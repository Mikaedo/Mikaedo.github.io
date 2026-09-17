# -*- coding: utf-8 -*-
"""Sert a WeCite des donnees inventees, le temps des captures.

Meme demarche que pour le SI-ENV : plutot que de monter Spring Boot et
sa base, on repond au frontend exactement ce qu'il attend. Les
residents, les incidents et les cotisations sont inventes, la cite
aussi : rien de reel ne figure dans le portfolio.
"""
import json
import random
from datetime import datetime, timedelta
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

random.seed(7)
MAINTENANT = datetime(2026, 9, 17, 10, 0)

CITE = {
    "id": 1,
    "nom": "Résidence Les Palmiers",
    "adresse": "Riviera Palmeraie, Cocody",
    "ville": "Abidjan",
    "latitude": 5.3671,
    "longitude": -3.9832,
    "nombreVillas": 48,
    "montantCotisation": 25000,
}

PRENOMS = ["Koffi", "Aminata", "Yao", "Fanta", "Ibrahim", "Adjoua",
           "Mamadou", "Akissi", "Serge", "Mariam", "Franck", "Nadège"]
NOMS = ["Kouassi", "Traoré", "N'Dri", "Diallo", "Bamba", "Koné",
        "Yapo", "Cissé", "Gbagbo", "Ouattara", "Touré", "Kouamé"]


def nom_complet(i):
    return f"{PRENOMS[i % len(PRENOMS)]} {NOMS[(i * 3) % len(NOMS)]}"


RESIDENTS = [{
    "id": i,
    "nom": nom_complet(i),
    "email": f"resident{i}@exemple.ci",
    "telephone": f"07 {random.randint(10,99)} {random.randint(10,99)} "
                 f"{random.randint(10,99)} {random.randint(10,99)}",
    "villa": f"Villa {chr(65 + i % 6)}{i:02d}",
    "roles": (["ROLE_RESIDENT"] if i > 3 else
              ["ROLE_ADMIN"] if i == 1 else
              ["ROLE_GARDIEN"] if i == 2 else ["ROLE_SUPER_ADMIN"]),
    "actif": True,
    "latitude": CITE["latitude"] + random.uniform(-0.002, 0.002),
    "longitude": CITE["longitude"] + random.uniform(-0.002, 0.002),
    "dateInscription": (MAINTENANT - timedelta(days=random.randint(30, 400)))
                       .isoformat(),
} for i in range(1, 15)]

TYPES_INCIDENT = ["Panne d'éclairage", "Fuite d'eau", "Dépôt d'ordures",
                  "Portail défectueux", "Nuisance sonore", "Voirie dégradée"]
STATUTS = ["OUVERT", "EN_COURS", "RESOLU", "CLOTURE"]
PRIORITES = ["BASSE", "MOYENNE", "HAUTE", "URGENTE"]

INCIDENTS = [{
    "id": i,
    "titre": random.choice(TYPES_INCIDENT),
    "description": random.choice([
        "Le lampadaire de l'allée centrale ne s'allume plus depuis trois soirs.",
        "Écoulement permanent au niveau du compteur général.",
        "Les ordures s'accumulent près du portail nord depuis le week-end.",
        "Le portail automatique reste bloqué en position ouverte.",
        "Travaux tardifs chez un voisin, au-delà de 22 heures.",
        "Nid-de-poule à l'entrée, gênant pour les véhicules bas.",
    ]),
    "statut": random.choices(STATUTS, weights=[3, 4, 3, 2])[0],
    "priorite": random.choices(PRIORITES, weights=[2, 4, 3, 1])[0],
    "residentId": random.randint(1, 14),
    "residentNom": nom_complet(random.randint(1, 14)),
    "villa": f"Villa {chr(65 + i % 6)}{i:02d}",
    "dateCreation": (MAINTENANT - timedelta(days=random.randint(0, 40),
                     hours=random.randint(0, 20))).isoformat(),
    "photos": [],
} for i in range(1, 19)]

MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre"]

COTISATIONS = [{
    "id": i,
    "residentId": (i % 14) + 1,
    "residentNom": nom_complet((i % 14) + 1),
    "villa": f"Villa {chr(65 + i % 6)}{i:02d}",
    "mois": MOIS[i % len(MOIS)],
    "annee": 2026,
    "montant": 25000,
    "statut": random.choices(["PAYEE", "EN_ATTENTE", "EN_RETARD", "REJETEE"],
                             weights=[6, 2, 2, 1])[0],
    "moyenPaiement": random.choice(["GeniusPay", "Espèces", "Virement"]),
    "datePaiement": (MAINTENANT - timedelta(days=random.randint(1, 60)))
                    .isoformat(),
    "recuUrl": None,
} for i in range(1, 25)]

ANNONCES = [
    {"id": 1, "titre": "Coupure d'eau programmée",
     "contenu": "La SODECI annonce une coupure jeudi de 8 h à 14 h sur le "
                "secteur. Pensez à faire vos réserves.",
     "auteur": "Administration", "epingle": True,
     "datePublication": (MAINTENANT - timedelta(days=1)).isoformat()},
    {"id": 2, "titre": "Assemblée générale du 28 septembre",
     "contenu": "Ordre du jour : budget d'entretien, renouvellement du "
                "contrat de gardiennage, réfection de la voirie.",
     "auteur": "Administration", "epingle": True,
     "datePublication": (MAINTENANT - timedelta(days=4)).isoformat()},
    {"id": 3, "titre": "Nouveau prestataire de ramassage",
     "contenu": "Le ramassage passe désormais le lundi et le jeudi matin.",
     "auteur": "Administration", "epingle": False,
     "datePublication": (MAINTENANT - timedelta(days=12)).isoformat()},
]

