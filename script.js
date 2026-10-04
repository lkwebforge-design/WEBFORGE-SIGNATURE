document.documentElement.classList.add('loader-active');
const glow=document.querySelector('.cursor-glow');
if(glow){window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true})}
window.addEventListener('load',()=>{setTimeout(()=>{document.documentElement.classList.remove('loader-active');document.documentElement.classList.add('loader-done')},650)});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}}));
const motionVideo=document.querySelector('[data-motion-video]');
if(motionVideo){
  const activate=()=>motionVideo.dataset.active='true';
  const deactivate=()=>motionVideo.dataset.active='false';
  motionVideo.addEventListener('pointerenter',activate);
  motionVideo.addEventListener('pointerleave',deactivate);
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)activate();else deactivate()}),{threshold:.58});
  io.observe(motionVideo);
}
const story=document.querySelector('[data-story-video]');
if(story){
  const play=()=>story.dataset.playing='true';
  story.addEventListener('pointerenter',play);
  story.addEventListener('focus',play);
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)play()}),{threshold:.6});
  io.observe(story);
}

/* Vimeo AI concept reels: explicitly start muted playback when cards enter view. */
(function(){
  const frames=[...document.querySelectorAll('.ai-reel iframe,.video-gallery iframe,.real-story-video iframe')];
  if(!frames.length) return;
  const startPlayers=()=>{
    if(!window.Vimeo || !window.Vimeo.Player) return;
    frames.forEach(frame=>{
      if(frame.dataset.playerReady) return;
      frame.dataset.playerReady='true';
      const player=new Vimeo.Player(frame);
      frame._vimeoPlayer=player;
      player.setMuted(true).catch(()=>{});
      player.play().catch(()=>{});
    });
  };
  const loadApi=()=>{
    if(window.Vimeo){startPlayers();return;}
    if(document.querySelector('script[data-vimeo-api]')) return;
    const s=document.createElement('script');
    s.src='https://player.vimeo.com/api/player.js';
    s.async=true;
    s.dataset.vimeoApi='true';
    s.onload=startPlayers;
    document.head.appendChild(s);
  };
  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        loadApi();
        const frame=entry.target;
        if(frame._vimeoPlayer) frame._vimeoPlayer.play().catch(()=>{});
      }else if(frame._vimeoPlayer){
        frame._vimeoPlayer.pause().catch(()=>{});
      }
    });
  },{threshold:.22});
  frames.forEach(frame=>io.observe(frame));
})();


/* Performance: only play portfolio videos while they are visible. */
(function(){
  const videos=[...document.querySelectorAll('.signature-video-gallery video, .story-video video')];
  if(!videos.length) return;
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
    const v=entry.target;
    if(entry.isIntersecting){
      v.play().catch(()=>{});
    }else{
      v.pause();
    }
  }),{rootMargin:'180px 0px',threshold:.08});
  videos.forEach(v=>io.observe(v));
})();


/* Start Project uses native <details>/<summary> so it works reliably on Safari/iPhone without JavaScript. */

/* WEBFORGE SIGNATURE — isolated cookie consent */
(function(){
  const KEY='webforge_cookie_consent_v3';
  function initPreviewButton(){const b=document.getElementById('wf-cookie-preview');if(!b)return;b.addEventListener('click',()=>{const l=document.getElementById('wf-cookie-layer');if(l){l.classList.remove('wf-cookie-hidden');try{localStorage.removeItem('webforge_cookie_consent_v3')}catch(e){}}});}
  function init(){
    if(document.getElementById('wf-cookie-layer')) return;
    const layer=document.createElement('div');
    layer.id='wf-cookie-layer';
    layer.innerHTML='<div class="wf-cookie-box" role="dialog" aria-label="Cookie preferences"><div class="wf-cookie-copy"><span>WEBFORGE / PRIVACY</span><strong>A little privacy, beautifully handled.</strong><p>Essential cookies keep this site working. Optional analytics is only enabled if you choose it.</p></div><div class="wf-cookie-actions"><button type="button" id="wf-cookie-reject">Reject Optional</button><button type="button" id="wf-cookie-manage">Manage</button><button type="button" id="wf-cookie-accept">Accept All</button></div></div>';
    document.body.appendChild(layer);
    const box=layer.querySelector('.wf-cookie-box');
    const hide=()=>{layer.classList.add('wf-cookie-hidden')};
    let saved=false; try{saved=!!localStorage.getItem(KEY)}catch(e){}
    if(saved) hide();
    layer.querySelector('#wf-cookie-accept').addEventListener('pointerup',()=>{try{localStorage.setItem(KEY,JSON.stringify({essential:true,analytics:true}))}catch(e){} hide()},{passive:true});
    layer.querySelector('#wf-cookie-reject').addEventListener('pointerup',()=>{try{localStorage.setItem(KEY,JSON.stringify({essential:true,analytics:false}))}catch(e){} hide()},{passive:true});
    layer.querySelector('#wf-cookie-manage').addEventListener('pointerup',()=>{alert('Essential cookies are always on. Optional analytics is currently off unless you choose Accept All.')},{passive:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{init();initPreviewButton()},{once:true}); else {init();initPreviewButton();}
})();
