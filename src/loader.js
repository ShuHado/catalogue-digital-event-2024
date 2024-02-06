document.addEventListener("DOMContentLoaded", function () {
	// Affiche le loader immédiatement
	document.getElementById("loader").style.display = "block";

	setTimeout(function () {
		// Cache le loader et affiche le bouton "Entrer" après 5 secondes
		document.getElementById("loader").style.display = "none";
		document.getElementById("enter-site").style.display = "block";
	}, 5000);

	document
		.getElementById("enter-site")
		.addEventListener("click", function () {
			var splashScreen = document.getElementById("splash-screen");
			splashScreen.classList.add("fade-out"); // Ajoutez la classe pour commencer le fondu
			setTimeout(function () {
				splashScreen.style.display = "none"; // Cache après la fin de la transition
			}, 1000); // Correspond au temps de la transition CSS
		});
});
