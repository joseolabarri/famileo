// Famileo – service worker
// 1) Recibe los avisos (Firebase Cloud Messaging) aunque la app esté cerrada.
// 2) Permite instalar la app y abrirla sin conexión.
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDeBiZJ4gHZF4sVRq00yPnSRAWMzS0P4As",
  authDomain: "quiniela-2026-2027.firebaseapp.com",
  projectId: "quiniela-2026-2027",
  storageBucket: "quiniela-2026-2027.firebasestorage.app",
  messagingSenderId: "65100035401",
  appId: "1:65100035401:web:75d584e436b03b6a461698"
});
firebase.messaging(); // muestra el aviso y, al pulsarlo, abre Famileo en el enlace que trae

const CACHE = "famileo-v2";
const BASE = ["./", "./index.html", "./manifest.json", "./icons/icon-192.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Primero la red (así siempre ves la última versión); si no hay conexión, la copia guardada.
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r; })
      .catch(() => caches.match(e.request))
  );
});
