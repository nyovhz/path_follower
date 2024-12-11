"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { LoadGLTFByPath, getOBjectByName } from '../helpers/ModelHelper.js'
import { loadCurveFromJSON } from "../helpers/GetCurve.js";
import { setupRenderer } from "../helpers/RendererHelper.js";
import { getCameraList } from "../helpers/CameraHelper.js";
import PositionAlongPathState from "../helpers/PositionAlongPathState.js";
import { handleScroll, updatePosition} from '../helpers/PositionAlongPathMethods.js'

const scenePath = "./hallway.glb";
const curvePath = "./path.json";

export default function Scene() {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  

  useEffect(() => {
    

    const initializeScene = async () => {
      if (!mountRef.current || !canvasRef.current) return;

      // Crear la escena
      const scene = new THREE.Scene();

      // Cargar el modelo GLTF en la escena
      //await LoadGLTFByPath(scene, scenePath);

      // Cargar la curva desde JSON
      let mazePath = await loadCurveFromJSON(curvePath);

      // Añadir la curva como malla a la escena
      scene.add(mazePath.mesh);

      // Configurar la cámara
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      
      const cameraList = getCameraList(scene);
      if (cameraList.length > 0) {
        camera.position.copy(cameraList[0].position);
        camera.rotation.copy(cameraList[0].rotation);
      }
      scene.add(camera);

      // Configurar el renderer, pasando el canvas desde React
      const renderer = setupRenderer(canvasRef.current);

      let positionAlongPathState = new PositionAlongPathState();
      let lastScrollTop = window.scrollY;
     
      window.addEventListener('scroll', onScroll, false);
      function onScroll(event) {
        const scrollTop = window.scrollY; // Obtener la posición actual
        const changeInScroll = scrollTop - lastScrollTop; // Calcular el desplazamiento relativo
        lastScrollTop = scrollTop;
      
        // Introducir un factor de escala para suavizar el efecto
        const scrollFactor = 0.01;
        handleScroll({ deltaY: changeInScroll * scrollFactor }, positionAlongPathState);
      }
      

      
      // Animar la escena
      const animate = () => {
        requestAnimationFrame(animate);
        updatePosition(mazePath, camera, positionAlongPathState);
        renderer.render(scene, camera);
      };
      animate();
    };

    initializeScene();
  }, []);

  return (
    <div ref={mountRef} style={{ width: "100%", height: "100vh" }}>
      <canvas id="background" ref={canvasRef} />
    </div>
  );
}
