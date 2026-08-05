/* ================= M-PESA ARENA ================= */
const rnd=(a,b)=>a+Math.random()*(b-a), ri=(a,b)=>Math.floor(rnd(a,b+1));
const fmt=n=>Math.round(n).toLocaleString('en-KE'), money=n=>'KES '+fmt(n);
const pick=a=>a[ri(0,a.length-1)];
const SKIN=["#f2c79b","#e8b07e","#d69a6a","#a86b3c","#8a5a2b","#f5d0a9"];
const HAIR=["#2b2b2b","#3d2817","#1a1a1a","#4a3520","#5a3a1a"];
const SHIRT=["#e74c3c","#2980b9","#27ae60","#8e44ad","#e67e22","#16a085","#c0392b"];
const AV=["#2f9e6b","#c0392b","#8e44ad","#d3a521","#2980b9","#16a085","#e67e22","#34495e","#0e5033","#7b61ff"];
const FNAMES_M=["Brian","David","Kevin","Otieno","Samuel","Mutua","Dennis","Peter","Ali","Kamau"];
const FNAMES_F=["Wanjiru","Aisha","Faith","Grace","Amina","Njeri","Zainab","Achieng","Halima","Nasra"];
const LAST=["K.","O.","M.","N.","W.","H.","D.","A."];

/* ---- asset classes ---- */
const ICON={
 gold:`<svg viewBox="0 0 40 40" width="30" height="30"><path d="M5 27l5-9h20l-5 9z" fill="#fff" opacity=".95"/><path d="M11 17l4-6h14l-4 6z" fill="#fff" opacity=".8"/></svg>`,
 crypto:`<svg viewBox="0 0 40 40" width="30" height="30"><circle cx="20" cy="20" r="14" fill="none" stroke="#fff" stroke-width="2.5"/><text x="20" y="26" font-size="16" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial">₿</text></svg>`,
 shares:`<svg viewBox="0 0 40 40" width="30" height="30"><g stroke="#fff" stroke-width="2.4"><line x1="12" y1="8" x2="12" y2="32"/><line x1="20" y1="6" x2="20" y2="34"/><line x1="28" y1="12" x2="28" y2="28"/></g><g fill="#fff"><rect x="9" y="14" width="6" height="10" rx="1"/><rect x="17" y="11" width="6" height="16" rx="1"/><rect x="25" y="16" width="6" height="7" rx="1"/></g></svg>`,
 futures:`<svg viewBox="0 0 40 40" width="30" height="30"><polyline points="7,28 16,20 22,25 33,10" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><polyline points="26,10 33,10 33,17" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
 nse:`<svg viewBox="0 0 40 40" width="30" height="30"><path d="M20 7l13 7H7z" fill="#fff"/><g fill="#fff"><rect x="10" y="16" width="3.5" height="13"/><rect x="18" y="16" width="3.5" height="13"/><rect x="26" y="16" width="3.5" height="13"/></g><rect x="7" y="30" width="26" height="3.5" fill="#fff"/></svg>`,
 forex:`<svg viewBox="0 0 40 40" width="30" height="30"><rect x="6" y="12" width="28" height="16" rx="2.5" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="20" cy="20" r="4.5" fill="none" stroke="#fff" stroke-width="2.2"/><text x="20" y="24" font-size="8" fill="#fff" text-anchor="middle" font-weight="800">$</text></svg>`,
 stock:`<svg viewBox="0 0 40 40" width="30" height="30"><polyline points="7,26 14,18 20,22 27,12 33,16" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="14" cy="18" r="2.4" fill="#fff"/><circle cx="27" cy="12" r="2.4" fill="#fff"/></svg>`};
const CLASSES=[
 {k:"Gold & Metals",img:"images/gold.jpg",short:"Gold",ic:"gold",g:"linear-gradient(135deg,#b8860b,#d4af37)",sym:"XAU/USD",px:2038,dp:1,
  blurb:"Precious metals like gold and silver — a classic store of value that investors turn to in uncertain times.",
  how:["Priced per ounce in USD","Traded 24/5 via CFDs & futures","Rises when risk & inflation climb"]},
 {k:"Crypto",img:"images/crypto.jpg",short:"Crypto",ic:"crypto",g:"linear-gradient(135deg,#5b3cc4,#7b61ff)",sym:"BTC/USDT",px:64200,dp:0,
  blurb:"Digital assets such as Bitcoin and Ethereum — high-volatility, 24/7 markets traded on regulated (VASP-licensed) venues.",
  how:["Traded 24/7, globally","High volatility = high risk","Via VASP-licensed exchanges"]},
 {k:"Shares",img:"images/share.jpg",short:"Shares",ic:"shares",g:"linear-gradient(135deg,#0f6e4f,#12a150)",sym:"Equity",px:142,dp:2,
  blurb:"Ownership stakes in listed companies. You profit from price gains and dividends as the business grows.",
  how:["Buy a slice of a company","Earn from growth & dividends","Executed via licensed brokers"]},
 {k:"Futures",img:"images/futures.jpg",short:"Futures",ic:"futures",g:"linear-gradient(135deg,#0b6b6b,#0d9488)",sym:"Gold Fut",px:2041,dp:1,
  blurb:"Contracts to buy or sell an asset at a set price on a future date — used to speculate or hedge, often with leverage.",
  how:["Agree a price for later","Leverage magnifies gains & losses","Settled on expiry date"]},
 {k:"NSE",img:"images/nse.jpg",short:"NSE",ic:"nse",g:"linear-gradient(135deg,#12324f,#1663b0)",sym:"NSE20",px:1850,dp:1,
  blurb:"The Nairobi Securities Exchange — Kenya's home market of 66+ listed companies, accessed through Ziidi Trader.",
  how:["Kenya's listed companies","Routed via Ziidi / NSE brokers","Local, regulated by CMA"]},
 {k:"Forex",img:"images/forex.jpg",short:"Forex",ic:"forex",g:"linear-gradient(135deg,#1a5e3a,#12813f)",sym:"EUR/USD",px:1.087,dp:4,
  blurb:"Foreign exchange — trading one currency against another. The world's largest, most liquid market.",
  how:["Trade currency pairs","Deep liquidity, tight spreads","CMA-licensed FX brokers"]},
 {k:"Stock Trading",img:"images/share.jpg",short:"Stocks",ic:"stock",g:"linear-gradient(135deg,#0b4a6b,#2980b9)",sym:"US Tech",px:402,dp:2,
  blurb:"Active trading of global equities — taking shorter-term positions in shares to profit from price moves.",
  how:["Shorter-term equity trades","Global markets access","Skill & timing driven"]}];
const CMAP={}; CLASSES.forEach(c=>CMAP[c.k]=c);

/* ---- traders ---- */
const BIOS=[
 "Former bank treasury dealer turned independent trader. I specialise in disciplined, risk-first positions and never chase losses.",
 "Self-taught trader since university. I trade the trend, cut losers fast, and let winners run — consistency over hero trades.",
 "Ex-quant analyst. My edge is data: I only take setups with a clear statistical advantage and strict stop-losses.",
 "Full-time trader for 6 years. I focus on capital preservation first, growth second — slow and steady compounding.",
 "I blend fundamentals with technicals across FX and metals. Patience and position-sizing are my whole game."];
let traders=[];
function makeTrader(i,name,gender,score,ret){
  const classes={}; const pool=[...CLASSES];
  const n=ri(3,5); for(let j=0;j<n;j++){const c=pool.splice(ri(0,pool.length-1),1)[0]; classes[c.k]={perf:rnd(ret-6,ret+10),hold:ri(15,150)*1000};}
  const nb=Math.max(0,Math.round(score/30));
  const backers=Array.from({length:nb},()=>({name:pick([...FNAMES_M,...FNAMES_F])[0]+".",amount:ri(2,120)*1000}));
  return {id:i,name,gender,age:ri(24,46),score,ret,base:ret,equity:1+ret/100,color:AV[i%AV.length],
    skin:pick(SKIN),hair:pick(HAIR),shirt:pick(SHIRT),own:ri(60,400)*1000,backers,bio:pick(BIOS),classes,
    kyc:{joined:pick(["Jan","Feb","Mar","Apr"])+" 2026",trades:ri(120,1900)},
    hist:Array.from({length:18},(_,j)=>1+ret/100*(0.5+j/36)+rnd(-.03,.03)),self:false};
}
[["Wanjiru","F",912,38],["Brian","M",784,29],["Aisha","F",561,21],["David","M",498,17],["Faith","F",342,12],
 ["Grace","F",640,24],["Kevin","M",455,15],["Amina","F",710,26],["Otieno","M",280,9],["Samuel","M",150,4]]
 .forEach((t,i)=>traders.push(makeTrader(i,t[0]+" "+pick(LAST),t[1],t[2],t[3])));

function tierOf(s){return s>=800?"Diamond":s>=600?"Platinum":s>=400?"Gold":s>=200?"Silver":"Bronze";}
function pubTraders(){return traders.filter(t=>!t.self);}
function tradersIn(k){return pubTraders().filter(t=>t.classes[k]).sort((a,b)=>b.classes[k].perf-a.classes[k].perf);}

/* ---- avatar art ---- */
function avatar(t,size){size=size||44;const long=t.gender==='F';
 return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" style="border-radius:50%;flex-shrink:0">
   <rect width="100" height="100" fill="${t.color}"/>
   ${long?`<path d="M20 46c0-22 13-32 30-32s30 10 30 32v46H20z" fill="${t.hair}"/>`:''}
   <path d="M26 96c2-16 12-24 24-24s22 8 24 24z" fill="${t.shirt}"/>
   <ellipse cx="50" cy="48" rx="20" ry="23" fill="${t.skin}"/>
   ${long?`<path d="M30 42c2-15 10-21 20-21s18 6 20 21c-5-6-12-8-20-8s-15 2-20 8z" fill="${t.hair}"/>`
        :`<path d="M28 42c2-17 12-23 22-23s20 6 22 23c-6-7-14-9-22-9s-16 2-22 9z" fill="${t.hair}"/>`}
 </svg>`;}