GARDES = [{
    "id": i,
    "gardienNom": nom_complet(2),
    "debut": (MAINTENANT - timedelta(days=i, hours=12)).isoformat(),
    "fin": (MAINTENANT - timedelta(days=i)).isoformat() if i > 0 else None,
    "statut": "EN_COURS" if i == 0 else "TERMINEE",
    "visitesEnregistrees": random.randint(3, 18),
} for i in range(0, 8)]

REGLEMENTS = [
    {"id": 1, "titre": "Horaires de travaux",
     "contenu": "Les travaux bruyants sont autorisés de 8 h à 18 h en "
                "semaine, et jusqu'à 13 h le samedi.", "ordre": 1},
    {"id": 2, "titre": "Stationnement",
     "contenu": "Le stationnement dans les allées est réservé aux "
                "véhicules de service.", "ordre": 2},
    {"id": 3, "titre": "Animaux domestiques",
     "contenu": "Les animaux doivent être tenus en laisse dans les "
                "parties communes.", "ordre": 3},
]

JOURNAL = [{
    "id": i,
    "action": random.choice(["CONNEXION", "INCIDENT_CREE", "COTISATION_VALIDEE",
                             "ANNONCE_PUBLIEE", "RESIDENT_AJOUTE",
                             "GARDE_DEMARREE"]),
    "utilisateur": f"resident{random.randint(1,14)}@exemple.ci",
    "details": random.choice([
        "Connexion depuis l'application mobile",
        "Nouvel incident signalé",
        "Cotisation de septembre validée",
        "Annonce publiée à tous les résidents",
        "Compte résident créé",
        "Prise de garde enregistrée",
    ]),
    "adresseIp": f"41.66.{random.randint(10,240)}.{random.randint(2,250)}",
    "horodatage": (MAINTENANT - timedelta(hours=i * 4)).isoformat(),
} for i in range(1, 22)]

MOI = {
    "id": 1, "nom": nom_complet(1), "email": "admin@exemple.ci",
    "telephone": "07 12 34 56 78", "villa": "Villa A01",
    "roles": ["ROLE_ADMIN"], "citeId": 1, "citeNom": CITE["nom"],
}

# Un jeton non signe, mais dont la charge est valide : le frontend le
# decode pour lire sa date d'expiration.
JETON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBleGVtcGxlLmNpIiwicm9sZXMiOlsiQURNSU4iXSwiY2l0ZUlkIjoxLCJpYXQiOjE3ODk2MzM5MzksImV4cCI6MTgyMTE2OTkzOX0.demonstration-locale-sans-valeur"


def statistiques():
    par_statut = {}
    for i in INCIDENTS:
        par_statut[i["statut"]] = par_statut.get(i["statut"], 0) + 1
    payees = sum(1 for c in COTISATIONS if c["statut"] == "PAYEE")
    return {
        "totalResidents": len(RESIDENTS),
        "totalIncidents": len(INCIDENTS),
        "incidentsOuverts": par_statut.get("OUVERT", 0),
        "incidentsEnCours": par_statut.get("EN_COURS", 0),
        "incidentsResolus": par_statut.get("RESOLU", 0),
        "totalCotisations": len(COTISATIONS),
        "cotisationsPayees": payees,
        "tauxRecouvrement": round(payees / len(COTISATIONS) * 100),
        "montantCollecte": payees * 25000,
        "montantAttendu": len(COTISATIONS) * 25000,
        "gardeEnCours": True,
        "parStatut": par_statut,
    }


ROUTES = {
    "/auth/login": lambda: {"token": JETON, "type": "Bearer",
                            "utilisateur": MOI, "roles": MOI["roles"]},
    "/auth/me": lambda: MOI,
    "/residents": lambda: RESIDENTS,
    "/residents/me": lambda: MOI,
    "/residents/map": lambda: [
        {"id": r["id"], "nom": r["nom"], "villa": r["villa"],
         "latitude": r["latitude"], "longitude": r["longitude"]}
        for r in RESIDENTS],
    "/incidents": lambda: INCIDENTS,
    "/cotisations": lambda: COTISATIONS,
    "/annonces": lambda: ANNONCES,
    "/reglements": lambda: REGLEMENTS,
    "/cites/me": lambda: CITE,
    "/gardes/admin/actives": lambda: [g for g in GARDES if g["fin"] is None],
    "/gardes/admin/historique": lambda: GARDES,
    "/admin/audit-logs": lambda: JOURNAL,
    "/admin/campagnes": lambda: [],
    "/admin/notifications/unread": lambda: [],
    "/admin/security/reset-requests": lambda: [],
    "/statistiques": statistiques,
    "/dashboard": statistiques,
    "/admin/statistiques": statistiques,
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
        chemin = urlparse(self.path).path.rstrip("/") or "/"
        # Le frontend prefixe parfois ses appels par /api.
        if chemin.startswith("/api"):
            chemin = chemin[4:] or "/"

        if chemin in ROUTES:
            return self.repondre(ROUTES[chemin]())

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
    print("API WeCite de demonstration sur http://127.0.0.1:8085")
    HTTPServer(("127.0.0.1", 8085), Serveur).serve_forever()
