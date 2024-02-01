import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const embedContainer = document.getElementById("container");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.z = 2;
camera.position.y = 1;
camera.position.x = 0;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = 0;
renderer.domElement.style.left = "400px";
renderer.domElement.style.zIndex = -1;
embedContainer.appendChild(renderer.domElement);

// Chargement de la texture
const texture1Loader = new THREE.TextureLoader();
const texture1 = texture1Loader.load("./img/2k_sun.jpg");

// Création d'une sphère avec la texture
const sphere1geo = new THREE.SphereGeometry(1, 32, 32);
const sphere1mesh = new THREE.MeshBasicMaterial({ map: texture1 });
const sphere1 = new THREE.Mesh(sphere1geo, sphere1mesh);
sphere1.position.y = 1;
scene.add(sphere1);

// Chargement de la texture
const texture2Loader = new THREE.TextureLoader();
const texture2 = texture2Loader.load("./img/2k_mercury.jpg");

// Création d'une sphère avec la texture
const sphere2geo = new THREE.SphereGeometry(1, 32, 32);
const sphere2mesh = new THREE.MeshBasicMaterial({ map: texture2 });
const sphere2 = new THREE.Mesh(sphere2geo, sphere2mesh);
sphere2.position.y = 6;
scene.add(sphere2);

// Chargement de la texture
const texture3Loader = new THREE.TextureLoader();
const texture3 = texture3Loader.load("./img/2k_jupiter.jpg");

// Création d'une sphère avec la texture
const sphere3geo = new THREE.SphereGeometry(1, 32, 32);
const sphere3mesh = new THREE.MeshBasicMaterial({ map: texture3 });
const sphere3 = new THREE.Mesh(sphere3geo, sphere3mesh);
sphere3.position.y = 11;
scene.add(sphere3);

function showEmbedForPlanet(index) {
	// Cache tous les divs
	for (let i = 1; i <= 3; i++) {
		document.getElementById("embed" + i).style.display = "none";
	}

	// Affiche le div correspondant à la planète actuelle
	const embedId = "embed" + (index + 1);
	document.getElementById(embedId).style.display = "flex";
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.target.set(0, 1, 0);

const snapPositions = [1, 6, 11];
let currentSnapIndex = 0;

let targetY = camera.position.y;

function onScroll(event) {
	const delta = Math.sign(event.deltaY);

	// Mise à jour de l'index de snap en fonction du scroll
	if (delta < 0 && currentSnapIndex > 0) {
		currentSnapIndex--;
	} else if (delta > 0 && currentSnapIndex < snapPositions.length - 1) {
		currentSnapIndex++;
	}

	showEmbedForPlanet(currentSnapIndex);

	// Définir la nouvelle cible de déplacement
	targetY = snapPositions[currentSnapIndex];
	console.log(currentSnapIndex);
}

// INVERSION DU SCROLL
// function onScroll(event) {
//     const delta = Math.sign(event.deltaY);
//     console.log("Scroll Delta:", delta);

//     if (delta > 0 && currentSnapIndex > 0) {
//         currentSnapIndex--;
//         console.log("Scrolling up, New index:", currentSnapIndex);
//     } else if (delta < 0 && currentSnapIndex < snapPositions.length - 1) {
//         currentSnapIndex++;
//         console.log("Scrolling down, New index:", currentSnapIndex);
//     }

//     showEmbedForPlanet(currentSnapIndex);

//     // Définir la nouvelle cible de déplacement
//     targetY = snapPositions[currentSnapIndex];
// }

showEmbedForPlanet(0);

function animate() {
	requestAnimationFrame(animate);

	// Interpolation douce vers la cible
	const lerpFactor = 0.05;
	camera.position.y += (targetY - camera.position.y) * lerpFactor;

	// Mise à jour des Orbit Controls pour suivre le déplacement
	controls.target.set(
		controls.target.x,
		camera.position.y,
		controls.target.z
	);
	controls.update();

	renderer.render(scene, camera);

	sphere1.rotation.y += 0.001;
	sphere2.rotation.y += 0.001;
	sphere3.rotation.y += 0.001;
}

window.addEventListener("wheel", onScroll);
animate();
