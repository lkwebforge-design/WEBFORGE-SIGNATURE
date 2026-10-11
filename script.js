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


/* Hero image fallback: scroll-scrubbed frame sequence activates only if the primary hero image fails. */
(function(){
  const hero = document.querySelector('.hero-redesign');
  const stage = document.querySelector('.showcase-main');
  const primary = stage && stage.querySelector(':scope > img');
  if(!hero || !stage || !primary) return;

  const frameSources = [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85'
  ];

  let started = false;
  function activateFallback(){
    if(started) return;
    started = true;
    const canvas = document.createElement('canvas');
    canvas.className = 'showcase-frame-fallback';
    canvas.setAttribute('aria-label','Scroll-controlled visual fallback');
    canvas.setAttribute('role','img');
    Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',objectFit:'cover'});
    stage.insertBefore(canvas, primary);
    primary.style.display = 'none';
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    const frames = frameSources.map(src => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = src;
      return image;
    });
    let frameIndex = -1;
    let scheduled = false;
    function draw(){
      scheduled = false;
      const rect = hero.getBoundingClientRect();
      const span = Math.max(1, rect.height);
      const progress = Math.max(0,Math.min(1,(-rect.top)/span));
      const nextIndex = Math.min(frames.length-1,Math.floor(progress*(frames.length-1)+0.5));
      if(nextIndex === frameIndex && canvas.width) return;
      frameIndex = nextIndex;
      const img = frames[frameIndex];
      if(!img.complete || !img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1,2);
      const width = Math.max(1,stage.clientWidth), height = Math.max(1,stage.clientHeight);
      canvas.width = Math.round(width*dpr);
      canvas.height = Math.round(height*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const scale = Math.max(width/img.naturalWidth,height/img.naturalHeight);
      const zoom = 1.02 + progress*.045;
      const w=img.naturalWidth*scale*zoom, h=img.naturalHeight*scale*zoom;
      ctx.drawImage(img,(width-w)/2,(height-h)/2,w,h);
    }
    function requestDraw(){
      if(scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(draw);
    }
    frames.forEach(img => img.addEventListener('load',requestDraw,{once:true}));
    window.addEventListener('scroll',requestDraw,{passive:true});
    window.addEventListener('resize',requestDraw);
    requestDraw();
  }

  if(primary.complete && primary.naturalWidth === 0) activateFallback();
  primary.addEventListener('error',activateFallback,{once:true});
})();
