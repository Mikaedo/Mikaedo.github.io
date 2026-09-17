# -*- coding: utf-8 -*-
"""Releve les proportions et les couleurs du visage, pour l'avatar.

Un bitmoji ressemblant ne s'invente pas : il se mesure. MediaPipe pose
quatre cent soixante-huit reperes sur le visage, d'ou l'on tire les
rapports qui font la ressemblance, la largeur du visage rapportee a sa
hauteur, l'ecartement des yeux, la place des lunettes.

Les couleurs se prelevent au meme endroit : la peau sur la joue, hors
zone d'ombre, les cheveux au-dessus du front, le vetement sous le
menton. Les valeurs obtenues serviront a dessiner le personnage en
volume, aux bonnes teintes.
"""
import io
import json
import sys

import cv2
import mediapipe as mp
import numpy as np

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

PHOTO = r"C:\Users\DELL\Downloads\mimi.jpeg"
SORTIE = (r"C:\Users\DELL\AppData\Local\Temp\claude"
          r"\d--etude-soutenance-SI-ENV"
          r"\3233866b-194c-446a-b8f6-65c65b911c25\scratchpad\visage.json")

image = cv2.imread(PHOTO)
if image is None:
    print("photo introuvable")
    sys.exit(1)

h, l = image.shape[:2]
print(f"photo : {l} x {h}")

# --- Les reperes du visage ---------------------------------------
# MediaPipe 1.0 a retire l'ancienne interface « solutions » : on passe
# par la tache de reperage, qui demande un fichier de modele.
import os

MODELE = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                      "face_landmarker.task")

options = mp.tasks.vision.FaceLandmarkerOptions(
    base_options=mp.tasks.BaseOptions(model_asset_path=MODELE),
    running_mode=mp.tasks.vision.RunningMode.IMAGE,
    num_faces=1)

