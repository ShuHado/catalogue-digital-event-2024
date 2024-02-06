const showEmbedParagraph = document.querySelector("p.showEmbed");
const embedElement = document.getElementsByClassName("embedElement");
const closeButton = document.getElementsByClassName("closeModalBtn");
const modalContent = document.getElementsByClassName("modal-content");
const main = document.getElementsByClassName("main");

document.addEventListener("DOMContentLoaded", function () {
  showEmbedParagraph.addEventListener("click", function () {
    // MAIN
    main[0].style.display = "none";

    // MODAL
    modalContent[0].style.width = "95%";
    modalContent[0].style.height = "95%";
    modalContent[0].style.position = "fixed";
    modalContent[0].style.top = "50%";
    modalContent[0].style.left = "50%";
    modalContent[0].style.transform = "translate(-50%, -50%)";
    modalContent[0].style.margin = "0";
    modalContent[0].style.zIndex = "9999";

    // EMBED
    embedElement[0].style.display = "block";

    // CLOSE BUTTON
    closeButton[0].style.display = "block";

    // FOOTER
    footer[0].style.zIndex = "-1";
  });

  //   onclick close button
  closeButton[0].addEventListener("click", function () {
    // MAIN
    main[0].style.display = "block";

    // MODAL
    modalContent[0].style.position = "relative";
    modalContent[0].style.margin = "30% 0 0 10%";
    modalContent[0].style.height = "40dvh";
    modalContent[0].style.width = "55%";
    modalContent[0].style.top = "unset";
    modalContent[0].style.left = "unset";
    modalContent[0].style.transform = "unset";
    modalContent[0].style.zIndex = "999";

    // EMBED
    embedElement[0].style.display = "none";

    // CLOSE BUTTON
    closeButton[0].style.display = "none";
  });
});
