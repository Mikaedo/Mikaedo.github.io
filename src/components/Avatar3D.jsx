import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import maillage from '../data/maillageVisage.json';
import texture from '../assets/images/visage-texture.jpg';
import { visage } from '../data/avatar';
import { bitmoji } from '../data/bitmoji';
import './Avatar3D.css';

/**
 * Votre visage, en volume, qui accompagne le parcours.
 *
 * Ce n'est pas un personnage dessiné : MediaPipe a relevé 478 sommets
 * en trois dimensions sur le portrait, reliés ici en 918 triangles et
 * habillés de la photo elle-même. La ressemblance est donc exacte,
 * puisque c'est votre visage et non une interprétation.
 *
 * Un premier essai assemblait des sphères pour figurer les traits :
 * chaque correction déplaçait le défaut, les yeux passaient derrière
 * les lunettes, la barbe mangeait le menton. Le maillage règle la
 * question à la racine.
 *
 * @param {number} avancement  0 en haut du parcours, 1 en bas
 */
export default function Avatar3D({ avancement = 0 }) {
  const support = useRef(null);
  const vivant = useRef({ avancement: 0 });

  useEffect(() => {
    const cadre = support.current;
    if (!cadre) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    const rendu = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendu.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    cadre.appendChild(rendu.domElement);

    const groupe = new THREE.Group();
    scene.add(groupe);

    // ---------------------------------------------------------------
    // Un modèle Ready Player Me, s'il en existe un.
    //
    // Il arrive en pied : on le cadre sur le buste, et l'on masque le
    // maillage du visage qui servait de solution d'attente.
    // ---------------------------------------------------------------
    let modeleCharge = false;

    if (bitmoji.modele) {
      const chargeur = new GLTFLoader();
      chargeur.load(
        bitmoji.modele,
        (gltf) => {
          modeleCharge = true;
          groupe.clear();

          const personnage = gltf.scene;
          const c = bitmoji.cadrage;

          /* Le modèle est livré debout, à l'échelle humaine : on le
             remonte pour cadrer sur le visage et les épaules. */
          personnage.position.y = -c.hauteurVisee;
          personnage.traverse((o) => {
            if (o.isMesh) {
              o.castShadow = false;
              o.receiveShadow = false;
              /* Les cheveux et les vêtements arrivent parfois en
                 double face : on garde la face avant, plus propre. */
              if (o.material) o.material.side = THREE.FrontSide;
            }
          });

          groupe.add(personnage);
          camera.position.set(0, 0, c.distance * 3.2);
          camera.lookAt(0, 0, 0);
        },
        undefined,
        () => {
          /* Le modèle n'a pas pu être chargé : le maillage du visage
             reste affiché, personne ne voit une vignette vide. */
          modeleCharge = false;
        }
      );
    }

    // ---------------------------------------------------------------
    // Le maillage du visage, à défaut de modèle
    // ---------------------------------------------------------------
    const geometrie = new THREE.BufferGeometry();
    geometrie.setAttribute('position',
      new THREE.Float32BufferAttribute(maillage.sommets, 3));
    geometrie.setAttribute('uv',
      new THREE.Float32BufferAttribute(maillage.uv, 2));
    geometrie.setIndex(maillage.triangles);

    /* Les normales décident de la façon dont la lumière accroche : sans
       elles, la surface serait uniformément plate. */
    geometrie.computeVertexNormals();

    const chargeur = new THREE.TextureLoader();
    const peau = chargeur.load(texture);
    peau.colorSpace = THREE.SRGBColorSpace;

    const matiere = new THREE.MeshStandardMaterial({
      map: peau,
      roughness: 0.82,
      metalness: 0.02,
      side: THREE.DoubleSide
    });

    const tete = new THREE.Mesh(geometrie, matiere);
    /* Le maillage sort plus grand que nature : on le ramene a une
       taille ou le buste ne parait pas rachitique. */
    tete.scale.setScalar(0.78);
    tete.position.y = 0.16;
    groupe.add(tete);

    /* Le buste, dans les couleurs relevées sur la photo : il donne une
       assise au visage, qui flotterait sans lui. */
    const c = visage.couleurs;
    const mat = (couleur) => new THREE.MeshStandardMaterial({
      color: new THREE.Color(couleur), roughness: 0.9, metalness: 0
    });

    /* Le cou : sans lui, la tete flotte au-dessus du buste. */
    const cou = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.2, 0.3, 14), mat(c.peauOmbre));
    cou.position.set(0, -0.44, 0.02);
    groupe.add(cou);

    const epaules = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.34, 0.6, 6, 16), mat(c.pull));
    epaules.rotation.z = Math.PI / 2;
    epaules.position.set(0, -0.66, -0.08);
    epaules.scale.set(1, 1, 0.6);
    groupe.add(epaules);

    const torse = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.44, 0.55, 20), mat(c.pull));
    torse.scale.set(1, 1, 0.62);
    torse.position.set(0, -1.0, -0.08);
    groupe.add(torse);

    /* Le col de chemise et la cravate, sous le menton. */
    [-1, 1].forEach((cote) => {
      const pan = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.22, 0.04), mat(c.chemise));
      pan.position.set(cote * 0.08, -0.56, 0.2);
      pan.rotation.z = cote * 0.5;
      groupe.add(pan);
    });

    const cravate = new THREE.Mesh(
      new THREE.BoxGeometry(0.075, 0.34, 0.05), mat(c.cravate));
    cravate.position.set(0, -0.78, 0.2);
    groupe.add(cravate);

    // --- L'éclairage -----------------------------------------------
    /* Une lumière principale légèrement de côté : la photo est éclairée
       de face, un éclairage frontal écraserait tout le relief. */
    const cle = new THREE.DirectionalLight(0xfff6ec, 1.5);
    cle.position.set(1.6, 2.2, 3.2);
    scene.add(cle);

    const appoint = new THREE.DirectionalLight(0xffe6d2, 0.55);
    appoint.position.set(-2.6, 0.4, 1.8);
    scene.add(appoint);

    scene.add(new THREE.AmbientLight(0xffffff, 0.72));

    camera.position.set(0, -0.2, 3.3);
    camera.lookAt(0, -0.2, 0);

    function redimensionner() {
      const t = Math.min(cadre.clientWidth, cadre.clientHeight) || 200;
      rendu.setSize(t, t, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    }
    redimensionner();
    window.addEventListener('resize', redimensionner);

    const sobre = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let image;
    let temps = 0;

    function animer() {
      image = requestAnimationFrame(animer);
      temps += 0.016;
      const avance = vivant.current.avancement;

      if (!sobre) {
        /* Le visage se tourne doucement, et suit l'étape lue : il
           regarde vers le bas du parcours à mesure qu'on descend. */
        groupe.rotation.y = Math.sin(temps * 0.32) * 0.2 - avance * 0.34;
        groupe.rotation.x = avance * 0.14;
        groupe.position.y = Math.sin(temps * 0.75) * 0.03;
      } else {
        groupe.rotation.y = -avance * 0.34;
      }

      rendu.render(scene, camera);
    }
    animer();

    return () => {
      cancelAnimationFrame(image);
      window.removeEventListener('resize', redimensionner);
      geometrie.dispose();
      matiere.dispose();
      peau.dispose();
      rendu.dispose();
      if (rendu.domElement.parentNode === cadre) {
        cadre.removeChild(rendu.domElement);
      }
    };
  }, []);

  useEffect(() => {
    vivant.current.avancement = avancement;
  }, [avancement]);

  return <div className="avatar3d" ref={support} aria-hidden="true" />;
}
