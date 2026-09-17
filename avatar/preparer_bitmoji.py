# -*- coding: utf-8 -*-
"""Detoure le bitmoji et le decoupe en parties animables.

L'avatar arrive sur fond blanc uniforme, a moins d'un point d'ecart
mesure sur les quatre coins : un seuillage depuis les bords suffit, et
il donne un contour net. La chemise blanche est preservee, puisqu'elle
n'est pas reliee au cadre.

Le personnage est ensuite decoupe : la tete, le buste et les deux bras
deviennent des images separees. Chacune bougera de son cote, la tete
suivant la lecture, les bras balancant, le buste respirant. Un
personnage d'un seul tenant ne peut que glisser ou tourner en bloc, ce
qui parait mecanique.

Les decoupes se recouvrent : sans ce recouvrement une couture
apparaitrait a chaque articulation des que les parties bougent.
"""
import io
import os
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ICI = os.path.dirname(os.path.abspath(__file__))
SOURCE = os.path.join(ICI, "bitmoji_source.jpg")
DOSSIER = os.path.join(os.path.dirname(ICI), "src", "assets", "images")

with Image.open(SOURCE) as brut:
    image = brut.convert("RGB")
l, h = image.size
print(f"source : {l} x {h}")

a = np.array(image, dtype=np.int16)

# --- Le fond blanc -------------------------------------------------
# Presque blanc, et presque neutre : la chemise l'est aussi, mais elle
# porte des ombres et n'atteint pas ce seuil partout.
clair = (a.min(axis=2) > 236) & (a.max(axis=2) - a.min(axis=2) < 10)
print(f"pixels clairs : {clair.mean() * 100:.1f} %")

# Un parcours depuis les bords : seul le blanc relie au cadre est du
# fond. La chemise, entouree du sujet, n'est jamais atteinte.
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

masque = Image.fromarray(((~fond) * 255).astype(np.uint8), "L")
masque = masque.filter(ImageFilter.GaussianBlur(1.6))
m = np.array(masque, dtype=np.float32) / 255.0

# Le seuil est pousse au-dela du milieu : il mord d'un pixel ou deux
# sur le sujet. C'est voulu. Le detourage laissait sinon un lisere a
# 220/214/212, du blanc du studio, alors que le sujet est a 113/76/64 :
# ce liseré cerne la tete d'un trait clair et la fait paraitre collee.
# Mieux vaut perdre un pixel de contour que garder le fond.
m = np.clip((m - 0.62) / 0.30, 0, 1)

# Une transition douce sur le pourtour : un bord binaire dentelle les
# obliques et souligne la decoupe. Les valeurs intermediaires font le
# raccord avec ce qu'il y a derriere.
m = m ** 1.18

entier = Image.fromarray(
    np.dstack([np.array(image, dtype=np.uint8),
               (m * 255).astype(np.uint8)]), "RGBA")

boite = entier.getbbox()
if boite:
    entier = entier.crop(boite)
L, H = entier.size
print(f"detoure : {L} x {H}")

os.makedirs(DOSSIER, exist_ok=True)

# --- Le decoupage --------------------------------------------------
# Les fractions sont relevees sur l'image : la tete tient dans le
# cinquieme superieur, les bras descendent le long du buste jusqu'aux
# poches. Les tranches se recouvrent d'environ deux points.
# Les bras ne sont pas decoupes : les mains sont dans les poches sur
# cette photo, ils n'ont donc rien a bouger de leur cote.
PARTIES = {
    # (gauche, haut, droite, bas), en fractions de l'image
    "tete":  (0.30, 0.000, 0.70, 0.245),
    "corps": (0.16, 0.200, 0.86, 1.000),
}

for nom, (g, ht, d, bs) in PARTIES.items():
    partie = entier.crop((int(g * L), int(ht * H), int(d * L), int(bs * H)))
    chemin = os.path.join(DOSSIER, f"bitmoji-{nom}.webp")
    partie.save(chemin, "WEBP", quality=92, method=6)
    print(f"   {nom:<8} {partie.size}  "
          f"{round(os.path.getsize(chemin) / 1024)} Ko")

# L'image entiere sert de repli si l'animation ne se lance pas.
entier_reduit = entier.copy()
entier_reduit.thumbnail((640, 860), Image.LANCZOS)
complet = os.path.join(DOSSIER, "bitmoji-complet.webp")
entier_reduit.save(complet, "WEBP", quality=90, method=6)
print(f"   complet  {entier_reduit.size}  "
      f"{round(os.path.getsize(complet) / 1024)} Ko")

# Deux vignettes de controle. Le liseré du detourage ne se voit pas
# sur un fond clair : c'est sur le brun sombre qu'il apparait, et
# c'est la qu'il faut le juger. On cadre sur la tete, ou la coupure
# se remarque le plus.
tete_seule = entier.crop((int(0.30 * L), 0, int(0.70 * L), int(0.245 * H)))
for nom, teinte in (("clair", (252, 250, 247)),
                    ("sombre", (23, 17, 12))):
    vue = Image.new("RGB", tete_seule.size, teinte)
    vue.paste(tete_seule, (0, 0), tete_seule)
    vue = vue.resize((vue.width * 2, vue.height * 2), Image.LANCZOS)
    vue.save(os.path.join(ICI, f"controle_tete_{nom}.jpg"), quality=94)
print("controle : controle_tete_clair.jpg, controle_tete_sombre.jpg")
