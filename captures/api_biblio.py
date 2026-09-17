# -*- coding: utf-8 -*-
"""Sert a l'application Bibliotheque UPB des donnees inventees.

Meme principe que pour le SI-ENV et WeCite. Le catalogue, les
emprunts et les lecteurs sont inventes : aucun fonds documentaire reel
ne figure dans le portfolio.
"""
import json
import random
from datetime import datetime, timedelta
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

random.seed(11)
MAINTENANT = datetime(2026, 9, 17, 9, 0)

CATALOGUES = [
    {"id": 1, "nom": "Informatique", "description": "Algorithmique, génie logiciel, réseaux"},
    {"id": 2, "nom": "Mathématiques", "description": "Analyse, algèbre, probabilités"},
    {"id": 3, "nom": "Gestion", "description": "Comptabilité, management, économie"},
    {"id": 4, "nom": "Littérature", "description": "Romans, essais, poésie"},
    {"id": 5, "nom": "Sciences", "description": "Physique, chimie, biologie"},
]

LIVRES = [
    ("Clean Code", "Robert C. Martin", 1, 2008, 4),
    ("Design Patterns", "Gamma, Helm, Johnson, Vlissides", 1, 1994, 2),
    ("Introduction to Algorithms", "Cormen et al.", 1, 2009, 3),
    ("Le Pragmatic Programmer", "Hunt et Thomas", 1, 2019, 2),
    ("Refactoring", "Martin Fowler", 1, 2018, 1),
    ("Calculus", "James Stewart", 2, 2015, 5),
    ("Mathématiques discrètes", "Kenneth Rosen", 2, 2012, 3),
    ("Probabilités et statistiques", "Sheldon Ross", 2, 2014, 2),
    ("Principes de management", "Henri Fayol", 3, 2016, 4),
    ("Comptabilité générale", "Claude Pérochon", 3, 2017, 6),
    ("Économie du développement", "Gérard Destanne", 3, 2011, 2),
    ("L'Aventure ambiguë", "Cheikh Hamidou Kane", 4, 1961, 5),
    ("Une si longue lettre", "Mariama Bâ", 4, 1979, 4),
    ("Les Soleils des indépendances", "Ahmadou Kourouma", 4, 1968, 3),
    ("1984", "George Orwell", 4, 1949, 2),
    ("Le Vieux Nègre et la Médaille", "Ferdinand Oyono", 4, 1956, 3),
    ("Cosmos", "Carl Sagan", 5, 1980, 2),
    ("Une brève histoire du temps", "Stephen Hawking", 5, 1988, 3),
    ("Biologie moléculaire", "Bruce Alberts", 5, 2015, 2),
    ("Chimie organique", "Paula Bruice", 5, 2013, 1),
]

CATALOGUE = [{
    "id": i + 1,
    "titre": t,
    "auteur": a,
    "catalogueId": cat,
    "catalogueNom": next(c["nom"] for c in CATALOGUES if c["id"] == cat),
    "anneePublication": annee,
    "isbn": f"978-2-{random.randint(1000, 9999)}-{random.randint(1000, 9999)}-{random.randint(0, 9)}",
    "exemplairesTotal": ex,
    "exemplairesDisponibles": max(0, ex - random.randint(0, min(2, ex))),
    "editeur": random.choice(["Dunod", "Eyrolles", "Présence Africaine",
                              "Pearson", "Hachette", "De Boeck"]),
    "resume": "Ouvrage de référence du fonds documentaire universitaire.",
    "imageUrl": None,
} for i, (t, a, cat, annee, ex) in enumerate(LIVRES)]

PRENOMS = ["Koffi", "Aminata", "Yao", "Fanta", "Ibrahim", "Adjoua",
           "Mamadou", "Akissi", "Serge", "Mariam"]
NOMS = ["Kouassi", "Traoré", "N'Dri", "Diallo", "Bamba", "Koné",
        "Yapo", "Cissé", "Ouattara", "Touré"]

ETUDIANTS = [{
    "utilisateurId": i,
    "id": i,
    "nom": NOMS[(i * 3) % len(NOMS)],
    "prenom": PRENOMS[i % len(PRENOMS)],
    "identifiant": f"UPB{2024 + i % 3}{i:03d}",
    "email": f"etudiant{i}@upb.edu.ci",
    "matricule": f"UPB{2024 + i % 3}{i:03d}",
    "typeUtilisateur": ("ETUDIANT" if i > 3 else
                        "ADMINISTRATEUR" if i == 1 else "BIBLIOTHECAIRE"),
    "type_utilisateur": ("ETUDIANT" if i > 3 else
                         "ADMINISTRATEUR" if i == 1 else "BIBLIOTHECAIRE"),
    "filiere": random.choice(["MIAGE", "Génie Logiciel", "Réseaux",
                              "Gestion", "Mathématiques"]),
    "niveau": random.choice(["Licence 1", "Licence 2", "Licence 3", "Master 1"]),
    "role": "ETUDIANT" if i > 2 else ("ADMIN" if i == 1 else "BIBLIOTHECAIRE"),
    "actif": True,
    "empruntsEnCours": random.randint(0, 3),
    "dateInscription": (MAINTENANT - timedelta(days=random.randint(40, 700)))
                       .isoformat(),
} for i in range(1, 17)]

