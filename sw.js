const CACHE='nurjahan-v57';
const APP_SHELL=['./','./index.html','./manifest.json'];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll(APP_SHELL.map(path=>new Request(path,{cache:'reload'}))).catch(()=>{});
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('nurjahan-')&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin) return;

  event.respondWith((async()=>{
    try{
      const response=await fetch(event.request,{cache:'no-store'});
      if(response.ok){
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
      }
      return response;
    }catch(error){
      const cached=await caches.match(event.request);
      if(cached) return cached;
      if(event.request.mode==='navigate'){
        const shell=await caches.match('./index.html');
        if(shell) return shell;
      }
      return new Response('Offline — Nurjahan.com সাময়িকভাবে সংযোগের বাইরে।',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
    }
  })());
});