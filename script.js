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

/* WEBFORGE SIGNATURE — privacy-friendly cookie consent */
(function(){
  const STORAGE_KEY='webforge_cookie_consent_v1';
  const loadStyles=()=>{
    if(document.querySelector('link[data-cookie-css]')) return;
    const link=document.createElement('link');
    link.rel='stylesheet'; link.href='./cookie-consent.css'; link.dataset.cookieCss='true';
    document.head.appendChild(link);
  };
  const saved=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')}catch(e){return null}};
  const save=(prefs)=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify({...prefs,updatedAt:new Date().toISOString()}))}catch(e){}};
  const inject=()=>{
    if(document.querySelector('.cookie-consent')) return;
    const banner=document.createElement('aside');
    banner.className='cookie-consent';
    banner.setAttribute('aria-label','Cookie preferences');
    banner.innerHTML=`
      <div class="cookie-consent-copy">
        <p class="cookie-consent-kicker">WEBFORGE / PRIVACY</p>
        <p>We use essential cookies to keep this site working. Optional analytics cookies help us understand site usage. You can accept all, reject optional cookies, or choose what you allow.</p>
      </div>
      <div class="cookie-consent-actions">
        <button class="cookie-btn" data-cookie="reject">Reject Optional</button>
        <button class="cookie-btn" data-cookie="manage">Manage Preferences</button>
        <button class="cookie-btn primary" data-cookie="accept">Accept All</button>
      </div>`;
    document.body.appendChild(banner);

    const modal=document.createElement('div');
    modal.className='cookie-settings';
    modal.setAttribute('role','dialog');
    modal.setAttribute('aria-modal','true');
    modal.setAttribute('aria-label','Cookie preferences');
    modal.innerHTML=`
      <div class="cookie-panel">
        <h3>Cookie preferences</h3>
        <p>Essential cookies are always enabled because they are needed for core site functions. Optional analytics stays off unless you choose to enable it.</p>
        <div class="cookie-option"><div><strong>Essential</strong><small>Required for basic website functionality and your consent choice.</small></div><label class="cookie-switch"><input type="checkbox" checked disabled><span class="cookie-slider"></span></label></div>
        <div class="cookie-option"><div><strong>Analytics</strong><small>Optional measurement to help us improve the website. No analytics is activated by this consent component.</small></div><label class="cookie-switch"><input id="cookie-analytics" type="checkbox"><span class="cookie-slider"></span></label></div>
        <div class="cookie-panel-actions"><button class="cookie-close" data-cookie="close">Cancel</button><button class="cookie-btn primary" data-cookie="save">Save Preferences</button></div>
      </div>`;
    document.body.appendChild(modal);

    const show=()=>banner.classList.add('is-visible');
    const hide=()=>banner.classList.remove('is-visible');
    const open=()=>modal.classList.add('is-visible');
    const close=()=>modal.classList.remove('is-visible');

    banner.addEventListener('click',e=>{
      const action=e.target.closest('[data-cookie]')?.dataset.cookie;
      if(action==='accept'){save({essential:true,analytics:true});hide()}
      if(action==='reject'){save({essential:true,analytics:false});hide()}
      if(action==='manage'){open()}
    });
    modal.addEventListener('click',e=>{
      const action=e.target.closest('[data-cookie]')?.dataset.cookie;
      if(action==='close') close();
      if(action==='save'){
        save({essential:true,analytics:!!document.querySelector('#cookie-analytics')?.checked});
        close(); hide();
      }
      if(e.target===modal) close();
    });

    const current=saved();
    if(current && current.analytics) document.querySelector('#cookie-analytics').checked=true;
    if(!current) show();
  };
  const init=()=>{loadStyles();inject()};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