STATUTS = ["EN_COURS", "RENDU", "EN_RETARD"]

EMPRUNTS = [{
    "id": i,
    "livreId": random.randint(1, len(CATALOGUE)),
    "livreTitre": random.choice(LIVRES)[0],
    "etudiantId": random.randint(1, 16),
    "etudiantNom": f"{PRENOMS[i % len(PRENOMS)]} {NOMS[(i * 5) % len(NOMS)]}",
    "matricule": f"UPB2025{i:03d}",
    "dateEmprunt": (MAINTENANT - timedelta(days=random.randint(1, 45)))
                   .isoformat(),
    "dateRetourPrevue": (MAINTENANT + timedelta(days=random.randint(-8, 20)))
                        .isoformat(),
    "dateRetourEffective": None,
    "statut": random.choices(STATUTS, weights=[5, 4, 2])[0],
} for i in range(1, 23)]

MOI = {
    "utilisateurId": 1,
    "identifiant": "LIB001",
    "nom": "Konan",
    "prenom": "Aya",
    "email": "biblio@upb.edu.ci",
    "typeUtilisateur": "ADMINISTRATEUR",
    "type_utilisateur": "ADMINISTRATEUR",
    "actif": True,
    "dateInscription": "2024-09-02T08:00:00",
}

JETON = ("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
         "eyJzdWIiOiJhZG1pbkB1cGIuZWR1LmNpIiwicm9sZSI6IkFETUlOIn0."
         "demonstration-locale-sans-valeur")


def statistiques():
    """Les chiffres du tableau de bord, aux noms attendus par l'appli."""
    en_cours = sum(1 for e in EMPRUNTS if e["statut"] == "EN_COURS")
    retard = sum(1 for e in EMPRUNTS if e["statut"] == "EN_RETARD")
    return {
        "totalLivres": len(CATALOGUE),
        "totalUtilisateurs": len(ETUDIANTS),
        "administrateurs": 1,
        "bibliothecaires": 2,
        "etudiants": len(ETUDIANTS) - 3,
        "empruntsEnCours": en_cours,
        "empruntsEnRetard": retard,
        "reservationsEnAttente": 4,
        "totalExemplaires": sum(l["exemplairesTotal"] for l in CATALOGUE),
        "exemplairesDisponibles": sum(l["exemplairesDisponibles"]
                                      for l in CATALOGUE),
        "totalEmprunts": len(EMPRUNTS),
        "totalCatalogues": len(CATALOGUES),
        "retards": [
            {"titreLivre": e["livreTitre"], "utilisateur": e["etudiantNom"],
             "retard": random.randint(2, 15), "penalite": random.randint(500, 3000)}
            for e in EMPRUNTS if e["statut"] == "EN_RETARD"][:5],
        "reservationsRecentes": [
            {"reservationId": i, "titreLivre": random.choice(LIVRES)[0],
             "utilisateur": e["nom"], "position": i,
             "statut": "EN_ATTENTE"}
            for i, e in enumerate(ETUDIANTS[:4], start=1)],
    }


ROUTES = {
    # Le controleur Java expose « /connexion », non « /login ».
    "/api/auth/connexion": lambda: {"token": JETON, "utilisateur": MOI},
    "/api/auth/login": lambda: {"token": JETON, "utilisateur": MOI},
    "/api/auth/me": lambda: MOI,
    "/api/auth/profil": lambda: MOI,
    "/api/livres": lambda: CATALOGUE,
    "/api/livres/disponibles": lambda: [l for l in CATALOGUE
                                        if l["exemplairesDisponibles"] > 0],
    "/api/livres/recherche": lambda: CATALOGUE[:8],
    "/api/catalogues": lambda: CATALOGUES,
    "/api/emprunts": lambda: EMPRUNTS,
    "/api/emprunts/en-cours": lambda: [e for e in EMPRUNTS
                                       if e["statut"] == "EN_COURS"],
    "/api/emprunts/retards": lambda: [e for e in EMPRUNTS
                                      if e["statut"] == "EN_RETARD"],
    "/api/admin/utilisateurs": lambda: ETUDIANTS,
    "/api/admin/dashboard": statistiques,
    "/api/admin/statistiques": statistiques,
    "/api/biblio/dashboard": statistiques,
    "/api/admin/audits": lambda: [],
    "/api/biblio/statistiques": statistiques,
    "/api/notifications": lambda: [],
    "/api/password-reset/pending": lambda: [],
    "/api/statistiques": statistiques,
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
    print("API Bibliotheque de demonstration sur http://127.0.0.1:8080")
    HTTPServer(("127.0.0.1", 8080), Serveur).serve_forever()
