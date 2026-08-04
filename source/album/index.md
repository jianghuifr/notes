---
title: Album
layout: page
---

<style>
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 2em 0;
}
.gallery-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 4/3;
  background: var(--color-code-bg);
  transition: transform 0.2s, box-shadow 0.2s;
}
.gallery-item:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}
.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
@media (max-width: 768px) {
  .gallery { grid-template-columns: repeat(2, 1fr); gap: 8px; }
}
@media (max-width: 480px) {
  .gallery { grid-template-columns: 1fr; }
}

/* Lightbox */
.lightbox {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0,0,0,0.92);
  align-items: center;
  justify-content: center;
}
.lightbox.open { display: flex; }
.lightbox img {
  max-width: 92vw;
  max-height: 88vh;
  object-fit: contain;
  border-radius: 4px;
}
.lightbox-close {
  position: absolute;
  top: 16px;
  right: 20px;
  width: 40px; height: 40px;
  border: none;
  background: rgba(255,255,255,0.15);
  color: #fff;
  font-size: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.lightbox-close:hover { background: rgba(255,255,255,0.3); }
.lightbox-prev, .lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px; height: 48px;
  border: none;
  background: rgba(255,255,255,0.12);
  color: #fff;
  font-size: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.lightbox-prev:hover, .lightbox-next:hover { background: rgba(255,255,255,0.25); }
.lightbox-prev { left: 16px; }
.lightbox-next { right: 16px; }
.lightbox-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.7);
  font-size: 14px;
}
@media (max-width: 768px) {
  .lightbox-prev, .lightbox-next { width: 36px; height: 36px; font-size: 20px; }
  .lightbox-prev { left: 8px; }
  .lightbox-next { right: 8px; }
}
</style>

<div class="gallery" id="gallery"></div>

<div class="lightbox" id="lightbox">
  <button class="lightbox-close" id="lbClose">✕</button>
  <button class="lightbox-prev" id="lbPrev">‹</button>
  <img id="lbImg" src="" alt="">
  <button class="lightbox-next" id="lbNext">›</button>
  <span class="lightbox-counter" id="lbCounter"></span>
</div>

<script>
(function() {
  var photos = [
    { src: "https://picsum.photos/seed/a1/800/600", alt: "Photo 1" },
    { src: "https://picsum.photos/seed/a2/800/600", alt: "Photo 2" },
    { src: "https://picsum.photos/seed/a3/800/600", alt: "Photo 3" },
    { src: "https://picsum.photos/seed/a4/800/600", alt: "Photo 4" },
    { src: "https://picsum.photos/seed/a5/800/600", alt: "Photo 5" },
    { src: "https://picsum.photos/seed/a6/800/600", alt: "Photo 6" },
    { src: "https://picsum.photos/seed/a7/900/600", alt: "Photo 7" },
    { src: "https://picsum.photos/seed/a8/900/600", alt: "Photo 8" },
    { src: "https://picsum.photos/seed/a9/600/900", alt: "Photo 9" },
    { src: "https://picsum.photos/seed/a10/800/600", alt: "Photo 10" },
    { src: "https://picsum.photos/seed/a11/800/600", alt: "Photo 11" },
    { src: "https://picsum.photos/seed/a12/800/600", alt: "Photo 12" }
  ];

  var gallery = document.getElementById("gallery");
  photos.forEach(function(p) {
    var item = document.createElement("div");
    item.className = "gallery-item";
    item.innerHTML = '<img src="' + p.src + '" alt="' + p.alt + '" loading="lazy">';
    gallery.appendChild(item);
  });

  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCounter = document.getElementById("lbCounter");
  var currentIdx = 0;

  function open(idx) {
    currentIdx = idx;
    lbImg.src = photos[idx].src;
    lbImg.alt = photos[idx].alt;
    lbCounter.textContent = (idx + 1) + " / " + photos.length;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  function prev() {
    currentIdx = (currentIdx - 1 + photos.length) % photos.length;
    lbImg.src = photos[currentIdx].src;
    lbImg.alt = photos[currentIdx].alt;
    lbCounter.textContent = (currentIdx + 1) + " / " + photos.length;
  }

  function next() {
    currentIdx = (currentIdx + 1) % photos.length;
    lbImg.src = photos[currentIdx].src;
    lbImg.alt = photos[currentIdx].alt;
    lbCounter.textContent = (currentIdx + 1) + " / " + photos.length;
  }

  gallery.addEventListener("click", function(e) {
    var item = e.target.closest(".gallery-item");
    if (!item) return;
    var items = Array.from(gallery.children);
    open(items.indexOf(item));
  });

  document.getElementById("lbClose").addEventListener("click", close);
  document.getElementById("lbPrev").addEventListener("click", prev);
  document.getElementById("lbNext").addEventListener("click", next);
  lb.addEventListener("click", function(e) { if (e.target === lb) close(); });

  document.addEventListener("keydown", function(e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });
})();
</script>
