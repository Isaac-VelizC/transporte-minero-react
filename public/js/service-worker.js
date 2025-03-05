const CACHE_NAME = "map-cache-v1";
const OFFLINE_PAGE = "./offline.html";

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            cache.addAll([OFFLINE_PAGE]).catch((error) => {
                console.error("Error al agregar offline.html al caché:", error);
            })
        )
    );
});

self.addEventListener("fetch", (event) => {
    const { request } = event;

    // Si la petición es de un tile de OpenStreetMap
    if (request.url.includes("tile.openstreetmap.org")) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const cachedResponse = await cache.match(request);
                if (cachedResponse) {
                    return cachedResponse; // ✅ Usa el tile en caché si existe
                }
                try {
                    const networkResponse = await fetch(request);
                    cache.put(request, networkResponse.clone()); // 🟢 Guarda el tile en caché
                    return networkResponse;
                } catch (error) {
                    console.error("Error al obtener el tile:", error);
                    return new Response("", { status: 404 }); // 🔴 Respuesta vacía si falla
                }
            })
        );
    } else {
        // Para otras peticiones (ejemplo: página offline)
        event.respondWith(
            fetch(request).catch(async () => {
                const cache = await caches.open(CACHE_NAME);
                return cache.match(OFFLINE_PAGE) || new Response("Página offline no disponible", { status: 503 });
            })
        );
    }
});
