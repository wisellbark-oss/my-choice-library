const CACHE='my-choice-library-icon-v3';
const ASSETS=['./','./index.html','./app.webmanifest','./icon.svg','./icons/choice-192-v3.png','./icons/choice-512-v3.png','./icons/apple-touch-180-v3.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('my-choice-library-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
  e.respondWith(caches.open(CACHE).then(async cache=>{
    const cached=await cache.match(e.request);
    if(cached)return cached;
    try{
      const response=await fetch(e.request);
      if(response.ok)await cache.put(e.request,response.clone());
      return response;
    }catch(error){
      if(e.request.mode==='navigate')return (await cache.match('./index.html'))||Response.error();
      return Response.error();
    }
  }));
});
