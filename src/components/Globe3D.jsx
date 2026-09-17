import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Globe3D.css';

/**
 * Le globe, centré sur Abidjan, derrière l'ouverture.
 *
 * Il tourne lentement, s'éloigne à mesure qu'on descend dans la page,
 * et se laisse faire tourner à la main. Trois arcs partent d'Abidjan :
 * c'est de là que part le travail présenté ici.
 *
 * Les parallèles et les méridiens sont tracés un à un : le fil de fer
 * d'une sphère Three.js la triangule et donne un ballon de football
 * plutôt qu'un globe.
 */
export default function Globe3D() {
  const support = useRef(null);

  useEffect(() => {
    const cadre = support.current;
    if (!cadre) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    const rendu = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendu.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    cadre.appendChild(rendu.domElement);

    const globe = new THREE.Group();
    scene.add(globe);

    const R = 2;

    function jeton(nom, repli) {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue(nom).trim();
      return new THREE.Color(v || repli);
    }

    /* La sphère pleine, discrète : elle masque les points passés
       derrière, sans quoi la lecture du volume se perd. */
    const boule = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.985, 44, 44),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.85 })
    );
    globe.add(boule);

    /* Les parallèles. */
    const grille = new THREE.Group();
    const matGrille = new THREE.LineBasicMaterial({
      transparent: true, opacity: 0.3
    });
    const matEquateur = new THREE.LineBasicMaterial({
      transparent: true, opacity: 0.55
    });

    for (let lat = -60; lat <= 60; lat += 30) {
      const pts = [];
      const r = R * Math.cos((lat * Math.PI) / 180);
      const y = R * Math.sin((lat * Math.PI) / 180);
      for (let a = 0; a <= 64; a++) {
        const th = (a / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(r * Math.cos(th), y, r * Math.sin(th)));
      }
      grille.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        lat === 0 ? matEquateur : matGrille
      ));
    }

    /* Les méridiens. */
    for (let lon = 0; lon < 180; lon += 30) {
      const pts = [];
      for (let b = 0; b <= 64; b++) {
        const ph = (b / 64) * Math.PI * 2;
        const lo = (lon * Math.PI) / 180;
        pts.push(new THREE.Vector3(
          R * Math.sin(ph) * Math.cos(lo),
          R * Math.cos(ph),
          R * Math.sin(ph) * Math.sin(lo)
        ));
      }
      grille.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts), matGrille));
    }
    globe.add(grille);

    /* Un halo : une sphère à peine plus large, vue de l'intérieur. */
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.14, 36, 36),
      new THREE.MeshBasicMaterial({
        transparent: true, opacity: 0.06, side: THREE.BackSide
      })
    );
    globe.add(halo);

    function versVecteur(lat, lon, rayon) {
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((lon + 180) * Math.PI) / 180;
      return new THREE.Vector3(
        -rayon * Math.sin(phi) * Math.cos(theta),
        rayon * Math.cos(phi),
        rayon * Math.sin(phi) * Math.sin(theta)
      );
    }

    /* Abidjan, et les deux villes où mes projets se déroulent. */
    const VILLES = [
      { lat: 5.35, lon: -4.02, cle: true },   // Abidjan
      { lat: 5.35, lon: -3.89, cle: false },  // Bingerville
      { lat: 5.42, lon: -4.02, cle: false }   // Abobo
    ];

    const reperes = [];
    const matRepere = new THREE.MeshBasicMaterial({ transparent: true });

    VILLES.forEach((v) => {
      const pos = versVecteur(v.lat, v.lon, R * 1.014);
      const point = new THREE.Mesh(
        new THREE.SphereGeometry(v.cle ? 0.08 : 0.048, 12, 12), matRepere);
      point.position.copy(pos);
      globe.add(point);
      reperes.push(point);

      if (v.cle) {
        /* L'onde qui bat sur Abidjan. */
        const onde = new THREE.Mesh(
          new THREE.RingGeometry(0.1, 0.13, 30),
          new THREE.MeshBasicMaterial({
            transparent: true, opacity: 0.6, side: THREE.DoubleSide
          })
        );
        onde.position.copy(pos);
        onde.lookAt(0, 0, 0);
        onde.userData.bat = true;
        globe.add(onde);
        reperes.push(onde);
      }
    });

    /* Les arcs : les liaisons qu'un système finit par établir. */
    const arcs = [];
    [[5.35, -4.02, 48.85, 2.35],
     [5.35, -4.02, 5.35, -3.89],
     [5.35, -4.02, 37.77, -122.42]].forEach((t) => {
      const a = versVecteur(t[0], t[1], R);
      const b = versVecteur(t[2], t[3], R);
      const milieu = a.clone().add(b).multiplyScalar(0.5)
        .normalize().multiplyScalar(R * 1.34);
      const courbe = new THREE.QuadraticBezierCurve3(a, milieu, b);
      const ligne = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(courbe.getPoints(44)),
        new THREE.LineBasicMaterial({ transparent: true, opacity: 0.45 })
      );
      globe.add(ligne);
      arcs.push(ligne);
    });

    function majCouleurs() {
      const sombre =
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        (!document.documentElement.getAttribute('data-theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

      const brun = jeton('--brun', '#4A3426');
      const accent = jeton('--accent', '#8C5A32');
      const creux = jeton('--fond-creux', '#F4EFE8');

      boule.material.color = sombre
        ? brun.clone().multiplyScalar(0.3) : creux.clone();
      boule.material.opacity = sombre ? 0.7 : 0.85;

      [matGrille, matEquateur].forEach((m, i) => {
        m.color = sombre ? accent.clone().multiplyScalar(0.85) : brun.clone();
        m.opacity = (i === 1 ? 0.58 : 0.3) * (sombre ? 1 : 0.8);
      });

      halo.material.color = accent.clone();
      matRepere.color = accent.clone();
      reperes.forEach((p) => { p.material.color = accent.clone(); });
      arcs.forEach((a) => {
        a.material.color = accent.clone();
        a.material.opacity = sombre ? 0.5 : 0.4;
      });
    }
    majCouleurs();

    const suiviTheme = new MutationObserver(majCouleurs);
    suiviTheme.observe(document.documentElement, {
      attributes: true, attributeFilter: ['data-theme']
    });
    const suiviSysteme = window.matchMedia('(prefers-color-scheme: dark)');
    suiviSysteme.addEventListener('change', majCouleurs);

    camera.position.set(0, 0.6, 6.4);
    camera.lookAt(0, 0, 0);

    function redimensionner() {
      const l = cadre.clientWidth;
      const h = cadre.clientHeight || l;
      if (!l || !h) return;
      rendu.setSize(l, h, false);
      camera.aspect = l / h;
      camera.updateProjectionMatrix();
    }
    redimensionner();
    window.addEventListener('resize', redimensionner);

    /* On peut le faire tourner à la main, et il s'éloigne quand la
       page défile : on prend de la hauteur en descendant. */
    let tourne = -0.6;
    let cibleT = -0.6;
    let dist = 6.4;
    let cibleD = 6.4;
    let saisi = false;
    let departX = 0;
    let departA = 0;

    const toile = rendu.domElement;
    toile.style.cursor = 'grab';

    const prendre = (x) => {
      saisi = true; departX = x; departA = cibleT;
      toile.style.cursor = 'grabbing';
    };
    const bouger = (x) => {
      if (saisi) cibleT = departA + (x - departX) * 0.0072;
    };
    const lacher = () => { saisi = false; toile.style.cursor = 'grab'; };

    toile.addEventListener('mousedown', (e) => prendre(e.clientX));
    window.addEventListener('mousemove', (e) => bouger(e.clientX));
    window.addEventListener('mouseup', lacher);
    toile.addEventListener('touchstart',
      (e) => prendre(e.touches[0].clientX), { passive: true });
    toile.addEventListener('touchmove',
      (e) => bouger(e.touches[0].clientX), { passive: true });
    toile.addEventListener('touchend', lacher);

    const surDefilement = () => {
      const part = Math.min(window.scrollY / 700, 1);
      if (!saisi) cibleD = 6.4 + part * 2.6;
    };
    window.addEventListener('scroll', surDefilement, { passive: true });

    const sobre = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let image;
    const t0 = performance.now();

    function animer(t) {
      image = requestAnimationFrame(animer);
      if (!saisi && !sobre) cibleT += 0.0016;
      tourne += (cibleT - tourne) * 0.075;
      dist += (cibleD - dist) * 0.07;

      globe.rotation.y = tourne;
      globe.rotation.x = 0.22;
      camera.position.z = dist;
      camera.lookAt(0, 0, 0);

      if (!sobre) {
        const bat = (Math.sin((t - t0) * 0.0022) + 1) / 2;
        globe.children.forEach((o) => {
          if (o.userData.bat) {
            const e = 1 + bat * 1.5;
            o.scale.set(e, e, e);
            o.material.opacity = 0.6 * (1 - bat);
          }
        });
      }
      rendu.render(scene, camera);
    }
    animer();

    return () => {
      cancelAnimationFrame(image);
      window.removeEventListener('resize', redimensionner);
      window.removeEventListener('scroll', surDefilement);
      window.removeEventListener('mousemove', bouger);
      window.removeEventListener('mouseup', lacher);
      suiviTheme.disconnect();
      suiviSysteme.removeEventListener('change', majCouleurs);
      rendu.dispose();
      if (rendu.domElement.parentNode === cadre) {
        cadre.removeChild(rendu.domElement);
      }
    };
  }, []);

  return <div className="globe3d" ref={support} aria-hidden="true" />;
}
