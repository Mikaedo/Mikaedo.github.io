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
masque = masque.filter(ImageFilter.GaussianBlur(1.1))
m = np.array(masque, dtype=np.float32) / 255.0
# Un contour franc : sans ce resserrement, un lisere blanc du fond
# reste accroche au sujet.
m = np.clip((m - 0.44) / 0.34, 0, 1)

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
PARTIES = {
    # (gauche, haut, droite, bas), en fractions de l'image
    "tete":        (0.30, 0.000, 0.70, 0.245),
    "corps":       (0.16, 0.200, 0.86, 1.000),
    "bras-gauche": (0.14, 0.215, 0.38, 0.600),
    "bras-droit":  (0.62, 0.215, 0.86, 0.600),
}

for nom, (g, ht, d, bs) in PARTIES.items():
    partie = entier.crop((int(g * L), int(ht * H), int(d * L), int(bs * H)))
    chemin = os.path.join(DOSSIER, f"bitmoji-{nom}.png")
    partie.save(chemin, optimize=True)
    print(f"   {nom:<14} {partie.size}  "
          f"{round(os.path.getsize(chemin) / 1024)} Ko")

# L'image entiere sert de repli si l'animation ne se lance pas.
entier_reduit = entier.copy()
entier_reduit.thumbnail((640, 860), Image.LANCZOS)
complet = os.path.join(DOSSIER, "bitmoji-complet.png")
entier_reduit.save(complet, optimize=True)
print(f"   complet        {entier_reduit.size}  "
      f"{round(os.path.getsize(complet) / 1024)} Ko")

# Une vignette de controle, sur le crème de la page.
controle = Image.new("RGB", entier.size, (252, 250, 247))
controle.paste(entier, (0, 0), entier)
controle.thumbnail((360, 640), Image.LANCZOS)
controle.save(os.path.join(ICI, "controle_detourage.jpg"), quality=90)
print("controle : controle_detourage.jpg")
