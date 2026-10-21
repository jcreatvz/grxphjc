// TBX — tube text engine, ported verbatim from John's tbx-tube-text skill
// (assets/tbx.html, his recreation of Codrops "3D Text Animation on Scroll" demo 3).
//
// Untouched on purpose: the arc-length solver, the glyph wrapping and the measuring rig took
// several passes to get right in the original and the failure modes are not obvious. The only
// changes here are the module wrapper and the typing escape hatches — no maths was edited.
// Reference: grxphjc-skill/references/tbx/ (SKILL.md, geometry.md, presets.md).
/* eslint-disable */
// @ts-nocheck

var TBX_SAMPLES = {
  svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
       '<path d="M50 4 60 38 94 28 72 54 97 74 63 72 70 96 50 72 30 96 37 72 3 74 28 54 6 28 40 38Z"/></svg>',
  gif: 'data:image/gif;base64,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',
  lottie: {"v":"5.7.4","fr":30,"ip":0,"op":60,"w":100,"h":100,"nm":"plus","ddd":0,"assets":[],"layers":[
    {"ddd":0,"ind":1,"ty":4,"nm":"plus","sr":1,"ks":{
      "o":{"a":0,"k":100},
      "r":{"a":1,"k":[
        {"t":0,"s":[0],"i":{"x":[0.33],"y":[1]},"o":{"x":[0.67],"y":[0]}},
        {"t":60,"s":[90]}]},
      "p":{"a":0,"k":[50,50,0]},
      "a":{"a":0,"k":[0,0,0]},
      "s":{"a":0,"k":[100,100,100]}},
     "ao":0,"ip":0,"op":60,"st":0,"bm":0,
     "shapes":[{"ty":"gr","nm":"g","it":[
       {"ty":"rc","d":1,"s":{"a":0,"k":[76,20]},"p":{"a":0,"k":[0,0]},"r":{"a":0,"k":3}},
       {"ty":"rc","d":1,"s":{"a":0,"k":[20,76]},"p":{"a":0,"k":[0,0]},"r":{"a":0,"k":3}},
       {"ty":"fl","c":{"a":0,"k":[0.824,0.196,0.208,1]},"o":{"a":0,"k":100}},
       {"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100}}
     ]}]}]}
};

var TBX = (function(){
  var lottieLoader = null;
  function loadLottie(){
    if (window.lottie) return Promise.resolve(window.lottie);
    if (!lottieLoader){
      lottieLoader = new Promise(function(resolve, reject){
        var s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
        s.onload = function(){ resolve(window.lottie); };
        s.onerror = function(){ reject(new Error('lottie-web failed to load')); };
        document.head.appendChild(s);
      });
    }
    return lottieLoader;
  }
  function clamp(v, a, b){ return v < a ? a : v > b ? b : v; }
  var DEG = 180 / Math.PI;
  var HARD_WRAP = 100;   // degrees — above this, wrapping is not optional

  function mount(section, config){
    var ring = section.querySelector('.tbx__ring');
    var srText = section.querySelector('.tbx__sr');
    var meas = document.createElement('div');
    meas.className = 'tbx__measure';
    meas.setAttribute('aria-hidden','true');
    section.appendChild(meas);

    var segs = [];        // measured items in ring order
    var atoms = [];       // positioned DOM nodes
    var players = [];
    var divAspect = 1;    // divider width ÷ height, refined once art loads
    var signature = '';
    var report = {};
    var onFit = null;

    var spin = 0, target = 0, drift = 0, radius = 0;
    var lastT = 0, running = false, visible = true;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- divider construction ---------- */
    function makeDivider(){
      var d = config.divider;
      var el = document.createElement('span');
      el.className = 'tbx__div';
      el.setAttribute('aria-hidden','true');

      if (d.mode === 'text'){
        el.classList.add('tbx__div--text');
        el.textContent = d.text || '+';
      } else if (d.mode === 'svg'){
        el.innerHTML = d.svg || TBX_SAMPLES.svg;
      } else if (d.mode === 'image' || d.mode === 'gif'){
        var img = document.createElement('img');
        img.src = d.src || (d.mode === 'gif' ? TBX_SAMPLES.gif : '');
        img.alt = ''; img.decoding = 'async';
        el.appendChild(img);
      } else if (d.mode === 'lottie'){
        el.classList.add('tbx__div--lottie');
        var host = document.createElement('div');
        el.appendChild(host);
        loadLottie().then(function(lottie){
          var opts = { container: host, renderer: 'svg', loop: true, autoplay: !reduced };
          if (d.lottieSrc) opts.path = d.lottieSrc;
          else opts.animationData = JSON.parse(JSON.stringify(d.lottieData || TBX_SAMPLES.lottie));
          try { players.push(lottie.loadAnimation(opts)); } catch(e){}
        }).catch(function(){});
      }
      return el;
    }

    /* ---------- divider aspect ratio, so its width joins the budget ---------- */
    function resolveAspect(){
      var d = config.divider;
      if (d.mode === 'none' || d.mode === 'text'){ divAspect = 1; return; }

      if (d.mode === 'svg'){
        var m = (d.svg || TBX_SAMPLES.svg).match(/viewBox\s*=\s*["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)/i);
        divAspect = m ? (parseFloat(m[1]) / parseFloat(m[2])) : 1;
        return;
      }
      if (d.mode === 'image' || d.mode === 'gif'){
        divAspect = 1;
        var probe = new Image();
        probe.onload = function(){
          if (!probe.naturalHeight) return;
          var a = probe.naturalWidth / probe.naturalHeight;
          if (Math.abs(a - divAspect) > 0.01){ divAspect = a; layout(); }
        };
        probe.src = d.src || (d.mode === 'gif' ? TBX_SAMPLES.gif : '');
        return;
      }
      if (d.mode === 'lottie'){
        var data = d.lottieSrc ? null : (d.lottieData || TBX_SAMPLES.lottie);
        divAspect = (data && data.w && data.h) ? data.w / data.h : 1;
        section.style.setProperty('--tbx-da', divAspect);
      }
    }

    /* ---------- measuring ---------- */
    function measureStrings(list){
      meas.textContent = '';
      var spans = list.map(function(s){
        var el = document.createElement('span');
        el.textContent = s;
        meas.appendChild(el);
        return el;
      });
      var out = spans.map(function(el){ return el.getBoundingClientRect().width; });
      meas.textContent = '';
      return out;
    }

    /* ---------- build the ordered list of items ---------- */
    function buildSegments(){
      var d = config.divider, f = config.fit, t = config.tube;
      var hasDiv = d.mode !== 'none';
      var words = config.words.map(String).filter(function(w){ return w.trim() !== ''; });
      if (!words.length) words = ['Tube'];

      segs = [];
      for (var r = 0; r < Math.max(1, t.repeat); r++){
        for (var i = 0; i < words.length; i++){
          segs.push({ kind:'word', text: words[i] });
          if (hasDiv) segs.push({ kind:'div' });
        }
      }
      if (!hasDiv && segs.length < 2) segs.push({ kind:'word', text: words[0] });

      /* gaps: 'inline' pulls each divider toward the word before it */
      segs.forEach(function(s, i){
        var prev = segs[(i - 1 + segs.length) % segs.length];
        s.gapEm = (d.placement === 'inline' && s.kind === 'div' && prev.kind === 'word')
          ? f.gapTight : f.gap;
      });

      srText.textContent = words.join(hasDiv && d.mode === 'text' ? ' ' + (d.text || '+') + ' ' : ', ');
    }

    /* ---------- measure every item at the stylesheet's own size ---------- */
    function measureSegments(){
      section.style.removeProperty('--tbx-size');
      section.style.setProperty('--tbx-squeeze', 1);
      var F0 = parseFloat(getComputedStyle(meas).fontSize) || 48;

      var strings = [], map = [];
      segs.forEach(function(s){
        if (s.kind !== 'word') return;
        s.chars = Array.prototype.slice.call(s.text);
        map.push({ seg:s, start:strings.length, count:s.chars.length });
        strings = strings.concat(s.chars);
      });
      var widths = strings.length ? measureStrings(strings) : [];

      map.forEach(function(m){
        m.seg.charW = widths.slice(m.start, m.start + m.count);
        m.seg.natural = m.seg.charW.reduce(function(a, b){ return a + b; }, 0);
      });

      var dw = config.divider.mode === 'text'
        ? measureStrings([config.divider.text || '+'])[0] * config.divider.scale
        : divAspect * config.divider.scale * F0;

      segs.forEach(function(s){ if (s.kind === 'div') s.natural = dw; });
      return F0;
    }

    /* ---------- the solver ---------- */
    function solve(F0){
      var f = config.fit, t = config.tube;
      var r0 = Math.min(window.innerWidth, window.innerHeight) * t.radius;

      var St = 0, Sd = 0, Sg = 0;
      segs.forEach(function(s){
        if (s.kind === 'word') St += s.natural; else Sd += s.natural;
        Sg += s.gapEm * F0;
      });

      var F = F0, s = 1, r = r0;
      var avail = function(){ return 2 * Math.PI * r * f.safety; };
      var need  = function(){ return (F / F0) * (St * s + Sd + Sg); };
      var stage = 'natural';

      if (need() > avail() && St > 0){
        s = clamp(((avail() * F0 / F) - Sd - Sg) / St, f.minSqueeze, 1);
        stage = 'squeezed';
      }
      if (need() > avail()){
        var K = St * s + Sd + Sg;
        F = clamp(avail() * F0 / K, f.minFont, F0);
        stage = 'resized';
      }
      if (need() > avail()){
        r = Math.min(r0 * f.growRadius, need() / (2 * Math.PI * f.safety));
        stage = 'grown';
      }
      if (need() > avail()){
        var fixed = (F / F0) * (Sd + Sg);
        if (fixed > avail() * 0.8){
          F *= avail() * 0.8 / fixed;
          fixed = (F / F0) * (Sd + Sg);
        }
        s = St > 0 ? Math.max(0.04, (avail() - fixed) / ((F / F0) * St)) : s;
        stage = 'distorted';
      }

      report = {
        stage: stage, font: F, base: F0, squeeze: s,
        radius: r, baseRadius: r0,
        used: need() / (2 * Math.PI * r), cells: segs.length
      };
      return report;
    }

    /* ---------- place everything on the ring ---------- */
    function layout(){
      if (!segs.length) return;
      var F0 = measureSegments();
      var fit = solve(F0);
      var f = config.fit, t = config.tube;
      var k = fit.font / F0;

      section.style.setProperty('--tbx-size', fit.font.toFixed(2) + 'px');
      section.style.setProperty('--tbx-squeeze', fit.squeeze.toFixed(4));
      section.style.setProperty('--tbx-div-scale', config.divider.scale);
      section.style.setProperty('--tbx-accent', config.divider.color);
      section.dataset.backface = t.backface;
      section.style.setProperty('--tbx-perspective',
        (t.perspective * (fit.radius / fit.baseRadius)).toFixed(0) + 'px');
      radius = fit.radius;

      /* final widths, then angles in proportion */
      var totalArc = 0;
      segs.forEach(function(s){
        s.w = s.natural * k * (s.kind === 'word' ? fit.squeeze : 1);
        s.gapPx = s.gapEm * fit.font;
        s.theta = s.w / radius;
        totalArc += s.theta + s.gapPx / radius;
      });
      var slack = Math.max(0, 2 * Math.PI - totalArc) / segs.length;

      /* wrap decisions drive the DOM structure */
      var sig = segs.map(function(s){
        /* past HARD_WRAP a flat chord spans more than the tube itself —
           tan(theta/2) runs away, so wrapping stops being a preference */
        var wrapped = s.kind === 'word' && (
          f.wrap === 'always' ||
          s.theta * DEG > HARD_WRAP ||
          (f.wrap === 'auto' && s.theta * DEG > f.wrapAngle));
        s.wrapped = !!wrapped;
        return (s.kind === 'word' ? s.text : '|') + (wrapped ? '~' : '');
      }).join('/') + '#' + config.divider.mode + config.divider.placement;

      if (sig !== signature){ emit(); signature = sig; }

      /* walk the ring */
      var cursor = -segs[0].theta / 2;
      var ai = 0;
      segs.forEach(function(s){
        if (s.kind === 'word' && s.wrapped){
          var acc = 0;
          for (var i = 0; i < s.chars.length; i++){
            var cw = s.charW[i] * k * fit.squeeze;
            if (s.chars[i].trim() !== ''){
              place(atoms[ai], (cursor + (acc + cw / 2) / radius) * DEG);
              ai++;
            }
            acc += cw;
          }
        } else {
          place(atoms[ai], (cursor + s.theta / 2) * DEG);
          ai++;
        }
        cursor += s.theta + s.gapPx / radius + slack;
      });

      if (onFit) onFit(fit);
      draw();
    }

    function place(atom, deg){
      if (!atom) return;
      var a = deg / DEG;
      atom.style.transform =
        'translate3d(' + (Math.sin(a) * radius).toFixed(2) + 'px, -50%, ' +
        (Math.cos(a) * radius).toFixed(2) + 'px) rotateY(' + deg.toFixed(2) + 'deg)';
      atom.dataset.deg = deg;
    }

    /* ---------- DOM, rebuilt only when the structure changes ---------- */
    function emit(){
      players.forEach(function(p){ try { p.destroy(); } catch(e){} });
      players = [];
      ring.textContent = '';
      atoms = [];

      segs.forEach(function(s){
        if (s.kind === 'div'){
          atoms.push(cell(makeDivider()));
          return;
        }
        if (!s.wrapped){
          var w = document.createElement('span');
          w.className = 'tbx__word';
          w.textContent = s.text;
          atoms.push(cell(w));
          return;
        }
        s.chars.forEach(function(ch){
          if (ch.trim() === '') return;
          var g = document.createElement('span');
          g.className = 'tbx__word';
          g.textContent = ch;
          atoms.push(cell(g));
        });
      });

      function cell(child){
        var li = document.createElement('li');
        li.className = 'tbx__cell';
        li.appendChild(child);
        ring.appendChild(li);
        return li;
      }
    }

    /* ---------- scroll ---------- */
    function progress(){
      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var span = rect.height + vh;
      return span > 0 ? clamp((vh - rect.top) / span, 0, 1) : 0;
    }

    function draw(){
      var t = config.tube;
      var rot = spin + drift;
      ring.style.transform = 'rotateZ(' + t.tilt + 'deg) rotateY(' + rot.toFixed(3) + 'deg)';
      if (t.backface !== 'fade' && !config.divider.faceCamera) return;

      atoms.forEach(function(a){
        var deg = parseFloat(a.dataset.deg) + rot;
        if (t.backface === 'fade'){
          a.style.opacity = (0.07 + ((Math.cos(deg / DEG) + 1) / 2) * 0.93).toFixed(3);
        }
        if (config.divider.faceCamera){
          var div = a.querySelector('.tbx__div');
          if (div) div.style.transform = 'rotateY(' + (-deg).toFixed(2) + 'deg)';
        }
      });
    }

    function tick(now){
      if (!running) return;
      var t = config.tube;
      var dt = lastT ? Math.min((now - lastT) / 1000, 0.1) : 0;
      lastT = now;
      target = progress() * 360 * t.turns;
      spin += (target - spin) * (reduced ? 1 : t.ease);
      if (!reduced && t.idleSpin) drift += t.idleSpin * dt;
      draw();
      requestAnimationFrame(tick);
    }
    function start(){ if (running || !visible) return; running = true; lastT = 0; requestAnimationFrame(tick); }
    function stop(){ running = false; }

    if ('IntersectionObserver' in window){
      new IntersectionObserver(function(e){
        visible = e[0].isIntersecting;
        if (visible) start(); else stop();
      }, { rootMargin:'120px 0px' }).observe(section);
    }

    var resizeTimer;
    window.addEventListener('resize', function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layout, 120);
    });

    function rebuild(){
      signature = '';
      resolveAspect();
      buildSegments();
      layout();
    }

    rebuild();
    spin = progress() * 360 * config.tube.turns;
    draw();
    start();

    /* measurement is only valid once the real face has loaded */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

    return {
      rebuild: rebuild,
      relayout: layout,
      report: function(){ return report; },
      onFit: function(fn){ onFit = fn; if (report.font) fn(report); },
      config: config
    };
  }

  return { mount: mount, loadLottie: loadLottie };
})();

// Presets from the skill (TBX_DEFAULTS + the overlay each preset states).
var TBX_DEFAULTS = {
  words: ['Motion','Identity','Type','Campaign','Experimental'],
  divider: { mode:'text', placement:'slot', scale:0.7, color:'#d23235', faceCamera:false, text:'+', svg:'', src:'', lottieSrc:'', lottieData:null },
  fit: { gap:0.45, gapTight:0.16, safety:0.96, minSqueeze:0.62, minFont:22, growRadius:1.35, wrap:'auto', wrapAngle:30 },
  tube: { radius:0.4, tilt:15, turns:1, repeat:1, perspective:1000, idleSpin:0, backface:'mirror', ease:0.085 }
};
var TBX_PRESETS = {
  tube: {},
  marquee: {
    divider: { mode:'lottie', scale:0.75 },
    fit:     { gap:0.9, minSqueeze:0.66, minFont:36, growRadius:1.5, wrapAngle:8 },
    tube:    { radius:0.51, tilt:20, idleSpin:7 }
  }
};
(TBX as any).resolve = function (name: string) {
  var out = JSON.parse(JSON.stringify(TBX_DEFAULTS));
  var p = (TBX_PRESETS as any)[name];
  if (p) Object.keys(p).forEach(function (g) {
    if (g === 'words') out.words = p[g].slice(); else Object.assign(out[g], p[g]);
  });
  return out;
};

export default TBX;
export { TBX_SAMPLES };
