document.addEventListener("DOMContentLoaded", function () {
	// Affiche le loader immédiatement.
	document.getElementById("loader").style.display = "block";

	// Le bouton "Entrer" s'affichera maintenant via le main.js après le chargement complet des textures,
	// donc nous supprimons la partie qui modifie son style display ici.

	// Cette fonction gère le clic sur le bouton "Entrer".
	// Assurez-vous que cette partie du code s'exécute après que le bouton soit rendu cliquable dans le main.js.
	const enterSiteBtn = document.getElementById("enter-site");
	if (enterSiteBtn) {
		enterSiteBtn.addEventListener("click", function () {
			var splashScreen = document.getElementById("splash-screen");
			splashScreen.classList.add("fade-out"); // Ajoutez la classe pour commencer le fondu
			setTimeout(function () {
				splashScreen.style.display = "none"; // Cache après la fin de la transition
			}, 1000); // Correspond au temps de la transition CSS
		});
	}
});