function heroArena(){return `<svg class="hero" viewBox="0 0 430 900" preserveAspectRatio="xMidYMid slice">
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2a7fb8"/><stop offset="0.45" stop-color="#e8a15a"/><stop offset="0.75" stop-color="#f6c76a"/><stop offset="1" stop-color="#7a3f1e"/></linearGradient>
    <radialGradient id="sun" cx="80%" cy="60%" r="45%"><stop offset="0" stop-color="#fff6d8"/><stop offset="1" stop-color="#f6c76a" stop-opacity="0"/></radialGradient></defs>
  <rect width="430" height="900" fill="url(#sky)"/><rect width="430" height="900" fill="url(#sun)"/>
  <g opacity=".22" fill="#fff"><path d="M40 120c60-14 120-14 180 0M60 180c50-10 90-10 150 2"/></g>
  <g transform="translate(215 560)" fill="#5a3b28" opacity=".92">
    <ellipse cx="0" cy="120" rx="230" ry="60" fill="#3a2717"/>
    <path d="M-190 120c0-120 85-190 190-190s190 70 190 190z" fill="#6b4a30"/>
    <g fill="#3a2717">${Array.from({length:11},(_,i)=>`<rect x="${-175+i*33}" y="-10" width="20" height="60" rx="9"/>`).join('')}</g>
    <g fill="#4a3120">${Array.from({length:12},(_,i)=>`<rect x="${-185+i*32}" y="60" width="18" height="52" rx="8"/>`).join('')}</g>
    <rect x="-200" y="112" width="400" height="16" fill="#2e1f12"/>
  </g></svg>`;}

/* ================= STATE ================= */
let role=null, user={name:'Investor'}, wallet=0, positions=[], subTier='Free';
let selfId=null, traderSelf=null, invHist=[], tradeLog=[], curMkt=CLASSES[0].sym, agreedFor=null;
let state={page:'login',arg:null}, hist=[], tickN=0, _min=41;

/* candles per market symbol */
let candles={};
CLASSES.forEach(c=>{let p=c.px;candles[c.sym]=Array.from({length:22},()=>{const o=p;p=p*(1+rnd(-.004,.0045));return{o,c:p,h:Math.max(o,p)*(1+rnd(0,.002)),l:Math.min(o,p)*(1-rnd(0,.002))};});});

/* AUM / positions */
function autoIdx(){const t=[...pubTraders()].sort((a,b)=>b.score-a.score).slice(0,8);return t.reduce((s,x)=>s+x.equity,0)/t.length;}
function swarmIdx(){const t=[...pubTraders()].sort((a,b)=>b.score-a.score).slice(0,10);let w=0,s=0;t.forEach(x=>{w+=x.score;s+=x.equity*x.score;});return s/w;}
function idxFor(p){return p.kind==='trader'?traders[p.ref].equity:p.kind==='auto'?autoIdx():swarmIdx();}
function posValue(p){return p.amount*idxFor(p)/p.entryEq;}
function portValue(){return positions.reduce((s,p)=>s+posValue(p),0);}
function netWorth(){return wallet+portValue();}
function backingTo(id){return positions.filter(p=>p.kind==='trader'&&p.ref===id).reduce((s,p)=>s+p.amount,0);}
function traderAUM(id){const t=traders[id];return t.own+t.backers.reduce((s,b)=>s+b.amount,0)+backingTo(id);}
function backerCount(id){return traders[id].backers.length+positions.filter(p=>p.kind==='trader'&&p.ref===id).length;}
function clock(){_min=(_min+ri(1,3))%60;return '9:'+String(_min).padStart(2,'0');}

/* ================= ENGINE ================= */
function tick(){
  tickN++;
  traders.forEach(t=>{let tot=0,w=0;
    Object.keys(t.classes).forEach(k=>{const o=t.classes[k];o.perf+=rnd(-1.1,1.15)+(t.base>18?0.05:t.base<8?-0.05:0.01);o.perf=Math.max(-40,Math.min(130,o.perf));tot+=o.perf*o.hold;w+=o.hold;});
    t.ret=w?tot/w:t.ret; t.equity=Math.max(.4,1+t.ret/100);
    t.score+=rnd(-13,13)+(t.ret>18?3:t.ret<5?-3:0); t.score=Math.max(60,Math.min(999,t.score));
    t.hist.push(t.equity); if(t.hist.length>18)t.hist.shift();});
  Object.keys(candles).forEach(m=>{const a=candles[m],l=a[a.length-1];const nc=l.c*(1+rnd(-.0035,.0037));l.c=nc;l.h=Math.max(l.h,nc);l.l=Math.min(l.l,nc);});
  if(tickN%4===0)Object.keys(candles).forEach(m=>{const a=candles[m],o=a[a.length-1].c;a.push({o,c:o,h:o,l:o});if(a.length>22)a.shift();});
  if(role==='trader'&&traderSelf!=null&&traders[traderSelf].status==='active'&&tickN%2===0&&Math.random()<.75)genTrade();
  if(positions.length){invHist.push(portValue());if(invHist.length>40)invHist.shift();}
  softRefresh();
}
function genTrade(){const c=pick(CLASSES),side=Math.random()<.55?'BUY':'SELL',px=candles[c.sym][candles[c.sym].length-1].c;
  tradeLog.unshift({side,sym:c.sym,cls:c.short,qty:ri(1,40),px,dp:c.dp,t:clock()});if(tradeLog.length>30)tradeLog.pop();
  if(traderSelf!=null&&traders[traderSelf].classes[c.k])traders[traderSelf].classes[c.k].perf+=rnd(-.5,.8);}

/* ================= CHARTS ================= */
function spark(hist,col){const w=44,h=22,mn=Math.min(...hist),mx=Math.max(...hist),r=(mx-mn)||1;
  return `<svg width="44" height="22" viewBox="0 0 44 22"><polyline points="${hist.map((v,i)=>`${(i/(hist.length-1)*w).toFixed(1)},${(h-((v-mn)/r)*(h-3)-1.5).toFixed(1)}`).join(' ')}" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round"/></svg>`;}
