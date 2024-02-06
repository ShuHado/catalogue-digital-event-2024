import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	50,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
// fov 50 , camera.position.x = -0.8;
// camera.position.y = -0.2

// Ajustement pour les appareils mobiles
if (window.innerWidth < 1000) {
	camera.fov = 50; // Correction de la valeur fov pour les mobiles
	camera.position.x = -0.8;
	camera.position.y = -0.2;
	camera.updateProjectionMatrix(); // Très important après avoir changé le fov
}

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0";
document.body.appendChild(renderer.domElement);

const planetsZPositions = [
	-2, -22, -42, -62, -82, -102, -122, -142, -162, -182, -202, -222, -242,
	-262, -282,
];

let currentTargetIndex = 0;

const planets = []; // Stocker les planètes ici pour un accès facile
const geometry = new THREE.SphereGeometry(1, 64, 32);
const loader = new THREE.TextureLoader();

// Appliquer l'encodage sRGB à la normal map
const normalMap = loader.load("./normal/normalclay.jpg");

const texturePaths = [
	"./textures/arlequin.jpg",
	"./textures/beige.jpg",
	"./textures/bonbons.jpg",
	"./textures/desert.jpg",
	"./textures/feu2.jpg",
	"./textures/flamme.jpg",
	"./textures/jaune.jpg",
	"./textures/ob.jpg",
	"./textures/ov.jpg",
	"./textures/pommedamour.jpg",
	"./textures/rb.jpg",
	"./textures/roses.jpg",
	"./textures/sombretest.jpg",
	"./textures/sully.jpg",
	"./textures/lr3.jpg",
];

// Ajout d'une lumière ambiante pour un éclairage doux global
const ambientLight = new THREE.AmbientLight(0x404040); // couleur, intensité
scene.add(ambientLight);

// Ajout d'une lumière directionnelle pour simuler le soleil
const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // couleur, intensité
directionalLight.position.set(-10, 7, 10);
scene.add(directionalLight);

for (let i = 0; i < planetsZPositions.length; i++) {
	const texture = loader.load(
		texturePaths[i % texturePaths.length],
		function (texture) {
			texture.colorSpace = THREE.SRGBColorSpace;
		}
	);
	const material = new THREE.MeshPhongMaterial({
		map: texture,
		normalMap: normalMap,
		normalScale: new THREE.Vector2(10, 1),
	});
	const planet = new THREE.Mesh(geometry, material);
	planet.position.z = planetsZPositions[i];
	scene.add(planet);
	planets.push(planet);
}

camera.position.z = planetsZPositions[0] + 4;
camera.position.x = -1;

let isScrollingAllowed = true; // Variable de verrouillage pour contrôler le défilement

function loadIframe(planetIndex) {
	// Sélectionnez tous les embeds et les cachez tous en premier
	document.querySelectorAll(".modal-content").forEach((embed, index) => {
		if (index === planetIndex) {
			embed.style.display = "flex";
		} else {
			embed.style.display = "none";
		}
	});
}

function moveCamera() {
	const targetZ = planetsZPositions[currentTargetIndex] + 4;
	const delta = (targetZ - camera.position.z) * 0.09;
	camera.position.z += delta;

	if (Math.abs(camera.position.z - targetZ) > 0.1) {
		requestAnimationFrame(moveCamera);
	} else {
		camera.position.z = targetZ;
		isScrollingAllowed = true; // Unlock scrolling once the movement is finished
		loadIframe(currentTargetIndex); // Update iframe display for the current planet
	}
}

// Initial call to display the first embed when the page loads
loadIframe(0);

window.addEventListener("wheel", async function (event) {
	if (!isScrollingAllowed) return; // Empêche le défilement si le verrou est actif
	isScrollingAllowed = false; // Active le verrou pour empêcher d'autres défilements

	if (event.deltaY > 0) {
		if (currentTargetIndex < planetsZPositions.length - 1) {
			await adjustPlanetXPosition(currentTargetIndex, 2, 500);
			currentTargetIndex++;
			moveCamera();
		} else {
			isScrollingAllowed = true; // Libère le verrou si on ne peut pas avancer
		}
	} else if (event.deltaY < 0) {
		if (currentTargetIndex > 0) {
			currentTargetIndex--;
			moveCamera();
			await adjustPlanetXPosition(currentTargetIndex, 0, 500);
		} else {
			isScrollingAllowed = true; // Libère le verrou si on ne peut pas reculer
		}
	}
});

