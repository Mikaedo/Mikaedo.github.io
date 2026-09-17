# -*- coding: utf-8 -*-
"""Detoure le portrait, pour qu'il se fonde dans la page.

La photo est prise sur fond blanc de studio. Posee telle quelle sur le
creme du site, elle forme un rectangle qui se detache.

Le detourage par reseau de neurones demande de telecharger un modele,
ce que la connexion n'a pas permis. Ce n'est pas genant : le fond est
uniformement blanc, a moins de trois points d'ecart mesure sur les
quatre coins. Un seuillage suffit, et il donne un contour net.

Deux precautions, apprises d'une premiere version qui perçait le pull.

La premiere tient au seuil. Le beige clair du pull monte a 247/236/232 :
un seuil pose a 232 le classait comme fond, et les chevrons du motif
disparaissaient. Le fond, lui, ne descend pas sous 245 et reste
parfaitement neutre. On exige donc les deux a la fois, un niveau haut
ET une teinte neutre, ce que le beige ne verifie jamais.

La seconde tient au parcours. On avance depuis les bords vers
l'interieur : seul le blanc relie au cadre est du fond. La chemise,
blanche mais entouree du sujet, n'est jamais atteinte. On bouche
ensuite les poches de fond restees emprisonnees dans le vetement,
qui sur un fond sombre apparaitraient en trous noirs.
"""
import io
import os
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ICI = os.path.dirname(os.path.abspath(__file__))
SOURCE = r"C:\Users\DELL\Downloads\mimi.jpeg"
DOSSIER = os.path.join(os.path.dirname(ICI), "src", "assets", "images")

with Image.open(SOURCE) as brut:
    image = brut.convert("RGB")
print(f"source : {image.size}")

a = np.array(image, dtype=np.int16)
h, l = a.shape[:2]

# Le fond de studio : tres clair ET tres neutre. Le beige du pull
# atteint le premier critere par endroits, jamais le second.
niveau = a.min(axis=2)
ecart = a.max(axis=2) - niveau
clair = (niveau > 243) & (ecart < 8)
print(f"pixels clairs : {clair.mean() * 100:.1f} %")

# Un parcours depuis les bords, en huit directions : les diagonales
# evitent que le fond reste bloque dans un escalier de pixels.
fond = np.zeros((h, l), dtype=bool)
file = deque()

for x in range(l):
    for y in (0, h - 1):
        if clair[y, x] and not fond[y, x]:
            fond[y, x] = True
            file.append((y, x))
for y in range(h):
    for x in (0, l - 1):
        if clair[y, x] and not fond[y, x]:
            fond[y, x] = True
            file.append((y, x))

VOISINS = ((1, 0), (-1, 0), (0, 1), (0, -1),
           (1, 1), (1, -1), (-1, 1), (-1, -1))
while file:
    y, x = file.popleft()
    for dy, dx in VOISINS:
        ny, nx = y + dy, x + dx
        if 0 <= ny < h and 0 <= nx < l and clair[ny, nx] and not fond[ny, nx]:
            fond[ny, nx] = True
            file.append((ny, nx))

print(f"fond detecte : {fond.mean() * 100:.1f} %")

sujet = ~fond

# Une zone claire cernee par le vetement n'est pas du fond : c'est une
# maille du tricot ou un pli de la chemise. Le parcours depuis les
# bords ne l'atteint pas, elle reste donc opaque, et le fond de la
# page ne transparait pas au travers.
poches = clair & ~fond
print(f"clair enferme dans le sujet : {poches.mean() * 100:.2f} % (conserve)")

# Le masque du sujet, adouci pour que le contour ne soit pas dentele.
masque = Image.fromarray((sujet * 255).astype(np.uint8), "L")
masque = masque.filter(ImageFilter.GaussianBlur(1.2))

# Un contour net demande de resserrer le degrade : sans cela un lisere
# blanc du fond reste accroche au sujet.
m = np.array(masque, dtype=np.float32) / 255.0
m = np.clip((m - 0.42) / 0.34, 0, 1)

sortie = np.dstack([np.array(image, dtype=np.uint8),
                    (m * 255).astype(np.uint8)])
decoupe = Image.fromarray(sortie, "RGBA")

# On recadre sur le sujet, avec un peu d'air autour.
boite = decoupe.getbbox()
if boite:
    x0, y0, x1, y1 = boite
    marge = int((x1 - x0) * 0.03)
    decoupe = decoupe.crop((max(0, x0 - marge), max(0, y0 - marge),
                            min(decoupe.width, x1 + marge),
                            min(decoupe.height, y1 + marge)))

# Le bas du buste sort du cadre de la photo : le vetement y est coupe
# net, et le fond du studio s'y engouffre par les cotes. Plutot que de
# livrer un bord decoupe, on fait disparaitre progressivement le bas du
# portrait. Il se fond alors dans la page, sur le creme comme sur le
# brun sombre, et les entailles des cotes s'effacent avec lui.
A = np.array(decoupe)
hh = A.shape[0]
debut = int(hh * 0.60)          # la ou le fondu commence
voile = np.ones(hh, dtype=np.float32)
glissiere = np.linspace(1.0, 0.0, hh - debut) ** 2.1
voile[debut:] = glissiere
A[:, :, 3] = (A[:, :, 3].astype(np.float32) * voile[:, None]).astype(np.uint8)
decoupe = Image.fromarray(A, "RGBA")
print(f"fondu du bas a partir de {debut / hh * 100:.0f} % de la hauteur")

decoupe.thumbnail((880, 1180), Image.LANCZOS)
os.makedirs(DOSSIER, exist_ok=True)

chemin = os.path.join(DOSSIER, "portrait-detoure.webp")
decoupe.save(chemin, "WEBP", quality=90, method=6)
print(f"detoure : {decoupe.size}, "
      f"{round(os.path.getsize(chemin) / 1024)} Ko")

# Deux vignettes de controle : le portrait doit tenir sur les deux
# fonds du site, le creme et le brun tres sombre.
for nom, teinte in (("clair", (0xFC, 0xFA, 0xF7)),
                    ("sombre", (0x17, 0x11, 0x0C))):
    vue = Image.new("RGB", decoupe.size, teinte)
    vue.paste(decoupe, (0, 0), decoupe)
    vue.save(os.path.join(ICI, f"controle_portrait_{nom}.jpg"), quality=92)
print("controle : controle_portrait_clair.jpg, controle_portrait_sombre.jpg")
