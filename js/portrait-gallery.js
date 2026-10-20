(function () {
  "use strict";
  var gallery = document.querySelector(".about-photo-gallery");
  if (!gallery) return;
  var cards = Array.from(gallery.querySelectorAll(".portrait-card"));
  var count = document.getElementById("aboutPhotoCount"), index = 0, busy = false;
  var prev = document.getElementById("aboutPhotoPrev"), next = document.getElementById("aboutPhotoNext");
  function showPhoto(step) {
    if (busy) return;
    var outgoing = cards[index];
    var before = cards.map(function (card) { return getComputedStyle(card).transform; });
    index = (index + step + cards.length) % cards.length;
    cards.forEach(function (card, i) {
      var slot = (i - index + cards.length) % cards.length;
      card.dataset.slot = String(slot); card.setAttribute("aria-hidden", slot ? "true" : "false");
    });
    count.textContent = (index + 1) + " / " + cards.length;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !outgoing.animate) return;
    busy = true;
    var animations = cards.map(function (card, i) {
      var after = getComputedStyle(card).transform;
      if (card === outgoing) {
        return card.animate([
          { transform:before[i], zIndex:4 },
          { transform:"translate(" + (step > 0 ? "-32%" : "36%") + ", 5%) rotate(" + (step > 0 ? "-10deg" : "10deg") + ")", zIndex:4, offset:0.45 },
          { transform:after, zIndex:Number(getComputedStyle(card).zIndex) }
        ], { duration:650, easing:"cubic-bezier(.22,.7,.25,1)" });
      }
      return card.animate([{ transform:before[i] }, { transform:after }], { duration:650, easing:"cubic-bezier(.22,.7,.25,1)" });
    });
    Promise.all(animations.map(function (a) { return a.finished.catch(function () {}); })).then(function () { busy = false; });
  }
  prev.addEventListener("click", function () { showPhoto(-1); });
  next.addEventListener("click", function () { showPhoto(1); });
  gallery.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); showPhoto(event.key === "ArrowRight" ? 1 : -1); }
  });
})();
