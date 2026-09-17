const themes={
  ocean:{name:'Ocean Blue',a:'#2563eb',b:'#06b6d4',bg:'#f8fbff',card:'#ffffff',soft:'#f8fafc'},
  royal:{name:'Royal Purple',a:'#7c3aed',b:'#ec4899',bg:'#fcf9ff',card:'#ffffff',soft:'#faf5ff'},
  emerald:{name:'Emerald',a:'#059669',b:'#22c55e',bg:'#f5fffb',card:'#ffffff',soft:'#f0fdf4'},
  tech:{name:'Tech Dark',a:'#38bdf8',b:'#2563eb',bg:'#070b12',card:'#0f172a',soft:'#111d2e'},
  galaxy:{name:'Galaxy',a:'#8b5cf6',b:'#ec4899',bg:'#0b0617',card:'#151026',soft:'#1b1430'},
  sunset:{name:'Sunset',a:'#f97316',b:'#eab308',bg:'#fffaf5',card:'#ffffff',soft:'#fff7ed'},
  diamond:{name:'Diamond',a:'#0891b2',b:'#60a5fa',bg:'#f4fbff',card:'#ffffff',soft:'#eff6ff'},
  rose:{name:'Rose',a:'#e11d48',b:'#f43f5e',bg:'#fff7f9',card:'#ffffff',soft:'#fff1f2'},
  coffee:{name:'Coffee',a:'#92400e',b:'#d97706',bg:'#fffaf5',card:'#ffffff',soft:'#fffbeb'},
  aurora:{name:'Aurora',a:'#14b8a6',b:'#8b5cf6',bg:'#f6fffe',card:'#ffffff',soft:'#f0fdfa'},
  luxury:{name:'Luxury Gold',a:'#b7791f',b:'#f59e0b',bg:'#fffcf2',card:'#ffffff',soft:'#fffbea'},
  ice:{name:'Ice Blue',a:'#0284c7',b:'#22d3ee',bg:'#f0fbff',card:'#ffffff',soft:'#ecfeff'},
  neon:{name:'Neon',a:'#22c55e',b:'#06b6d4',bg:'#050b0d',card:'#0b1718',soft:'#102326'},
  midnight:{name:'Midnight',a:'#6366f1',b:'#3b82f6',bg:'#050816',card:'#0d1326',soft:'#111a32'},
  coral:{name:'Coral',a:'#f43f5e',b:'#fb7185',bg:'#fff8f7',card:'#ffffff',soft:'#fff1f2'}
};
function applyTheme(k){const t=themes[k]||themes.ocean;for(const[n,v]of Object.entries(t))if(n!=='name')document.documentElement.style.setProperty('--nj-'+n,v);document.body?.classList.toggle('nj-dark',['tech','galaxy','neon','midnight'].includes(k));try{localStorage.setItem('njTheme',k)}catch(e){}const s=document.getElementById('nj-theme');if(s)s.value=k;document.querySelectorAll('.theme-btn').forEach(b=>b.classList.toggle('active',b.dataset.theme===k));}
function initTheme(){applyTheme(localStorage.getItem('njTheme')||'ocean')}
window.NurjahanThemes=themes;window.applyTheme=applyTheme;window.initTheme=initTheme;
