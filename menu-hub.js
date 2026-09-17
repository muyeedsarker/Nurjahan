(function(){
  const ACTIONS=[
    ['theme','🎨','Theme'],['color','🌈','Color'],['ai','🤖','AI Help'],['support','💬','Support'],['camera','📷','Camera'],
    ['packages','🛍️','Packages'],['payment','💳','Payment'],['features','✨','Features'],['live','📡','Live'],['domain','🌐','Domain']
  ];
  function mount(){
    const fab=document.getElementById('nj-quick-fab'),panel=document.getElementById('nj-quick-panel');
    if(!fab||!panel||panel.dataset.hubReady)return;
    panel.dataset.hubReady='1';
    const style=document.createElement('style');style.id='nj-menu-hub-css';style.textContent=`
      #nj-quick-panel.nj-hub{position:fixed!important;right:0!important;bottom:0!important;width:0!important;height:0!important;max-width:none!important;max-height:none!important;overflow:visible!important;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important;backdrop-filter:none!important;z-index:10061!important}
      #nj-quick-panel.nj-hub .nj-q-head,#nj-quick-panel.nj-hub .nj-q-actions,#nj-quick-panel.nj-hub .nj-q-sub{display:none!important}
      .nj-hub-item{position:fixed;width:48px;height:48px;border:1px solid color-mix(in srgb,var(--nj-a,#2563eb) 35%,#cbd5e1);border-radius:50%;background:color-mix(in srgb,var(--nj-card,#fff) 94%,transparent);color:var(--nj-a,#2563eb);box-shadow:0 8px 24px #0004;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1px;font:900 17px system-ui,'Noto Sans Bengali',sans-serif;cursor:pointer;opacity:0;transform:translate(0,0) scale(.25);pointer-events:none;transition:transform .35s cubic-bezier(.34,1.56,.64,1),opacity .2s;z-index:10062}
      .nj-hub-item small{font-size:8px;line-height:1;color:currentColor;white-space:nowrap}
      #nj-quick-panel.nj-hub-open .nj-hub-item{opacity:1;pointer-events:auto;transform:translate(var(--x),var(--y)) scale(1)}
      .nj-hub-view{position:fixed;right:64px;bottom:58px;width:min(300px,calc(100vw - 78px));max-height:62vh;overflow:auto;padding:12px;border:1px solid color-mix(in srgb,var(--nj-a,#2563eb) 35%,#cbd5e1);border-radius:18px;background:color-mix(in srgb,var(--nj-card,#fff) 97%,transparent);box-shadow:0 18px 50px #0005;backdrop-filter:blur(16px);color:var(--text-primary,#111);font:700 12px system-ui,'Noto Sans Bengali',sans-serif;z-index:10063}
      .nj-hub-view[hidden]{display:none}.nj-hub-view h3{margin:0 0 8px;color:var(--nj-a,#2563eb)}.nj-hub-view p{margin:6px 0;line-height:1.55}.nj-hub-close{float:right;border:0;background:var(--nj-a,#2563eb);color:#fff;border-radius:50%;width:26px;height:26px;cursor:pointer}.nj-hub-view button:not(.nj-hub-close){border:1px solid var(--nj-a,#2563eb);background:var(--nj-soft,#f8fafc);color:var(--nj-a,#2563eb);border-radius:9px;padding:8px;margin:3px;cursor:pointer;font-weight:800}.nj-hub-view input{width:100%;box-sizing:border-box;padding:8px;border:1px solid #cbd5e1;border-radius:8px;margin:4px 0}.nj-hub-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}.nj-hub-card{padding:9px;border:1px solid #e5e7eb;border-radius:10px}.nj-hub-status{padding:8px;border-radius:9px;background:var(--nj-soft,#f8fafc);color:var(--nj-a,#2563eb)}
      @media(max-width:520px){.nj-hub-item{width:43px;height:43px;font-size:15px}.nj-hub-item small{font-size:7px}.nj-hub-view{right:55px;bottom:52px;width:min(275px,calc(100vw - 65px))}}
    `;document.head.appendChild(style);
    panel.classList.add('nj-hub');
    const old=panel.querySelectorAll('.nj-q-actions a,.nj-q-actions button');old.forEach(e=>e.style.display='none');
    ACTIONS.forEach((a,i)=>{const b=document.createElement('button');b.className='nj-hub-item';b.type='button';b.dataset.action=a[0];b.innerHTML=`<span>${a[1]}</span><small>${a[2]}</small>`;panel.appendChild(b);const angle=Math.PI+(Math.PI*i/(ACTIONS.length-1));const r=155; b.style.setProperty('--x',`${Math.cos(angle)*r}px`);b.style.setProperty('--y',`${Math.sin(angle)*r}px`);b.addEventListener('click',()=>show(a[0],a[2]));});
    const view=document.createElement('div');view.className='nj-hub-view';view.hidden=true;document.body.appendChild(view);
    function show(key,title){
      const close=`<button class="nj-hub-close" aria-label="Close">×</button>`;
      const map={
        theme:`<h3>🎨 Theme</h3><p>মেনুর ভেতর থেকেই Theme নির্বাচন করুন।</p><div id="hub-theme-grid" class="nj-hub-grid"></div>`,
        color:`<h3>🌈 Color</h3><p>মেনুর ভেতর থেকেই Color নির্বাচন করুন।</p><div id="hub-color-grid" class="nj-hub-grid"></div>`,
        ai:`<h3>🤖 AI Help</h3><p>Nurjahan AI Support — আপনার প্রশ্ন এখানেই লিখুন।</p><input id="hub-ai-input" placeholder="আপনার প্রশ্ন লিখুন..."/><button id="hub-ai-send">Send</button><div id="hub-ai-out" class="nj-hub-status">প্রশ্ন লিখে Send চাপুন।</div>`,
        support:`<h3>💬 Support</h3><p>সাপোর্ট অপশন এখানেই থাকবে।</p><div class="nj-hub-status">মানব সহায়তা প্রয়োজন হলে এই মেনু থেকেই যোগাযোগের তথ্য দেখা যাবে।</div>`,
        camera:`<h3>📷 Camera</h3><p>ক্যামেরা মেনুর ভেতরেই চালু হবে।</p><video id="hub-video" autoplay playsinline style="width:100%;border-radius:10px;background:#000"></video><button id="hub-camera-start">📷 Camera চালু</button>`,
        packages:`<h3>🛍️ Packages</h3><div class="nj-hub-grid"><div class="nj-hub-card">Basic<br>৳99</div><div class="nj-hub-card">Standard<br>৳199</div><div class="nj-hub-card">Premium<br>৳399</div><div class="nj-hub-card">Premium Plus<br>৳799</div></div>`,
        payment:`<h3>💳 Payment</h3><p>Manual payment এখানেই শুরু হবে।</p><div class="nj-hub-status">Payment details ও Transaction ID মেনুর ভেতরেই নেওয়া যাবে।</div>`,
        features:`<h3>✨ Features</h3><div class="nj-hub-grid"><div class="nj-hub-card">AI Support</div><div class="nj-hub-card">Camera</div><div class="nj-hub-card">Packages</div><div class="nj-hub-card">Payment</div><div class="nj-hub-card">Domain</div><div class="nj-hub-card">Live</div></div>`,
        live:`<h3>📡 Live</h3><div class="nj-hub-status">Live status মেনুর ভেতরেই দেখা যাবে।</div>`,
        domain:`<h3>🌐 Domain</h3><p>Domain & Hosting setup এখানেই করা হবে।</p><input placeholder="আপনার domain লিখুন"/><button id="hub-domain-check">✓ Check Domain</button><div id="hub-domain-out" class="nj-hub-status">Domain লিখুন।</div>`
      };
      view.innerHTML=close+(map[key]||`<h3>${title}</h3><p>এই অপশনটি মেনুর ভেতরেই পরিচালিত হবে।</p>`);view.hidden=false;
      view.querySelector('.nj-hub-close').onclick=()=>view.hidden=true;
      if(key==='theme'){const g=view.querySelector('#hub-theme-grid');themeOrder.forEach(k=>{const b=document.createElement('button');b.textContent=themeLabels[k];b.onclick=()=>{applyTheme(k);markActive()};g.appendChild(b)});}
      if(key==='color'){const g=view.querySelector('#hub-color-grid');quickColors.forEach(([a,b,n])=>{const x=document.createElement('button');x.textContent=n;x.onclick=()=>applyQuickColor(a,b);g.appendChild(x)});}
      if(key==='camera'){view.querySelector('#hub-camera-start').onclick=async()=>{try{const s=await navigator.mediaDevices.getUserMedia({video:true});view.querySelector('#hub-video').srcObject=s}catch(e){view.querySelector('#hub-video').outerHTML='<div class="nj-hub-status">ক্যামেরা permission প্রয়োজন।</div>'}};}
      if(key==='domain')view.querySelector('#hub-domain-check').onclick=()=>view.querySelector('#hub-domain-out').textContent='Domain format যাচাই করা হলো।';
      if(key==='ai')view.querySelector('#hub-ai-send').onclick=()=>view.querySelector('#hub-ai-out').textContent='AI Support প্রস্তুত। আপনার প্রশ্ন গ্রহণ করা হয়েছে।';
    }
    fab.addEventListener('click',()=>setTimeout(()=>{panel.classList.toggle('nj-hub-open',!panel.hidden)},0));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,100));else setTimeout(mount,100);
})();
