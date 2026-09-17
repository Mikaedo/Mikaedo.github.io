# -*- coding: utf-8 -*-
"""Detoure le portrait, pour qu'il se fonde dans la page.

La photo est prise sur fond blanc de studio. Posee telle quelle sur le
creme du site, elle forme un rectangle qui se detache : le masque en
degrade pose plus tot adoucissait les bords sans supprimer le fond.

Le detourage par reseau de neurones demande de telecharger un modele,
ce que la connexion n'a pas permis. Ce n'est pas genant ici : le fond
est uniformement blanc, a moins d'un point d'ecart mesure sur les
quatre coins. Un seuillage suffit donc, et il donne un contour net.

On procede depuis les bords vers l'interieur, pour ne pas evider les
zones blanches du sujet lui-meme : la chemise reste opaque, seul le
fond qui touche le cadre disparait.
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
SORTIE = os.path.join(os.path.dirname(ICI), "src", "assets", "images",
                      "portrait-detoure.png")

with Image.open(SOURCE) as brut:
    image = brut.convert("RGB")
print(f"source : {image.size}")

a = np.array(image, dtype=np.int16)
h, l = a.shape[:2]

# Ce qui est presque blanc, et presque gris : le fond de studio.
clair = (a.min(axis=2) > 232) & (a.max(axis=2) - a.min(axis=2) < 14)
print(f"pixels clairs : {clair.mean() * 100:.1f} %")

# Un parcours depuis les bords : seul le blanc relie au cadre est du
# fond. La chemise, blanche mais entouree du sujet, n'est pas atteinte.
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

while file:
    y, x = file.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < h and 0 <= nx < l and clair[ny, nx] and not fond[ny, nx]:
            fond[ny, nx] = True
            file.append((ny, nx))

print(f"fond detecte : {fond.mean() * 100:.1f} %")

# Le masque du sujet, adouci pour que le contour ne soit pas dentele.
masque = Image.fromarray(((~fond) * 255).astype(np.uint8), "L")
masque = masque.filter(ImageFilter.GaussianBlur(1.4))

# Un contour net demande de resserrer le degrade : sans cela un lisere
# blanc du fond reste accroche au sujet.
m = np.array(masque, dtype=np.float32) / 255.0
m = np.clip((m - 0.45) / 0.35, 0, 1)

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

decoupe.thumbnail((880, 1180), Image.LANCZOS)
os.makedirs(os.path.dirname(SORTIE), exist_ok=True)
decoupe.save(SORTIE, optimize=True)

print(f"detoure : {decoupe.size}, "
      f"{round(os.path.getsize(SORTIE) / 1024)} Ko")
print(f"ecrit : {SORTIE}")
