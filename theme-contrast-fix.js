(function(){
  const GALAXY={a:'#a855f7',b:'#f472b6',bg:'#14052a',card:'#21113a',soft:'#2a1648'};
  function applyGalaxy(){
    if(localStorage.getItem('njTheme')!=='galaxy') return;
    const r=document.documentElement;
    Object.entries({
      '--nj-a':GALAXY.a,'--nj-b':GALAXY.b,'--nj-bg':GALAXY.bg,'--nj-card':GALAXY.card,'--nj-soft':GALAXY.soft,
      '--brand-primary':GALAXY.a,'--brand-light':GALAXY.soft,'--bg-white':GALAXY.bg,
      '--text-primary':'#F8FAFC','--text-secondary':'#E9D5FF','--border-color':'#55327A','--nj-page-card':GALAXY.card
    }).forEach(([k,v])=>r.style.setProperty(k,v,'important'));
    r.style.setProperty('--nj-border','color-mix(in srgb,#a855f7 30%,#55327A)','important');
    document.body&&document.body.classList.add('nj-dark');
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('.nj-q-theme,.theme-btn,.nj-theme-btn');
    if(b&&b.dataset.theme==='galaxy') setTimeout(applyGalaxy,0);
  });
  window.addEventListener('load',()=>setTimeout(applyGalaxy,50));
  setTimeout(applyGalaxy,150);
})();
