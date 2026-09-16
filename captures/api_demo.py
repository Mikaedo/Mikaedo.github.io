# -*- coding: utf-8 -*-
"""Sert au tableau de bord des donnees inventees, le temps des captures.

Monter la vraie pile achoppe sur un detail d'environnement Windows :
la bibliotheque cliente de PostgreSQL renvoie ses messages dans la
locale francaise, que le pilote lit en UTF-8 et n'arrive pas a
decoder. Le probleme ne tient ni au code du SI-ENV ni a la base.

Plutot que de s'y user, on sert au tableau de bord exactement ce qu'il
attend, sans base du tout. Les chantiers, les signalements et les
plaintes sont inventes : aucune donnee de l'AGEROUTE ne figure dans le
portfolio, ce qui est de toute facon la seule chose acceptable pour
une page publique.
"""
import json
import random
from datetime import datetime, timedelta
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

random.seed(4)  # les memes donnees d'une capture a l'autre

MAINTENANT = datetime(2026, 9, 16, 11, 30)

CHANTIERS = [
    {"id": 1, "nom": "Quatrième pont, rive Yopougon", "commune": "Yopougon",
     "latitude": 5.3352, "longitude": -4.0728, "rayon_influence": 500},
    {"id": 2, "nom": "Échangeur Mitterrand Est", "commune": "Cocody",
     "latitude": 5.3608, "longitude": -3.9721, "rayon_influence": 400},
    {"id": 3, "nom": "Autoroute Y4, section nord", "commune": "Abobo",
     "latitude": 5.4192, "longitude": -4.0201, "rayon_influence": 700},
    {"id": 4, "nom": "Voie de desserte Attécoubé", "commune": "Attécoubé",
     "latitude": 5.3401, "longitude": -4.0451, "rayon_influence": 350},
    {"id": 5, "nom": "Carrefour Akwaba", "commune": "Port-Bouët",
     "latitude": 5.2612, "longitude": -3.9268, "rayon_influence": 450},
    {"id": 6, "nom": "Boulevard de la Paix, tronçon 2", "commune": "Marcory",
     "latitude": 5.2983, "longitude": -3.9834, "rayon_influence": 400},
]

NUISANCES = ["Déchets solides", "Eau stagnante", "Poussière",
             "Bruit de chantier", "Émissions atmosphériques", "Gravats"]
CRITICITES = ["FAIBLE", "MOYENNE", "CRITIQUE"]
STATUTS = ["NOUVEAU", "EN_COURS", "RESOLU", "CLOTURE"]

DESCRIPTIONS = [
    "Amoncellement de gravats en bordure de voie, non bâché.",
    "Eau stagnante dans une tranchée ouverte depuis huit jours.",
    "Poussière importante au passage des camions, riverains incommodés.",
    "Travaux nocturnes au-delà de l'horaire autorisé par le PGES.",
    "Déchets de coffrage laissés sur l'accotement après repli.",
    "Ruissellement chargé vers le caniveau, sans dispositif de filtration.",
    "Dépôt sauvage constaté à l'entrée du chantier.",
    "Engins au ralenti prolongé, fumées visibles.",
]

def signalements():
    out = []
    for i in range(1, 29):
        ch = random.choice(CHANTIERS)
        jours = random.randint(0, 45)
        crit = random.choices(CRITICITES, weights=[3, 5, 2])[0]
        out.append({
            "id": i,
            "uuid_mobile": f"sig-{i:04d}-demo",
            "type_nuisance": random.choice(NUISANCES),
            "description": random.choice(DESCRIPTIONS),
            "criticite": crit,
            "criticite_ia": crit if random.random() > 0.3 else random.choice(CRITICITES),
            "confiance_ia": round(random.uniform(0.62, 0.94), 2),
            "statut": random.choice(STATUTS),
            "latitude": ch["latitude"] + random.uniform(-0.004, 0.004),
            "longitude": ch["longitude"] + random.uniform(-0.004, 0.004),
            "chantier_id": ch["id"],
            "chantier": {"id": ch["id"], "nom": ch["nom"],
                         "commune": ch["commune"]},
            "utilisateur_id": random.randint(1, 4),
            "utilisateur_nom": random.choice(
                ["Koffi Adama", "Traoré Aminata", "Yao Bernard", "Diallo Fanta"]),
            "date_observation": (MAINTENANT - timedelta(days=jours,
                                 hours=random.randint(0, 9))).isoformat(),
            "cree_le": (MAINTENANT - timedelta(days=jours)).isoformat(),
            "photos": [],
            "gps_source": random.choice(["appareil", "saisie"]),
        })
    return out

SIGNALEMENTS = signalements()

