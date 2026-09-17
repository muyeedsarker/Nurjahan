(function(){
  const PRO_THEMES={
    executive:{name:'Executive Navy',a:'#0F3D5E',b:'#2563EB',bg:'#F7FAFC',card:'#FFFFFF',soft:'#EEF4FA'},
    graphite:{name:'Graphite Mint',a:'#334155',b:'#10B981',bg:'#F8FAFC',card:'#FFFFFF',soft:'#ECFDF5'},
    plum:{name:'Plum Champagne',a:'#6B21A8',b:'#D4A017',bg:'#FCF9FF',card:'#FFFFFF',soft:'#F7F0FF'},
    earth:{name:'Digital Earth',a:'#166534',b:'#B45309',bg:'#FAFAF5',card:'#FFFFFF',soft:'#F1F5E8'},
    arctic:{name:'Arctic Indigo',a:'#3730A3',b:'#0891B2',bg:'#F6F9FF',card:'#FFFFFF',soft:'#EEF2FF'}
  };
  const PRO_COLORS=[
    ['#0F3D5E','#2563EB','🔷 Executive'],
    ['#334155','#10B981','🟢 Graphite Mint'],
    ['#6B21A8','#D4A017','🟣 Champagne Plum'],
    ['#166534','#B45309','🌿 Digital Earth'],
    ['#3730A3','#0891B2','🧊 Arctic Indigo']
  ];
  function add(){
    if(!window.NurjahanThemes||typeof themeOrder==='undefined'||typeof quickColors==='undefined'||typeof themeLabels==='undefined')return;
    Object.assign(window.NurjahanThemes,PRO_THEMES);
    Object.keys(PRO_THEMES).forEach(k=>{if(!themeOrder.includes(k))themeOrder.push(k)});
    Object.assign(themeLabels,{executive:'💼 Executive',graphite:'🪨 Graphite Mint',plum:'🍇 Plum Champagne',earth:'🌿 Digital Earth',arctic:'🧊 Arctic Indigo'});
    PRO_COLORS.forEach(c=>{if(!quickColors.some(x=>x[0]===c[0]&&x[1]===c[1]))quickColors.push(c)});
    document.querySelectorAll('.theme-buttons').forEach(box=>{delete box.dataset.nj20Ready});
    if(typeof buildThemeButtons==='function')buildThemeButtons();
    const colorGrid=document.querySelector('#nj-q-color .nj-q-grid');
    if(colorGrid){
      PRO_COLORS.forEach(([a,b,n])=>{if(colorGrid.querySelector(`[data-a="${a}"][data-b="${b}"]`))return;const x=document.createElement('button');x.className='nj-q-color';x.dataset.a=a;x.dataset.b=b;x.innerHTML=`<i style="display:inline-block;width:15px;height:15px;border-radius:50%;vertical-align:middle;border:1px solid #fff;margin-right:2px;background:linear-gradient(135deg,${a},${b})"></i>${n}`;x.onclick=()=>applyQuickColor(a,b);colorGrid.appendChild(x)});
      const h=document.querySelector('#nj-q-color b');if(h)h.textContent='🌈 ২৫টি Color';
    }
    const th=document.querySelector('#nj-q-theme b');if(th)th.textContent='🎨 ২৫টি Theme';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(add,150));else setTimeout(add,150);
})();
