(() => {
const cv = document.querySelector('.hero-canvas');
if (!cv) return;
const ctx = cv.getContext('2d');
const lerp = (a,b,t) => a + (b-a)*t;
const rgb = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
const mixc = (a,b,t) => `rgb(${a.map((v,i)=>Math.round(lerp(v,b[i],t))).join()})`;

const LAYERS = [6,9,10,9,6];
const GRID = [], NET_EDGES = [];
LAYERS.forEach((c,li)=>{ for(let i=0;i<c;i++)
  GRID.push([.16 + li*.68/(LAYERS.length-1), .5 + (i-(c-1)/2)*.115]); });
for(let li=0, off=0; li<LAYERS.length-1; off+=LAYERS[li], li++)
  for(let i=0;i<LAYERS[li];i++) for(let j=0;j<LAYERS[li+1];j++)
    if((i*7 + j*3 + li) % 2) NET_EDGES.push([off+i, off+LAYERS[li]+j]);

let W = 0, H = 0, dpr = 1;
function fit(){
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = cv.clientWidth; H = cv.clientHeight;
  cv.width = Math.round(W*dpr); cv.height = Math.round(H*dpr);
}

function draw(){
  const css = getComputedStyle(document.documentElement);
  const tok = n => rgb(css.getPropertyValue(n).trim());
  const mute = tok('--mute');
  const net = mixc(tok('--dec'), mute, .3), dot = `rgb(${mute})`;
  const side = Math.min(W,H)*.92, ox = (W-side)/2, oy = (H-side)/2;
  const P = GRID.map(([x,y]) => [ox + x*side, oy + y*side]);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle = net; ctx.lineWidth = 1;
  ctx.beginPath();
  NET_EDGES.forEach(([a,b]) => { ctx.moveTo(P[a][0],P[a][1]); ctx.lineTo(P[b][0],P[b][1]); });
  ctx.stroke();
  ctx.fillStyle = dot;
  P.forEach(([x,y]) => { ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill(); });
}

const redraw = () => { fit(); draw(); };
new ResizeObserver(redraw).observe(cv);
new MutationObserver(draw).observe(document.documentElement, {attributes:true, attributeFilter:['data-theme']});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
redraw();
})();
