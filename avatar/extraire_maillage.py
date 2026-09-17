# -*- coding: utf-8 -*-
"""Extrait le maillage 3D du visage, et la texture qui l'habille.

Assembler des spheres ne donne pas un portrait : chaque correction en
deplace le defaut. Mais MediaPipe ne rend pas que des points plats, il
rend un maillage en volume, quatre cent soixante-dix-huit sommets avec
leur profondeur, et la liste des triangles qui les relient.

C'est un vrai modele de votre visage. Habille de la photo elle-meme,
il ressemble, puisque c'est vous : ni approximation ni interpretation.

On sort trois choses :
  - les sommets, ramenes autour de l'origine et mis a l'echelle,
  - les triangles du maillage,
  - les coordonnees de texture, qui disent quel point de la photo se
    pose sur quel sommet.
"""
import io
import json
import os
import sys

import cv2
import mediapipe as mp
import numpy as np
from PIL import Image

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ICI = os.path.dirname(os.path.abspath(__file__))
PHOTO = r"C:\Users\DELL\Downloads\mimi.jpeg"
MODELE = os.path.join(ICI, "face_landmarker.task")
SORTIE = os.path.join(os.path.dirname(ICI), "src", "data")
TEXTURE = os.path.join(os.path.dirname(ICI), "src", "assets", "images",
                       "visage-texture.jpg")

image = cv2.imread(PHOTO)
h, l = image.shape[:2]
print(f"photo : {l} x {h}")

options = mp.tasks.vision.FaceLandmarkerOptions(
    base_options=mp.tasks.BaseOptions(model_asset_path=MODELE),
    running_mode=mp.tasks.vision.RunningMode.IMAGE,
    num_faces=1)

with mp.tasks.vision.FaceLandmarker.create_from_options(options) as repereur:
    entree = mp.Image(image_format=mp.ImageFormat.SRGB,
                      data=cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    resultat = repereur.detect(entree)

points = resultat.face_landmarks[0]
print(f"{len(points)} sommet(s)")

# --- Les sommets ---------------------------------------------------
# Les coordonnees arrivent entre 0 et 1 pour x et y, et en profondeur
# relative pour z. On les ramene dans un repere centre sur le visage,
# avec y vers le haut comme le veut Three.js.
brut = np.array([[p.x, p.y, p.z] for p in points], dtype=np.float32)

# Le rapport de la photo compte : sans lui le visage serait etire.
brut[:, 0] *= l / h

centre = brut.mean(axis=0)
centres = brut - centre

# La mise a l'echelle : le visage tient dans une sphere de rayon 1.
echelle = 1.0 / np.abs(centres).max()
sommets = centres * echelle
sommets[:, 1] *= -1        # y vers le haut
sommets[:, 2] *= -1.6      # la profondeur, accentuee pour le relief

print(f"etendue : x {sommets[:,0].min():.2f}..{sommets[:,0].max():.2f}  "
      f"y {sommets[:,1].min():.2f}..{sommets[:,1].max():.2f}  "
      f"z {sommets[:,2].min():.2f}..{sommets[:,2].max():.2f}")

# --- Les coordonnees de texture ------------------------------------
# Elles disent quel point de la photo se pose sur quel sommet : ce
# sont simplement les coordonnees d'origine, y renverse.
uv = np.array([[p.x, 1.0 - p.y] for p in points], dtype=np.float32)

# --- Les triangles -------------------------------------------------
# MediaPipe 1.0 ne publie plus la liste des aretes du maillage. On la
# reconstruit par triangulation de Delaunay sur les points projetes de
# face : le visage etant convexe vu de face, la triangulation plane
# rend le bon maillage une fois les sommets remis en volume.
plats = np.array([[p.x * l, p.y * h] for p in points], dtype=np.float32)

subdivision = cv2.Subdiv2D((0, 0, l + 2, h + 2))
for x, y in plats:
    subdivision.insert((float(x), float(y)))

# Retrouver l'indice d'un sommet a partir de ses coordonnees.
index = {(round(float(x), 2), round(float(y), 2)): i
         for i, (x, y) in enumerate(plats)}


def qui(x, y):
    return index.get((round(float(x), 2), round(float(y), 2)))


triangles = []
for t in subdivision.getTriangleList():
    a = qui(t[0], t[1])
    b = qui(t[2], t[3])
    c = qui(t[4], t[5])
    if a is None or b is None or c is None:
        continue  # un sommet du cadre englobant, hors visage
    triangles.append((a, b, c))

print(f"{len(triangles)} triangle(s)")

# --- La texture ----------------------------------------------------
# La photo entiere sert de texture : le maillage n'en utilise que la
# partie du visage, mais decouper ferait perdre les bords.
with Image.open(PHOTO) as im:
    im = im.convert("RGB")
    im.thumbnail((720, 960), Image.LANCZOS)
    os.makedirs(os.path.dirname(TEXTURE), exist_ok=True)
    im.save(TEXTURE, quality=88, optimize=True)
print(f"texture : {TEXTURE} ({round(os.path.getsize(TEXTURE)/1024)} Ko)")

# --- L'ecriture ----------------------------------------------------
donnees = {
    "sommets": [round(float(v), 4) for v in sommets.flatten()],
    "uv": [round(float(v), 4) for v in uv.flatten()],
    "triangles": [int(i) for t in triangles for i in t],
    "nbSommets": len(points),
    "nbTriangles": len(triangles),
}

chemin = os.path.join(SORTIE, "maillageVisage.json")
with open(chemin, "w", encoding="utf-8") as f:
    json.dump(donnees, f, separators=(",", ":"))
print(f"maillage : {chemin} ({round(os.path.getsize(chemin)/1024)} Ko)")