function lineChart(hist,col,h){h=h||64;const w=320;if(hist.length<2)hist=[hist[0]||1,hist[0]||1];const mn=Math.min(...hist),mx=Math.max(...hist),r=(mx-mn)||1;
  const pts=hist.map((v,i)=>`${(i/(hist.length-1)*w).toFixed(1)},${(h-((v-mn)/r)*(h-8)-4).toFixed(1)}`);
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px" preserveAspectRatio="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".25"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>
   <polygon points="0,${h} ${pts.join(' ')} ${w},${h}" fill="url(#lg)"/><polyline points="${pts.join(' ')}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
function candleChart(arr,h){h=h||180;const w=320,n=arr.length,cw=w/n*0.6,gap=w/n;
  const hi=Math.max(...arr.map(c=>c.h)),lo=Math.min(...arr.map(c=>c.l)),r=(hi-lo)||1,Y=v=>h-((v-lo)/r)*(h-16)-8;let s='';
  arr.forEach((c,i)=>{const x=gap*i+gap/2,up=c.c>=c.o,col=up?'#2fd06e':'#ff5a5a';
    s+=`<line x1="${x.toFixed(1)}" y1="${Y(c.h).toFixed(1)}" x2="${x.toFixed(1)}" y2="${Y(c.l).toFixed(1)}" stroke="${col}" stroke-width="1"/>`;
    const yo=Y(c.o),yc=Y(c.c);s+=`<rect x="${(x-cw/2).toFixed(1)}" y="${Math.min(yo,yc).toFixed(1)}" width="${cw.toFixed(1)}" height="${Math.max(2,Math.abs(yc-yo)).toFixed(1)}" rx="1" fill="${col}"/>`;});
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px">${s}</svg>`;}
function radial(segs,size){size=size||190;const R=size/2,r=R-18,C=2*Math.PI*r;let off=0,s='';
  segs.forEach(g=>{const len=g.pct/100*C;s+=`<circle cx="${R}" cy="${R}" r="${r}" fill="none" stroke="${g.color}" stroke-width="26" stroke-dasharray="${len.toFixed(2)} ${(C-len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 ${R} ${R})"/>`;off+=len;});
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${s}<text x="${R}" y="${R-2}" text-anchor="middle" font-size="12" fill="#6b7a72" font-weight="700">Earnings</text><text x="${R}" y="${R+16}" text-anchor="middle" font-size="15" fill="#0e2a1b" font-weight="800">100%</text></svg>`;}

/* ================= ROUTER ================= */
function go(page,arg){hist.push({...state});state={page,arg};render();}
function replace(page,arg){state={page,arg};render();}
function back(){if(hist.length){state=hist.pop();render();}}
function goHome(){hist=[];replace(role==='trader'?'tHome':'invHome');}
function render(){
  const P=PAGES[state.page]||{}; const scr=document.getElementById('screen');
  document.getElementById('sbRole').textContent=P.chrome?(role==='trader'?'Trader':'Investor')+' • Arena':'M-PESA Arena';
  document.getElementById('appbar').classList.toggle('hidden',!P.chrome);
  document.getElementById('tabbar').classList.toggle('hidden',!P.tab);
  if(P.chrome){document.getElementById('barT').textContent=(typeof P.title==='function'?P.title(state.arg):P.title)||'';
    document.getElementById('barS').textContent=(typeof P.sub==='function'?P.sub(state.arg):P.sub)||'';
    document.getElementById('backBtn').style.visibility=hist.length?'visible':'hidden';}
  if(P.tab)buildTabbar(P.tab);
  scr.innerHTML=`<div class="${P.raw?'':'pad'} fade" id="scrIn"></div>`;
  P.render(state.arg, document.getElementById('scrIn'));
  scr.scrollTop=0; closeDrawer();
}
/* tabbar */
const TABS={investor:[["invHome","Home","M3 11l9-8 9 8M5 10v10h14V10"],["invPortfolio","Portfolio","M3 7h18v13H3zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"],["invPro","AI Pro","M12 2l2.4 6.9H22l-6 4.4 2.3 7L12 16l-6.3 4.3 2.3-7-6-4.4h7.6z"]],
 trader:[["tHome","Home","M3 11l9-8 9 8M5 10v10h14V10"],["tMarkets","Markets","M4 18V9M9 18V5M14 18v-6M19 18V8"],["tTrades","Activity","M4 7h16M4 12h16M4 17h10"],["tBackers","Backers","M9 8a3 3 0 100-6 3 3 0 000 6zM3 20c0-3 3-5 6-5s6 2 6 5"],["tEarn","Earnings","M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v10M9 10h4.5a2 2 0 010 4H9"]]};
function buildTabbar(which){const nav=document.getElementById('tabbar');
  nav.innerHTML=TABS[which].map(([pg,lb,d])=>`<button class="tab ${state.page===pg?'on':''}" onclick="goHomeTab('${pg}')"><svg viewBox="0 0 24 24"><path d="${d}"/></svg>${lb}</button>`).join('');}
function goHomeTab(pg){hist=[];replace(pg);}
/* drawer */
function openDrawer(){const t=role==='trader'&&traderSelf!=null?traders[traderSelf]:null;
  document.getElementById('drawer').innerHTML=`
    <div class="dhead">${t?avatar(t,56):`<div style="width:56px;height:56px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;color:var(--green);font-weight:900;font-size:26px">${(user.name||'I')[0]}</div>`}
      <div class="nm">${t?t.name:user.name}</div><div class="rl">${role==='trader'?'Trader role · can trade, not withdraw':'Investor'}</div></div>
    <div class="ditems">
      <div class="di" onclick="closeAll();goHome()"><span class="dic">⌂</span> Home</div>
      ${role==='investor'?`<div class="di" onclick="closeAll();go('invPortfolio')"><span class="dic">📊</span> My Portfolio</div>
      <div class="di" onclick="closeAll();go('invPro')"><span class="dic">✦</span> AI Pro</div>`:
      `<div class="di" onclick="closeAll();go('tEarn')"><span class="dic">💰</span> Earnings</div>
      <div class="di" onclick="closeAll();go('tBackers')"><span class="dic">👥</span> My Backers</div>`}
      <div class="di" onclick="closeAll();showLegal()"><span class="dic">§</span> Legal notice</div>
      <div class="di" onclick="closeAll();replace('roles')"><span class="dic">⇄</span> Switch role</div>
    </div>
    <div class="dfoot"><button class="btn ghost" onclick="logout()">Log out</button></div>`;
  document.getElementById('drawer').classList.add('on');document.getElementById('backdrop').classList.add('on');}
function closeDrawer(){document.getElementById('drawer').classList.remove('on');}
function logout(){role=null;traderSelf=null;selfId=null;positions=[];wallet=0;subTier='Free';invHist=[];agreedFor=null;hist=[];closeAll();replace('login');}
/* sheet */
function openSheet(html){document.getElementById('sheet').innerHTML=html;document.getElementById('sheet').classList.add('on');document.getElementById('backdrop').classList.add('on');}
function closeSheet(){document.getElementById('sheet').classList.remove('on');}
function closeAll(){closeSheet();closeDrawer();document.getElementById('backdrop').classList.remove('on');}

/* ================= ONBOARDING SCREENS ================= */
function renderLogin(arg,el){
  document.getElementById('screen').innerHTML=`<div id="login">
    <div class="hero"></div><div class="scrim"></div>
    <div class="content">
      <h1>M-pesa Arena</h1>
      <div class="tag">The best rise to the top. Capital follows talent.</div>
      <button class="btn grad" onclick="go('roles')" style="width:auto;padding:14px 42px;margin-top:8px">Enter Arena</button>
    </div></div>`;
}
function backchip(){return `<button class="bkbtn" onclick="back()">‹ Back</button>`;}
function renderRoles(arg,el){
  el.innerHTML=`
    <div class="role-banner"><div class="rb-scrim"></div>
      <button class="bkbtn onhero" onclick="back()" style="position:absolute;top:14px;left:14px;z-index:2">‹ Back</button>
      <div class="rb-in"><h2>The Arena</h2><p>Choose how you want to take part</p></div></div>
    <div class="rbig inv" onclick="go('legal','investor')">
      <div class="ric">${ICON.gold}</div>
      <div class="rh">💰 Investor</div>
      <div class="rd">Fund your wallet, explore asset classes, and back top-ranked traders — or let the AI invest for you.</div>
      <div class="rgo">Enter as Investor →</div></div>
    <div class="rbig trd" onclick="go('legal','trader')">
      <div class="ric">${ICON.stock}</div>
      <div class="rh">📈 Trader</div>
      <div class="rd">Assume a trader role, fund your desk, trade live markets, build a track record and grow your backers' capital.</div>
      <div class="rgo">Enter as Trader →</div></div>`;
}
function legalHTML(kind){
  const invest=`<div class="legal-box">
    <h4>1. Agreement & parties</h4><p>This Investor Agreement ("Agreement") is a legally binding contract between you ("Investor", "you") and Safaricom PLC and its affiliates ("Safaricom", "we", "us"). By ticking "accept" you confirm you are at least 18 years of age, of sound mind, and legally capable of entering into this Agreement, and you agree to be bound by it in full.</p>
    <h4>2. No financial or investment advice</h4><p>M-PESA Arena is an execution and allocation platform only. Nothing on the platform (including rankings, scores, AI sentiment or trader information) constitutes financial, investment, tax or legal advice, an offer, a solicitation or a recommendation. You make all allocation decisions independently and at your sole discretion.</p>
    <h4>3. Investment & market risk</h4><p>Trading and investing in financial instruments carries a high level of risk, including the risk of losing some or ALL of your capital. Prices are volatile; leverage (where applicable) magnifies both gains and losses; and markets may be illiquid. Returns are not guaranteed and past performance and trader rankings are not indicative of future results.</p>
    <h4>4. Assumption of risk & acceptance of liability</h4><p>You knowingly and voluntarily assume all risks associated with your use of the platform and expressly accept full and sole liability for all losses arising from your allocation decisions, within the risk profile you select. Any capital-protection features (including automatic de-allocation) reduce but do not eliminate risk.</p>
    <h4>5. Fees, profit-sharing & loss allocation</h4><p>Where a trader you back generates profit for you, a performance fee ("carry") of <b>15–20% of that profit</b> is payable to the trader, and Safaricom retains <b>25–30% of that carry</b> as a platform fee. Carry is charged on a <b>high-water-mark</b> basis — only on net new profit above the previous peak — so no fee is charged where there is no new profit ("no profit, no fee"). <b>Illustration:</b> on KES 100,000 of profit, the trader\'s carry at 15% is KES 15,000 (you retain KES 85,000), and Safaricom\'s share is approximately KES 4,500 (about 30% of the carry), leaving the trader approximately KES 10,500. <b>Losses:</b> you bear all market losses within your chosen risk profile; automatic de-allocation at −20% and portfolio circuit-breakers mitigate but do not eliminate loss; traders are not required to reimburse market losses, and no performance fee is payable on losses.</p>
    <h4>6. Service provided "as is"; no warranties</h4><p>The platform is provided on an "as is" and "as available" basis. To the maximum extent permitted by law, Safaricom disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose, accuracy, uninterrupted availability, and non-infringement.</p>
    <h4>7. Limitation of liability</h4><p>To the fullest extent permitted by the laws of Kenya, Safaricom, its affiliates, directors, officers, employees and agents shall not be liable for any direct, indirect, incidental, special, consequential, exemplary or punitive damages, or any loss of profits, capital, data or goodwill, arising out of or relating to your use of the platform or any investment losses, whether based in contract, tort, negligence, strict liability or otherwise, even if advised of the possibility of such damages.</p>
    <h4>8. Indemnity</h4><p>You agree to indemnify, defend and hold harmless Safaricom and the parties in clause 7 from and against any and all claims, liabilities, damages, losses and expenses (including reasonable legal fees) arising out of or connected with your use of the platform, your allocation decisions, or your breach of this Agreement.</p>
    <h4>9. Custody, regulation & nature of product</h4><p>Customer funds are held by a licensed custodian, ring-fenced from traders and from Safaricom. The service operates on CMA-licensed and VASP-licensed rails. This is a regulated investment product and is NOT betting or gambling; funds purchase real, owned assets under a licensed mandate.</p>
    <h4>10. Data protection & consent</h4><p>You consent to the collection, processing and sharing of your personal and transaction data for KYC, AML, fraud-prevention, regulatory and service purposes in accordance with the Data Protection Act, 2019 and applicable law.</p>
    <h4>11. Governing law & dispute resolution</h4><p>This Agreement is governed by the laws of the Republic of Kenya. Any dispute shall be subject to the exclusive jurisdiction of the courts of Kenya, without prejudice to any requirement to first attempt resolution through good-faith negotiation.</p></div>`;
  const trade=`<div class="legal-box">
    <h4>1. Agreement & parties</h4><p>This Trader Agreement ("Agreement") is a legally binding contract between you ("Trader", "you") and Safaricom PLC and its affiliates ("Safaricom", "we", "us"). By ticking "accept" you confirm you are at least 18 years of age, legally capable of contracting, and you agree to be bound by it in full.</p>
    <h4>2. Trader role & mandate</h4><p>You are granted a limited, revocable, trade-only mandate to place buy and sell orders on capital allocated to you through connected, licensed venues. You have NO authority to withdraw, transfer, pledge or otherwise deal with backers\' funds, which remain in regulated custody in the backers\' names at all times.</p>
    <h4>3. Eligibility & representations</h4><p>You represent and warrant that: (a) you are not an undischarged bankrupt; (b) you are not subject to any regulatory prohibition; (c) all information you provide is true and complete; and (d) you will promptly disclose any criminal charge or conviction, insolvency event or regulatory action affecting you.</p>
    <h4>4. Authorisation of background, criminal & credit (CRB) checks</h4><p>You expressly authorise and consent to Safaricom and its appointed agents conducting, at any time during onboarding and for the duration of your participation: (i) <b>criminal record and police-clearance checks</b> (including through the Directorate of Criminal Investigations / good-conduct certification); (ii) <b>Credit Reference Bureau (CRB) checks</b> to assess loan defaults, credit history and indebtedness; and (iii) identity, sanctions, PEP and anti-money-laundering screening. You authorise relevant bureaus, agencies and third parties to release such information to Safaricom and consent to its processing, storage and use in deciding and reviewing your eligibility. Admission is at Safaricom\'s sole discretion and adverse findings may result in refusal, suspension or removal.</p>
    <h4>5. Investment & market risk</h4><p>Trading carries a high level of risk, including total loss of capital. Leverage magnifies gains and losses. You trade your own capital during the profile-building period and, once eligible, backers\' capital under mandate.</p>
    <h4>6. Fees, remuneration, profit-sharing & loss allocation</h4><p>You earn a performance fee ("carry") of <b>15–20% of the net new profit</b> you generate for your backers, calculated on a <b>high-water-mark</b> basis (payable only on profit exceeding the prior peak). Safaricom retains <b>25–30% of your carry</b> as a platform fee; your net remuneration is your carry less Safaricom\'s share. <b>Illustration:</b> on KES 100,000 of profit generated for backers, your carry at 15% is KES 15,000, Safaricom retains approximately KES 4,500 (about 30% of the carry), and your take-home is approximately KES 10,500, while backers retain KES 85,000. "No profit, no fee." <b>Losses:</b> backers bear market losses within their chosen risk profile; you are remunerated only on profit and are <b>not required to reimburse market losses</b>, save where they arise from your fraud, wilful misconduct or breach; poor performance results in forfeited fees, de-allocation and delisting.</p>
    <h4>7. Trader liability, conduct & consequences</h4><p>You accept full and sole liability for your trading conduct and decisions. You shall not engage in market manipulation, wash trading, collusion, gaming of the ranking engine, or any unlawful conduct. Breach or under-performance may result in loss of allocation, forfeiture of accrued fees, penalties, delisting and legal action.</p>
    <h4>8. Service "as is"; no warranties</h4><p>The platform is provided "as is" and "as available", with all warranties disclaimed to the maximum extent permitted by law.</p>
    <h4>9. Limitation of liability</h4><p>To the fullest extent permitted by the laws of Kenya, Safaricom, its affiliates, directors, officers, employees and agents shall not be liable for any direct, indirect, incidental, special, consequential or punitive damages, or loss of profits, capital or data, arising from your use of the platform, whether in contract, tort, negligence or otherwise.</p>
    <h4>10. Indemnity</h4><p>You agree to indemnify, defend and hold harmless Safaricom and the parties in clause 9, and any backer, from and against any claims, liabilities, damages, losses and expenses (including legal fees) arising from your trading conduct, misrepresentation, or breach of this Agreement.</p>
    <h4>11. Independent status</h4><p>You act as an independent participant. Nothing in this Agreement creates an employment, agency, partnership or joint-venture relationship between you and Safaricom.</p>
    <h4>12. AML, sanctions & data protection</h4><p>You will comply with all applicable anti-money-laundering, counter-terrorism-financing and sanctions laws. You consent to the collection, processing and sharing of your personal, biometric, criminal-record, credit and transaction data for the purposes in this Agreement, in accordance with the Data Protection Act, 2019.</p>
    <h4>13. Governing law & dispute resolution</h4><p>This Agreement is governed by the laws of the Republic of Kenya and subject to the exclusive jurisdiction of the courts of Kenya.</p></div>`;
  return kind==='trader'?trade:invest;
}
function agreeBlock(target){
  if(target==='trader') return `
    <label class="agree"><input type="checkbox" class="legalchk" onchange="chkLegal()"/><span>I have read, understood and accept this Trader Agreement in full. I accept sole liability for my trading conduct, agree to indemnify Safaricom and backers, and acknowledge Safaricom bears no liability for market losses.</span></label>
    <label class="agree"><input type="checkbox" class="legalchk" onchange="chkLegal()"/><span>I authorise Safaricom and its agents to conduct <b>criminal-record / police-clearance</b> checks, <b>Credit Reference Bureau (CRB)</b> checks for loan defaults and credit history, and identity, sanctions and AML screening — and to obtain, process and store the results.</span></label>
    <button class="btn" id="agreeBtn" disabled style="opacity:.5" onclick="afterLegal('trader')">Accept &amp; continue →</button>`;
  return `
    <label class="agree"><input type="checkbox" class="legalchk" onchange="chkLegal()"/><span>I have read, understood and accept this Investor Agreement in full. I bear all market losses within my chosen risk profile, understand this is regulated investment (not gambling), and accept that Safaricom is not liable for investment losses.</span></label>
    <button class="btn" id="agreeBtn" disabled style="opacity:.5" onclick="afterLegal('investor')">Accept &amp; continue →</button>`;
}
function chkLegal(){const all=[...document.querySelectorAll('.legalchk')].every(c=>c.checked);const b=document.getElementById('agreeBtn');if(b){b.disabled=!all;b.style.opacity=all?1:.5;}}
function renderLegal(target,el){
  el.innerHTML=`${backchip()}
    <div class="role-h">${target==='trader'?'Trader Agreement':target==='investor'?'Investor Agreement':'Legal Notice'}</div>
    <div class="role-sub">Please read carefully. You must accept to continue.</div>
    ${legalHTML(target||role||'investor')}
    ${target?agreeBlock(target):`<button class="btn ghost" style="margin-top:16px" onclick="back()">Close</button>`}`;
}
function showLegal(){go('legal',null);}
function afterLegal(target){agreedFor=target;
  if(target==='investor'){role='investor';user={name:'Investor'};wallet=0;positions=[];hist=[];replace('invHome');}
  else{role='trader';hist=[];replace('tOnboard');}
}

/* ================= INVESTOR ================= */
function clsChange(c){const a=candles[c.sym];return (a[a.length-1].c-a[0].o)/a[0].o*100;}
function renderInvHome(arg,el){
  el.innerHTML=`
    <div class="wallet">
      <div class="lbl">Investment wallet</div>
      <div class="bal"><small>KES </small><span id="wBal">${fmt(wallet)}</span></div>
      <div class="sub">Net worth <b id="wNet">${money(netWorth())}</b> · Invested <b id="wInv">${money(portValue())}</b></div>
      <div class="acts"><button class="solid" onclick="fundSheet()">＋ Fund wallet</button><button onclick="withdrawSheet()">↓ Withdraw</button></div>
    </div>
    <div class="sect">Explore asset classes</div>
    <p class="muted" style="font-size:12px;margin:-4px 4px 12px">Tap a class to learn how it trades and see the traders who specialise in it.</p>
    <div id="assetList">${CLASSES.map(c=>{const ch=clsChange(c);return `<div class="acard" onclick="go('assetInfo','${c.k}')">
      <div class="atile" style="background:${c.g}">${c.img?`<div class="atile-img" style="background-image:url('${c.img}')"></div><div class="atile-sc"></div>`:``}<div class="atile-ic">${ICON[c.ic]}</div></div>
      <div class="at"><div class="n">${c.k}</div><div class="d">${tradersIn(c.k).length} traders · ${c.sym}</div></div>
      <div class="ar"><div class="p ${ch>=0?'up':'down'}">${ch>=0?'+':''}${ch.toFixed(2)}%</div><div class="s">today</div></div>
      <div class="chev">›</div></div>`;}).join('')}</div>
    <div class="safety">🛡️ Your money stays in your name. Traders trade it — never withdraw it. Auto-protected at −20%.</div>`;
}
function softInvHome(){const b=document.getElementById('wBal');if(!b)return;b.textContent=fmt(wallet);
  document.getElementById('wNet').textContent=money(netWorth());document.getElementById('wInv').textContent=money(portValue());
  const l=document.getElementById('assetList');if(l)CLASSES.forEach((c,i)=>{const ch=clsChange(c),e=l.children[i]&&l.children[i].querySelector('.ar .p');if(e){e.textContent=(ch>=0?'+':'')+ch.toFixed(2)+'%';e.className='p '+(ch>=0?'up':'down');}});}
function fundSheet(){openSheet(`<div class="sheet-grip"></div><div style="text-align:center;font-size:17px;font-weight:800">Fund your wallet</div>
  <p class="muted" style="text-align:center;font-size:12.5px;margin:6px 0 10px">Top up from your M-PESA balance.</p>
  <div class="chips">${[1000,5000,20000,50000,100000].map(a=>`<button class="chip" onclick="wallet+=${a};closeSheet();replace('invHome')">+${fmt(a)}</button>`).join('')}</div>
  <button class="btn ghost" onclick="closeSheet()">Done</button>`);}
function withdrawSheet(){openSheet(`<div class="sheet-grip"></div><div style="text-align:center;font-size:17px;font-weight:800">Withdraw to M-PESA</div>
  <div class="amt-display"><small>KES </small>${fmt(wallet)}</div>
  <p class="muted" style="text-align:center;font-size:12px;margin:2px 0 12px">Available in your wallet. Payouts route only to your own M-PESA number.</p>
  <div class="chips">${[1000,5000,20000].map(a=>`<button class="chip" onclick="wallet=Math.max(0,wallet-${a});closeSheet();replace('invHome')">−${fmt(a)}</button>`).join('')}
    <button class="chip" onclick="wallet=0;closeSheet();replace('invHome')">All</button></div>
  <button class="btn ghost" onclick="closeSheet()">Cancel</button>`);}

function renderAssetInfo(k,el){const c=CMAP[k],list=tradersIn(k),ch=clsChange(c);
  el.innerHTML=`
    <div class="asset-hero" style="background:${c.g}">
      ${c.img?`<div class="ah-bg" style="background-image:url('${c.img}')"></div><div class="ah-scrim"></div>`:``}
      <div class="ah-in"><div class="big">${ICON[c.ic]}</div><h2>${c.k}</h2><p>${c.blurb}</p>
      <div style="margin-top:12px;font-size:22px;font-weight:800">${c.sym} <span style="font-size:14px;opacity:.9">${ch>=0?'▲ +':'▼ '}${ch.toFixed(2)}% today</span></div></div>
    </div>
    <div class="infoblock"><h4>How it trades</h4><div class="howrow">${c.how.map((h,i)=>`<div class="hstep"><div class="hn">${i+1}</div><div class="ht">${h}</div></div>`).join('')}</div></div>
    <div class="sect">Traders specialising in ${c.short}</div>
    <div class="rankinfo">⚖️ <b>How traders are ranked:</b> the AI scores each on a 0–1000 Arena Score — risk-adjusted returns (30%), consistency (25%), capital efficiency (15%), decision quality (15%), track record (10%) and diversification (5%). Skill, not luck. The list below is ranked by performance in ${c.short}.</div>
    <div id="atList">${list.map((t,i)=>traderRow(t,i,k)).join('')||'<div class="lockmsg">No traders in this class yet.</div>'}</div>`;
}
function traderRow(t,i,k){const grade=tierOf(t.score),perf=k?t.classes[k].perf:t.ret;
  return `<div class="trow" data-id="${t.id}" onclick="go('profile',${t.id})">
    <div class="rank">${i+1}</div>${avatar(t,42)}
    <div class="ti"><div class="n">${t.name}</div><div class="m"><span class="tier t-${grade}">${grade}</span><span class="verified" style="padding:2px 7px">✓</span><span class="muted" style="font-size:11px">${t.age}, ${t.gender==='F'?'Female':'Male'}</span></div></div>
    <div class="tr"><div class="p ${perf>=0?'up':'down'}">${perf>=0?'+':''}${perf.toFixed(1)}%</div><div class="s">${k?CMAP[k].short:'30-day'}</div></div></div>`;}

function renderProfile(id,el){const t=traders[id],grade=tierOf(t.score),rank=[...pubTraders()].sort((a,b)=>b.score-a.score).findIndex(x=>x.id===id)+1;
  const backing=backingTo(id),cls=Object.keys(t.classes);
  el.innerHTML=`
    <div class="profhero">
      <div class="top">${avatar(t,66)}<div style="flex:1"><div style="font-size:20px;font-weight:800">${t.name}</div>
        <div class="meta">${t.age} yrs · ${t.gender==='F'?'Female':'Male'} · Rank #${rank}</div></div></div>
      <div class="badges"><span class="chip2"><span class="tier t-${grade}" style="padding:2px 7px">${grade}</span></span>
        <span class="chip2">✓ KYC Verified</span><span class="chip2">Arena Score ${Math.round(t.score)}</span><span class="chip2">👥 ${backerCount(id)} backers</span></div>
    </div>
    <div class="grid2" style="margin-top:12px">
      <div class="bigstat"><div class="k">30-day return</div><div class="v ${t.ret>=0?'up':'down'}">${t.ret>=0?'+':''}${t.ret.toFixed(1)}%</div></div>
      <div class="bigstat"><div class="k">Assets under mgmt</div><div class="v">${money(traderAUM(id))}</div></div>
    </div>
    <div class="card" style="margin-top:12px"><div class="muted" style="font-size:12px;font-weight:600">Past performance (verified)</div>${lineChart(t.hist,t.ret>=0?'#12a150':'#e23b3b',80)}</div>
    <div class="sect">Trades these asset classes</div>
    <div class="card"><div class="achips">${cls.map(c=>`<span class="acx">${CMAP[c].short} <b class="${t.classes[c].perf>=0?'up':'down'}">${t.classes[c].perf>=0?'+':''}${t.classes[c].perf.toFixed(0)}%</b></span>`).join('')}</div></div>
    <div class="bio"><div class="q">Why back ${t.name.split(' ')[0]}</div>${t.bio}</div>
    ${backing?`<div class="safety" style="background:#eef6ff;border-color:#cfe2fb;color:#1663b0;margin-top:14px">You're backing ${t.name.split(' ')[0]} with ${money(backing)}.</div>
      <div style="display:flex;gap:10px;margin-top:12px"><button class="btn" style="flex:1" onclick="openBack(${id})">＋ Increase</button><button class="btn red" style="flex:1" onclick="exitTrader(${id})">Withdraw</button></div>`
      :`<button class="btn" style="margin-top:16px" onclick="openBack(${id})">Back ${t.name.split(' ')[0]} →</button>`}
    <div class="safety">✓ Verified track record · reconciled against custody · min 30-day history before eligible</div>`;
}
/* backing flow */
let bd={};
function openBack(id){bd={amount:0,label:traders[id].name,kind:'trader',ref:id};backAmount('Back '+traders[id].name.split(' ')[0]);}
function openAuto(){bd={amount:0,label:'Arena Auto',kind:'auto',ref:null};backAmount('Invest with Arena Auto');}
function openSwarm(){bd={amount:0,label:'Swarm Intelligence',kind:'swarm',ref:null};backAmount('Invest with Swarm');}
function backAmount(title){openSheet(`<div class="sheet-grip"></div><div style="text-align:center;font-size:16px;font-weight:800">${title}</div>
  <div class="amt-display"><small>KES </small><span id="bAmt">0</span></div>
  <div class="muted" style="text-align:center;font-size:12px">Available: ${money(wallet)}</div>
  <div class="chips">${[1000,5000,10000,25000].map(a=>`<button class="chip" onclick="bset(${a})">${fmt(a)}</button>`).join('')}</div>
  <div class="keypad">${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(k=>k===''?'<div></div>':`<button onclick="bkey('${k}')">${k}</button>`).join('')}</div>
  <button class="btn" id="bGo" onclick="bpin()">Continue →</button>`);bd.amount=0;bren();}
function bset(a){bd.amount=Math.min(a,wallet);bren();}
function bkey(k){let s=String(bd.amount||'');if(k==='⌫')s=s.slice(0,-1);else s=(s==='0'?'':s)+k;bd.amount=Math.min(parseInt(s||'0'),wallet);bren();}
function bren(){const v=document.getElementById('bAmt');if(v)v.textContent=fmt(bd.amount);const g=document.getElementById('bGo');if(g)g.style.opacity=bd.amount>=100?1:.5;}
function bpin(){if(bd.amount<100)return;window.__pin='';
  openSheet(`<div class="sheet-grip"></div><div style="text-align:center;font-size:16px;font-weight:800">Confirm with M-PESA PIN</div>
   <p class="muted" style="text-align:center;font-size:13px;margin:8px 0">Invest <b>${money(bd.amount)}</b> · ${bd.label}</p>
   <div class="pindots" id="pd">${'<div class="pindot"></div>'.repeat(4)}</div>
   <div class="keypad">${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(k=>k===''?'<div></div>':`<button onclick="bpk('${k}')">${k}</button>`).join('')}</div>
   <p class="muted" style="text-align:center;font-size:11px">Demo — enter any 4 digits</p>`);}
function bpk(k){let p=window.__pin;if(k==='⌫')p=p.slice(0,-1);else if(p.length<4)p+=k;window.__pin=p;
  document.querySelectorAll('#pd .pindot').forEach((d,i)=>d.classList.toggle('f',i<p.length));if(p.length===4)setTimeout(bconfirm,240);}
function bconfirm(){const eq=bd.kind==='trader'?traders[bd.ref].equity:bd.kind==='auto'?autoIdx():swarmIdx();
  wallet-=bd.amount;positions.push({kind:bd.kind,ref:bd.ref,label:bd.label,amount:bd.amount,entryEq:eq});
  openSheet(`<div class="sheet-grip"></div><div class="success-ico">✓</div><div style="text-align:center;font-size:19px;font-weight:800">You're in the Arena!</div>
   <p class="muted" style="text-align:center;font-size:13px;margin:8px 0">${money(bd.amount)} now backing <b>${bd.label}</b>.</p>
   <div class="mirror-note">Your money mirrors ${bd.label}'s performance across their asset classes, cumulatively. Track it in Portfolio.</div>
   <button class="btn" onclick="closeSheet();hist=[];replace('invPortfolio')">View Portfolio →</button>`);}
function exitTrader(id){const i=positions.findIndex(p=>p.kind==='trader'&&p.ref===id);if(i>=0){wallet+=posValue(positions[i]);positions.splice(i,1);if(!positions.length)invHist=[];}back();}

let portTab='overall';
function renderInvPortfolio(arg,el){
  if(!positions.length){el.innerHTML=`<div class="empty"><div class="ico">📊</div><div style="font-weight:700;margin-bottom:6px">No investments yet</div>
    <div style="font-size:13px">Explore asset classes and back a trader.</div><button class="btn" style="margin-top:16px" onclick="goHome()">Explore assets →</button></div>`;return;}
  const pv=portValue(),cost=positions.reduce((s,p)=>s+p.amount,0),pl=pv-cost,plp=cost?pl/cost*100:0;
  el.innerHTML=`<div class="wallet" style="background:linear-gradient(125deg,#0a3d2a,#12813f)">
      <div class="lbl">Total invested value</div><div class="bal" id="pTot">${money(pv)}</div>
      <div class="sub">Total P&L <b id="pPl">${pl>=0?'+':''}${money(pl).slice(4)} (${plp>=0?'+':''}${plp.toFixed(1)}%)</b></div></div>
    <div class="subtabs" id="pSub">
      <button class="${portTab==='overall'?'on':''}" onclick="setPT('overall')">Overall</button>
      <button class="${portTab==='trader'?'on':''}" onclick="setPT('trader')">By trader</button>
      <button class="${portTab==='asset'?'on':''}" onclick="setPT('asset')">By asset</button></div>
    <div id="pBody"></div>
    <div class="safety">🛡️ If any trader falls −20%, your capital auto-exits to your wallet.</div>`;
  renderPBody();
}
function setPT(s){portTab=s;document.querySelectorAll('#pSub button').forEach((b,i)=>b.classList.toggle('on',['overall','trader','asset'][i]===s));renderPBody();}
function renderPBody(){const body=document.getElementById('pBody');if(!body)return;
  const pv=portValue(),cost=positions.reduce((s,p)=>s+p.amount,0),pl=pv-cost;
  if(portTab==='overall'){body.innerHTML=`<div class="card"><div class="muted" style="font-size:12px;font-weight:600">Performance over time · aggregated</div>${lineChart(invHist.length>1?invHist:[cost,pv],pl>=0?'#12a150':'#e23b3b',90)}<div class="muted" style="font-size:11px">Across ${positions.length} backing${positions.length===1?'':'s'} · live</div></div>`;}
  else if(portTab==='trader'){body.innerHTML=positions.map((p,i)=>{const v=posValue(p),pl=v-p.amount,plp=pl/p.amount*100,ico=p.kind==='auto'?'🤖':p.kind==='swarm'?'🐝':'',col=p.kind==='trader'?traders[p.ref].color:p.kind==='auto'?'#12813f':'#7b61ff';
    return `<div class="acard" onclick="manageBacking(${i})"><div class="atile" style="background:${col};color:#fff;font-weight:800;font-size:16px">${p.kind==='trader'?p.label[0]:ico}</div>
      <div class="at"><div class="n">${p.label}</div><div class="d">Backed ${money(p.amount)} · tap to manage</div></div>
      <div class="ar"><div class="p">${money(v)}</div><div class="s ${pl>=0?'up':'down'}">${pl>=0?'+':''}${plp.toFixed(1)}%</div></div></div>`;}).join('');}
  else{const agg=assetAgg();body.innerHTML=`<div class="card">${Object.keys(agg.byc).length?Object.entries(agg.byc).map(([k,d])=>{const plp=d.cost?(d.val-d.cost)/d.cost*100:0,pct=agg.tot?d.val/agg.tot*100:0;
    return `<div class="bd"><div class="top"><b>${CMAP[k]?CMAP[k].short:k}</b><span>${money(d.val)} · <span class="${plp>=0?'up':'down'}">${plp>=0?'+':''}${plp.toFixed(1)}%</span></span></div><div class="bar"><i style="width:${pct.toFixed(0)}%;background:${plp>=0?'#12a150':'#e23b3b'}"></i></div></div>`;}).join(''):'<div class="lockmsg">Back a trader to see asset exposure.</div>'}
    <div class="muted" style="font-size:11px;margin-top:8px">Your exposure across asset classes, aggregated from every trader you back.</div></div>`;}
}
function assetAgg(){const byc={};let tot=0;
  positions.forEach(p=>{const v=posValue(p);
    if(p.kind==='trader'){const t=traders[p.ref],w=Object.values(t.classes).reduce((s,x)=>s+x.hold,0);
      Object.keys(t.classes).forEach(k=>{const wt=t.classes[k].hold/w;byc[k]=byc[k]||{val:0,cost:0};byc[k].val+=v*wt;byc[k].cost+=p.amount*wt;});}
    else{['Crypto','Forex','Shares'].forEach(k=>{byc[k]=byc[k]||{val:0,cost:0};byc[k].val+=v/3;byc[k].cost+=p.amount/3;});}});
  Object.values(byc).forEach(d=>tot+=d.val);return {byc,tot};}
function manageBacking(i){const p=positions[i],v=posValue(p),pl=v-p.amount;
  openSheet(`<div class="sheet-grip"></div><div style="text-align:center;font-size:17px;font-weight:800">${p.label}</div>
   <p class="muted" style="text-align:center;font-size:13px;margin:6px 0">Value ${money(v)} · <span class="${pl>=0?'up':'down'}">${pl>=0?'+':''}${money(pl).slice(4)}</span></p>
   ${p.kind==='trader'?`<button class="btn" onclick="closeSheet();openBack(${p.ref})">＋ Increase backing</button>`:''}
   <button class="btn red" style="margin-top:10px" onclick="exitPos(${i})">Withdraw ${money(v)} to wallet</button>
   <button class="btn ghost" style="margin-top:10px" onclick="closeSheet()">Cancel</button>`);}
function exitPos(i){wallet+=posValue(positions[i]);positions.splice(i,1);if(!positions.length)invHist=[];closeSheet();hist=[];replace('invPortfolio');}

const TIERS={Free:0,Insights:500,Auto:1000};
function renderInvPro(arg,el){const paid=subTier!=='Free',auto=subTier==='Auto';
  const sent=[["Forex","EUR/USD","Bullish",72,"Dollar softening on rate-cut expectations; momentum turning up."],
    ["Crypto","BTC/USDT","Bullish",65,"Inflows rising; large holders accumulating on-chain."],
    ["Gold & Metals","XAU/USD","Neutral",50,"Range-bound; watching real yields and risk sentiment."],
    ["Shares","Equities","Bearish",58,"Profit-taking after earnings; short-term pullback likely."]];
  el.innerHTML=`<div class="sect">Your plan</div>
    ${tierCard('Free','KES 0','Free',['Explore assets & back traders','Portfolio tracking'],['AI sentiment advice','AI Swarm auto-investing'])}
    ${tierCard('Insights','KES 500/mo','Insights',['Everything in Free','AI sentiment advice on every market','Weekly Arena report'],['AI Swarm auto-investing'])}
    ${tierCard('Auto','KES 1,000/mo','Auto',['Everything in Insights','AI invests for you via Swarm Intelligence','Priority −20% protection'],[])}
    <div class="sect">AI sentiment advice ${paid?'':'· subscribe to unlock'}</div>
    <div style="${paid?'':'filter:grayscale(1);opacity:.55'}">${sent.map(s=>`<div class="acard" style="cursor:default"><div class="atile" style="background:${CMAP[s[0]].g}">${ICON[CMAP[s[0]].ic]}</div>
      <div class="at"><div class="n">${s[1]} <span class="pill ${s[2]==='Bullish'?'up':s[2]==='Bearish'?'down':'muted'}" style="background:${s[2]==='Bullish'?'#e7f7ec':s[2]==='Bearish'?'#fdeaea':'#eef3ef'}">${s[2]} ${s[3]}%</span></div><div class="d">${s[4]}</div></div></div>`).join('')}</div>
    ${!paid?'<div class="lockmsg">🔒 Subscribe to Insights to see live AI sentiment.</div>':''}
    ${auto?`<div class="card" style="margin-top:14px"><div style="font-weight:800;font-size:15px">🐝 AI Swarm auto-investing</div><div class="muted" style="font-size:12.5px;margin:6px 0 12px">Let the AI deploy your wallet into a Swarm Intelligence portfolio and manage it.</div><button class="btn" onclick="openSwarm()">Deploy into Swarm →</button></div>`:''}`;
}
function tierCard(name,price,key,has,not){const active=subTier===key;
  return `<div class="tier-card ${active?'active':''}" style="border:2px solid ${active?'var(--green)':'var(--line)'};border-radius:18px;padding:16px;margin-bottom:13px;background:#fff">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-weight:800;font-size:16px">${name} ${active?'<span class="pill" style="background:var(--green);color:#fff">CURRENT</span>':''}</span><span style="font-weight:800;color:var(--green-d)">${price}</span></div>
    <ul style="list-style:none;margin:10px 0 0">${has.map(h=>`<li style="font-size:12.5px;padding:4px 0 4px 22px;position:relative"><span style="position:absolute;left:0;color:var(--green);font-weight:800">✓</span>${h}</li>`).join('')}${not.map(n=>`<li style="font-size:12.5px;padding:4px 0 4px 22px;position:relative;color:#b7c1ba"><span style="position:absolute;left:0">–</span>${n}</li>`).join('')}</ul>
    ${active?'':`<button class="btn ${key==='Free'?'ghost':''}" style="margin-top:12px" onclick="subscribe('${key}')">${key==='Free'?'Downgrade to Free':'Subscribe · '+price}</button>`}</div>`;}
function subscribe(key){if(key==='Free'){subTier='Free';replace('invPro');return;}
  openSheet(`<div class="sheet-grip"></div><div class="success-ico">✓</div><div style="text-align:center;font-size:18px;font-weight:800">${key} activated</div>
   <p class="muted" style="text-align:center;font-size:13px;margin:8px 0">You're now on Arena ${key} · KES ${TIERS[key]}/month.</p>
   <button class="btn" onclick="subTier='${key}';closeSheet();replace('invPro')">Done</button>`);}

/* ================= TRADER ================= */
let td={name:'Mike Okoth',amount:0};
function renderTOnboard(arg,el){
  el.innerHTML=`${backchip()}
    <div class="role-h">Assume your trader role</div>
    <p class="muted" style="font-size:12.5px;margin:0 2px 12px;line-height:1.5">An authenticated identity that can place trades — but can never withdraw funds. Fund with a minimum of <b>KES 100,000</b> of your own capital. You trade solo for 90 days while the AI builds your profile, then you can be backed.</p>
    <div class="muted" style="font-size:11px;font-weight:700;margin:0 2px 5px">AVATAR NAME</div>
    <input id="tName" class="roleinput" value="${td.name}" oninput="td.name=this.value"/>
    <div class="muted" style="font-size:11px;font-weight:700;margin:14px 2px 5px">FUND TRADING WALLET</div>
    <div class="amt-display" style="text-align:left;margin:0"><small>KES </small><span id="tdAmt">0</span></div>
    <div id="tdWarn" style="display:none;color:var(--red);font-size:12px;font-weight:700;margin:2px">Minimum is KES 100,000</div>
    <div class="chips" style="justify-content:flex-start">${[100000,250000,500000,1000000].map(a=>`<button class="chip" onclick="tdset(${a})">${fmt(a)}</button>`).join('')}</div>
    <div class="keypad">${[1,2,3,4,5,6,7,8,9,'000',0,'⌫'].map(k=>`<button onclick="tdkey('${k}')">${k}</button>`).join('')}</div>
    <button class="btn grad" id="tdGo" style="opacity:.5" onclick="confirmTrader()">Assume role &amp; fund →</button>`;
  td.amount=0;tdren();
}
function tdset(a){td.amount=a;tdren();}
function tdkey(k){let s=String(td.amount||'');if(k==='⌫')s=s.slice(0,-1);else if(k==='000')s=(s===''||s==='0'?'':s)+'000';else s=(s==='0'?'':s)+k;td.amount=parseInt(s||'0');tdren();}
function tdren(){const v=document.getElementById('tdAmt');if(v)v.textContent=fmt(td.amount);const g=document.getElementById('tdGo');if(g)g.style.opacity=td.amount>=100000?1:.5;const w=document.getElementById('tdWarn');if(w)w.style.display=(td.amount>0&&td.amount<100000)?'block':'none';}
function confirmTrader(){if(td.amount<100000)return;
  const nm=(td.name||'Mike Okoth').trim()||'Mike Okoth';
  if(selfId==null){const classes={};const pool=[...CLASSES];for(let j=0;j<4;j++){const c=pool.splice(ri(0,pool.length-1),1)[0];classes[c.k]={perf:rnd(-2,7),hold:Math.round(td.amount/4)};}
    const t={id:traders.length,name:nm,gender:'M',age:29,score:rnd(120,240),ret:rnd(-2,7),base:6,equity:1.03,color:'#0e5033',skin:pick(SKIN),hair:pick(HAIR),shirt:'#1ba94c',
      own:td.amount,backers:[],status:'building',day:ri(4,22),bio:'Just assumed my trader role on Arena.',classes,kyc:{joined:'Today',trades:ri(4,40)},hist:Array.from({length:18},(_,j)=>1+0.03*(j/36)+rnd(-.02,.02)),self:true};
    traders.push(t);selfId=t.id;}
  else{traders[selfId].name=nm;traders[selfId].own=td.amount;}
  traderSelf=selfId;user={name:nm};hist=[];replace('tHome');
}
function completeProfile(){const t=traders[selfId];t.status='active';t.day=90;t.score=rnd(430,600);t.base=14;t.bio=pick(BIOS);
  t.backers=Array.from({length:ri(9,26)},()=>({name:pick([...FNAMES_M,...FNAMES_F])[0]+'.',amount:ri(3,120)*1000}));
  openSheet(`<div class="sheet-grip"></div><div class="success-ico">✓</div><div style="text-align:center;font-size:18px;font-weight:800">Profile complete — you can be backed!</div>
   <p class="muted" style="text-align:center;font-size:13px;margin:8px 0">Your 90-day track record is verified. Investors can now allocate capital to you.</p>
   <button class="btn" onclick="closeSheet();hist=[];replace('tHome')">See my desk →</button>`);}

const PLATS=[["FXPesa · Forex","CMA-licensed","💱","#e8f1fb"],["VASP Exchange · Crypto","Regulated venue","🪙","#f0ecfb"],["CFD Partner · Futures","Commodity futures","📈","#e9f7ee"],["NSE via Ziidi · Shares","Equities","📊","#fbf3df"]];
function platformList(){return PLATS.map(p=>`<div class="plat"><div class="pl-i" style="background:${p[3]}">${p[2]}</div><div class="pl-t"><div class="n">${p[0]}</div><div class="s">${p[1]}</div></div><div style="display:flex;align-items:center;gap:7px"><span class="dot-on"></span><span style="font-size:11px;font-weight:700;color:var(--up)">Connected</span></div></div>`).join('');}

let tHomeTab='agg',tHomeTime='3M';
function renderTHome(arg,el){const t=traders[traderSelf],grade=tierOf(t.score),building=t.status==='building',aum=traderAUM(t.id),pct=Math.min(100,Math.round(t.day/90*100));
  el.innerHTML=`
    <div class="profhero">
      <div class="top">${avatar(t,54)}<div style="flex:1"><div style="font-size:12px;opacity:.8">Trader role · trading as</div><div style="font-size:19px;font-weight:800">${t.name}</div>
        <div class="badges" style="margin-top:6px"><span class="chip2">🔐 Can trade · cannot withdraw</span><span class="chip2"><span class="tier t-${grade}" style="padding:2px 7px">${grade}</span></span></div></div></div>
    </div>
    ${building?`<div class="card" style="margin-top:12px;border:2px solid #f0d98a;background:#fffaf0">
      <div style="font-weight:800;font-size:15px">🧠 Building your Arena profile</div>
      <div class="muted" style="font-size:12.5px;margin:6px 0 10px;line-height:1.5">Trading using backer's capital will only be unlocked after <b>3 months</b> of trading using your own capital. The AI will build your profile during this time.</div>
      <div class="bar" style="height:12px"><i style="width:${pct}%;background:var(--gold)"></i></div>
      <div class="muted" style="font-size:11px;margin-top:5px">${pct}% complete · not yet eligible for backing</div>
      <button class="btn" style="margin-top:12px" onclick="completeProfile()">▶ Simulate 3 months (demo)</button></div>`:''}
    <div class="grid2" style="margin-top:12px">
      ${building?`<div class="bigstat"><div class="k">Trading wallet</div><div class="v">${money(t.own)}</div></div><div class="bigstat"><div class="k">Backing</div><div class="v" style="color:var(--muted)">🔒 Locked</div></div>`
      :`<div class="bigstat"><div class="k">Total AUM</div><div class="v" id="thAum">${money(aum)}</div></div><div class="bigstat"><div class="k">Backers</div><div class="v">${backerCount(t.id)}</div></div>`}
      <div class="bigstat"><div class="k">30-day return</div><div class="v ${t.ret>=0?'up':'down'}" id="thRet">${t.ret>=0?'+':''}${t.ret.toFixed(1)}%</div></div>
      <div class="bigstat"><div class="k">Your capital</div><div class="v">${money(t.own)}</div></div>
    </div>
    <div class="sect">Portfolio performance</div>
    <div class="subtabs" id="thSub"><button class="${tHomeTab==='agg'?'on':''}" onclick="setThTab('agg')">Aggregate</button><button class="${tHomeTab==='asset'?'on':''}" onclick="setThTab('asset')">By asset</button></div>
    <div id="thBody"></div>
    ${!building?`<div class="sect">People backing you</div><div class="card" id="thBackers">${backersPreview(t)}</div>`:''}
    <div class="sect">Connected platforms · orchestrated via API</div>${platformList()}
    <div class="safety">🔗 Arena only orchestrates &amp; monitors. Every order routes to licensed venues, time-stamped.</div>`;
  renderThBody();
}
function setThTab(s){tHomeTab=s;document.querySelectorAll('#thSub button').forEach((b,i)=>b.classList.toggle('on',['agg','asset'][i]===s));renderThBody();}
function renderThBody(){const t=traders[traderSelf],body=document.getElementById('thBody');if(!body)return;
  if(tHomeTab==='agg'){const cut={'1W':11,'1M':6,'3M':0}[tHomeTime];const h=t.hist.slice(cut);
    body.innerHTML=`<div class="card"><div class="timetabs">${['1W','1M','3M'].map(x=>`<button class="${tHomeTime===x?'on':''}" onclick="setThTime('${x}')">${x}</button>`).join('')}</div>
      ${lineChart(h,t.ret>=0?'#12a150':'#e23b3b',90)}<div class="muted" style="font-size:11px">Aggregate across all asset classes · ${tHomeTime}</div></div>`;}
  else{const w=Object.values(t.classes).reduce((s,x)=>s+x.hold,0);
    body.innerHTML=`<div class="card">${Object.keys(t.classes).map(k=>{const o=t.classes[k],p=o.hold/w*100;return `<div class="bd"><div class="top"><b>${CMAP[k].short}</b><span>${money(o.hold)} · <span class="${o.perf>=0?'up':'down'}">${o.perf>=0?'+':''}${o.perf.toFixed(1)}%</span></span></div><div class="bar"><i style="width:${p.toFixed(0)}%;background:${o.perf>=0?'#12a150':'#e23b3b'}"></i></div></div>`;}).join('')}</div>`;}
}
function setThTime(x){tHomeTime=x;renderThBody();}
function backersPreview(t){const list=[...t.backers,...positions.filter(p=>p.kind==='trader'&&p.ref===t.id).map(p=>({name:'You',amount:p.amount}))].sort((a,b)=>b.amount-a.amount).slice(0,4);
  return list.map(b=>`<div class="backer-row"><div class="ba" style="background:${b.name==='You'?'#12a150':AV[b.name.charCodeAt(0)%AV.length]}">${b.name[0]}</div><div class="bn">${b.name==='You'?'You':b.name+' •••'}</div><div class="bm">${money(b.amount)}</div></div>`).join('')
    +`<button class="btn ghost" style="margin-top:10px" onclick="go('tBackers')">See all backers →</button>`;}
function softTHome(){const t=traders[traderSelf];const r=document.getElementById('thRet');if(!r)return;
  const a=document.getElementById('thAum');if(a)a.textContent=money(traderAUM(t.id));
  r.textContent=(t.ret>=0?'+':'')+t.ret.toFixed(1)+'%';r.className='v '+(t.ret>=0?'up':'down');
  if(tHomeTab==='asset')renderThBody();}

function renderTMarkets(arg,el){el.innerHTML=`
    <div class="mkt-pills" id="mkP">${CLASSES.map(c=>`<button class="mkt-pill ${c.sym===curMkt?'on':''}" onclick="setMkt('${c.sym}')">${c.sym}</button>`).join('')}</div>
    <div class="chartcard"><div class="ch-top"><div><div style="font-size:12px;opacity:.7" id="mkN">${curMkt}</div><div class="pr" id="mkPx"></div></div><div id="mkCh" style="font-weight:800"></div></div><div id="mkChart"></div></div>
    <div style="display:flex;gap:10px;margin-top:12px"><button class="btn" style="flex:1;background:var(--up);box-shadow:none" onclick="placeTrade('BUY')">Buy</button><button class="btn red" style="flex:1;box-shadow:none" onclick="placeTrade('SELL')">Sell</button></div>
    <div class="sect">Connected platforms</div>${platformList()}
    <div class="safety">🔗 Prices & execution stream from licensed venues via consumed APIs. Arena monitors — never holds the risk.</div>`;
  softMarkets();}
function setMkt(m){curMkt=m;document.querySelectorAll('#mkP .mkt-pill').forEach(b=>b.classList.toggle('on',b.textContent===m));softMarkets();}
function softMarkets(){const arr=candles[curMkt];if(!arr||!document.getElementById('mkChart'))return;
  const c=CLASSES.find(x=>x.sym===curMkt),last=arr[arr.length-1],chg=(last.c-arr[0].o)/arr[0].o*100;
  document.getElementById('mkN').textContent=curMkt;document.getElementById('mkPx').textContent=last.c.toLocaleString('en-US',{minimumFractionDigits:c.dp,maximumFractionDigits:c.dp});
  const e=document.getElementById('mkCh');e.textContent=(chg>=0?'▲ +':'▼ ')+chg.toFixed(2)+'%';e.style.color=chg>=0?'#2fd06e':'#ff5a5a';
  document.getElementById('mkChart').innerHTML=candleChart(arr,180);}
function placeTrade(side){const c=CLASSES.find(x=>x.sym===curMkt),px=candles[curMkt][candles[curMkt].length-1].c;
  tradeLog.unshift({side,sym:c.sym,cls:c.short,qty:ri(1,25),px,dp:c.dp,t:clock()});
  if(traderSelf!=null&&traders[traderSelf].classes[c.k])traders[traderSelf].classes[c.k].perf+=side==='BUY'?rnd(0,.5):rnd(-.3,.3);
  openSheet(`<div class="sheet-grip"></div><div class="success-ico" style="background:${side==='BUY'?'#12a150':'#e23b3b'}">${side==='BUY'?'↑':'↓'}</div>
   <div style="text-align:center;font-size:18px;font-weight:800">${side} ${c.sym}</div><p class="muted" style="text-align:center;font-size:13px;margin:8px 0">Order routed to the connected venue and time-stamped. Backers mirror this automatically.</p>
   <button class="btn" onclick="closeSheet();hist=[];replace('tTrades')">View activity →</button>`);}
function renderTTrades(arg,el){if(!tradeLog.length){el.innerHTML=`<div class="empty"><div class="ico">📡</div><div style="font-weight:700">Monitoring…</div><div style="font-size:13px;margin-top:4px">Your trades appear here in real time.</div></div>`;return;}
  el.innerHTML=`<div class="sect">Live activity · every order monitored</div>${tradeLog.map((x,i)=>`<div class="tfeed ${i===0?'newflash':''}"><div class="tside ${x.side.toLowerCase()}">${x.side}</div><div class="fi"><div class="a">${x.sym} <span class="muted" style="font-weight:600">· ${x.cls}</span></div><div class="m">Qty ${x.qty} @ ${x.px.toLocaleString('en-US',{minimumFractionDigits:x.dp,maximumFractionDigits:x.dp})} · ${x.t}</div></div><div class="muted" style="font-size:12px;font-weight:700">routed ✓</div></div>`).join('')}`;}
function renderTBackers(arg,el){const t=traders[traderSelf];
  if(t.status==='building'){el.innerHTML=`<div class="empty"><div class="ico">🔒</div><div style="font-weight:700;margin-bottom:6px">Backing not unlocked yet</div><div style="font-size:13px;max-width:280px;margin:0 auto">Day ${t.day} of your 90-day build. Once complete, investors can back you.</div><button class="btn" style="margin-top:16px" onclick="completeProfile()">▶ Simulate 3 months (demo)</button></div>`;return;}
  const list=[...t.backers,...positions.filter(p=>p.kind==='trader'&&p.ref===t.id).map(p=>({name:'You',amount:p.amount}))].sort((a,b)=>b.amount-a.amount);
  el.innerHTML=`<div class="grid2"><div class="bigstat"><div class="k">Total AUM</div><div class="v" id="bkAum">${money(traderAUM(t.id))}</div></div><div class="bigstat"><div class="k">Backers</div><div class="v">${list.length}</div></div></div>
    <div class="sect">Who's backing you · exact amounts</div><div class="card">${list.map(b=>`<div class="backer-row"><div class="ba" style="background:${b.name==='You'?'#12a150':AV[b.name.charCodeAt(0)%AV.length]}">${b.name[0]}</div><div class="bn">${b.name==='You'?'You (via investor login)':b.name+' •••'}</div><div class="bm">${money(b.amount)}</div></div>`).join('')}</div>
    <div class="safety">🛡️ You trade this capital — you can never withdraw it. It stays in each backer's name.</div>`;}
function softBackers(){const e=document.getElementById('bkAum');if(e)e.textContent=money(traderAUM(traderSelf));}
function renderTEarn(arg,el){const t=traders[traderSelf];
  if(t.status==='building'){el.innerHTML=`<div class="empty"><div class="ico">💰</div><div style="font-weight:700;margin-bottom:6px">No carry yet — profile build</div><div style="font-size:13px;max-width:290px;margin:0 auto">You trade only your own capital for 90 days, so there's no backer profit to share yet. Then you earn 17.5% carry.</div><button class="btn" style="margin-top:16px" onclick="completeProfile()">▶ Simulate 3 months (demo)</button></div>`;return;}
  const aum=traderAUM(t.id),gross=Math.max(0,aum*(t.ret/100));
  const segs=[{label:'Investors keep',pct:82.5,color:'#1a7d4a',value:gross*.825},{label:'Your carry (take-home)',pct:12.69,color:'#12a150',value:gross*.1269},{label:'Arena / Safaricom',pct:4.81,color:'#c6a700',value:gross*.0481}];
  el.innerHTML=`<div class="wallet" style="background:linear-gradient(125deg,#0a3d2a,#12813f)"><div class="lbl">Your take-home (this period)</div><div class="bal" id="eNet">${money(segs[1].value)}</div><div class="sub">On ${money(aum)} AUM · ${t.ret.toFixed(1)}% return</div></div>
    <div class="sect">How the profit splits</div>
    <div class="card"><div class="radial-wrap">${radial(segs,190)}</div>
      <div class="legend">${segs.map(s=>`<div class="legrow"><span class="legdot" style="background:${s.color}"></span><span class="ln">${s.label}</span><span class="lp">${s.pct}%</span><span class="lv">${money(s.value)}</span></div>`).join('')}</div></div>
    <div class="mirror-note">You earn <b>17.5% of the profit</b> you make for backers. Arena takes <b>27.5% of your carry</b>. High-water mark: you only earn on <b>new</b> profit above your last peak.</div>
    <div class="safety">✓ Reconciled against custody · paid only on realised gains</div>`;}
function softEarn(){const t=traders[traderSelf];const e=document.getElementById('eNet');if(!e)return;e.textContent=money(Math.max(0,traderAUM(t.id)*(t.ret/100))*.1269);}

/* ================= PAGES + INIT ================= */
function softPortfolio(){const el=document.getElementById('pTot');if(!el)return;
  const pv=portValue(),cost=positions.reduce((s,p)=>s+p.amount,0),pl=pv-cost,plp=cost?pl/cost*100:0;
  el.textContent=money(pv);document.getElementById('pPl').textContent=(pl>=0?'+':'')+money(pl).slice(4)+' ('+(plp>=0?'+':'')+plp.toFixed(1)+'%)';renderPBody();}
function softAssetInfo(){const k=state.arg,cont=document.getElementById('atList');if(!cont)return;
  const first={};cont.querySelectorAll('.trow').forEach(el=>first[el.dataset.id]=el.getBoundingClientRect().top);
  const list=tradersIn(k);cont.innerHTML=list.map((t,i)=>traderRow(t,i,k)).join('')||'<div class="lockmsg">No traders in this class yet.</div>';
  cont.querySelectorAll('.trow').forEach(el=>{const id=el.dataset.id;if(first[id]!=null){const d=first[id]-el.getBoundingClientRect().top;
    if(Math.abs(d)>1){el.style.transform=`translateY(${d}px)`;el.style.transition='none';requestAnimationFrame(()=>{el.style.transition='transform .6s cubic-bezier(.2,.9,.25,1)';el.style.transform='';});}}});}
function softRefresh(){const p=state.page;
  if(p==='invHome')softInvHome();else if(p==='invPortfolio')softPortfolio();
  else if(p==='tHome')softTHome();else if(p==='tMarkets')softMarkets();
  else if(p==='tBackers')softBackers();else if(p==='tEarn')softEarn();
  else if(p==='tTrades'){const s=document.getElementById('scrIn');if(s)renderTTrades(null,s);}
  else if(p==='assetInfo')softAssetInfo();}
const PAGES={
 login:{render:renderLogin,chrome:false,raw:true},
 roles:{render:renderRoles,chrome:false},
 legal:{render:renderLegal,chrome:false},
 invHome:{render:renderInvHome,chrome:true,tab:'investor',title:'Invest',sub:"Grow your money"},
 assetInfo:{render:renderAssetInfo,chrome:true,tab:'investor',title:a=>CMAP[a]?CMAP[a].k:'Asset',sub:'How it trades & who trades it'},
 profile:{render:renderProfile,chrome:true,tab:'investor',title:'Trader Profile',sub:'Verified track record'},
 invPortfolio:{render:renderInvPortfolio,chrome:true,tab:'investor',title:'My Portfolio',sub:'Your performance, live'},
 invPro:{render:renderInvPro,chrome:true,tab:'investor',title:'Arena AI Pro',sub:'Smarter investing'},
 tOnboard:{render:renderTOnboard,chrome:false},
 tHome:{render:renderTHome,chrome:true,tab:'trader',title:'Trader Desk',sub:'Your desk, monitored live'},
 tMarkets:{render:renderTMarkets,chrome:true,tab:'trader',title:'Live Markets',sub:'Orchestrated via connected APIs'},
 tTrades:{render:renderTTrades,chrome:true,tab:'trader',title:'Activity',sub:'Every trade monitored'},
 tBackers:{render:renderTBackers,chrome:true,tab:'trader',title:'My Backers',sub:'Who is backing you'},
 tEarn:{render:renderTEarn,chrome:true,tab:'trader',title:'Earnings',sub:'Your split, exactly'},
};
replace('login');
setInterval(tick,1400);
