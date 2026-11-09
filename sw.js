'use strict';
const PREFIX='trukkikoe-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+'1.0.0';
const FILES=['./','./index.html','./manifest.webmanifest','./src/style.css','./src/core.js','./src/app.js','./src/pdf.js','./src/pdf-lib.min.js','./src/fonts.js','./src/pwa.js','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
// Updates wait until all app windows close; an exam is never forcibly reloaded.
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||!event.request.url.startsWith(self.registration.scope))return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);const hit=await cache.match(event.request,{ignoreSearch:true});if(hit)return hit;if(event.request.mode==='navigate')return (await cache.match('./index.html'))||fetch(event.request);return fetch(event.request);})());
});