with mp.tasks.vision.FaceLandmarker.create_from_options(options) as repereur:
    entree = mp.Image(image_format=mp.ImageFormat.SRGB,
                      data=cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    resultat = repereur.detect(entree)

if not resultat.face_landmarks:
    print("aucun visage detecte")
    sys.exit(1)

points = resultat.face_landmarks[0]
print(f"{len(points)} repere(s) releve(s)")


def p(i):
    """Un repere, en pixels."""
    return np.array([points[i].x * l, points[i].y * h])


# Les indices sont ceux du maillage de MediaPipe.
REPERES = {
    "menton":        152,
    "front":         10,
    "joue_gauche":   234,
    "joue_droite":   454,
    "oeil_g_ext":    33,
    "oeil_g_int":    133,
    "oeil_d_int":    362,
    "oeil_d_ext":    263,
    "nez_pointe":    1,
    "nez_base":      2,
    "bouche_gauche": 61,
    "bouche_droite": 291,
    "bouche_haut":   13,
    "bouche_bas":    14,
    "sourcil_g":     105,
    "sourcil_d":     334,
}
r = {nom: p(i) for nom, i in REPERES.items()}

hauteur_visage = np.linalg.norm(r["menton"] - r["front"])
largeur_visage = np.linalg.norm(r["joue_droite"] - r["joue_gauche"])
ecart_yeux = np.linalg.norm(r["oeil_d_int"] - r["oeil_g_int"])
largeur_oeil = np.linalg.norm(r["oeil_g_int"] - r["oeil_g_ext"])
largeur_bouche = np.linalg.norm(r["bouche_droite"] - r["bouche_gauche"])

mesures = {
    "rapport_visage": round(float(largeur_visage / hauteur_visage), 3),
    "ecart_yeux_sur_largeur": round(float(ecart_yeux / largeur_visage), 3),
    "oeil_sur_largeur": round(float(largeur_oeil / largeur_visage), 3),
    "bouche_sur_largeur": round(float(largeur_bouche / largeur_visage), 3),
    # La hauteur des yeux dans le visage : 0 au front, 1 au menton.
    "yeux_hauteur": round(float(
        (r["oeil_g_ext"][1] - r["front"][1]) / hauteur_visage), 3),
    "nez_hauteur": round(float(
        (r["nez_pointe"][1] - r["front"][1]) / hauteur_visage), 3),
    "bouche_hauteur": round(float(
        (r["bouche_haut"][1] - r["front"][1]) / hauteur_visage), 3),
}

print("\nPROPORTIONS")
for k, v in mesures.items():
    print(f"   {k:<26} {v}")


# --- Les couleurs -------------------------------------------------
def teinte(x, y, rayon=9):
    """La couleur dominante autour d'un point.

    La moyenne ne convient pas : un bloc a cheval sur les cheveux et
    le front rend un gris qui n'existe nulle part sur la photo. On
    prend donc la mediane, qui retient la couleur reellement majoritaire
    et ignore les quelques pixels de l'autre zone.
    """
    x, y = int(x), int(y)
    bloc = image[max(0, y - rayon):y + rayon, max(0, x - rayon):x + rayon]
    if bloc.size == 0:
        return "#000000"
    b, g, rr = np.median(bloc.reshape(-1, 3), axis=0)
    return "#%02X%02X%02X" % (int(rr), int(g), int(b))


# La joue, prise entre l'oeil et la bouche, du cote eclaire et bien a
# l'interieur du visage pour eviter le bord et l'ombre.
joue = np.array([
    (r["joue_droite"][0] * 0.42 + r["nez_pointe"][0] * 0.58),
    (r["nez_pointe"][1] * 0.5 + r["bouche_haut"][1] * 0.5)
])

# Les cheveux : au-dessus du front, mais pas trop haut pour rester
# dans la masse et non dans le fond blanc du studio.
cheveux = np.array([r["front"][0], r["front"][1] - hauteur_visage * 0.30])

couleurs = {
    "peau":        teinte(*joue, 10),
    # Le front est plus eclaire : il sert aux reliefs de l'avatar.
    "peau_claire": teinte(r["front"][0],
                          r["front"][1] + hauteur_visage * 0.09, 9),
    "cheveux":     teinte(*cheveux, 9),
    # Le vetement, pris sur le cote pour eviter la cravate centrale.
    # Le pull, pris franchement sur le cote, loin de la chemise.
    "vetement":    teinte(r["joue_gauche"][0] - largeur_visage * 0.78,
                          min(h - 14, r["menton"][1] + hauteur_visage * 0.82), 13),
    # La cravate, dans l'axe du menton et plus bas que le col.
    "cravate":     teinte(r["menton"][0] - largeur_visage * 0.02,
                          min(h - 14, r["menton"][1] + hauteur_visage * 0.78), 8),
    "levres":      teinte(*((r["bouche_haut"] + r["bouche_bas"]) / 2), 4),
}

print("\nCOULEURS")
for k, v in couleurs.items():
    print(f"   {k:<14} {v}")

with open(SORTIE, "w", encoding="utf-8") as f:
    json.dump({"mesures": mesures, "couleurs": couleurs}, f,
              ensure_ascii=False, indent=1)
print(f"\nEcrit : {SORTIE}")

# --- Verification visuelle ---------------------------------------
# On marque sur la photo les endroits ou les couleurs ont ete prises :
# une teinte fausse se voit tout de suite sur l'image de controle.
controle = image.copy()
for nom, pt in [("peau", joue), ("cheveux", cheveux),
                ("front", (r["front"][0], r["front"][1] + hauteur_visage * 0.09)),
                ("vetement", (r["joue_gauche"][0] - largeur_visage * 0.78,
                              min(h - 14, r["menton"][1] + hauteur_visage * 0.82))),
                ("cravate", (r["menton"][0] - largeur_visage * 0.02,
                             min(h - 14, r["menton"][1] + hauteur_visage * 0.78)))]:
    x, y = int(pt[0]), int(pt[1])
    cv2.circle(controle, (x, y), 11, (0, 255, 255), 2)
    cv2.putText(controle, nom, (x + 15, y + 4),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)

cv2.imwrite(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                         "controle_points.jpg"), controle)
print("controle ecrit : controle_points.jpg")
