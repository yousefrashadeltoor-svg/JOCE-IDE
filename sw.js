
const CACHE_NAME = 'joce-ide-v2-3-cache';
const ASSETS = [
  "./README.md",
  "./backgrounds/arctic-glow.png",
  "./backgrounds/aurora-night.png",
  "./backgrounds/city-neon.png",
  "./backgrounds/forest-mist.png",
  "./backgrounds/graphite-cloud.png",
  "./backgrounds/matrix-rain.png",
  "./backgrounds/ocean-depth.png",
  "./backgrounds/solar-burst.png",
  "./backgrounds/sunset-glow.png",
  "./backgrounds/violet-dream.png",
  "./css/style.css",
  "./data/changelog.json",
  "./data/locales/ar.json",
  "./data/locales/en.json",
  "./data/meta.json",
  "./data/themes/aurora.json",
  "./data/themes/forest.json",
  "./data/themes/graphite.json",
  "./data/themes/matrix.json",
  "./data/themes/midnight.json",
  "./data/themes/neon.json",
  "./data/themes/ocean.json",
  "./data/themes/solar.json",
  "./data/themes/sunset.json",
  "./data/themes/violet.json",
  "./docs/DEVELOPER_CENTER.txt",
  "./extensions/joce_color_picker_pro.joce-ext",
  "./extensions/joce_icon_library_pro.joce-ext",
  "./extensions/joce_json_formatter_pro.joce-ext",
  "./extensions/joce_markdown_preview_pro.joce-ext",
  "./extensions/joce_project_stats_pro.joce-ext",
  "./extensions/joce_project_templates_pro.joce-ext",
  "./extensions/joce_snippet_manager_pro.joce-ext",
  "./extensions/joce_todo_manager_pro.joce-ext",
  "./extensions/joce_workspace_notes_pro.joce-ext",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./index.html",
  "./js/app.js",
  "./js/enhancements.js",
  "./manifest.webmanifest"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
      return resp;
    }).catch(() => cached))
  );
});
