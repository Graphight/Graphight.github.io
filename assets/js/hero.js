(() => {
const cv = document.querySelector('.hero-canvas');
if (!cv) return;
const ctx = cv.getContext('2d');
const TAU = Math.PI*2, N = 40;
const lerp = (a,b,t) => a + (b-a)*t;
const clamp = (v,a,b) => v<a?a:v>b?b:v;
const smooth = t => t*t*(3-2*t);
const d2 = (a,b) => (a[0]-b[0])**2 + (a[1]-b[1])**2;
const rgb = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
const mixc = (a,b,t) => `rgb(${a.map((v,i)=>Math.round(lerp(v,b[i],t))).join()})`;

const LAYERS = [6,9,10,9,6];
const GRID = [], NET_EDGES = [];
LAYERS.forEach((c,li)=>{ for(let i=0;i<c;i++)
  GRID.push([.16 + li*.68/(LAYERS.length-1), .5 + (i-(c-1)/2)*.8/(Math.max(...LAYERS)-1)]); });
for(let li=0, off=0; li<LAYERS.length-1; off+=LAYERS[li], li++)
  for(let i=0;i<LAYERS[li];i++) for(let j=0;j<LAYERS[li+1];j++)
    if((i*7 + j*3 + li) % 2) NET_EDGES.push([off+i, off+LAYERS[li]+j]);

function mulberry(seed){
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed>>>15, 1 | seed);
    t = t + Math.imul(t ^ t>>>7, 61 | t) ^ t;
    return ((t ^ t>>>14) >>> 0) / 4294967296; };
}
const gauss = r => (r()+r()+r()-1.5)*1.15;
const shuffle = (a,r) => { for(let i=a.length-1;i>0;i--){ const j=(r()*(i+1))|0;
  [a[i],a[j]]=[a[j],a[i]]; } return a; };
const mean = ps => [ps.reduce((s,p)=>s+p[0],0)/ps.length,
                    ps.reduce((s,p)=>s+p[1],0)/ps.length];

function hull(ps){
  if(ps.length < 3) return ps.slice();
  const s = ps.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const cr = (o,a,b) => (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0]);
  const half = arr => { const h=[];
    for(const p of arr){ while(h.length>1 && cr(h[h.length-2],h[h.length-1],p)<=0) h.pop();
      h.push(p); } h.pop(); return h; };
  return half(s).concat(half(s.reverse()));
}
const pad = (poly, k=1.13) => { const c = mean(poly);
  return poly.map(p => [c[0]+(p[0]-c[0])*k, c[1]+(p[1]-c[1])*k]); };
const outline = (g, k) => { const h = hull(g); return h.length > 2 ? pad(h, k) : null; };

function blobs(r, k){
  const cen = [];
  for(let tries=0; cen.length<k && tries<400; tries++){
    const c = [.24+r()*.52, .24+r()*.52];
    if(cen.every(o => d2(o,c) > .05 - tries*.0001)) cen.push(c);
  }
  while(cen.length<k) cen.push([.24+r()*.52, .24+r()*.52]);
  const w = Array.from({length:k},()=>.6+r()), tot = w.reduce((a,b)=>a+b);
  const label = [];
  w.forEach((v,i)=>{ const c=Math.max(3, Math.round(N*v/tot));
    for(let j=0;j<c;j++) label.push(i); });
  while(label.length > N) label.pop();
  while(label.length < N) label.push(k-1);
  shuffle(label, r);
  const sp = .05 + r()*.03;
  return label.map(l => [clamp(cen[l][0]+gauss(r)*sp,.07,.93),
                         clamp(cen[l][1]+gauss(r)*sp,.07,.93)]);
}

function build(seed){
  const r = mulberry(seed), pts = blobs(r, 3), pos = pts.map(p=>p.slice());
  const inTree = [0], rest = pts.map((_,i)=>i).slice(1), tree = [];
  while(rest.length){
    let bi=0, bj=0, bd=Infinity;
    inTree.forEach(a => rest.forEach((b,ri) => {
      const d = d2(pts[a],pts[b]); if(d<bd){ bd=d; bi=a; bj=ri; } }));
    tree.push([bi, rest[bj], bd]); inTree.push(rest[bj]); rest.splice(bj,1);
  }
  const frames = [];
  tree.forEach((_,n)=> frames.push({ pos:pos.map(p=>p.slice()), group:pts.map(()=>-1),
    links: tree.slice(0,n+1).map(e=>[e[0],e[1]]), strokes:[] }));
  const cut = tree.slice().sort((a,b)=>b[2]-a[2]).slice(0,2);
  const kept = tree.filter(e => !cut.includes(e));
  const par = pts.map((_,i)=>i), find = x => par[x]===x ? x : (par[x]=find(par[x]));
  kept.forEach(([a,b]) => { par[find(a)] = find(b); });
  const roots = [...new Set(pts.map((_,i)=>find(i)))];
  const group = pts.map((_,i)=>roots.indexOf(find(i)));
  const world = mean(pos);
  for(let s=0;s<14;s++){
    const cs = {};
    group.forEach((g,i)=>{ (cs[g] = cs[g] || []).push(pos[i]); });
    pos.forEach((p,i)=>{ const c = mean(cs[group[i]]);
      p[0] += (c[0]-world[0])*.012; p[1] += (c[1]-world[1])*.012; });
    frames.push({ pos:pos.map(p=>p.slice()), group,
      links: kept.map(e=>[e[0],e[1]]),
      strokes: Object.values(cs).map(g => outline(g)).filter(Boolean) });
  }
  return { frames, order: shuffle([0,1,2,3,4,5,6], r) };
}

