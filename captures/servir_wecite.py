# -*- coding: utf-8 -*-
"""Sert le tableau de bord WeCite, routes cote client comprises."""
import os, sys
from http.server import SimpleHTTPRequestHandler, HTTPServer

RACINE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "wecite-site")


class Spa(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=RACINE, **k)

    def do_GET(self):
        if os.path.isfile(self.translate_path(self.path)):
            return super().do_GET()
        self.path = "/index.html"
        return super().do_GET()

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8300
    print(f"WeCite sur http://127.0.0.1:{port}")
    HTTPServer(("127.0.0.1", port), Spa).serve_forever()
