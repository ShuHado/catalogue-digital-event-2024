// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// const embedContainer = document.getElementById("container");

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
// 	75,
// 	window.innerWidth / window.innerHeight,
// 	0.1,
// 	1000
// );
// camera.position.z = 2;
// camera.position.y = 1;
// camera.position.x = 0;

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.domElement.style.position = "absolute";
// renderer.domElement.style.top = 0;
// renderer.domElement.style.left = "400px";
// renderer.domElement.style.zIndex = -1;
// embedContainer.appendChild(renderer.domElement);

// // Chargement de la texture
// const texture1Loader = new THREE.TextureLoader();
// const texture1 = texture1Loader.load("./img/2k_sun.jpg");
// texture1.encoding = THREE.sRGBEncoding;

// // Création d'une sphère avec la texture
// const sphere1geo = new THREE.SphereGeometry(1, 32, 32);
// const sphere1mesh = new THREE.MeshBasicMaterial({ map: texture1 });
// const sphere1 = new THREE.Mesh(sphere1geo, sphere1mesh);
// sphere1.position.y = 1;
// scene.add(sphere1);

// // Chargement de la texture
// const texture2Loader = new THREE.TextureLoader();
// const texture2 = texture2Loader.load("./img/2k_mercury.jpg");

// // Création d'une sphère avec la texture
// const sphere2geo = new THREE.SphereGeometry(1, 32, 32);
// const sphere2mesh = new THREE.MeshBasicMaterial({ map: texture2 });
// const sphere2 = new THREE.Mesh(sphere2geo, sphere2mesh);
// sphere2.position.y = 6;
// scene.add(sphere2);

// // Chargement de la texture
// const texture3Loader = new THREE.TextureLoader();
// const texture3 = texture3Loader.load("./img/2k_jupiter.jpg");

// // Création d'une sphère avec la texture
// const sphere3geo = new THREE.SphereGeometry(1, 32, 32);
// const sphere3mesh = new THREE.MeshBasicMaterial({ map: texture3 });
// const sphere3 = new THREE.Mesh(sphere3geo, sphere3mesh);
// sphere3.position.y = 11;
// scene.add(sphere3);

// function showEmbedForPlanet(index) {
// 	// Cache tous les divs
// 	for (let i = 1; i <= 3; i++) {
// 		document.getElementById("embed" + i).style.display = "none";
// 	}

// 	// Affiche le div correspondant à la planète actuelle
// 	const embedId = "embed" + (index + 1);
// 	document.getElementById(embedId).style.display = "flex";
// }

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableZoom = false;
// controls.target.set(0, 1, 0);

// const snapPositions = [1, 6, 11];
// let currentSnapIndex = 0;

// let targetY = camera.position.y;

// function onScroll(event) {
// 	const delta = Math.sign(event.deltaY);

// 	// Mise à jour de l'index de snap en fonction du scroll
// 	if (delta < 0 && currentSnapIndex > 0) {
// 		currentSnapIndex--;
// 	} else if (delta > 0 && currentSnapIndex < snapPositions.length - 1) {
// 		currentSnapIndex++;
// 	}

// 	showEmbedForPlanet(currentSnapIndex);

// 	// Définir la nouvelle cible de déplacement
// 	targetY = snapPositions[currentSnapIndex];
// 	console.log(currentSnapIndex);
// }

// // INVERSION DU SCROLL
// // function onScroll(event) {
// //     const delta = Math.sign(event.deltaY);
// //     console.log("Scroll Delta:", delta);

// //     if (delta > 0 && currentSnapIndex > 0) {
// //         currentSnapIndex--;
// //         console.log("Scrolling up, New index:", currentSnapIndex);
// //     } else if (delta < 0 && currentSnapIndex < snapPositions.length - 1) {
// //         currentSnapIndex++;
// //         console.log("Scrolling down, New index:", currentSnapIndex);
// //     }

// //     showEmbedForPlanet(currentSnapIndex);

// //     // Définir la nouvelle cible de déplacement
// //     targetY = snapPositions[currentSnapIndex];
// // }

// showEmbedForPlanet(0);

// function animate() {
// 	requestAnimationFrame(animate);

// 	// Interpolation douce vers la cible
// 	const lerpFactor = 0.05;
// 	camera.position.y += (targetY - camera.position.y) * lerpFactor;

// 	// Mise à jour des Orbit Controls pour suivre le déplacement
// 	controls.target.set(
// 		controls.target.x,
// 		camera.position.y,
// 		controls.target.z
// 	);
// 	controls.update();

// 	renderer.render(scene, camera);

