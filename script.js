const CONFIG = {
  name: "Dashu",
  from: "Your favourite son Naod Dagnachew",
  sub: "Another year around the sun, and still the best dad there is.",
  wish: "Wishing you a year full of success, joy and every one of your wishes coming true.",
  reasons: [
    "You taught me how to be brave and how to be kind.",
    "You always have time for me, no matter how busy you are.",
    "Your jokes are terrible and you only teklilo megures.",
    "You're agressive when it comes to my career and hobbies, Which played a huge role in shaping the paths I'm taking right now."
  ],
  closing: "Happy birthday, Dashu. I love you."
};

const $ = id => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const COLORS = ["#e63946","#ffc857","#7ee0c3","#ff8a6b","#fff6e0","#8fa8ff"];

// Title: the single page-load moment
const t = $("title");
let d = 0;
function addWord(word, cls){
  const w = document.createElement("span");
  w.style.display = "inline-block";
  if (cls) w.className = cls;
  [...word].forEach(ch => {
    const s = document.createElement("span");
    s.className = "l"; s.textContent = ch; s.style.animationDelay = (d++ * 0.06) + "s";
    w.appendChild(s);
  });
  t.appendChild(w); t.appendChild(document.createTextNode(" "));
}
addWord("Happy"); addWord("Birthday,"); addWord(CONFIG.name + "!", "name");
$("sub").textContent = CONFIG.sub;
$("closing").textContent = CONFIG.closing;
$("from").textContent = "With love, " + CONFIG.from;
document.title = "Happy Birthday, " + CONFIG.name;
CONFIG.reasons.forEach(r => { const li = document.createElement("li"); li.textContent = r; $("why").appendChild(li); });

// Stars
for (let i = 0; i < 60; i++){
  const s = document.createElement("i");
  s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s`;
  $("stars").appendChild(s);
}

// Balloons
function balloon(){
  const b = document.createElement("div");
  b.className = "b";
  const c = COLORS[Math.floor(Math.random()*COLORS.length)];
  const sz = 0.7 + Math.random()*0.7;
  b.style.cssText = `left:${Math.random()*95}%;background:radial-gradient(circle at 35% 30%,#fff8,${c} 55%);` +
    `animation-duration:${9 + Math.random()*9}s;animation-delay:${-Math.random()*12}s;scale:${sz}`;
  $("balloons").appendChild(b);
  return b;
}
for (let i = 0; i < 14; i++) balloon();

// Candles
const NS = "http://www.w3.org/2000/svg";
const candles = [90,120,150,180,210];
let lit = candles.length;
candles.forEach((x, i) => {
  const g = document.createElementNS(NS, "g");
  g.innerHTML = `
    <rect x="${x-5}" y="72" width="10" height="46" rx="2" fill="${COLORS[i%COLORS.length]}"/>
    <rect x="${x-5}" y="82" width="10" height="5" fill="#fff6e0" opacity=".6"/>
    <circle class="glow" cx="${x}" cy="56" r="20" fill="#ffc857"/>
    <g class="flame" tabindex="0" role="button" aria-label="Blow out candle ${i+1}">
      <path d="M${x} 38c9 10 8 20 0 28-8-8-9-18 0-28z" fill="#ffc857"/>
      <path d="M${x} 48c4 5 4 10 0 14-4-4-4-9 0-14z" fill="#fff6e0"/>
    </g>
    <path class="smoke" d="M${x} 50q-6-10 0-18t0-14" stroke="#fff6e0" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  $("candles").appendChild(g);
  const f = g.querySelector(".flame");
  const out = () => blowOut(g, f);
  f.addEventListener("click", out);
  f.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " "){ e.preventDefault(); out(); } });
});

function blowOut(g, f){
  if (f.classList.contains("out")) return;
  f.classList.add("out");
  g.querySelector(".glow").style.opacity = 0;
  g.querySelector(".smoke").classList.add("on");
  if (--lit === 0) celebrate();
}
$("blow").addEventListener("click", () => {
  [...$("candles").children].forEach((g, i) => setTimeout(() => blowOut(g, g.querySelector(".flame")), i * 120));
});

// Confetti
const cv = $("fx"), ctx = cv.getContext("2d");
let parts = [], running = false;
function size(){ cv.width = innerWidth; cv.height = innerHeight; }
addEventListener("resize", size); size();
function burst(n, x, y){
  for (let i = 0; i < n; i++){
    const a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 9;
    parts.push({x, y, vx: Math.cos(a)*v, vy: Math.sin(a)*v - 6, w: 6 + Math.random()*6, h: 4 + Math.random()*5,
      r: Math.random()*6, vr: (Math.random()-.5)*.4, c: COLORS[Math.floor(Math.random()*COLORS.length)], life: 1});
  }
  if (!running){ running = true; requestAnimationFrame(tick); }
}
function tick(){
  ctx.clearRect(0, 0, cv.width, cv.height);
  parts = parts.filter(p => p.life > 0 && p.y < cv.height + 20);
  parts.forEach(p => {
    p.vy += .22; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= .004;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = Math.max(p.life, 0);
    ctx.fillStyle = p.c; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h); ctx.restore();
  });
  if (parts.length) requestAnimationFrame(tick); else running = false;
}
function celebrate(){
  $("msg").textContent = CONFIG.wish;
  if (reduce) return;
  burst(160, innerWidth/2, innerHeight*0.55);
  setTimeout(() => burst(100, innerWidth*0.2, innerHeight*0.6), 300);
  setTimeout(() => burst(100, innerWidth*0.8, innerHeight*0.6), 550);
  for (let i = 0; i < 10; i++) balloon();
}
