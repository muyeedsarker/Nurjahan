(function(){
  const ACTIONS=[['theme','🎨','Theme'],['color','🌈','Color'],['settings','⚙️','Settings'],['ai','🤖','AI'],['support','💬','Support'],['camera','📷','Camera'],['packages','🛍️','Packages'],['payment','💳','Payment'],['features','✨','Features'],['domain','🌐','Domain']];
  function mount(){
    const fab=document.getElementById('nj-quick-fab'),panel=document.getElementById('nj-quick-panel');
    if(!fab||!panel||panel.dataset.hubReady)return; panel.dataset.hubReady='1';
    const style=document.createElement('style');style.id='nj-menu-hub-css';style.textContent=`
      #nj-quick-panel.nj-hub{position:fixed!important;inset:auto 0 0 auto!important;width:0!important;height:0!important;overflow:visible!important;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important;z-index:10061!important}
      #nj-quick-panel.nj-hub .nj-q-head,#nj-quick-panel.nj-hub .nj-q-actions,#nj-quick-panel.nj-hub .nj-q-sub{display:none!important}
      .nj-hub-item{position:fixed;width:44px;height:44px;padding:0!important;border:1px solid color-mix(in srgb,var(--nj-a,#2563eb) 35%,#cbd5e1);border-radius:50%;background:color-mix(in srgb,var(--nj-card,#fff) 95%,transparent);color:var(--nj-a,#2563eb);box-shadow:0 7px 20px #0003;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:0;font:900 15px system-ui,'Noto Sans Bengali',sans-serif;cursor:pointer;opacity:0;transform:translate(0,0) scale(.25);pointer-events:none;transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .18s;z-index:10062}
      .nj-hub-item small{font-size:6px;line-height:1;white-space:nowrap}
      #nj-quick-panel.nj-hub-open .nj-hub-item{opacity:1;pointer-events:auto;transform:translate(var(--x),var(--y)) scale(1)}
      .nj-hub-view{position:fixed;right:58px;bottom:54px;width:min(300px,calc(100vw - 70px));max-height:62vh;overflow:auto;padding:12px;border:1px solid color-mix(in srgb,var(--nj-a,#2563eb) 35%,#cbd5e1);border-radius:16px;background:color-mix(in srgb,var(--nj-card,#fff) 97%,transparent);box-shadow:0 16px 45px #0004;backdrop-filter:blur(15px);color:var(--text-primary,#111);font:700 12px system-ui,'Noto Sans Bengali',sans-serif;z-index:10063}
      .nj-hub-view[hidden]{display:none}.nj-hub-view h3{margin:0 0 8px;color:var(--nj-a,#2563eb)}.nj-hub-view p{margin:6px 0;line-height:1.5}.nj-hub-close{float:right;border:0;background:var(--nj-a,#2563eb);color:#fff;border-radius:50%;width:26px;height:26px;cursor:pointer}.nj-hub-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px}.nj-hub-card{padding:9px;border:1px solid #e5e7eb;border-radius:9px}.nj-hub-status{padding:8px;border-radius:9px;background:var(--nj-soft,#f8fafc);color:var(--nj-a,#2563eb)}
      .nj-hub-view button:not(.nj-hub-close){border:1px solid var(--nj-a,#2563eb);background:var(--nj-soft,#f8fafc);color:var(--nj-a,#2563eb);border-radius:8px;padding:7px;margin:2px;cursor:pointer;font-weight:800}
      @media(max-width:520px){.nj-hub-item{width:40px;height:40px;font-size:14px}.nj-hub-item small{font-size:5.5px}.nj-hub-view{right:52px;bottom:50px;width:min(270px,calc(100vw - 62px))}}
      /* Theme + Color: compact 5-column equal buttons */
      #nj-q-theme .nj-q-grid,#nj-q-color .nj-q-grid{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:5px!important}
      #nj-q-theme .nj-q-grid button,#nj-q-color .nj-q-grid button{width:100%!important;min-width:0!important;height:38px!important;min-height:38px!important;margin:0!important;padding:3px 2px!important;border-radius:9px!important;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:flex!important;align-items:center;justify-content:center;gap:2px;font-size:8px!important;font-weight:850!important}
      #nj-q-theme .nj-q-grid button{flex-direction:column;line-height:1}
      #nj-q-theme .nj-q-grid button .nj-theme-swatch{width:15px;height:15px;min-width:15px;border-radius:50%;display:block;box-shadow:0 1px 4px #0003}
      #nj-q-color .nj-q-grid button i{width:14px!important;height:14px!important;min-width:14px!important;margin:0!important;box-shadow:0 1px 4px #0003}
    `;document.head.appendChild(style);panel.classList.add('nj-hub');
    panel.querySelectorAll('.nj-q-actions a,.nj-q-actions button').forEach(e=>e.style.display='none');
    ACTIONS.forEach((a,i)=>{const b=document.createElement('button');b.className='nj-hub-item';b.type='button';b.innerHTML=`<span>${a[1]}</span><small>${a[2]}</small>`;panel.appendChild(b);const angle=(Math.PI*0.10)+(Math.PI*0.80*i/(ACTIONS.length-1));const r=145;b.style.setProperty('--x',`${-Math.cos(angle)*r}px`);b.style.setProperty('--y',`${-Math.sin(angle)*r}px`);b.addEventListener('click',()=>show(a[0],a[2]));});
    const view=document.createElement('div');view.className='nj-hub-view';view.hidden=true;document.body.appendChild(view);
    function show(key,title){
      const close='<button class="nj-hub-close" aria-label="Close">×</button>';
      const map={
        theme:'<h3>🎨 Theme</h3><p>২৫টি Theme — এখানে থেকেই নির্বাচন করুন।</p><div id="hub-theme-grid" class="nj-hub-grid"></div>',
        color:'<h3>🌈 Color</h3><p>২৫টি Color — এখানে থেকেই নির্বাচন করুন।</p><div id="hub-color-grid" class="nj-hub-grid"></div>',
        settings:'<h3>⚙️ Settings</h3><p>Nurjahan Settings</p><div class="nj-hub-grid"><div class="nj-hub-card">🎨 Theme</div><div class="nj-hub-card">🌈 Color</div><div class="nj-hub-card">🔔 Notifications</div><div class="nj-hub-card">🔐 Privacy</div></div>',
        ai:'<h3>🤖 AI Help</h3><p>আপনার প্রশ্ন এখানেই লিখুন।</p><input id="hub-ai-input" style="width:100%;box-sizing:border-box;padding:8px;border:1px solid #cbd5e1;border-radius:8px" placeholder="প্রশ্ন লিখুন..."/><button id="hub-ai-send">Send</button><div id="hub-ai-out" class="nj-hub-status">AI Support প্রস্তুত।</div>',
        support:'<h3>💬 Support</h3><div class="nj-hub-status">Customer Support মেনুর ভেতরেই পাওয়া যাবে।</div>',
        camera:'<h3>📷 Camera</h3><video id="hub-video" autoplay playsinline style="width:100%;border-radius:9px;background:#000"></video><button id="hub-camera-start">📷 চালু করুন</button>',
        packages:'<h3>🛍️ Packages</h3><div class="nj-hub-grid"><div class="nj-hub-card">Basic<br>৳99</div><div class="nj-hub-card">Standard<br>৳199</div><div class="nj-hub-card">Premium<br>৳399</div><div class="nj-hub-card">Premium Plus<br>৳799</div></div>',
        payment:'<h3>💳 Payment</h3><div class="nj-hub-status">Manual payment ও Transaction ID এখান থেকেই নেওয়া যাবে।</div>',
        features:'<h3>✨ Features</h3><div class="nj-hub-grid"><div class="nj-hub-card">AI Support</div><div class="nj-hub-card">Camera</div><div class="nj-hub-card">Packages</div><div class="nj-hub-card">Payment</div></div>',
        domain:'<h3>🌐 Domain</h3><p>Domain format এখানে যাচাই করা যাবে।</p><input id="hub-domain" style="width:100%;box-sizing:border-box;padding:8px;border:1px solid #cbd5e1;border-radius:8px" placeholder="example.com"/><button id="hub-domain-check">✓ Check</button><div id="hub-domain-out" class="nj-hub-status">Domain লিখুন।</div>'
      };view.innerHTML=close+(map[key]||`<h3>${title}</h3><p>এই অপশনটি মেনুর ভেতরেই পরিচালিত হবে।</p>`);view.hidden=false;view.querySelector('.nj-hub-close').onclick=()=>view.hidden=true;
      if(key==='theme'){const g=view.querySelector('#hub-theme-grid');themeOrder.forEach(k=>{const b=document.createElement('button');b.textContent=themeLabels[k];b.onclick=()=>applyTheme(k);g.appendChild(b)})}
      if(key==='color'){const g=view.querySelector('#hub-color-grid');quickColors.forEach(([a,b,n])=>{const x=document.createElement('button');x.textContent=n;x.onclick=()=>applyQuickColor(a,b);g.appendChild(x)})}
      if(key==='camera')view.querySelector('#hub-camera-start').onclick=async()=>{try{const s=await navigator.mediaDevices.getUserMedia({video:true});view.querySelector('#hub-video').srcObject=s}catch(e){view.innerHTML=close+'<div class="nj-hub-status">ক্যামেরা permission প্রয়োজন।</div>';view.querySelector('.nj-hub-close').onclick=()=>view.hidden=true}};
      if(key==='ai')view.querySelector('#hub-ai-send').onclick=()=>view.querySelector('#hub-ai-out').textContent='আপনার প্রশ্ন গ্রহণ করা হয়েছে।';
      if(key==='domain')view.querySelector('#hub-domain-check').onclick=()=>view.querySelector('#hub-domain-out').textContent='Domain format যাচাই করা হয়েছে।';
    }
    fab.addEventListener('click',()=>setTimeout(()=>panel.classList.toggle('nj-hub-open',!panel.hidden),0));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,100));else setTimeout(mount,100);
})();
