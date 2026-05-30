/* RJ Marcon Construções — demo Never Settle Digital */
(function(){
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- PRELOADER ---------- */
  var pre = document.getElementById("preloader"),
      preNum = document.getElementById("preNum"),
      n = 0;
  function finishPre(){
    pre.classList.add("done");
    document.body.classList.remove("lock");
    playHero();
  }
  document.body.classList.add("lock");
  var pt = setInterval(function(){
    n += Math.random()*16+6; if(n>=100){n=100;clearInterval(pt);setTimeout(finishPre,420);}
    preNum.textContent = Math.floor(n);
  }, 90);

  /* ---------- LENIS SMOOTH SCROLL ---------- */
  var lenis;
  if(!reduce && window.Lenis){
    lenis = new Lenis({ lerp:.08, wheelMultiplier:1, smoothWheel:true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function(t){ lenis.raf(t*1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function scrollTo(target){
    if(lenis) lenis.scrollTo(target,{offset:-10});
    else document.querySelector(target).scrollIntoView({behavior:"smooth"});
  }
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener("click",function(e){
      var id=a.getAttribute("href"); if(id.length>1){e.preventDefault();scrollTo(id);closeMenu();}
    });
  });

  /* ---------- NAV ---------- */
  var nav=document.getElementById("nav");
  ScrollTrigger.create({start:60,end:99999,
    onUpdate:function(s){ nav.classList.toggle("solid", s.scroll()>60); }});
  var burger=document.getElementById("burger"), navLinks=document.getElementById("navLinks");
  function closeMenu(){navLinks.classList.remove("open");burger.classList.remove("x");}
  burger.addEventListener("click",function(){navLinks.classList.toggle("open");});

  /* ---------- SCROLL PROGRESS ---------- */
  var bar=document.getElementById("scrollProgress");
  ScrollTrigger.create({start:0,end:"max",onUpdate:function(s){bar.style.width=(s.progress*100)+"%";}});

  /* ---------- CUSTOM CURSOR + MAGNETIC ---------- */
  if(!reduce && matchMedia("(hover:hover)").matches){
    var cur=document.getElementById("cursor"), cx=innerWidth/2, cy=innerHeight/2, tx=cx, ty=cy;
    addEventListener("mousemove",function(e){tx=e.clientX;ty=e.clientY;});
    (function loop(){cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;cur.style.transform="translate("+cx+"px,"+cy+"px) translate(-50%,-50%)";requestAnimationFrame(loop);})();
    document.querySelectorAll("a,button,[data-magnetic],input,textarea").forEach(function(el){
      el.addEventListener("mouseenter",function(){cur.classList.add("hover");});
      el.addEventListener("mouseleave",function(){cur.classList.remove("hover");});
    });
    var curText=document.getElementById("cursorText");
    document.querySelectorAll("[data-cursor]").forEach(function(el){
      el.addEventListener("mouseenter",function(){curText.textContent=el.getAttribute("data-cursor");cur.classList.add("labeled");cur.classList.remove("hover");});
      el.addEventListener("mouseleave",function(){curText.textContent="";cur.classList.remove("labeled");});
    });
    document.querySelectorAll("[data-magnetic]").forEach(function(el){
      el.addEventListener("mousemove",function(e){
        var r=el.getBoundingClientRect();
        gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.3,y:(e.clientY-r.top-r.height/2)*.4,duration:.4});
      });
      el.addEventListener("mouseleave",function(){gsap.to(el,{x:0,y:0,duration:.5,ease:"elastic.out(1,.4)"});});
    });
  }

  /* ---------- HERO INTRO ---------- */
  function playHero(){
    var tl=gsap.timeline();
    tl.to(".hero-title .line>span",{y:0,duration:1.1,stagger:.12,ease:"expo.out"})
      .from(".hero-eyebrow",{opacity:0,y:20,duration:.7},"-=.8")
      .to(".hero .reveal",{opacity:1,y:0,duration:.8,stagger:.1},"-=.6");
  }
  // mouse parallax on hero
  if(!reduce){
    var sky=document.getElementById("heroVideo");
    document.getElementById("hero").addEventListener("mousemove",function(e){
      var dx=(e.clientX/innerWidth-.5), dy=(e.clientY/innerHeight-.5);
      if(sky) gsap.to(sky,{x:dx*-22,y:dy*-12,duration:.8});
      gsap.to(".hero-grid",{x:dx*18,y:dy*10,duration:.8});
    });
    if(sky) gsap.to(sky,{yPercent:6,ease:"none",scrollTrigger:{trigger:"#hero",start:"top top",end:"bottom top",scrub:true}});
  }

  /* ---------- REVEALS ---------- */
  gsap.utils.toArray(".reveal").forEach(function(el){
    if(el.closest(".hero")) return;
    ScrollTrigger.create({trigger:el,start:"top 86%",onEnter:function(){el.classList.add("in");}});
  });

  /* ---------- SIGNATURE: edifício se construindo ---------- */
  (function buildSeq(){
    var svg=document.getElementById("buildSvg"); if(!svg) return;
    var pct=document.getElementById("buildPct");
    var steps=[].slice.call(document.querySelectorAll("#buildSteps li"));
    var cols=svg.querySelectorAll(".b-col"),
        slabs=svg.querySelectorAll(".b-slab"),
        glass=svg.querySelectorAll(".b-glass"),
        found=svg.querySelector(".b-foundation"),
        roof=svg.querySelector(".b-roof"),
        crane=svg.querySelector(".b-crane"),
        hook=svg.querySelector(".b-hook"),
        cable=svg.querySelector(".b-cable");

    gsap.set([cols,slabs,roof,found],{transformBox:"fill-box",transformOrigin:"50% 100%"});
    gsap.set(glass,{transformBox:"fill-box",transformOrigin:"50% 50%"});
    if(reduce){ // static finished state
      gsap.set([cols,slabs,roof],{scaleY:1});gsap.set(found,{opacity:1,scaleY:1});gsap.set(glass,{opacity:1,scale:1});
      pct.textContent="100";steps.forEach(function(s){s.classList.add("on");});return;
    }
    gsap.set(cols,{scaleY:0}); gsap.set(slabs,{scaleY:0}); gsap.set(roof,{scaleY:0});
    gsap.set(found,{opacity:0,scaleY:0}); gsap.set(glass,{opacity:0,scale:.6});

    function setStep(i){steps.forEach(function(s,k){s.classList.toggle("on",k<=i);});}

    var tl=gsap.timeline({
      scrollTrigger:{trigger:"#buildPin",start:"top top",end:"+=2200",scrub:.6,pin:true,
        onUpdate:function(s){pct.textContent=Math.round(s.progress*100);}}
    });
    tl.to(found,{opacity:1,scaleY:1,duration:1,onStart:function(){setStep(0);}})
      .to(cols,{scaleY:1,duration:2,stagger:.15,ease:"power2.out",onStart:function(){setStep(1);}})
      .to(slabs,{scaleY:1,duration:1.6,stagger:.25,ease:"back.out(1.6)"},"-=1")
      .to(glass,{opacity:1,scale:1,duration:1.6,stagger:.06,ease:"power2.out",onStart:function(){setStep(2);}})
      .to(roof,{scaleY:1,duration:.8,onStart:function(){setStep(3);}})
      .to(cable,{attr:{y2:520},duration:1},"<")
      .to(glass,{fill:"rgba(94,155,209,.4)",stroke:"#5E9BD1",duration:1,onStart:function(){setStep(4);}})
      .to(crane,{opacity:.25,x:60,duration:1.2,ease:"power1.inOut"},"-=.4");
  })();

  /* ---------- STATS COUNTERS ---------- */
  gsap.utils.toArray(".stat .num").forEach(function(el){
    var to=+el.dataset.to;
    ScrollTrigger.create({trigger:el,start:"top 88%",once:true,onEnter:function(){
      gsap.to({v:0},{v:to,duration:1.8,ease:"power2.out",onUpdate:function(){el.textContent=Math.floor(this.targets()[0].v);}});
    }});
  });

  /* ---------- PROCESS LINE ---------- */
  var pl=document.getElementById("procLine");
  if(pl) gsap.to(pl,{width:"88%",ease:"none",scrollTrigger:{trigger:".proc-track",start:"top 80%",end:"bottom 60%",scrub:true}});

  /* ---------- WORKS: scroll horizontal pinado ---------- */
  (function works(){
    var track=document.getElementById("worksTrack"), pin=document.getElementById("worksPin");
    if(!track||!pin) return;
    var imgs=gsap.utils.toArray(".work-img img");
    if(reduce){return;}
    var dist=function(){return Math.max(0, track.scrollWidth - window.innerWidth + 40);};
    gsap.to(track,{x:function(){return -dist();},ease:"none",
      scrollTrigger:{trigger:pin,start:"top top",end:function(){return "+="+dist();},pin:true,scrub:.6,invalidateOnRefresh:true,
        onUpdate:function(s){var d=(s.progress-.5)*46;imgs.forEach(function(im){gsap.set(im,{x:d});});}}});
  })();

  /* ---------- PARALLAX genérico ---------- */
  if(!reduce) gsap.utils.toArray("[data-parallax]").forEach(function(el){
    var amt=parseFloat(el.getAttribute("data-parallax"))||60;
    gsap.to(el,{y:amt,ease:"none",scrollTrigger:{trigger:el,start:"top bottom",end:"bottom top",scrub:true}});
  });

  /* ---------- MANIFESTO: revela palavra por palavra ---------- */
  (function manifesto(){
    var el=document.getElementById("manifestoText"); if(!el) return;
    var hot={"promessa":1,"prazo":1,"orçamento":1,"retrabalho":1};
    var words=el.textContent.trim().split(/\s+/);
    el.innerHTML=words.map(function(w){
      var k=w.toLowerCase().replace(/[^a-zà-ÿ]/g,"");
      return '<span class="w'+(hot[k]?" hot":"")+'">'+w+'</span>';
    }).join(" ");
    var spans=el.querySelectorAll(".w");
    if(reduce){spans.forEach(function(s){s.classList.add("on");});return;}
    ScrollTrigger.create({trigger:"#manifesto",start:"top top",end:"bottom bottom",scrub:.4,
      onUpdate:function(s){var n=Math.ceil(s.progress*spans.length);spans.forEach(function(sp,k){sp.classList.toggle("on",k<n);});}});
  })();

  /* ---------- CINE: vídeo pinado + capítulos ---------- */
  (function cine(){
    var pin=document.getElementById("cinePin"), vid=document.getElementById("cineVideo");
    var chs=gsap.utils.toArray(".cine-ch");
    if(!pin) return;
    if(chs[0]) chs[0].classList.add("on");
    if(vid) ScrollTrigger.create({trigger:pin,start:"top 80%",end:"bottom 20%",
      onToggle:function(s){ if(s.isActive){vid.play&&vid.play();} else {vid.pause&&vid.pause();} }});
    if(reduce) return;
    ScrollTrigger.create({trigger:"#cine",start:"top top",end:"bottom bottom",scrub:.4,
      onUpdate:function(s){var i=Math.min(chs.length-1,Math.floor(s.progress*chs.length*0.999));
        chs.forEach(function(c,k){c.classList.toggle("on",k===i);});}});
  })();

  /* ---------- BG SCENE: jornada de cor ---------- */
  (function journey(){
    var bg=document.querySelector(".bgscene"); if(!bg||reduce) return;
    var scenes=[["#hero","#0b0e13"],["#obra","#0c1117"],["#manifesto","#0a0f16"],["#servicos","#0b0e13"],["#obras","#090c11"],["#cine","#07090d"],["#processo","#0b0e13"],["#sobre","#0a1016"],["#contato","#0a121a"]];
    scenes.forEach(function(p){var t=document.querySelector(p[0]); if(!t) return;
      var set=function(){gsap.to(bg,{backgroundColor:p[1],duration:1.1,overwrite:"auto"});};
      ScrollTrigger.create({trigger:t,start:"top 55%",end:"bottom 45%",onEnter:set,onEnterBack:set});
    });
  })();

  /* ---------- CURTAIN wipe ---------- */
  if(!reduce) gsap.utils.toArray(".stats").forEach(function(el){
    el.classList.add("curtain");
    ScrollTrigger.create({trigger:el,start:"top 82%",onEnter:function(){el.classList.add("wiped");}});
  });

  /* ---------- SVC CARD GLOW + TILT ---------- */
  document.querySelectorAll(".svc-card").forEach(function(c){
    c.addEventListener("mousemove",function(e){
      var r=c.getBoundingClientRect();
      c.style.setProperty("--mx",(e.clientX-r.left)+"px");
      c.style.setProperty("--my",(e.clientY-r.top)+"px");
      if(!reduce){var rx=((e.clientY-r.top)/r.height-.5)*-5,ry=((e.clientX-r.left)/r.width-.5)*5;
        gsap.to(c,{rotateX:rx,rotateY:ry,transformPerspective:800,duration:.4});}
    });
    c.addEventListener("mouseleave",function(){gsap.to(c,{rotateX:0,rotateY:0,duration:.5});});
  });

  /* ---------- FORM (demo) ---------- */
  var form=document.getElementById("leadForm"), note=document.getElementById("formNote");
  form.addEventListener("submit",function(e){
    e.preventDefault();
    var nome=document.getElementById("nome").value.trim();
    note.textContent="Recebido"+(nome?", "+nome.split(" ")[0]:"")+"! Te chamamos no mesmo dia útil. ✓";
    note.classList.add("ok"); form.reset();
  });

  // ensure layout settles after fonts
  window.addEventListener("load",function(){ScrollTrigger.refresh();});
})();