function frameAt(run, u){
  const F = run.frames, f = u*(F.length-1);
  const i = Math.min(F.length-1, Math.floor(f)), j = Math.min(F.length-1, i+1);
  const t = f - i, A = F[i], B = F[j], near = t < .5 ? A : B;
  return { pos: A.pos.map((p,n)=>[lerp(p[0],B.pos[n][0],t), lerp(p[1],B.pos[n][1],t)]),
           group:near.group, links:near.links, strokes:near.strokes };
}

const LOOP = 32;
const fwd = x => ({ ph: smooth(clamp(x/2.5,0,1)),
  u: x < 2.5 ? 0 : .5*((x-2.5)/8.5) + .5*smooth((x-2.5)/8.5) });
const phase = t => t < 11 ? fwd(t) : t < 16 ? fwd(11) : t < 27 ? fwd(11-(t-16)) : fwd(0);

let W = 0, H = 0, dpr = 1, tk, run, loop = -1;
const jit = GRID.map((_,i)=>(i*2.399)%TAU);
const CLUSTER = ['--fn','--tag','--ty','--con','--str','--op','--kw'];
function tokens(){
  const css = getComputedStyle(document.documentElement);
  const tok = n => rgb(css.getPropertyValue(n).trim());
  const mute = tok('--mute');
  tk = { stone: mute, net: mixc(tok('--dec'), mute, .3), cl: CLUSTER.map(tok) };
}
function fit(){
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = cv.clientWidth; H = cv.clientHeight;
  cv.width = Math.round(W*dpr); cv.height = Math.round(H*dpr);
}

function draw(now){
  const t = now/1000, n = Math.floor(t/LOOP);
  if(n !== loop){ loop = n; run = build((Math.random()*1e6)|0); }
  const { ph, u } = phase(t % LOOP), st = frameAt(run, u);
  const colors = run.order.map(i => tk.cl[i]), stone = tk.stone;
  const side = Math.min(W,H)*.92, ox = (W-side)/2, oy = (H-side)/2, z = clamp(side/250,1,2);
  const P = st.pos.map((q,i) => [ox + lerp(GRID[i][0],q[0],ph)*side,
                                 oy + lerp(GRID[i][1],q[1],ph)*side]);
  const hue = i => st.group[i] < 0 ? stone : colors[st.group[i] % colors.length];
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,W,H);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  st.strokes.forEach(poly => {
    ctx.globalAlpha = ph*.22; ctx.lineWidth = z;
    ctx.setLineDash([3*z,4*z]);
    ctx.strokeStyle = mixc(stone, colors[0], .3);
    ctx.beginPath();
    poly.forEach((q,i) => i ? ctx.lineTo(ox+q[0]*side,oy+q[1]*side) : ctx.moveTo(ox+q[0]*side,oy+q[1]*side));
    ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
  });

  ctx.strokeStyle = tk.net;
  NET_EDGES.forEach(([a,b],k) => {
    const w = .3 + .7*Math.abs(Math.sin(now/620 + k*1.7));
    ctx.globalAlpha = ((1-ph)**1.4)*(.10+.28*w); ctx.lineWidth = (.4+1.1*w)*z;
    ctx.beginPath(); ctx.moveTo(P[a][0],P[a][1]); ctx.lineTo(P[b][0],P[b][1]); ctx.stroke();
  });

  st.links.forEach(([a,b],k) => {
    const w = .35 + .65*Math.abs(Math.sin(now/700 + k*1.9));
    ctx.globalAlpha = ph*(.16+.34*w); ctx.lineWidth = (.5+1.1*w)*z;
    ctx.strokeStyle = mixc(stone, hue(a), .85);
    ctx.beginPath(); ctx.moveTo(P[a][0],P[a][1]); ctx.lineTo(P[b][0],P[b][1]); ctx.stroke();
  });

  P.forEach(([x,y],i) => {
    const a = .5 + .5*Math.sin(now/500 + jit[i]);
    ctx.globalAlpha = .5 + .5*a;
    ctx.fillStyle = mixc(stone, hue(i), ph);
    ctx.beginPath(); ctx.arc(x, y, (1.8+1.2*a)*z, 0, TAU); ctx.fill();
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

new ResizeObserver(fit).observe(cv);
new MutationObserver(tokens).observe(document.documentElement, {attributes:true, attributeFilter:['data-theme']});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', tokens);
fit(); tokens();
requestAnimationFrame(draw);
})();
