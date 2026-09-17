import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  siFlutter, siPython, siFastapi, siSpring, siReact,
  siPostgresql, siDocker
} from 'simple-icons';
import './Technos3D.css';

/**
 * Les technologies, portées par des cubes en volume.
 *
 * Chaque face avant porte le logo officiel de l'outil, tiré du
 * catalogue Simple Icons : ce sont les vraies marques, dans leurs
 * vraies couleurs, et non des lettres dessinées à la main.
 *
 * Le logo arrive en tracé SVG : on le peint sur une toile, qui sert
 * de texture. Un chargement d'image externe serait bloqué et
 * alourdirait la page pour rien, puisque le tracé tient en quelques
 * centaines d'octets.
 */

/* Sept outils, ceux qui traversent les trois projets. Le reste est
   dans le détail en dessous : le répéter ici surchargerait la rangée
   sans rien apprendre de plus. */
const OUTILS = [
  { icone: siFlutter,    nom: 'Flutter' },
  { icone: siPython,     nom: 'Python' },
  { icone: siFastapi,    nom: 'FastAPI' },
  { icone: siSpring,     nom: 'Spring Boot' },
  { icone: siReact,      nom: 'React' },
  { icone: siPostgresql, nom: 'PostgreSQL' },
  { icone: siDocker,     nom: 'Docker' }
];

export default function Technos3D() {
  const support = useRef(null);
  const [survol, setSurvol] = useState(null);

  useEffect(() => {
    const cadre = support.current;
    if (!cadre) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 3, 0.1, 100);
    const rendu = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendu.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    cadre.appendChild(rendu.domElement);

    const rangee = new THREE.Group();
    scene.add(rangee);

    /* Le logo, peint sur une toile blanche : la marque garde sa
       couleur d'origine, posée sur un fond clair qui la fait ressortir
       sur la page brune. */
    function peindre(outil) {
      const T = 512;
      const toile = document.createElement('canvas');
      toile.width = T;
      toile.height = T;
      const d = toile.getContext('2d');

      d.fillStyle = '#FFFFFF';
      d.fillRect(0, 0, T, T);

      /* Le tracé de Simple Icons vit dans une boîte de 24 : on
         l'agrandit et on le centre dans la toile. */
      const echelle = (T * 0.52) / 24;
      d.save();
      d.translate(T / 2, T * 0.42);
      d.scale(echelle, echelle);
      d.translate(-12, -12);
      d.fillStyle = '#' + outil.icone.hex;
      d.fill(new Path2D(outil.icone.path));
      d.restore();

      d.fillStyle = '#3A2B20';
      d.textAlign = 'center';
      d.textBaseline = 'middle';
      d.font = '600 44px "Public Sans", Helvetica, sans-serif';
      d.fillText(outil.nom, T / 2, T * 0.82);

      const texture = new THREE.CanvasTexture(toile);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      return texture;
    }

    const cubes = [];
    const cote = 1.6;

    OUTILS.forEach((outil, i) => {
      const face = new THREE.MeshStandardMaterial({
        map: peindre(outil), roughness: 0.42, metalness: 0.04
      });
      /* Les tranches prennent la couleur de la marque, assombrie :
         le cube se lit comme un objet, non comme une image plate. */
      const tranche = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#' + outil.icone.hex).multiplyScalar(0.8),
        roughness: 0.5, metalness: 0.06
      });

      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(cote, cote, cote * 0.26),
        [tranche, tranche, tranche, tranche, face, face]
      );

      cube.position.x = (i - (OUTILS.length - 1) / 2) * 1.85;
      cube.userData = { rang: i, phase: i * 0.38 };
      rangee.add(cube);
      cubes.push(cube);
    });

    const cle = new THREE.DirectionalLight(0xfff6ec, 1.3);
    cle.position.set(2, 3, 5);
    scene.add(cle);
    const appoint = new THREE.DirectionalLight(0xffeedd, 0.5);
    appoint.position.set(-3, 1, 3);
    scene.add(appoint);
    scene.add(new THREE.AmbientLight(0xffffff, 0.78));

    camera.position.set(0, 0, 7.4);
    camera.lookAt(0, 0, 0);

    function redimensionner() {
      const l = cadre.clientWidth;
      const h = cadre.clientHeight || l / 6;
      if (!l || !h) return;
      rendu.setSize(l, h, false);
      camera.aspect = l / h;
      /* Sur écran étroit, on recule pour que la rangée tienne. */
      camera.position.z = l < 640 ? 12.5 : l < 900 ? 9.8 : 7.4;
      camera.updateProjectionMatrix();
    }
    redimensionner();
    window.addEventListener('resize', redimensionner);

    /* Le cube survolé s'avance et cesse de tourner, pour qu'on lise
       son nom. */
    const rayon = new THREE.Raycaster();
    const souris = new THREE.Vector2();
    let vise = -1;

    const surSouris = (e) => {
      const b = rendu.domElement.getBoundingClientRect();
      souris.x = ((e.clientX - b.left) / b.width) * 2 - 1;
      souris.y = -((e.clientY - b.top) / b.height) * 2 + 1;
      rayon.setFromCamera(souris, camera);
      const touches = rayon.intersectObjects(cubes);
      const nouveau = touches.length ? touches[0].object.userData.rang : -1;
      if (nouveau !== vise) {
        vise = nouveau;
        setSurvol(nouveau >= 0 ? OUTILS[nouveau].nom : null);
        rendu.domElement.style.cursor = nouveau >= 0 ? 'pointer' : 'default';
      }
    };
    const surSortie = () => { vise = -1; setSurvol(null); };

    rendu.domElement.addEventListener('mousemove', surSouris);
    rendu.domElement.addEventListener('mouseleave', surSortie);

    const sobre = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let image;
    let temps = 0;

    function animer() {
      image = requestAnimationFrame(animer);
      if (!sobre) temps += 0.008;

      cubes.forEach((c) => {
        const actif = c.userData.rang === vise;
        const cibleRot = actif ? 0 : temps + c.userData.phase;
        const cibleZ = actif ? 0.8 : 0;
        const cibleE = actif ? 1.18 : 1;

        c.rotation.y += (cibleRot - c.rotation.y) * (actif ? 0.12 : 1);
        c.position.z += (cibleZ - c.position.z) * 0.14;
        c.scale.x += (cibleE - c.scale.x) * 0.14;
        c.scale.y = c.scale.x;
        c.position.y = sobre ? 0
          : Math.sin(temps * 1.5 + c.userData.phase) * 0.08;
      });

      rendu.render(scene, camera);
    }
    animer();

    return () => {
      cancelAnimationFrame(image);
      window.removeEventListener('resize', redimensionner);
      rendu.domElement.removeEventListener('mousemove', surSouris);
      rendu.domElement.removeEventListener('mouseleave', surSortie);
      cubes.forEach((c) => {
        c.geometry.dispose();
        c.material.forEach((m) => { m.map?.dispose(); m.dispose(); });
      });
      rendu.dispose();
      if (rendu.domElement.parentNode === cadre) {
        cadre.removeChild(rendu.domElement);
      }
    };
  }, []);

  return (
    <div className="technos3d">
      <div className="technos3d__scene" ref={support} aria-hidden="true" />
      <p className="technos3d__legende">
        {survol || 'Survolez un logo pour le voir de face'}
      </p>
      {/* La liste reste lisible pour un lecteur d'écran et si la 3D
          ne se charge pas. */}
      <p className="invisible">
        {OUTILS.map((o) => o.nom).join(', ')}
      </p>
    </div>
  );
}
