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
