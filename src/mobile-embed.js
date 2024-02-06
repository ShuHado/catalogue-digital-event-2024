let footer = document.getElementById("footer");
let showEmbedParagraph = document.querySelectorAll("p.showEmbed");
let embedElement = document.querySelectorAll("embed.embedElement");
let closeButton = document.querySelectorAll("span.closeModalBtn");
let modalContent = document.querySelectorAll("div.modal-content");
let main = document.querySelectorAll("div.main");

document.addEventListener("DOMContentLoaded", function () {
	showEmbedParagraph.forEach((element) => {
		element.addEventListener("click", function () {
			// MAIN
			main.forEach((element) => {
				element.style.display = "none";
			});

			// MODAL

			modalContent.forEach((element) => {
				element.style.width = "95%";
				element.style.height = "95%";
				element.style.position = "fixed";
				element.style.top = "50%";
				element.style.left = "50%";
				element.style.transform = "translate(-50%, -50%)";
				element.style.margin = "0";
				element.style.zIndex = "9999";
			});

			// EMBED
			embedElement.forEach((element) => {
				element.style.display = "block";
			});

			// CLOSE BUTTON
			closeButton.forEach((element) => {
				element.style.display = "block";
			});

			// FOOTER
			footer.style.zIndex = "-1";

			console.log("clicked");
		});
	});

	closeButton.forEach((element) => {
		element.addEventListener("click", function () {
			// MAIN
			main.forEach((element) => {
				element.style.display = "block";
			});

			// MODAL
			modalContent.forEach((element) => {
				element.style.position = "relative";
				element.style.margin = "30% 0 0 10%";
				element.style.height = "40dvh";
				element.style.width = "55%";
				element.style.top = "unset";
				element.style.left = "unset";
				element.style.transform = "unset";
				element.style.zIndex = "999";
			});

			// EMBED
			embedElement.forEach((element) => {
				element.style.display = "none";
			});

			// CLOSE BUTTON
			closeButton.forEach((element) => {
				element.style.display = "none";
			});

			// FOOTER
			footer.style.zIndex = "999";
		});
	});
});
