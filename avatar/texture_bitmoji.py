# -*- coding: utf-8 -*-
"""Transforme la photo en texture de dessin anime.

Le maillage du visage est juste, c'est la texture qui fait le rendu
photographique. Pour obtenir le style bitmoji, on ne change pas la
geometrie mais l'habillage : on aplatit les couleurs en quelques
teintes franches, on lisse les details de peau, et l'on renforce les
traits qui portent l'identite, les sourcils, les yeux, la barbe.

Le principe est celui du dessin anime : peu de couleurs, des aplats
nets, des contours marques. On garde les vraies teintes de la photo,
si bien que l'avatar reste le portrait de la personne, styliseralement
plutot que photographiquement.
"""
import io
import os
import sys

import cv2
import numpy as np
from PIL import Image

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ICI = os.path.dirname(os.path.abspath(__file__))
SOURCE = r"C:\Users\DELL\Downloads\mimi.jpeg"
SORTIE = os.path.join(os.path.dirname(ICI), "src", "assets", "images",
                      "visage-bitmoji.jpg")

image = cv2.imread(SOURCE)
h, l = image.shape[:2]
print(f"source : {l} x {h}")

# --- 1. Lisser la peau -------------------------------------------
# Le filtre bilateral efface le grain et les irregularites sans
# brouiller les contours : c'est ce qui donne la peau lisse du dessin
# anime. Plusieurs passes valent mieux qu'une seule trop forte.
lisse = image.copy()
# Une reduction puis un agrandissement : le filtre travaille sur une
# image plus petite, ce qui efface le grain bien mieux qu'en passant
# plusieurs fois sur l'image entiere.
petit = cv2.resize(lisse, (l // 2, h // 2), interpolation=cv2.INTER_AREA)
for _ in range(9):
    petit = cv2.bilateralFilter(petit, d=9, sigmaColor=52, sigmaSpace=11)
lisse = cv2.resize(petit, (l, h), interpolation=cv2.INTER_LINEAR)
lisse = cv2.bilateralFilter(lisse, d=7, sigmaColor=40, sigmaSpace=9)

# --- 2. Aplatir les couleurs -------------------------------------
# On regroupe les pixels en quelques teintes : la peau devient un
# aplat, les cheveux un autre. Sans cela le degrade subsisterait et le
# rendu resterait photographique.
donnees = lisse.reshape((-1, 3)).astype(np.float32)
criteres = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 24, 0.6)
TEINTES = 8
_, etiquettes, centres = cv2.kmeans(
    donnees, TEINTES, None, criteres, 6, cv2.KMEANS_PP_CENTERS)
aplats = centres[etiquettes.flatten()].reshape(image.shape).astype(np.uint8)
print(f"{TEINTES} teintes retenues")

# --- 3. Relever les couleurs -------------------------------------
# Le dessin anime a des couleurs plus vives que la photo : on remonte
# la saturation, sans toucher a la teinte pour ne pas denaturer le
# portrait.
tsl = cv2.cvtColor(aplats, cv2.COLOR_BGR2HSV).astype(np.float32)
tsl[:, :, 1] = np.clip(tsl[:, :, 1] * 1.22, 0, 255)   # saturation
tsl[:, :, 2] = np.clip(tsl[:, :, 2] * 1.06, 0, 255)   # luminosite
aplats = cv2.cvtColor(tsl.astype(np.uint8), cv2.COLOR_HSV2BGR)

# --- 3 bis. Rendre les yeux et la bouche ------------------------
# L'aplatissement les efface : ce sont de petites zones a fort
# contraste, que le regroupement de couleurs fond dans la peau. On les
# reprend de la photo lissee, aux endroits releves par MediaPipe.
import mediapipe as mp

MODELE = os.path.join(ICI, "face_landmarker.task")
if os.path.exists(MODELE):
    options = mp.tasks.vision.FaceLandmarkerOptions(
        base_options=mp.tasks.BaseOptions(model_asset_path=MODELE),
        running_mode=mp.tasks.vision.RunningMode.IMAGE, num_faces=1)
    with mp.tasks.vision.FaceLandmarker.create_from_options(options) as rep:
        entree = mp.Image(image_format=mp.ImageFormat.SRGB,
                          data=cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        res = rep.detect(entree)

    if res.face_landmarks:
        pts = res.face_landmarks[0]

        def xy(i):
            return int(pts[i].x * l), int(pts[i].y * h)

        # Le contour de chaque oeil et de la bouche, tels que les
        # numerote le maillage de MediaPipe.
        ZONES = [
            [33, 246, 161, 160, 159, 158, 157, 173, 133,
             155, 154, 153, 145, 144, 163, 7],             # oeil gauche
            [362, 398, 384, 385, 386, 387, 388, 466, 263,
             249, 390, 373, 374, 380, 381, 382],           # oeil droit
            [61, 40, 37, 0, 267, 270, 291, 321, 405,
             17, 181, 91],                                 # bouche
        ]

        masque = np.zeros((h, l), dtype=np.uint8)
        for zone in ZONES:
            contour = np.array([xy(i) for i in zone], dtype=np.int32)
            cv2.fillPoly(masque, [contour], 255)

        # Un contour flou : la zone reprise se fond dans l'aplat au
        # lieu de former un timbre net.
        masque = cv2.GaussianBlur(masque, (9, 9), 0)
        m = (masque.astype(np.float32) / 255.0)[:, :, None]

        # On y reprend la photo lissee, un peu contrastee pour que
        # l'iris et les levres restent nets.
        detail = cv2.convertScaleAbs(lisse, alpha=1.12, beta=-8)
        aplats = (aplats * (1 - m) + detail * m).astype(np.uint8)
        print("yeux et bouche repris de la photo")


# --- 4. Tracer les contours --------------------------------------
# Ce sont eux qui font le dessin : les sourcils, la monture, la barbe
# et le contour du visage se detachent d'un trait sombre.
# On trace les contours sur l'image lissee, non sur l'originale : le
# grain de peau y produisait des points parasites sur tout le front.
gris = cv2.cvtColor(lisse, cv2.COLOR_BGR2GRAY)
gris = cv2.medianBlur(gris, 7)
contours = cv2.adaptiveThreshold(
    gris, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY,
    blockSize=13, C=5)

# Les traits isoles de quelques pixels sont du bruit : une ouverture
# les efface et ne laisse que les contours francs.
contours = cv2.morphologyEx(contours, cv2.MORPH_CLOSE,
                            np.ones((3, 3), np.uint8))
contours = cv2.medianBlur(contours, 3)
contours = cv2.cvtColor(contours, cv2.COLOR_GRAY2BGR)

dessin = cv2.bitwise_and(aplats, contours)

# --- 5. Adoucir le trait -----------------------------------------
# Le seuillage laisse des traits durs : un leger flou les rend plus
# proches d'un dessin qu'a une photocopie.
dessin = cv2.bilateralFilter(dessin, d=9, sigmaColor=45, sigmaSpace=9)
# Un dernier lissage tres leger, pour que le trait ne soit pas dentele.
dessin = cv2.GaussianBlur(dessin, (3, 3), 0)

with Image.fromarray(cv2.cvtColor(dessin, cv2.COLOR_BGR2RGB)) as sortie:
    sortie.thumbnail((720, 960), Image.LANCZOS)
    os.makedirs(os.path.dirname(SORTIE), exist_ok=True)
    sortie.save(SORTIE, quality=92, optimize=True)
    print(f"bitmoji : {sortie.size}, "
          f"{round(os.path.getsize(SORTIE) / 1024)} Ko")

# Une vignette de controle, pour juger du rendu avant integration.
controle = os.path.join(ICI, "controle_bitmoji.jpg")
avant = Image.open(SOURCE)
avant.thumbnail((360, 480), Image.LANCZOS)
apres = Image.open(SORTIE)
apres.thumbnail((360, 480), Image.LANCZOS)
cote = Image.new("RGB", (avant.width + apres.width + 12,
                         max(avant.height, apres.height)), (250, 248, 245))
cote.paste(avant, (0, 0))
cote.paste(apres, (avant.width + 12, 0))
cote.save(controle, quality=88)
print(f"controle : {controle}")
