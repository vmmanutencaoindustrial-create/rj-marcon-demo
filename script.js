/* RJ Marcon — luxo editorial · Never Settle Digital */
(function(){
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  gsap.registerPlugin(ScrollTrigger);
  if(!reduce) gsap.set(".hero-title .ln>span",{yPercent:110});

  /* PRELOADER */
  var pre=document.getElementById("pre"), preBar=document.getElementById("preBar"), n=0;
  document.body.classList.add("lock");
  function endPre(){ pre.classList.add("done"); document.body.classList.remove("lock"); playHero(); }
  var pt=setInterval(function(){ n+=Math.random()*14+7; if(n>=100){n=100;clearInterval(pt);setTimeout(endPre,420);} preBar.style.width=n+"%"; },95);

  /* LENIS */
  var lenis;
  if(!reduce && window.Lenis){
    lenis=new Lenis({lerp:.06,wheelMultiplier:.92,smoothWheel:true});
    lenis.on("scroll",ScrollTrigger.update);
    gsap.ticker.add(function(t){lenis.raf(t*1000);});
    gsap.ticker.lagSmoothing(0);
  }
  function goTo(t){ if(lenis)lenis.scrollTo(t,{offset:-10}); else document.querySelector(t).scrollIntoView({behavior:"smooth"}); }
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener("click",function(e){var id=a.getAttribute("href");if(id.length>1){e.preventDefault();goTo(id);closeMenu();}});
  });

  /* NAV */
  var nav=document.getElementById("nav");
  ScrollTrigger.create({start:50,end:"max",onUpdate:function(s){nav.classList.toggle("solid",s.scroll()>50);}});
  var burger=document.getElementById("burger"), navLinks=document.getElementById("navLinks");
  function closeMenu(){navLinks.classList.remove("open");}
  burger.addEventListener("click",function(){navLinks.classList.toggle("open");});

  /* PROGRESS */
  var bar=document.getElementById("scrollProgress");
  ScrollTrigger.create({start:0,end:"max",onUpdate:function(s){bar.style.width=(s.progress*100)+"%";}});

  /* CURSOR + MAGNETIC */
  if(!reduce && matchMedia("(hover:hover)").matches){
    var cur=document.getElementById("cursor"), curT=document.getElementById("cursorText"), cx=innerWidth/2, cy=innerHeight/2, tx=cx, ty=cy;
    addEventListener("mousemove",function(e){tx=e.clientX;ty=e.clientY;});
    (function loop(){cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;cur.style.transform="translate("+cx+"px,"+cy+"px) translate(-50%,-50%)";requestAnimationFrame(loop);})();
    document.querySelectorAll("a,button,input,[data-magnetic]").forEach(function(el){
      el.addEventListener("mouseenter",function(){cur.classList.add("hover");});
      el.addEventListener("mouseleave",function(){cur.classList.remove("hover");});
    });
    document.querySelectorAll("[data-cursor]").forEach(function(el){
      el.addEventListener("mouseenter",function(){curT.textContent=el.getAttribute("data-cursor");cur.classList.add("labeled");cur.classList.remove("hover");});
      el.addEventListener("mouseleave",function(){curT.textContent="";cur.classList.remove("labeled");});
    });
    document.querySelectorAll("[data-magnetic]").forEach(function(el){
      el.addEventListener("mousemove",function(e){var r=el.getBoundingClientRect();gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.28,y:(e.clientY-r.top-r.height/2)*.4,duration:.5});});
      el.addEventListener("mouseleave",function(){gsap.to(el,{x:0,y:0,duration:.6,ease:"elastic.out(1,.4)"});});
    });
  }

  /* LINE-MASK headings */
  document.querySelectorAll(".reveal-lines").forEach(function(h){
    var html=h.innerHTML;
    h.innerHTML='<span class="line-mask"><span class="line-inner">'+html+'</span></span>';
    var inner=h.querySelector(".line-inner");
    if(reduce) return;
    gsap.set(inner,{yPercent:105});
    ScrollTrigger.create({trigger:h,start:"top 90%",once:true,onEnter:function(){gsap.to(inner,{yPercent:0,duration:1.1,ease:"expo.out"});}});
  });

  /* HERO intro */
  function playHero(){
    var tl=gsap.timeline();
    tl.fromTo(".hero-title .ln>span",{yPercent:110},{yPercent:0,duration:1.2,stagger:.12,ease:"expo.out"})
      .to(".hero-eyebrow",{opacity:1,duration:.8},"-=1")
      .to(".hero-sub",{opacity:1,duration:.8},"-=.7");
    if(!reduce) gsap.to(".hero-video",{yPercent:8,ease:"none",scrollTrigger:{trigger:"#hero",start:"top top",end:"bottom top",scrub:true}});
  }

  /* STATEMENT word reveal */
  (function statement(){
    var el=document.getElementById("statementText"); if(!el) return;
    var words=el.textContent.trim().split(/\s+/);
    el.innerHTML=words.map(function(w){return '<span class="w">'+w+'</span>';}).join(" ");
    var ws=el.querySelectorAll(".w");
    if(reduce){ws.forEach(function(s){s.classList.add("on");});return;}
    ScrollTrigger.create({trigger:"#statement",start:"top 75%",end:"bottom 70%",scrub:.4,
      onUpdate:function(s){var c=Math.ceil(s.progress*ws.length);ws.forEach(function(sp,k){sp.classList.toggle("on",k<c);});}});
  })();

  /* SCENES */
  if(!reduce) gsap.utils.toArray(".scene").forEach(function(sc){
    var clip=sc.querySelector(".scene-img"), img=sc.querySelector(".scene-img img"), cap=sc.querySelector(".scene-cap");
    gsap.fromTo(img,{yPercent:-7},{yPercent:7,ease:"none",scrollTrigger:{trigger:sc,start:"top bottom",end:"bottom top",scrub:true}});
    gsap.fromTo(clip,{clipPath:"inset(0 0 100% 0)"},{clipPath:"inset(0 0 0% 0)",ease:"none",scrollTrigger:{trigger:sc,start:"top 95%",end:"top 40%",scrub:.5}});
    gsap.from(cap,{y:50,opacity:0,duration:1.1,ease:"power3.out",scrollTrigger:{trigger:sc,start:"top 60%"}});
  });

  /* generic reveal */
  gsap.utils.toArray(".reveal").forEach(function(el){
    ScrollTrigger.create({trigger:el,start:"top 88%",onEnter:function(){el.classList.add("in");}});
  });

  /* PROJETOS — preview flutuante */
  if(!reduce && matchMedia("(hover:hover)").matches){
    var px=innerWidth/2, py=innerHeight/2;
    addEventListener("mousemove",function(e){px=e.clientX;py=e.clientY;});
    document.querySelectorAll(".proj").forEach(function(p){
      var media=p.querySelector(".proj-media");
      var raf;
      function follow(){media.style.left=px+"px";media.style.top=py+"px";raf=requestAnimationFrame(follow);}
      p.addEventListener("mouseenter",function(){p.classList.add("show");follow();});
      p.addEventListener("mouseleave",function(){p.classList.remove("show");cancelAnimationFrame(raf);});
    });
  }

  /* FORM */
  var form=document.getElementById("leadForm"), note=document.getElementById("formNote");
  if(form) form.addEventListener("submit",function(e){
    e.preventDefault();
    var nome=document.getElementById("nome").value.trim();
    note.textContent="Recebido"+(nome?", "+nome.split(" ")[0]:"")+"! Retornamos no mesmo dia útil. ✓";
    note.classList.add("ok"); form.reset();
  });

  window.addEventListener("load",function(){ScrollTrigger.refresh();});
})();
