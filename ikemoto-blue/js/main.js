    (function () {
      "use strict";
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Hero carousel — Ken Burns cross-fade between 3 shots
      (function () {
        var slides = [].slice.call(document.querySelectorAll(".hero-carousel .slide"));
        var dots = [].slice.call(document.querySelectorAll(".hero-dots .dot"));
        if (slides.length < 2) return;
        var i = 0, timer = null;
        function show(n) {
          n = (n + slides.length) % slides.length;
          slides[i].classList.remove("is-active"); if (dots[i]) dots[i].classList.remove("is-active");
          i = n;
          slides[i].classList.add("is-active"); if (dots[i]) dots[i].classList.add("is-active");
        }
        function start() { if (reduce) return; stop(); timer = setInterval(function () { show(i + 1); }, 5000); }
        function stop() { if (timer) { clearInterval(timer); timer = null; } }
        dots.forEach(function (d, idx) { d.addEventListener("click", function () { show(idx); start(); }); });
        start();
        document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
      })();

      var header = document.getElementById("site-header");
      function onScroll() { header.classList.toggle("scrolled", window.scrollY > 60); }
      window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

      var burger = document.getElementById("hamburger");
      var mnav = document.getElementById("mobilenav");
      function setNav(open) {
        mnav.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      }
      burger.addEventListener("click", function () { setNav(!mnav.classList.contains("open")); });
      mnav.addEventListener("click", function (e) { if (e.target.tagName === "A") setNav(false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && mnav.classList.contains("open")) { setNav(false); burger.focus(); } });

      var revealEls = document.querySelectorAll("[data-reveal]");
      if (reduce || !("IntersectionObserver" in window)) {
        revealEls.forEach(function (el) { el.classList.add("in"); });
      } else {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
        }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
        revealEls.forEach(function (el) { io.observe(el); });
      }

      document.querySelectorAll(".faq-q").forEach(function (q) {
        q.addEventListener("click", function () {
          var expanded = q.getAttribute("aria-expanded") === "true";
          q.setAttribute("aria-expanded", expanded ? "false" : "true");
          q.nextElementSibling.classList.toggle("open", !expanded);
        });
      });
    })();
    document.addEventListener("DOMContentLoaded", function () {
      // Portfolio: category filter + pagination + category-aware lightbox
      // Items per page match the column count so each page is exactly one row
      function perPage() { var w = window.innerWidth; if (w <= 700) return 1; if (w <= 1100) return 3; return 4; }
      var PER = perPage();
      var allItems = [].slice.call(document.querySelectorAll('.gallery2 .gitem'));
      var tabs = [].slice.call(document.querySelectorAll('.pf-tab'));
      var pager = document.getElementById('pfPager');
      var lb = document.getElementById('lightbox');
      if (!allItems.length || !lb) return;
      var lbImg = document.getElementById('lbImg'), lbCap = document.getElementById('lbCap'), lbCount = document.getElementById('lbCount');
      var filter = 'all', page = 0, filtered = allItems.slice(), li = 0;
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Ikemoto-style scroll reveal: cards fade/drift up as they enter the viewport
      var io = (!reduce && 'IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('show'); io.unobserve(en.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }) : null;
      function reveal(items) {
        if (!io) { items.forEach(function (it) { it.classList.add('show'); }); return; }
        items.forEach(function (it, idx) { it.style.transitionDelay = (idx % 4) * 65 + 'ms'; io.observe(it); });
      }

      function matches(it) { return filter === 'all' || it.getAttribute('data-cat') === filter; }
      function render() {
        PER = perPage();
        filtered = allItems.filter(matches);
        var pages = Math.max(1, Math.ceil(filtered.length / PER));
        if (page >= pages) page = 0;
        allItems.forEach(function (it) { it.classList.add('hide'); it.classList.remove('show'); it.style.transitionDelay = ''; if (io) io.unobserve(it); });
        var pageItems = filtered.slice(page * PER, page * PER + PER);
        pageItems.forEach(function (it) { it.classList.remove('hide'); });
        void document.body.offsetWidth; // force reflow so the reveal transition replays
        reveal(pageItems);
        renderPager(pages);
      }

      // Re-render when the responsive per-page count changes (column breakpoints)
      window.addEventListener('resize', function () { if (perPage() !== PER) { page = 0; render(); } });

      function renderPager(pages) {
        if (!pager) return;
        pager.innerHTML = '';
        if (pages <= 1) { pager.style.display = 'none'; return; }
        pager.style.display = '';
        function btn(label, go, opts) {
          opts = opts || {};
          var b = document.createElement('button'); b.type = 'button';
          b.className = 'pf-page' + (opts.active ? ' is-active' : '') + (opts.nav ? ' pf-nav' : '');
          b.textContent = label; if (opts.disabled) b.disabled = true;
          if (!opts.disabled && go != null) b.addEventListener('click', function () { page = go; render(); scrollUp(); });
          return b;
        }
        function gap() { var s = document.createElement('span'); s.className = 'pf-gap'; s.textContent = '…'; return s; }
        pager.appendChild(btn('‹', page - 1, { nav: true, disabled: page === 0 }));
        // Windowed page list: first, last, current ±1, with ellipsis between
        var win = [], seen = {};
        [0, pages - 1, page - 1, page, page + 1].forEach(function (p) { if (p >= 0 && p < pages && !seen[p]) { seen[p] = 1; win.push(p); } });
        win.sort(function (a, b) { return a - b; });
        var prev = null;
        win.forEach(function (p) {
          if (prev !== null && p - prev > 1) pager.appendChild(gap());
          pager.appendChild(btn(String(p + 1), p, { active: p === page }));
          prev = p;
        });
        pager.appendChild(btn('›', page + 1, { nav: true, disabled: page === pages - 1 }));
      }
      function scrollUp() { var t = document.querySelector('.pf-tabs'); if (t) { window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' }); } }

      tabs.forEach(function (t) { t.addEventListener('click', function () {
        tabs.forEach(function (x) { x.classList.remove('is-active'); }); t.classList.add('is-active');
        filter = t.getAttribute('data-filter'); page = 0; render();
      }); });

      // Category-aware lightbox (cycles within the active filter)
      function lbList() { return filtered.map(function (it) { var im = it.querySelector('img'); var h = it.querySelector('.gtitle'); return { src: im.getAttribute('src'), cap: h ? h.textContent : (im.getAttribute('alt') || '') }; }); }
      var data = [];
      function show(n) { data = lbList(); if (!data.length) return; li = (n + data.length) % data.length; lbImg.setAttribute('src', data[li].src); lbImg.setAttribute('alt', data[li].cap); lbCap.textContent = data[li].cap; lbCount.textContent = (li + 1) + ' / ' + data.length; }
      function open(it) { data = lbList(); var idx = filtered.indexOf(it); show(idx < 0 ? 0 : idx); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
      function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }
      allItems.forEach(function (it) { it.setAttribute('tabindex', '0'); it.addEventListener('click', function (e) { e.preventDefault(); open(it); }); it.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(it); } }); });
      document.getElementById('lbClose').addEventListener('click', close);
      document.getElementById('lbPrev').addEventListener('click', function () { show(li - 1); });
      document.getElementById('lbNext').addEventListener('click', function () { show(li + 1); });
      lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
      document.addEventListener('keydown', function (e) { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') show(li - 1); else if (e.key === 'ArrowRight') show(li + 1); });

      render();
    });
  document.addEventListener("DOMContentLoaded",function(){
    var car=document.getElementById('tcar');
    if(car){
      var cprev=document.getElementById('tcarPrev'),cnext=document.getElementById('tcarNext');
      function cardPos(c){return c.getBoundingClientRect().left-car.getBoundingClientRect().left+car.scrollLeft;}
      function step(dir){
        var cards=[].slice.call(car.querySelectorAll('.tcard'));if(!cards.length)return;
        var x=car.scrollLeft,cur=0,best=1e9;
        cards.forEach(function(c,i){var d=Math.abs(cardPos(c)-x);if(d<best){best=d;cur=i;}});
        var ni=Math.max(0,Math.min(cards.length-1,cur+dir));
        car.scrollTo({left:cardPos(cards[ni]),behavior:'smooth'});
      }
      if(cprev)cprev.addEventListener('click',function(){step(-1);});
      if(cnext)cnext.addEventListener('click',function(){step(1);});
    }
    var photos=[].slice.call(document.querySelectorAll('[data-tlb]'));
    var tlb=document.getElementById('tlightbox');
    if(photos.length&&tlb){
      var img=document.getElementById('tlbImg'),txt=document.getElementById('tlbText'),who=document.getElementById('tlbWho'),cnt=document.getElementById('tlbCount');
      var data=photos.map(function(p){var card=p.closest('.tcard');return{src:card.querySelector('img').getAttribute('src'),text:card.querySelector('.ttext').textContent.trim(),who:card.querySelector('.twho').innerHTML};});
      var i=0;
      function tshow(n){i=(n+data.length)%data.length;img.setAttribute('src',data[i].src);txt.textContent=data[i].text;who.innerHTML=data[i].who;cnt.textContent=(i+1)+' / '+data.length;}
      function topen(n){tshow(n);tlb.classList.add('open');document.body.style.overflow='hidden';}
      function tclose(){tlb.classList.remove('open');document.body.style.overflow='';}
      photos.forEach(function(p,n){p.addEventListener('click',function(){topen(n);});});
      var tall=document.getElementById('tcarAll');if(tall)tall.addEventListener('click',function(){topen(0);});
      document.getElementById('tlbClose').addEventListener('click',tclose);
      document.getElementById('tlbPrev').addEventListener('click',function(){tshow(i-1);});
      document.getElementById('tlbNext').addEventListener('click',function(){tshow(i+1);});
      tlb.addEventListener('click',function(e){if(e.target===tlb)tclose();});
      document.addEventListener('keydown',function(e){if(!tlb.classList.contains('open'))return;if(e.key==='Escape')tclose();else if(e.key==='ArrowLeft')tshow(i-1);else if(e.key==='ArrowRight')tshow(i+1);});
    }
  });
  document.addEventListener("DOMContentLoaded",function(){
    var gtabs=[].slice.call(document.querySelectorAll('.gtab'));
    var gpanels=[].slice.call(document.querySelectorAll('.gpanel'));
    if(!gtabs.length)return;
    gtabs.forEach(function(t){t.addEventListener('click',function(){
      var g=t.getAttribute('data-g');
      gtabs.forEach(function(x){x.classList.toggle('is-active',x===t);});
      gpanels.forEach(function(p){p.classList.toggle('is-active',p.getAttribute('data-g')===g);});
    });});
  });
  
