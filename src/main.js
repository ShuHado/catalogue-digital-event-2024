import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();
const embed = document.getElementById("embed1");
console.log(embed);

// Camera
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );

// let camera = new THREE.PerspectiveCamera(
//   90,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );

let camera;
if (window.innerWidth > 768) {
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
} else {
	// Adjust camera settings for mobile devices
	camera = new THREE.PerspectiveCamera(
		160,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
}

camera.position.z = 8;
camera.position.y = 1;
camera.position.x = 5;

let cameraMinZposition = 10;
let cameraMaxZposition = -155;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "absolute";
if (window.innerWidth <= 768) {
	renderer.domElement.style.left = "0%";
	renderer.domElement.style.top = "0%";
} else {
	renderer.domElement.style.top = "4%";
	renderer.domElement.style.left = "40%";
}
renderer.domElement.style.transform = "scaleX(-1)";
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.enableRotate = false;
// controls.autoRotate = false;

// Ambient light to see the spheres with a shadow
const ambientLight = new THREE.AmbientLight(0x404040); // Lumière douce
scene.add(ambientLight);

// Directional light coming from the top left corner
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(15, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Load textures
const textureLoader = new THREE.TextureLoader();
// a table of textures
const textures = [
	textureLoader.load("./img/marble1.jpg"),
	textureLoader.load("./img/marble2.jpg"),
	textureLoader.load("./img/marble3.jpg"),
	textureLoader.load("./img/marble4.jpg"),
	textureLoader.load("./img/marble5.jpg"),
	textureLoader.load("./img/marble6.jpg"),
	textureLoader.load("./img/marble7.jpg"),
	textureLoader.load("./img/marble8.jpg"),
	textureLoader.load("./img/marble9.jpg"),
	textureLoader.load("./img/marble10.jpg"),
	textureLoader.load("./img/marble11.jpg"),
	textureLoader.load("./img/marble12.jpg"),
	textureLoader.load("./img/marble13.jpg"),
	textureLoader.load("./img/marble14.jpg"),
	textureLoader.load("./img/marble15.jpg"),
];
// encoding all the textures
textures.forEach((texture) => {
	texture.encoding = THREE.sRGBEncoding;
});

// Normal map
const normalMap = textureLoader.load("./normal/normalclay.jpg");

// Create spheres
const sphereGeometry = new THREE.SphereGeometry(1.5, 64, 32);
const materials = textures.map(
	(texture) =>
		new THREE.MeshPhongMaterial({
			map: texture,
			normalMap: normalMap,
			normalScale: new THREE.Vector2(10, 1),
			shininess: 500,
		})
);

const spheres = materials.map(
	(material) => new THREE.Mesh(sphereGeometry, material)
);
const planets = spheres.map((sphere, index) => {
	sphere.position.set(5, 1, -10 * index);
	console.log(
		"Sphere" +
			index +
			".x=" +
			sphere.position.x +
			" Sphere" +
			index +
			".y=" +
			sphere.position.y +
			" Sphere" +
			index +
			".z=" +
			sphere.position.z
	);
	scene.add(sphere);
	return sphere;
});

console.log("planets=" + planets);
console.log("spheres=" + spheres);

console.log(
	"Camera.x=" +
		camera.position.x +
		" Camera.y=" +
		camera.position.y +
		" Camera.z=" +
		camera.position.z
);

function showEmbedForPlanet(index) {
	// Cache tous les divs
	for (let i = 1; i <= textures.length; i++) {
		document.getElementById("embed" + i).style.display = "none";
	}

	// Affiche le div correspondant à la planète actuelle
	const embedId = "embed" + (index + 1);
	document.getElementById(embedId).style.display = "flex";
}

showEmbedForPlanet(0);

// ...

// currentSnapIndex
let currentSnapIndex = 0;
// const snapPositions = [0, -20, -40, -60, -80, -100, -120, -140, -160];
// generate the snapPositions depending on the number of planets
const snapPositions = [];
for (let i = 0; i < planets.length; i++) {
	snapPositions.push(-20 * i);
}
console.log("snapPositions=" + snapPositions);

// const planetPositionsX = [0, 0, 0]; // Initial X positions for each planet
let planetPositionsX = []; // Initial X positions for each planet
// generate the planetPositionsX depending on the number of planets
for (let i = 0; i < planets.length; i++) {
	planetPositionsX[i] = 0;
}
console.log("planetPositionsX=" + planetPositionsX);

function onScroll(event) {
	// const delta = Math.sign(event.deltaY);
	const delta = Math.sign(event.deltaY || event.deltaY);
	const scrollSpeed = 0.3; // Camera movement speed
	const planetMoveSpeed = 5; // Planet movement speed
	const planetInFront = getPlanetInFront();

	// Dynamic FOV

	// Move the camera forward or backward
	camera.position.z -= delta * scrollSpeed;

	// Stop the camera from going beyond the specified limits
	camera.position.z = Math.max(camera.position.z, cameraMaxZposition);
	camera.position.z = Math.min(camera.position.z, cameraMinZposition);

	// Update the x-coordinate of each planet based on camera position
	planets.forEach((planet, index) => {
		const distanceZ = planet.position.z - camera.position.z;
		const planetX =
			planetPositionsX[index] - distanceZ * (planetMoveSpeed / 5);
		planet.position.x = Math.min(planetX, 5); // Limit x position to 5
	});

	console.log("camera position z=" + camera.position.z);
	console.log(
		"planetSpheres position z=" + spheres[planetInFront].position.z
	);
	console.log(
		"planetSpheres position x=" + spheres[planetInFront].position.x
	);

	// Show the corresponding embed for the current planet
	showEmbedForPlanet(planetInFront);
}

function getPlanetInFront() {
	// Find the index of the planet closest to the camera
	let planetInFront = 0;
	planets.forEach((planet, index) => {
		if (
			planet.position.z - camera.position.z > 0 &&
			planetInFront < planets.length - 1
		) {
			planetInFront++;
		}
	});
	console.log("planetInFront =" + planetInFront);
	return planetInFront;
}

// Resize
window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
	requestAnimationFrame(animate);

	// Ajustement de la cible des OrbitControls pour que la caméra regarde toujours devant elle
	const lookDirection = new THREE.Vector3();
	camera.getWorldDirection(lookDirection);
	lookDirection.multiplyScalar(10); // Ajustez ce facteur scalaire au besoin pour contrôler la distance de la cible devant la caméra
	const newTarget = new THREE.Vector3().addVectors(
		camera.position,
		lookDirection
	);

	controls.target.set(newTarget.x, newTarget.y, newTarget.z);
	controls.update();

	// Rotation des sphères
	spheres.forEach((sphere) => {
		sphere.rotation.y -= 0.001;
	});

	renderer.render(scene, camera);
}

window.addEventListener("wheel", onScroll);
requestAnimationFrame(animate);

// ZOOM

// on click, move the camera to the planet in parameter
function zoomToPlanet(planetIndex) {
	// move the camera to the planet
	camera.position.z = spheres[planetIndex].position.z;
	// show the embed for the planet
	showEmbedForPlanet(planetIndex);
}

// MOBILE

// Disable rotation for mobile devices
if (/Mobi|Android/i.test(navigator.userAgent)) {
	controls.enableRotate = false;
	controls.dispose();
}

// Handle touch events
let touchStartY = 0;
window.addEventListener("touchstart", (event) => {
	touchStartY = event.touches[0].clientY;
});

window.addEventListener("touchmove", (event) => {
	const deltaY = event.touches[0].clientY - touchStartY;
	onScroll({ deltaY });
	touchStartY = event.touches[0].clientY;
});

// Disable context menu on long tap (optional)
window.addEventListener("contextmenu", (event) => event.preventDefault());
document.addEventListener("DOMContentLoaded", function () {
	var imgs = document.querySelectorAll(".popupclick"); // Sélectionnez tous les éléments avec la classe .popupclick
	var popup = document.getElementById("popup");
	var closePopupBtn = document.getElementById("closePopup");

	imgs.forEach(function (img) {
		img.addEventListener("click", function () {
			popup.style.display = "block"; // Affiche la popup
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
