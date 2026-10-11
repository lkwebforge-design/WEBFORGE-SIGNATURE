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
    const accept=layer.querySelector('#wf-cookie-accept');
    if(accept){accept.style.setProperty('background','linear-gradient(135deg, rgba(205,255,220,.30), rgba(55,135,88,.18))','important');accept.style.setProperty('color','#f0fff5','important');accept.style.setProperty('border','1px solid rgba(180,255,205,.55)','important');accept.style.setProperty('box-shadow','inset 0 1px 0 rgba(255,255,255,.22), inset 0 0 22px rgba(170,255,200,.08), 0 8px 30px rgba(40,120,70,.20)','important');accept.style.setProperty('backdrop-filter','blur(18px) saturate(160%)','important');accept.style.setProperty('-webkit-backdrop-filter','blur(18px) saturate(160%)','important');}
    const hide=()=>{layer.classList.add('wf-cookie-hidden')};
    let saved=false; try{saved=!!localStorage.getItem(KEY)}catch(e){}
    if(saved) hide();
    layer.querySelector('#wf-cookie-accept').addEventListener('pointerup',()=>{try{localStorage.setItem(KEY,JSON.stringify({essential:true,analytics:true}))}catch(e){} hide()},{passive:true});
    layer.querySelector('#wf-cookie-reject').addEventListener('pointerup',()=>{try{localStorage.setItem(KEY,JSON.stringify({essential:true,analytics:false}))}catch(e){} hide()},{passive:true});
    layer.querySelector('#wf-cookie-manage').addEventListener('pointerup',()=>{alert('Essential cookies are always on. Optional analytics is currently off unless you choose Accept All.')},{passive:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{init();initPreviewButton()},{once:true}); else {init();initPreviewButton();}
})();


/* Project brief: prepare a client-controlled WhatsApp message without a backend. */
(function(){
  const form=document.getElementById('project-brief-form');
  if(!form) return;
  form.addEventListener('submit',function(event){
    event.preventDefault();
    const data=new FormData(form);
    const value=name=>String(data.get(name)||'').trim();
    const message=[
      'Hi WebForge Signature! I would like to discuss a website project.',
      '',
      'Name: '+value('name'),
      'Business / brand: '+value('business'),
      'Website type: '+value('type'),
      'Budget: '+value('budget'),
      'Ideal deadline: '+value('deadline'),
      'Project details: '+(value('details')||'I would like to discuss the requirements.'),
      '',
      'I understand the final scope, quote and timeline will be confirmed after reviewing the brief.'
    ].join('\n');
    window.open('https://wa.me/94771544911?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
  });
})();


/* Cinematic hero: map scroll progress to restrained 3D transforms; no scroll hijacking. */
(function(){
  const pin=document.querySelector('[data-scroll-hero]');
  const stage=document.querySelector('.signature-hero-stage');
  const hero=document.querySelector('.signature-hero');
  if(!pin||!stage||!hero) return;
  const root=pin;
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let scheduled=false;
  function update(){
    scheduled=false;
    const rect=pin.getBoundingClientRect();
    const mobile=window.matchMedia('(max-width: 760px)').matches;
    const travel=Math.max(1,pin.offsetHeight-hero.offsetHeight);
    const progress=mobile
      ? Math.max(0,Math.min(1,(window.innerHeight-rect.top)/(window.innerHeight+hero.offsetHeight)))
      : Math.max(0,Math.min(1,(-rect.top)/travel));
    root.style.setProperty('--hero-progress',progress.toFixed(4));
    root.style.setProperty('--aura-opacity',(1-.12*progress).toFixed(3));
    root.style.setProperty('--cue-scale',(1-.45*progress).toFixed(3));
    root.style.setProperty('--interface-image-scale',(1+.1*progress).toFixed(3));
    if(reduce){
      ['--copy-lift','--scene-x','--scene-y','--scene-rotate','--aura-x','--orbit-turn','--core-x','--core-y','--core-rotate','--core-scale','--panel-x','--panel-y','--float-one-x','--float-one-y','--float-two-x','--float-two-y'].forEach(k=>root.style.removeProperty(k));
      return;
    }
    const px=(n)=>Math.round(n*progress*100)/100+'px';
    root.style.setProperty('--copy-lift',px(-18*progress));
    root.style.setProperty('--copy-opacity',(1-.08*progress).toFixed(3));
    root.style.setProperty('--scene-x',px(mobile?0:16*progress));
    root.style.setProperty('--scene-y',px(-24*progress));
    root.style.setProperty('--scene-rotate',(mobile?0:2.5*progress).toFixed(2)+'deg');
    root.style.setProperty('--aura-x',px(26*progress));
    root.style.setProperty('--orbit-turn',(34*progress).toFixed(2)+'deg');
    root.style.setProperty('--core-x',px(-18*progress));
    root.style.setProperty('--core-y',px(22*progress));
    root.style.setProperty('--core-rotate',(34*progress).toFixed(2)+'deg');
    root.style.setProperty('--core-scale',(1-.12*progress).toFixed(3));
    root.style.setProperty('--panel-x',px(28*progress));
    root.style.setProperty('--panel-y',px(-42*progress));
    root.style.setProperty('--float-one-x',px(-22*progress));
    root.style.setProperty('--float-one-y',px(20*progress));
    root.style.setProperty('--float-two-x',px(18*progress));
    root.style.setProperty('--float-two-y',px(-28*progress));
  }
  function schedule(){if(!scheduled){scheduled=true;window.requestAnimationFrame(update)}}
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  update();
})();