// 	sphere1.rotation.y += 0.001;
// 	sphere2.rotation.y += 0.001;
// 	sphere3.rotation.y += 0.001;
// }

// window.addEventListener("wheel", onScroll);
// animate();
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
let camera;
if (window.matchMedia("(max-width: 768px)").matches) {
	if (window.matchMedia("(max-width: 425px)").matches) {
		camera = new THREE.PerspectiveCamera(
			110,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
	}
} else {
	camera = new THREE.PerspectiveCamera(
		90,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
}

camera.position.z = 2;
camera.position.y = 1;
camera.position.x = 0;

// Initialisez le renderer ici
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Fond transparent
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = 0;
if (window.matchMedia("(max-width: 768px)").matches) {
	renderer.domElement.style.left = "30%";
	renderer.domElement.style.top = "-20%";
} else {
	renderer.domElement.style.left = "20%";
}
renderer.domElement.style.zIndex = 9;
// renderer.outputColorSpace = THREE.SRGBTransfer;
document.body.appendChild(renderer.domElement);

// Chargement de la texture
const texture1Loader = new THREE.TextureLoader();
const texture1 = texture1Loader.load("./img/marble5.jpg");
texture1.encoding = THREE.sRGBEncoding;
const normalMap1 = texture1Loader.load("./normal/normalclay.jpg");
const texture2 = texture1Loader.load("./img/marble7.jpg");
console.log(normalMap1);

// Création d'une sphère avec la texture
const sphere1geo = new THREE.SphereGeometry(1, 64, 32);
// Création d'une sphère avec la texture en utilisant MeshStandardMaterial
const sphere1material = new THREE.MeshPhongMaterial({
	map: texture1,
	// metalness: 0.6, // Ajustez cette valeur entre 0 (non métallique) et 1 (complètement métallique)
	// roughness: 0.2, // Ajustez cette valeur entre 0 (très lisse) et 1 (très rugueux)
	shininess: 200, // Plus élevé pour des surfaces plus brillantes
	normalMap: normalMap1,
	normalScale: new THREE.Vector2(6, 1), // Ajustez la force du normalMap
});
const sphere1 = new THREE.Mesh(sphere1geo, sphere1material);
sphere1.position.y = 1;
scene.add(sphere1);

// Création d'une sphère avec la texture
const sphere2geo = new THREE.SphereGeometry(1, 32, 32);
const sphere2material = new THREE.MeshStandardMaterial({
	map: texture1,
	shininess: 200,
	reflectivity: 0,
	normalMap: normalMap1,
	normalScale: new THREE.Vector2(2, 1),
});
const sphere2 = new THREE.Mesh(sphere2geo, sphere2material);
sphere2.position.y = 6;
scene.add(sphere2);

// Création d'une sphère avec la texture
const sphere3geo = new THREE.SphereGeometry(1, 32, 32);
const sphere3material = new THREE.MeshStandardMaterial({
	map: texture2,
	shininess: 200,
	reflectivity: 0.1,
	normalMap: normalMap1,
	normalScale: new THREE.Vector2(4, 1),
});
const sphere3 = new THREE.Mesh(sphere3geo, sphere3material);
sphere3.position.y = 11;
scene.add(sphere3);

// Création d'une sphère avec la texture
const sphere4geo = new THREE.SphereGeometry(1, 32, 32);
const sphere4material = new THREE.MeshStandardMaterial({
	map: texture1,
	metalness: 0.3,
	roughness: 0.6,
	// normalMap: normalMap4,
});
const sphere4 = new THREE.Mesh(sphere4geo, sphere4material);
sphere4.position.y = 16;
scene.add(sphere4);

// Création de la sphère 5 avec texture
const sphere5geo = new THREE.SphereGeometry(1, 32, 32);
const sphere5material = new THREE.MeshStandardMaterial({
	map: texture1,
	metalness: 0.3,
	roughness: 0.6,
	// normalMap: normalMap5,
});
const sphere5 = new THREE.Mesh(sphere5geo, sphere5material);
sphere5.position.y = 21;
scene.add(sphere5);

// Création de la sphère 6 avec texture
const sphere6geo = new THREE.SphereGeometry(1, 32, 32);
const sphere6material = new THREE.MeshStandardMaterial({
	map: texture1,
	metalness: 0.3,
	roughness: 0.6,
	// normalMap: normalMap6,
});
const sphere6 = new THREE.Mesh(sphere6geo, sphere6material);
sphere6.position.y = 26; // 21 + 5
scene.add(sphere6);

// Création de la sphère 7 avec texture
const sphere7geo = new THREE.SphereGeometry(1, 32, 32);
const sphere7material = new THREE.MeshStandardMaterial({
	map: texture1,
	metalness: 0.3,
	roughness: 0.6,
	// normalMap: normalMap7,
});
const sphere7 = new THREE.Mesh(sphere7geo, sphere7material);
sphere7.position.y = 31; // 26 + 5
scene.add(sphere7);

// Création de la sphère 8 avec texture
const sphere8geo = new THREE.SphereGeometry(1, 32, 32);
const sphere8material = new THREE.MeshStandardMaterial({
	map: texture1,
	metalness: 0.3,
	roughness: 0.6,
	// normalMap: normalMap8,
});
const sphere8 = new THREE.Mesh(sphere8geo, sphere8material);
sphere8.position.y = 36; // 31 + 5
scene.add(sphere8);

// Création de la sphère 9 avec texture
const sphere9geo = new THREE.SphereGeometry(1, 32, 32);
const sphere9material = new THREE.MeshStandardMaterial({
	map: texture1,
	metalness: 0.3,
	roughness: 0.6,
	// normalMap: normalMap9,
});
const sphere9 = new THREE.Mesh(sphere9geo, sphere9material);
sphere9.position.y = 41; // 36 + 5
scene.add(sphere9);

// Création de la sphère 10 avec texture
const sphere10geo = new THREE.SphereGeometry(1, 32, 32);
const sphere10material = new THREE.MeshStandardMaterial({
	map: texture1,
	metalness: 0.3,
	roughness: 0.6,
	// normalMap: normalMap10,
});
const sphere10 = new THREE.Mesh(sphere10geo, sphere10material);
sphere10.position.y = 46; // 41 + 5
scene.add(sphere10);

// Création de la sphère 11 avec texture
const sphere11geo = new THREE.SphereGeometry(1, 32, 32);
const sphere11material = new THREE.MeshStandardMaterial({
	map: texture1,
	metalness: 0.3,
	roughness: 0.6,
	// normalMap: normalMap11,
});
const sphere11 = new THREE.Mesh(sphere11geo, sphere11material);
sphere11.position.y = 51; // 46 + 5
scene.add(sphere11);

// Création de la sphère 12 avec texture
const sphere12geo = new THREE.SphereGeometry(1, 32, 32);
const sphere12material = new THREE.MeshStandardMaterial({
	map: texture1,
	metalness: 0.3,
	roughness: 0.6,
	// normalMap: normalMap12,
});
const sphere12 = new THREE.Mesh(sphere12geo, sphere12material);
sphere12.position.y = 56; // 51 + 5
scene.add(sphere12);

// Création de la sphère 13 avec texture
const sphere13geo = new THREE.SphereGeometry(1, 32, 32);
const sphere13material = new THREE.MeshStandardMaterial({
	map: texture1,
	metalness: 0.3,
	roughness: 0.6,
	// normalMap: normalMap13,
});
const sphere13 = new THREE.Mesh(sphere13geo, sphere13material);
sphere13.position.y = 61; // 56 + 5
scene.add(sphere13);

// Création de la sphère 14 avec texture
const sphere14geo = new THREE.SphereGeometry(1, 32, 32);
const sphere14material = new THREE.MeshStandardMaterial({
	map: texture1,
	metalness: 0.3,
	roughness: 0.6,
	// normalMap: normalMap14,
});
const sphere14 = new THREE.Mesh(sphere14geo, sphere14material);
sphere14.position.y = 66; // 61 + 5
scene.add(sphere14);

// Création de la sphère 15 avec texture
const sphere15geo = new THREE.SphereGeometry(1, 32, 32);
const sphere15material = new THREE.MeshStandardMaterial({
	map: texture1,
	metalness: 0.3,
	roughness: 0.6,
	// normalMap: normalMap15,
});
const sphere15 = new THREE.Mesh(sphere15geo, sphere15material);
sphere15.position.y = 71; // 66 + 5
scene.add(sphere15);

let lighY = 3;
let targetLightY = 0;
// Ajout d'une lumière directionnelle pour simuler le soleil
const directionalLight = new THREE.DirectionalLight(0xffffff, 4); // Couleur blanche, intensité pleine
// Positionnez la lumière pour qu'elle vienne du haut à gauche
directionalLight.position.set(-5, lighY, 5);
directionalLight.target.position.set(0, targetLightY, 0);
scene.add(directionalLight);

// Ajout d'une lumière ambiante pour des ombres moins dures
const ambientLight = new THREE.AmbientLight(0x404040); // Lumière douce
scene.add(ambientLight);

renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;

//

function showEmbedForPlanet(index) {
	// Cache tous les divs
	for (let i = 1; i <= 15; i++) {
		document.getElementById("embed" + i).style.display = "none";
	}

	// Affiche le div correspondant à la planète actuelle
	const embedId = "embed" + (index + 1);
	document.getElementById(embedId).style.display = "flex";
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.minPolarAngle = Math.PI / 2; // Angle horizontal - aucune rotation verticale autorisée
controls.maxPolarAngle = Math.PI / 2; // Même valeur pour bloquer la rotation verticale
let lastTouchY = 0;

function onTouchStart(event) {
	if (event.touches.length > 0) {
		lastTouchY = event.touches[0].clientY;
	}
}

function onTouchMove(event) {
	if (event.touches.length > 0) {
		const touchY = event.touches[0].clientY;
		const deltaY = lastTouchY - 1;
		lastTouchY = 1;

		// Simule un événement de scroll avec delta
		onScroll({ deltaY: deltaY });
	}
}
window.addEventListener("touchstart", onTouchStart, { passive: false });
window.addEventListener("touchmove", onTouchMove, { passive: false });

controls.target.set(0, 1, 0);

const snapPositions = [
	1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71,
];
let currentSnapIndex = 0;

let targetY = camera.position.y;

function onScroll(event) {
	const delta = Math.sign(event.deltaY);

	// Mise à jour de l'index de snap en fonction du scroll
	if (delta < 0 && currentSnapIndex > 0) {
		currentSnapIndex--;
		lighY -= 5; // Pour monter la lumière et sa cible en scroll up
		targetLightY -= 5;
		console.log(directionalLight.target.position.y);
		console.log(directionalLight.position.y);
	} else if (delta > 0 && currentSnapIndex < snapPositions.length - 1) {
		currentSnapIndex++;
		lighY += 5; // Pour descendre la lumière et sa cible en scroll down
		targetLightY += 5;
		console.log(directionalLight.target.position.y);
		console.log(directionalLight.position.y);
	}

	// Mise à jour de la position de la lumière et de sa cible
	directionalLight.position.set(-5, lighY, 5);
	directionalLight.target.position.set(0, targetLightY, 0); // Assurez-vous de mettre à jour la position de la cible ici
	scene.add(directionalLight.target); // Important: ajoutez la cible à la scène si ce n'est pas déjà fait

	// Afficher les informations de la planète actuelle
	showEmbedForPlanet(currentSnapIndex);

	// Définir la nouvelle cible de déplacement pour la caméra
	targetY = snapPositions[currentSnapIndex];
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
	sphere4.rotation.y += 0.001;
	sphere5.rotation.y += 0.001;
	sphere6.rotation.y += 0.001;
	sphere7.rotation.y += 0.001;
	sphere8.rotation.y += 0.001;
	sphere9.rotation.y += 0.001;
	sphere10.rotation.y += 0.001;
	sphere11.rotation.y += 0.001;
	sphere12.rotation.y += 0.001;
	sphere13.rotation.y += 0.001;
	sphere14.rotation.y += 0.001;
	sphere15.rotation.y += 0.001;
}

window.addEventListener("wheel", onScroll);
animate();
document.addEventListener("DOMContentLoaded", function () {
	var imgs = document.querySelectorAll(".popupclick"); // Sélectionnez tous les éléments avec la classe .popupclick
	var popup = document.getElementById("popup");
	var closePopupBtn = document.getElementById("closePopup");

	imgs.forEach(function (img) {
		img.addEventListener("click", function () {
			popup.style.display = "flex"; // Affiche la popup
		});
	});

	closePopupBtn.addEventListener("click", function () {
		popup.style.display = "none"; // Cache la popup
	});
});

document.addEventListener("DOMContentLoaded", function () {
	// S'assure que le code s'exécute une fois que le DOM est entièrement chargé
	var buttons = document.querySelectorAll(
		".click1, .click2, .click3, .click4, .click5, .click6, .click7, .click8, .click9, .click10, .click11, .click12, .click13, .click14, .click15"
	);
	var popup = document.getElementById("popup"); // Assurez-vous que cet ID correspond à votre popup

	buttons.forEach(function (button, index) {
		button.addEventListener("click", function () {
			popup.style.display = "none"; // Ferme la popup

			// Logique pour déplacer la caméra
			targetY = snapPositions[index];
			currentSnapIndex = index;

			// Mettez à jour la position de la lumière et de sa cible
			lighY = targetY - 2;
			targetLightY = targetY - 5;
			directionalLight.position.set(-5, lighY, 5);
			directionalLight.target.position.set(0, targetLightY, 0);
			scene.add(directionalLight.target);

			// Affichez les informations de la planète actuelle si nécessaire
			showEmbedForPlanet(index);
		});
	});
});