PLAINTES = [
    {"id": 1, "nom_plaignant": "Résident, cité Sicogi",
     "contact": "07 xx xx xx 12", "categorie": "Bruit",
     "description": "Les engins travaillent la nuit, impossible de dormir.",
     "statut": "EN_COURS", "canal": "application",
     "chantier_id": 1, "chantier": CHANTIERS[0],
     "latitude": 5.3361, "longitude": -4.0711,
     "date_depot": (MAINTENANT - timedelta(days=3)).isoformat()},
    {"id": 2, "nom_plaignant": "Commerçante, marché Abobo",
     "contact": "05 xx xx xx 88", "categorie": "Poussière",
     "description": "La poussière recouvre les étals toute la journée.",
     "statut": "NOUVEAU", "canal": "application",
     "chantier_id": 3, "chantier": CHANTIERS[2],
     "latitude": 5.4181, "longitude": -4.0219,
     "date_depot": (MAINTENANT - timedelta(days=1)).isoformat()},
    {"id": 3, "nom_plaignant": "Chef de quartier, Attécoubé",
     "contact": "01 xx xx xx 45", "categorie": "Eau stagnante",
     "description": "Une mare s'est formée près de l'école, les enfants y jouent.",
     "statut": "RESOLU", "canal": "telephone",
     "chantier_id": 4, "chantier": CHANTIERS[3],
     "latitude": 5.3412, "longitude": -4.0443,
     "date_depot": (MAINTENANT - timedelta(days=11)).isoformat()},
]

ALERTES = [
    {"id": 1, "message": "Seuil de signalements dépassé sur le chantier Y4",
     "niveau": "CRITIQUE", "valeur": 9, "chantier_id": 3,
     "chantier_nom": CHANTIERS[2]["nom"], "recue": False,
     "date_declenchement": (MAINTENANT - timedelta(hours=5)).isoformat()},
    {"id": 2, "message": "Trois eaux stagnantes signalées en 48 h",
     "niveau": "MOYENNE", "valeur": 3, "chantier_id": 1,
     "chantier_nom": CHANTIERS[0]["nom"], "recue": True,
     "date_declenchement": (MAINTENANT - timedelta(days=2)).isoformat()},
]

UTILISATEURS = [
    {"id": 1, "nom": "Koffi Adama", "email": "resp.env@exemple.ci",
     "role": "RESP_ENV", "premiere_connexion": False,
     "date_inscription": "2026-05-04T09:00:00"},
    {"id": 2, "nom": "Traoré Aminata", "email": "expert.hse@exemple.ci",
     "role": "EXPERT_HSE", "premiere_connexion": False,
     "date_inscription": "2026-05-04T09:10:00"},
    {"id": 3, "nom": "Yao Bernard", "email": "spec.env@exemple.ci",
     "role": "SPEC_ENV", "premiere_connexion": False,
     "date_inscription": "2026-05-06T14:20:00"},
    {"id": 4, "nom": "Diallo Fanta", "email": "spec.par@exemple.ci",
     "role": "SPEC_PAR", "premiere_connexion": False,
     "date_inscription": "2026-05-06T14:25:00"},
    {"id": 5, "nom": "Administrateur", "email": "admin@exemple.ci",
     "role": "ADMIN", "premiere_connexion": False,
     "date_inscription": "2026-05-01T08:00:00"},
    {"id": 6, "nom": "Agence de tutelle", "email": "ande@exemple.ci",
     "role": "ANDE", "premiere_connexion": False,
     "date_inscription": "2026-06-12T10:00:00"},
    {"id": 7, "nom": "Bailleur", "email": "bad@exemple.ci",
     "role": "BAD", "premiere_connexion": True,
     "date_inscription": "2026-06-12T10:05:00"},
]

ACTIONS = ["connexion", "signalement_cree", "statut_change", "rapport_genere",
           "compte_cree", "acces_refuse", "seuil_modifie"]

JOURNAUX = [{
    "id": i,
    "niveau": random.choice(["info", "info", "info", "avertissement"]),
    "message": random.choice([
        "Connexion réussie", "Signalement créé depuis le mobile",
        "Statut passé à « traité »", "Rapport mensuel généré",
        "Compte créé pour un nouvel agent", "Accès refusé, rôle insuffisant",
        "Seuil d'alerte modifié"]),
    "categorie": random.choice(["acces", "metier", "compte", "systeme"]),
    "utilisateur_login": random.choice(
        [u["email"] for u in UTILISATEURS]),
    "ip_source": f"41.66.{random.randint(10,240)}.{random.randint(2,250)}",
    "horodatage": (MAINTENANT - timedelta(hours=i * 3,
                   minutes=random.randint(0, 59))).isoformat(),
} for i in range(1, 25)]

SEUILS = [
    {"id": 1, "nom": "Signalements par chantier et par semaine",
     "indicateur": "signalements_semaine", "seuil": 8,
     "operateur": ">=", "actif": True, "chantier_id": None},
    {"id": 2, "nom": "Eaux stagnantes sur 48 heures",
     "indicateur": "eau_stagnante_48h", "seuil": 3,
     "operateur": ">=", "actif": True, "chantier_id": None},
    {"id": 3, "nom": "Criticité élevée non traitée sous 72 h",
     "indicateur": "critique_non_traite", "seuil": 1,
     "operateur": ">=", "actif": True, "chantier_id": None},
]

