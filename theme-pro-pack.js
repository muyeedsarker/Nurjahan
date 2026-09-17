(function(){
  const PRO_THEMES={
    executive:{name:'Executive Navy',a:'#0F3D5E',b:'#2563EB',bg:'#F7FAFC',card:'#FFFFFF',soft:'#EEF4FA'},
    graphite:{name:'Graphite Mint',a:'#334155',b:'#10B981',bg:'#F8FAFC',card:'#FFFFFF',soft:'#ECFDF5'},
    plum:{name:'Plum Champagne',a:'#6B21A8',b:'#D4A017',bg:'#FCF9FF',card:'#FFFFFF',soft:'#F7F0FF'},
    earth:{name:'Digital Earth',a:'#166534',b:'#B45309',bg:'#FAFAF5',card:'#FFFFFF',soft:'#F1F5E8'},
    arctic:{name:'Arctic Indigo',a:'#3730A3',b:'#0891B2',bg:'#F6F9FF',card:'#FFFFFF',soft:'#EEF2FF'}
  };
  const PRO_LABELS={executive:'💼 Executive',graphite:'🪨 Graphite Mint',plum:'🍇 Plum Champagne',earth:'🌿 Digital Earth',arctic:'🧊 Arctic Indigo'};
  const PRO_COLORS=[
    ['#0F3D5E','#2563EB','🔷 Executive'],
    ['#334155','#10B981','🟢 Graphite Mint'],
    ['#6B21A8','#D4A017','🟣 Champagne Plum'],
    ['#166534','#B45309','🌿 Digital Earth'],
    ['#3730A3','#0891B2','🧊 Arctic Indigo']
  ];
  function addTheme(k){
    const box=document.querySelector('#nj-q-theme .nj-q-grid');
    if(!box||box.querySelector('[data-theme="'+k+'"]'))return;
    const t=PRO_THEMES[k],b=document.createElement('button');
    b.type='button'; b.className='nj-q-theme'; b.dataset.theme=k;
    b.innerHTML='<span class="nj-theme-swatch" style="display:inline-block;width:15px;height:15px;border-radius:50%;vertical-align:middle;margin-right:2px;background:linear-gradient(135deg,'+t.a+','+t.b+')"></span>'+PRO_LABELS[k];
    b.addEventListener('click',function(){if(typeof applyTheme==='function')applyTheme(k)});
    box.appendChild(b);
  }
  function addColor(a,b,name){
    const box=document.querySelector('#nj-q-color .nj-q-grid');
    if(!box||box.querySelector('[data-a="'+a+'"][data-b="'+b+'"]'))return;
    const x=document.createElement('button');
    x.type='button'; x.className='nj-q-color'; x.dataset.a=a; x.dataset.b=b;
    x.innerHTML='<i style="display:inline-block;width:15px;height:15px;border-radius:50%;vertical-align:middle;border:1px solid #fff;margin-right:2px;background:linear-gradient(135deg,'+a+','+b+')"></i>'+name;
    x.addEventListener('click',function(){if(typeof applyQuickColor==='function')applyQuickColor(a,b)});
    box.appendChild(x);
  }
  function add(){
    if(window.NurjahanThemes)Object.assign(window.NurjahanThemes,PRO_THEMES);
    if(typeof themeOrder!=='undefined')Object.keys(PRO_THEMES).forEach(k=>{if(!themeOrder.includes(k))themeOrder.push(k)});
    if(typeof themeLabels!=='undefined')Object.assign(themeLabels,PRO_LABELS);
    if(typeof quickColors!=='undefined')PRO_COLORS.forEach(c=>{if(!quickColors.some(x=>x[0]===c[0]&&x[1]===c[1]))quickColors.push(c)});
    Object.keys(PRO_THEMES).forEach(addTheme);
    PRO_COLORS.forEach(c=>addColor(c[0],c[1],c[2]));
    const th=document.querySelector('#nj-q-theme b'); if(th)th.textContent='🎨 ২৫টি Theme';
    const co=document.querySelector('#nj-q-color b'); if(co)co.textContent='🌈 ২৫টি Color';
  }
  function start(){
    add();
    const mo=new MutationObserver(add); mo.observe(document.body,{childList:true,subtree:true});
    setTimeout(add,300); setTimeout(add,1000); setTimeout(add,2000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,100));
  else setTimeout(start,100);
})();
