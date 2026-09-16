# -*- coding: utf-8 -*-
"""Sert le tableau de bord Angular, routes cote client comprises.

Le serveur de fichiers ordinaire cherche un fichier pour chaque
adresse : demander « /dashboard » lui fait repondre 404, alors que
cette adresse n'existe que dans le navigateur, ou le routeur Angular
s'en charge.

On renvoie donc index.html pour toute adresse qui ne designe pas un
fichier reel. Les scripts et les images, eux, sont servis normalement.
"""
import os
import sys
from http.server import SimpleHTTPRequestHandler, HTTPServer

RACINE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "site")


class Angular(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=RACINE, **k)

    def do_GET(self):
        chemin = self.translate_path(self.path)
        # Un fichier existe : on le sert tel quel.
        if os.path.isfile(chemin):
            return super().do_GET()
        # Sinon c'est une route de l'application : index.html repond,
        # et le routeur du navigateur affiche la bonne page.
        self.path = "/index.html"
        return super().do_GET()

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8200
    print(f"tableau de bord sur http://127.0.0.1:{port}")
    HTTPServer(("127.0.0.1", port), Angular).serve_forever()
