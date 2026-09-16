const themes={ocean:{name:'Ocean Blue',a:'#2563eb',b:'#06b6d4'},royal:{name:'Royal Purple',a:'#7c3aed',b:'#ec4899'},emerald:{name:'Emerald',a:'#059669',b:'#22c55e'},sunset:{name:'Sunset',a:'#ea580c',b:'#eab308'},dark:{name:'Tech Dark',a:'#0f172a',b:'#2563eb'}};
function applyTheme(k){const t=themes[k]||themes.ocean;document.documentElement.style.setProperty('--nj-a',t.a);document.documentElement.style.setProperty('--nj-b',t.b);localStorage.setItem('njTheme',k);const s=document.getElementById('nj-theme');if(s)s.value=k}
function initTheme(){applyTheme(localStorage.getItem('njTheme')||'ocean')}
window.NurjahanThemes=themes;window.applyTheme=applyTheme;window.initTheme=initTheme;
