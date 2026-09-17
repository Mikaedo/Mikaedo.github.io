import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Technos3D.css';

/**
 * Les technologies, en volume, qui tournent lentement.
 *
 * Chaque bloc porte le nom d'un outil, gravé sur une plaque qui pivote
 * sur elle-même. Ce n'est pas un décor : la rangée dit d'un coup d'œil
 * avec quoi je travaille, avant même de lire le détail en dessous.
 *
 * Les plaques sont dessinées sur une toile plutôt que chargées comme
 * images : un logo importé garderait ses couleurs d'origine et jurerait
 * sur le brun de la page, en plus d'alourdir le chargement.
 */

/* Chaque outil, avec sa lettre de gravure et sa teinte propre, reprise
   de sa charte mais ramenée dans la gamme de la page. */
const OUTILS = [
  { nom: 'Flutter',    signe: 'F',  teinte: '#6E93B4' },
  { nom: 'Python',     signe: 'Py', teinte: '#9A8656' },
  { nom: 'Java',       signe: 'J',  teinte: '#A86B57' },
  { nom: 'Angular',    signe: 'A',  teinte: '#A85C5C' },
  { nom: 'React',      signe: 'R',  teinte: '#5C93A8' },
  { nom: 'PostgreSQL', signe: 'Pg', teinte: '#5C7C9A' },
  { nom: 'Docker',     signe: 'D',  teinte: '#5A8CBC' },
  { nom: 'YOLOv8',     signe: 'Y',  teinte: '#936EA8' },
  { nom: 'ONNX',       signe: 'O',  teinte: '#86829A' },
  { nom: 'Git',        signe: 'G',  teinte: '#B87046' }
];

export default function Technos3D() {
  const support = useRef(null);

  useEffect(() => {
    const cadre = support.current;
    if (!cadre) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 3, 0.1, 100);
    const rendu = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendu.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    cadre.appendChild(rendu.domElement);

    const rangee = new THREE.Group();
    scene.add(rangee);

    /* La gravure : le nom et la lettre, dessinés sur une toile qui
       sert de texture à la face avant de la plaque. */
    function graver(outil) {
      const toile = document.createElement('canvas');
      toile.width = 512;
      toile.height = 512;
      const d = toile.getContext('2d');

      d.fillStyle = outil.teinte;
      d.fillRect(0, 0, 512, 512);

      /* Un reflet diagonal, pour que la plaque ne soit pas plate. */
      const reflet = d.createLinearGradient(0, 0, 512, 512);
      reflet.addColorStop(0, 'rgba(255,255,255,.18)');
      reflet.addColorStop(0.5, 'rgba(255,255,255,.02)');
      reflet.addColorStop(1, 'rgba(0,0,0,.14)');
      d.fillStyle = reflet;
      d.fillRect(0, 0, 512, 512);

      d.fillStyle = 'rgba(255,255,255,.94)';
      d.textAlign = 'center';
      d.textBaseline = 'middle';
      d.font = 'bold 230px Georgia, serif';
      d.fillText(outil.signe, 256, 196);

      d.font = '600 62px "Public Sans", Helvetica, sans-serif';
      d.fillStyle = 'rgba(255,255,255,.8)';
      d.fillText(outil.nom, 256, 388);

      const texture = new THREE.CanvasTexture(toile);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      return texture;
    }

    const plaques = [];
    const cote = 1;

    OUTILS.forEach((outil, i) => {
      const face = new THREE.MeshStandardMaterial({
        map: graver(outil), roughness: 0.55, metalness: 0.1
      });
      const tranche = new THREE.MeshStandardMaterial({
        color: new THREE.Color(outil.teinte).multiplyScalar(0.62),
        roughness: 0.7, metalness: 0.08
      });

      /* Les six faces : la gravure devant et derrière, la teinte
         sombre sur les tranches. */
      const plaque = new THREE.Mesh(
        new THREE.BoxGeometry(cote, cote, cote * 0.24),
        [tranche, tranche, tranche, tranche, face, face]
      );

      plaque.position.x = (i - (OUTILS.length - 1) / 2) * 1.24;
      plaque.userData.phase = i * 0.42;
      rangee.add(plaque);
      plaques.push(plaque);
    });

    const cle = new THREE.DirectionalLight(0xfff4e6, 1.25);
    cle.position.set(2, 3, 5);
    scene.add(cle);
    const appoint = new THREE.DirectionalLight(0xffe8d4, 0.45);
    appoint.position.set(-3, 1, 3);
    scene.add(appoint);
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    camera.position.set(0, 0, 7.4);
    camera.lookAt(0, 0, 0);

    function redimensionner() {
      const l = cadre.clientWidth;
      const h = cadre.clientHeight || l / 6;
      if (!l || !h) return;
      rendu.setSize(l, h, false);
      camera.aspect = l / h;

      /* Sur écran étroit, on recule pour que la rangée tienne encore
         dans le cadre. */
      camera.position.z = l < 700 ? 12.5 : l < 1000 ? 9.4 : 7.4;
      camera.updateProjectionMatrix();
    }
    redimensionner();
    window.addEventListener('resize', redimensionner);

    const sobre = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let image;
    let temps = 0;

    function animer() {
      image = requestAnimationFrame(animer);
      if (!sobre) {
        temps += 0.009;
        plaques.forEach((p) => {
          /* Chaque plaque tourne avec un décalage : la rangée ondule
             au lieu de pivoter d'un bloc. */
          p.rotation.y = temps + p.userData.phase;
          p.position.y = Math.sin(temps * 1.6 + p.userData.phase) * 0.09;
        });
      }
      rendu.render(scene, camera);
    }
    animer();

    return () => {
      cancelAnimationFrame(image);
      window.removeEventListener('resize', redimensionner);
      plaques.forEach((p) => {
        p.geometry.dispose();
        p.material.forEach((m) => { m.map?.dispose(); m.dispose(); });
      });
      rendu.dispose();
      if (rendu.domElement.parentNode === cadre) {
        cadre.removeChild(rendu.domElement);
      }
    };
  }, []);

  return (
    <div className="technos3d" ref={support} aria-hidden="true" />
  );
}