INDICES = [{
    "chantier_id": c["id"], "chantier_nom": c["nom"],
    "ndvi_avant": round(random.uniform(0.38, 0.62), 3),
    "ndvi_apres": round(random.uniform(0.18, 0.46), 3),
    "ndwi_avant": round(random.uniform(0.10, 0.28), 3),
    "ndwi_apres": round(random.uniform(0.14, 0.34), 3),
    "no2_avant": round(random.uniform(38, 62), 1),
    "no2_apres": round(random.uniform(44, 78), 1),
    "date_calcul": "2026-09-10T00:00:00",
} for c in CHANTIERS]

# Le jeton est factice : cette API ne vérifie rien, elle ne sert qu'aux
# captures et ne tourne que sur cette machine.
JETON = ("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
         "eyJzdWIiOiJkZW1vQGV4ZW1wbGUuY2kiLCJyb2xlIjoiQURNSU4ifQ."
         "demonstration-locale-sans-valeur")


# Le role de la session en cours. Le script de capture le change avant
# chaque page, pour montrer le tableau de bord tel que chaque metier le
# voit : le specialiste pilote, l'agence de tutelle consulte seulement.
ROLE_COURANT = {"valeur": None}


def utilisateur_courant():
    if ROLE_COURANT["valeur"]:
        for u in UTILISATEURS:
            if u["role"] == ROLE_COURANT["valeur"]:
                return u
    return {"id": 5, "nom": "Administrateur", "email": "admin@exemple.ci",
            "role": "ADMIN", "premiere_connexion": False}


def resume():
    par_statut = {}
    for s in SIGNALEMENTS:
        par_statut[s["statut"]] = par_statut.get(s["statut"], 0) + 1
    return {
        "total_signalements": len(SIGNALEMENTS),
        "signalements_nouveaux": par_statut.get("NOUVEAU", 0),
        "signalements_en_cours": par_statut.get("EN_COURS", 0),
        "signalements_traites": par_statut.get("RESOLU", 0),
        "total_chantiers": len(CHANTIERS),
        "total_plaintes": len(PLAINTES),
        "alertes_actives": sum(1 for a in ALERTES if not a["recue"]),
        "par_statut": par_statut,
        "par_criticite": {
            c: sum(1 for s in SIGNALEMENTS if s["criticite"] == c)
            for c in CRITICITES
        },
        "par_type": {
            t: sum(1 for s in SIGNALEMENTS if s["type_nuisance"] == t)
            for t in NUISANCES
        },
    }


ROUTES = {
    "/auth/login": lambda: {"access_token": JETON, "token_type": "bearer",
                            "utilisateur": utilisateur_courant()},
    "/auth/me": utilisateur_courant,
    "/chantiers": lambda: CHANTIERS,
    "/signalements": lambda: SIGNALEMENTS,
    "/plaintes": lambda: PLAINTES,
    "/alertes": lambda: ALERTES,
    "/non-conformites": lambda: [],
    "/admin/users": lambda: UTILISATEURS,
    "/admin/logs": lambda: JOURNAUX,
    "/admin/seuils": lambda: SEUILS,
    "/admin/model": lambda: {"nom": "YOLOv8n", "version": "v2",
                             "map50": 0.712, "actif": True},
    "/satellite/indices": lambda: INDICES,
    "/satellite/resume": lambda: {"chantiers": len(CHANTIERS),
                                  "derniere_analyse": "2026-09-10"},
    "/mesures": lambda: [],
    "/mesures/parametres": lambda: {"indices": ["NDVI", "NDWI", "NO2"]},
    "/rapports/transmissions": lambda: [],
    "/dashboard/resume": resume,
    "/statistiques": resume,
}


class Serveur(BaseHTTPRequestHandler):
    def repondre(self, charge, code=200):
        corps = json.dumps(charge, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Access-Control-Allow-Methods", "*")
        self.send_header("Content-Length", str(len(corps)))
        self.end_headers()
        self.wfile.write(corps)

    def do_OPTIONS(self):
        self.repondre({}, 204)

    def router(self):
        decoupe = urlparse(self.path)
        chemin = decoupe.path.rstrip("/") or "/"

        # Le script de capture annonce le role de la page qu'il visite.
        if chemin == "/_role":
            from urllib.parse import parse_qs
            valeur = parse_qs(decoupe.query).get("r", [None])[0]
            ROLE_COURANT["valeur"] = valeur
            return self.repondre({"role": valeur})

        if chemin in ROUTES:
            return self.repondre(ROUTES[chemin]())
        # Une route inconnue renvoie une liste vide plutôt qu'une
        # erreur : le tableau de bord affiche alors une section vide
        # au lieu de s'arrêter.
        for prefixe, fonction in ROUTES.items():
            if chemin.startswith(prefixe + "/"):
                valeur = fonction()
                if isinstance(valeur, list) and valeur:
                    return self.repondre(valeur[0])
                return self.repondre(valeur)
        self.repondre([])

    do_GET = router
    do_POST = router
    do_PUT = router
    do_PATCH = router
    do_DELETE = router

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    print("API de demonstration sur http://127.0.0.1:8100")
    HTTPServer(("127.0.0.1", 8100), Serveur).serve_forever()