function adjustPlanetXPosition(planetIndex, targetX, duration = 1000) {
	return new Promise((resolve) => {
		const startTime = Date.now();
		const initialX = planets[planetIndex].position.x;
		const animate = function () {
			const elapsedTime = Date.now() - startTime;
			const fraction = elapsedTime / duration;

			if (fraction < 1) {
				const newX = initialX + (targetX - initialX) * fraction;
				planets[planetIndex].position.x = newX;
				requestAnimationFrame(animate);
			} else {
				planets[planetIndex].position.x = targetX;
				resolve();
			}
		};
		animate();
	});
}

let startY = 0; // Position Y de départ pour le toucher

window.addEventListener(
	"touchstart",
	function (e) {
		startY = e.touches[0].clientY; // Enregistre la position Y de départ
	},
	false
);

window.addEventListener(
	"touchend",
	function (e) {
		const endY = e.changedTouches[0].clientY; // Position Y finale

		if (!isScrollingAllowed) return;

		// Détection de la direction du geste (haut ou bas)
		if (startY > endY + 5) {
			// Défilement vers le haut
			if (currentTargetIndex < planetsZPositions.length - 1) {
				isScrollingAllowed = false;
				currentTargetIndex++;
				moveCamera();
			}
		} else if (startY < endY - 5) {
			// Défilement vers le bas
			if (currentTargetIndex > 0) {
				isScrollingAllowed = false;
				currentTargetIndex--;
				moveCamera();
			}
		}
	},
	false
);

// Création d'un champ de particules
const particleCount = 5000; // Nombre de particules
const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3); // x, y, z pour chaque particule

for (let i = 0; i < particleCount * 3; i++) {
	// Position aléatoire dans un espace défini
	positions[i] = (Math.random() - 0.5) * 1000;
}

particleGeometry.setAttribute(
	"position",
	new THREE.BufferAttribute(positions, 3)
);

const particleMaterial = new THREE.PointsMaterial({
	color: 0x888888,
	size: 1,
	transparent: true,
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

function animate() {
	requestAnimationFrame(animate);

	// POUR METTRE DES PARTICULES EN MOUVEMENT
	const positions = particles.geometry.attributes.position.array;
	for (let i = 0; i < particleCount * 3; i += 3) {
		positions[i + 2] += 1; // Déplace chaque particule vers la caméra

		// Réinitialisation des particules qui se rapprochent trop de la caméra
		if (positions[i + 2] > 200) {
			positions[i] = (Math.random() - 0.5) * 1000;
			positions[i + 1] = (Math.random() - 0.5) * 1000;
			positions[i + 2] = (Math.random() - 0.5) * 1000;
		}
	}
	particles.geometry.attributes.position.needsUpdate = true; // Important pour mettre à jour la géométrie

	planets.forEach((planet) => {
		planet.rotation.y += 0.001;
	});
	// console.log(camera.fov);
	renderer.render(scene, camera);
}

animate();

// POPUP
window.addEventListener("contextmenu", (event) => event.preventDefault());
document.addEventListener("DOMContentLoaded", function () {
	var nav = document.getElementById("navImage");
	var popup = document.getElementById("popup");
	var closePopupBtn = document.getElementById("closePopup");

	// imgs.forEach(function (img) {
	// 	img.addEventListener("click", function () {
	// 		popup.style.display = "block"; // Affiche la popup
	// 	});
	// });
	nav.addEventListener("click", () => {
		popup.style.display = "block"; // Cache la popup
	});

	closePopupBtn.addEventListener("click", function () {
		popup.style.display = "none"; // Cache la popup
	});
});

document.addEventListener("DOMContentLoaded", function () {
	// Obtient la référence à la popup
	const popup = document.getElementById("popup");

	// Ferme la popup
	function closePopup() {
		popup.style.display = "none";
	}

	// Attache des écouteurs d'événements pour chaque item
	for (let i = 0; i < 15; i++) {
		const item = document.querySelector(`.click${i + 1}`);
		if (item) {
			item.addEventListener("click", function () {
				// Définit l'index cible pour la caméra basé sur l'item cliqué
				currentTargetIndex = i;
				moveCamera(); // Déclenche le mouvement de la caméra
				closePopup(); // Ferme la popup
			});
		}
	}
});
