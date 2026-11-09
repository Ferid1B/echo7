const CACHE='echo7-v3';
const ASSETS=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png',
'fonts/literata-cyrillic-400-normal.woff2','fonts/literata-cyrillic-600-normal.woff2','fonts/literata-cyrillic-400-italic.woff2',
'fonts/literata-latin-400-normal.woff2','fonts/literata-latin-600-normal.woff2','fonts/literata-latin-400-italic.woff2',
'fonts/share-tech-mono-latin-400-normal.woff2',
'chapters/ch3a.js','chapters/ch3b.js','chapters/ch3c.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin) return;           // Supabase и прочее — напрямую
  if(u.pathname.includes('/quiet/')) return;                                  // «Тихая осень» не трогаем
  const isPage=e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html');
  if(isPage){   // страница: сначала сеть (чтобы приходили обновления), без сети — из кэша
    e.respondWith(fetch(e.request).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put('index.html',cp));return res;}).catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return res;})));
});
