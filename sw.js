const CACHE='echo7-v19';
const ASSETS=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png',
'fonts/literata-cyrillic-400-normal.woff2','fonts/literata-cyrillic-600-normal.woff2','fonts/literata-cyrillic-400-italic.woff2',
'fonts/literata-latin-400-normal.woff2','fonts/literata-latin-600-normal.woff2','fonts/literata-latin-400-italic.woff2',
'fonts/share-tech-mono-latin-400-normal.woff2',
'chapters/ch1x.js','chapters/ch1y.js','chapters/ch1z.js','chapters/ch1w.js','chapters/ch1v.js','chapters/ch1u.js','chapters/ch2x.js','chapters/ch2y.js','chapters/ch2z.js','chapters/ch2w.js','chapters/ch2u.js','chapters/ch2t.js','chapters/ch2s.js','chapters/ch2r.js','chapters/ch3a.js','chapters/ch3b.js','chapters/ch3c.js','chapters/ch3d.js','chapters/ch3e.js','chapters/ch3f.js','chapters/ch3g.js','chapters/ch3h.js','chapters/ch3i.js','chapters/ch3j.js','chapters/ch3k.js','chapters/ch4a.js','chapters/ch4b.js','chapters/ch4c.js','chapters/ch4d.js','chapters/ch4e.js','chapters/ch4f.js','chapters/ch5a.js','chapters/ch5b.js','chapters/ch5c.js','chapters/ch5d.js','chapters/ch5e.js','chapters/ch5f.js','chapters/ch5g.js','chapters/ch6a.js','chapters/ch6b.js','chapters/ch6c.js','chapters/ch6d.js','chapters/ch6e.js','chapters/ch6f.js','chapters/ch6g.js'];
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
