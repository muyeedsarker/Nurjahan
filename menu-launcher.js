(function(){
  function mount(){
    if(document.getElementById('nj-quick-fab')&&document.getElementById('nj-quick-panel'))return;
    const style=document.createElement('style');
    style.id='nj-quick-launcher-css';
    style.textContent=`#nj-quick-fab{position:fixed;right:15px;bottom:15px;z-index:10060;width:52px;height:52px;border:0;border-radius:50%;background:#2563eb;color:#fff;font-size:22px;font-weight:900;box-shadow:0 12px 30px #2563eb55;cursor:pointer;touch-action:manipulation}#nj-quick-fab:active{transform:scale(.95)}#nj-quick-panel{display:block;position:fixed;right:15px;bottom:15px;width:52px;height:52px;z-index:10061;pointer-events:none}#nj-quick-panel[hidden]{display:block!important}#nj-quick-panel.nj-launch-ready{pointer-events:auto}`;
    document.head.appendChild(style);
    const panel=document.createElement('div');panel.id='nj-quick-panel';panel.className='nj-launch-ready';panel.hidden=true;document.body.appendChild(panel);
    const fab=document.createElement('button');fab.id='nj-quick-fab';fab.type='button';fab.setAttribute('aria-label','Nurjahan Quick Menu');fab.textContent='☰';document.body.appendChild(fab);
    fab.addEventListener('click',function(){panel.hidden=!panel.hidden;fab.textContent=panel.hidden?'☰':'✕';panel.dispatchEvent(new Event('nj:quick-toggle'));});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
