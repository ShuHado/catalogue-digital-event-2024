import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	40,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

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

const planets = []; // Stockage des planètes pour un accès facile
const geometry = new THREE.SphereGeometry(1, 64, 32); // Géométrie des planètes
const loader = new THREE.TextureLoader(); // Chargeur de textures

// Chargement de la normal map
const normalMap = loader.load("./normal/normalclay.jpg");

// Chemins des textures de planètes
const texturePaths = [
	"./textures/interface_web.jpg",
	"./textures/creative_coding.jpg",
	"./textures/popcorn.jpg",
	"./textures/video_mapping.jpg",
	"./textures/video_story.jpg",
	"./textures/video_makingoff.jpg",
	"./textures/fake_videos.jpg",
	"./textures/photo_sceno.jpg",
	"./textures/photo_reportage.jpg",
	"./textures/podcast.jpg",
	"./textures/escape_game.jpg",
	"./textures/drone.jpg",
	"./textures/game_design.jpg",
	"./textures/ar_3d.jpg",
	"./textures/team_orga.jpg",
	// Ajoutez tous les chemins de texture ici
];

// Fonction pour charger une texture et retourner une promesse
function loadTexture(path) {
	return new Promise((resolve, reject) => {
		loader.load(
			path,
			function (texture) {
				// Définit l'espace de couleur de la texture
				texture.encoding = THREE.sRGBEncoding;
				resolve(texture);
			},
			undefined,
			reject
		);
	});
}

// Chargement de toutes les textures de manière asynchrone
Promise.all(texturePaths.map((path) => loadTexture(path)))
	.then((textures) => {
		textures.forEach((texture, index) => {
			const material = new THREE.MeshPhongMaterial({
				map: texture,
				normalMap: normalMap,
				normalScale: new THREE.Vector2(10, 1),
			});
			const planet = new THREE.Mesh(geometry, material);
			planet.position.z = planetsZPositions[index];
			scene.add(planet);
			planets.push(planet);
		});

		// Ajout des lumières ici pour s'assurer qu'elles sont ajoutées après le chargement des textures
		const ambientLight = new THREE.AmbientLight(0x404040);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
		directionalLight.position.set(-10, 7, 10);
		scene.add(directionalLight);

		document.getElementById("loader").style.display = "none";

		// Après le chargement complet, afficher le bouton "Entrer"
		document.getElementById("enter-site").style.display = "block";
	})
	.catch((error) => {
		console.error("Erreur lors du chargement des textures :", error);
	});

// for (let i = 0; i < planetsZPositions.length; i++) {
//   const texture = loader.load(
//     texturePaths[i % texturePaths.length],
//     function (texture) {
//       texture.colorSpace = THREE.SRGBColorSpace;
//     }
//   );
//   const material = new THREE.MeshPhongMaterial({
//     map: texture,
//     normalMap: normalMap,
//     normalScale: new THREE.Vector2(10, 1),
//   });
//   const planet = new THREE.Mesh(geometry, material);
//   planet.position.z = planetsZPositions[i];
//   scene.add(planet);
//   planets.push(planet);
// }

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

function updateNavImage(planetIndex) {
	const navImage = document.getElementById("navImage");
	if (navImage) {
		const imagePath = `./img/navbar/etape_${planetIndex + 1}.png`; // Les index commencent à 0, donc ajoutez 1 pour correspondre à vos noms de fichiers
		navImage.src = imagePath;
	}
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
		updateNavImage(currentTargetIndex);
	}
}

// Initial call to display the first embed when the page loads
loadIframe(0);

window.addEventListener("wheel", async function (event) {
	if (!isScrollingAllowed) return;
	isScrollingAllowed = false;

	if (event.deltaY > 0) {
		if (currentTargetIndex < planetsZPositions.length - 1) {
			await adjustPlanetXPosition(currentTargetIndex, 2, 100); // Durée réduite pour un mouvement plus rapide
			currentTargetIndex++;
			moveCamera();
			moveCamera(currentTargetIndex + 1);
		} else {
			// Si on est déjà sur la dernière planète, ne fait rien et permet de scroller à nouveau
			isScrollingAllowed = true;
		}
	} else if (event.deltaY < 0) {
		if (currentTargetIndex > 0) {
			currentTargetIndex--;
			moveCamera();
			moveCamera(currentTargetIndex - 1);

			await adjustPlanetXPosition(currentTargetIndex, 0, 500); // Durée réduite pour un mouvement plus rapide
		} else {
			// Si on est sur la première planète, ne fait rien et permet de scroller à nouveau
			isScrollingAllowed = true;
		}
	}
});

// Et de même, lors d'un clic sur un élément de navigation qui change la planète ciblée
document.querySelectorAll(".navigation-item").forEach((item, index) => {
	item.addEventListener("click", () => {
		moveCamera(index); // Supposant que chaque élément de navigation correspond à une planète
	});
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
	renderer.render(scene, camera);
}

animate();

// POPUP

function resetPlanetsPositionX() {
	planets.forEach((planet) => {
		// Réinitialise la position en x pour chaque planète
		planet.position.x = 0;
	});
}

window.addEventListener("contextmenu", (event) => event.preventDefault());
document.addEventListener("DOMContentLoaded", function () {
	var nav = document.getElementById("navImage");
	var popup = document.getElementById("popup");
	var closePopupBtn = document.getElementById("closePopup");

	nav.addEventListener("click", () => {
		popup.style.opacity = "0"; // S'assure que l'opacité est à 0
		popup.style.display = "block"; // Affiche la popup
		setTimeout(() => {
			popup.style.opacity = "1"; // Déclenche l'animation d'opacité
		}, 10); // Un délai court pour permettre au navigateur de reconnaître le changement d'état
	});

	closePopupBtn.addEventListener("click", function () {
		// Pour fermer la popup, inversez l'animation
		popup.style.opacity = "0";
		setTimeout(() => {
			popup.style.display = "none";
		}, 1000); // Attend que l'animation soit terminée pour cacher la popup
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
				resetPlanetsPositionX(); // Réinitialise les positions en x des planètes
				// Définit l'index cible pour la caméra basé sur l'item cliqué
				currentTargetIndex = i;
				moveCamera(); // Déclenche le mouvement de la caméra
				closePopup(); // Ferme la popup
			});
		}
	}
});
