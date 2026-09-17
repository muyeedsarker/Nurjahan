(function(){
  const LIGHT={
    tech:{a:'#2563EB',b:'#38BDF8',bg:'#F7FBFF',card:'#FFFFFF',soft:'#EEF6FF'},
    galaxy:{a:'#7C3AED',b:'#EC4899',bg:'#FBF8FF',card:'#FFFFFF',soft:'#F5EFFF'},
    neon:{a:'#16A34A',b:'#06B6D4',bg:'#F5FFFB',card:'#FFFFFF',soft:'#EAFFF5'},
    midnight:{a:'#4F46E5',b:'#3B82F6',bg:'#F6F8FF',card:'#FFFFFF',soft:'#EEF2FF'}
  };
  function fix(k){const t=LIGHT[k];if(!t)return;const r=document.documentElement;Object.entries(t).forEach(([n,v])=>r.style.setProperty('--nj-'+n,v));r.style.setProperty('--brand-primary',t.a);r.style.setProperty('--brand-light',t.soft);r.style.setProperty('--bg-white',t.bg);r.style.setProperty('--text-primary','#1E1E1E');r.style.setProperty('--text-secondary','#6B7280');r.style.setProperty('--border-color','color-mix(in srgb,'+t.a+' 18%,#e5e5e5)');document.body?.classList.remove('nj-dark');}
  function bind(){document.querySelectorAll('.nj-q-theme,.theme-btn,.nj-theme-btn').forEach(b=>{if(b.dataset.njLightFix)return;b.dataset.njLightFix='1';b.addEventListener('click',()=>setTimeout(()=>fix(b.dataset.theme),0),true)});const k=localStorage.getItem('njTheme');if(k)fix(k);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(bind,250));else setTimeout(bind,250);
  new MutationObserver(bind).observe(document.documentElement,{childList:true,subtree:true});
})();
