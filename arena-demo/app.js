/* ============ M-PESA ARENA — two-role demo ============ */
const AV=["#2f9e6b","#c0392b","#8e44ad","#d3a521","#2980b9","#16a085","#e67e22","#34495e","#0e5033","#7b61ff"];
const ASSETS=[{k:"FX",ico:"💱",bg:"#e8f1fb",mkt:"EUR/USD",px:1.087,dp:4},
              {k:"Crypto",ico:"🪙",bg:"#f0ecfb",mkt:"BTC/USDT",px:64200,dp:0},
              {k:"Futures",ico:"📈",bg:"#e9f7ee",mkt:"Gold Fut",px:2038,dp:1},
              {k:"Shares",ico:"📊",bg:"#fbf3df",mkt:"SCOM",px:18.4,dp:2}];
const NAMES=["Njeri","Otieno","Amina","Kevin","Grace","Brian","Faith","Samuel","Wanjiru","David","Zainab","Mutua","Achieng","Kamau","Halima","Dennis","Nasra","Peter","Cythia","Ali"];
function tierOf(s){return s>=800?"Diamond":s>=600?"Platinum":s>=400?"Gold":s>=200?"Silver":"Bronze";}
function rnd(a,b){return a+Math.random()*(b-a);}
function ri(a,b){return Math.floor(rnd(a,b+1));}
function fmt(n){return Math.round(n).toLocaleString('en-KE');}
function money(n){return 'KES '+fmt(n);}

let traders=[
 ["Wanjiru K.",912,38],["Brian O.",784,29],["Aisha M.",561,21],["David N.",498,17],
 ["Faith W.",342,12],["Grace W.",640,24],["Kevin M.",455,15],["Amina H.",710,26],
 ["Otieno D.",280,9],["Samuel K.",150,4]
].map((t,i)=>{
  const[name,score,ret]=t; const assets={};
  ASSETS.forEach(a=>assets[a.k]={hold:ri(20,180)*1000,pnl:rnd(-6,ret/2+9)});
  const own=ri(50,400)*1000;
  const nb=Math.max(2,Math.round(score/28));
  const backers=Array.from({length:nb},()=>({name:NAMES[ri(0,NAMES.length-1)][0]+".",amount:ri(2,120)*1000}));
  return {id:i,name,score,ret,base:ret,equity:1+ret/100,color:AV[i%AV.length],own,backers,
    kyc:{id:"✓ National ID",country:"Kenya 🇰🇪",joined:["Jan","Mar","Jun","Aug"][i%4]+" 2026",trades:ri(120,1900)},
    assets,hist:Array.from({length:18},(_,j)=>1+ret/100*(0.5+j/36)+rnd(-.03,.03))};
});
/* live candle markets */
let candles={};
ASSETS.forEach(a=>{let p=a.px;candles[a.mkt]=Array.from({length:22},()=>{const o=p;p=p*(1+rnd(-.004,.0045));const c=p;return{o,c,h:Math.max(o,c)*(1+rnd(0,.002)),l:Math.min(o,c)*(1-rnd(0,.002))};});});
let curMkt="EUR/USD";

/* state */
let role=null, wallet=42500, positions=[], subTier="Free", traderSelf=null;
let invHist=[], tradeLog=[], tickN=0, stack=[];

/* AUM / indices */
function pubTraders(){return traders.filter(t=>!t.self);}
function autoIndex(){const t=[...traders].sort((a,b)=>b.score-a.score).slice(0,8);return t.reduce((s,x)=>s+x.equity,0)/t.length;}
function swarmIndex(){const t=[...traders].sort((a,b)=>b.score-a.score).slice(0,10);let w=0,s=0;t.forEach(x=>{w+=x.score;s+=x.equity*x.score;});return s/w;}
function idxFor(p){return p.kind==='trader'?traders[p.ref].equity:p.kind==='auto'?autoIndex():swarmIndex();}
function posValue(p){return p.amount*idxFor(p)/p.entryEq;}
function portValue(){return positions.reduce((s,p)=>s+posValue(p),0);}
function netWorth(){return wallet+portValue();}
function investorBackingTo(id){return positions.filter(p=>p.kind==='trader'&&p.ref===id).reduce((s,p)=>s+p.amount,0);}
function traderAUM(id){const t=traders[id];return t.own+t.backers.reduce((s,b)=>s+b.amount,0)+investorBackingTo(id);}
function traderBackerCount(id){return traders[id].backers.length+positions.filter(p=>p.kind==='trader'&&p.ref===id).length;}

/* ============ ENGINE ============ */
function tick(){
  tickN++;
  traders.forEach(t=>{
    let tot=0,w=0;
    ASSETS.forEach(a=>{const o=t.assets[a.k];o.pnl+=rnd(-1.1,1.15)+(t.base>18?0.06:t.base<8?-0.05:0.01);o.pnl=Math.max(-45,Math.min(130,o.pnl));tot+=o.pnl*o.hold;w+=o.hold;});
    t.ret=tot/w; t.equity=Math.max(.4,1+t.ret/100);
    t.score+=rnd(-14,14)+(t.ret>18?3:t.ret<5?-3:0); t.score=Math.max(60,Math.min(999,t.score));
    t.hist.push(t.equity); if(t.hist.length>18)t.hist.shift();
  });
  // candles advance
  Object.keys(candles).forEach(m=>{const arr=candles[m];const last=arr[arr.length-1];
    const nc=last.c*(1+rnd(-.0035,.0037)); last.c=nc; last.h=Math.max(last.h,nc); last.l=Math.min(last.l,nc);});
  if(tickN%4===0){Object.keys(candles).forEach(m=>{const arr=candles[m];const o=arr[arr.length-1].c;arr.push({o,c:o,h:o,l:o});if(arr.length>22)arr.shift();});}
  // trader activity feed
  if(role==='trader'&&tickN%2===0&&Math.random()<0.8)genTrade();
  // investor equity history
  if(positions.length){invHist.push(portValue());if(invHist.length>40)invHist.shift();}
  refresh();
}
function genTrade(){
  const a=ASSETS[ri(0,3)], side=Math.random()<0.55?'BUY':'SELL';
  const px=candles[a.mkt][candles[a.mkt].length-1].c;
  tradeLog.unshift({side,asset:a.k,mkt:a.mkt,qty:ri(1,40),px,dp:a.dp,t:clock()});
  if(tradeLog.length>30)tradeLog.pop();
  if(traderSelf!=null){const o=traders[traderSelf].assets[a.k];o.pnl+=rnd(-0.6,0.9);}
}
let _min=41;
function clock(){_min=(_min+ri(1,3))%60;return '9:'+String(_min).padStart(2,'0');}
function refresh(){
  if(!role)return;
  const bar=role==='trader'?'nav-trader':'nav-investor';
  const tab=document.querySelector('#'+bar+' .tab.active')?.dataset.tab;
  const m={leaders:()=>renderLeaders(true),home:softInvHome,portfolio:softPortfolio,trader:softTraderProfile,
           dash:softTDash,markets:softMarkets,trades:renderTrades,backers:softBackers,earnings:softEarnings};
  if(m[tab])m[tab]();
}

/* ============ CHARTS ============ */
function spark(hist,col){const w=44,h=22,mn=Math.min(...hist),mx=Math.max(...hist),rg=(mx-mn)||1;
  const pts=hist.map((v,i)=>`${(i/(hist.length-1)*w).toFixed(1)},${(h-((v-mn)/rg)*(h-3)-1.5).toFixed(1)}`).join(' ');
  return `<svg class="spark" viewBox="0 0 ${w} ${h}"><polyline points="${pts}" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
function lineChart(hist,col,h){h=h||60;const w=320;if(hist.length<2)hist=[1,1];const mn=Math.min(...hist),mx=Math.max(...hist),rg=(mx-mn)||1;
  const pts=hist.map((v,i)=>`${(i/(hist.length-1)*w).toFixed(1)},${(h-((v-mn)/rg)*(h-8)-4).toFixed(1)}`);
  const area=`0,${h} ${pts.join(' ')} ${w},${h}`;
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px" preserveAspectRatio="none">
    <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".25"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>
    <polygon points="${area}" fill="url(#g1)"/><polyline points="${pts.join(' ')}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
function candleChart(arr,h){h=h||180;const w=320,n=arr.length,cw=w/n*0.62,gap=w/n;
  const hi=Math.max(...arr.map(c=>c.h)),lo=Math.min(...arr.map(c=>c.l)),rg=(hi-lo)||1;
  const Y=v=>h-((v-lo)/rg)*(h-16)-8;
  let s='';
  arr.forEach((c,i)=>{const x=gap*i+gap/2,up=c.c>=c.o,col=up?'#2fd06e':'#ff5a5a';
    s+=`<line x1="${x.toFixed(1)}" y1="${Y(c.h).toFixed(1)}" x2="${x.toFixed(1)}" y2="${Y(c.l).toFixed(1)}" stroke="${col}" stroke-width="1"/>`;
    const yo=Y(c.o),yc=Y(c.c),top=Math.min(yo,yc),bh=Math.max(2,Math.abs(yc-yo));
    s+=`<rect x="${(x-cw/2).toFixed(1)}" y="${top.toFixed(1)}" width="${cw.toFixed(1)}" height="${bh.toFixed(1)}" rx="1" fill="${col}"/>`;});
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px">${s}</svg>`;}

/* ============ LOGIN / NAV ============ */
const VIEW={home:'v-home',leaders:'v-leaders',portfolio:'v-portfolio',pro:'v-pro',trader:'v-trader',
            dash:'t-dash',markets:'t-markets',trades:'t-trades',backers:'t-backers',earnings:'t-earnings'};
const TITLES={home:['Home',"Grow your money with Africa's best"],leaders:['Live Leaderboard','Ranked by AI — in real time'],
  portfolio:['My Portfolio','Your performance, live'],pro:['Arena AI Pro','Smarter investing'],trader:['Trader Profile','Verified track record'],
  dash:['Trader Dashboard','Your desk, monitored live'],markets:['Live Markets','Orchestrated via connected APIs'],
  trades:['Activity','Every trade routed & monitored'],backers:['My Backers','Who is backing you'],earnings:['Earnings','Your split, exactly']};
function login(r){role=r;document.getElementById('login').classList.add('hide');
  document.getElementById('nav-investor').style.display=r==='investor'?'flex':'none';
  document.getElementById('nav-trader').style.display=r==='trader'?'flex':'none';
  document.getElementById('switchBtn').style.display='block';
  document.getElementById('sbRole').textContent=(r==='investor'?'Investor':'Trader')+' • ▲▲▲ • 100%';
  invHist=[];nav(r==='investor'?'home':'dash');}
let selfId=null, traderDraft={name:'Mike Okoth',amount:0};
function assumeRole(){
  openSheet(`<div class="sheet-grip"></div>
    <div style="text-align:center;font-size:18px;font-weight:800">Assume your trader role</div>
    <p class="muted" style="text-align:center;font-size:12.5px;margin:8px 6px 12px;line-height:1.5">A trader role is an authenticated identity that can place trades — buy &amp; sell — across the connected platforms, but can never withdraw funds. Any verified M-PESA user can assume it.</p>
    <div class="muted" style="font-size:11px;font-weight:700;margin:0 2px 5px">YOUR AVATAR NAME</div>
    <input id="avatarName" class="roleinput" value="Mike Okoth" autocomplete="off"/>
    <div class="safety" style="margin-top:12px">🔐 Authenticated via M-PESA identity · can place trades · cannot withdraw</div>
    <button class="btn" style="margin-top:14px" onclick="toFunding()">Continue to funding →</button>`);
}
function toFunding(){const i=document.getElementById('avatarName');traderDraft={name:((i&&i.value)||'Mike Okoth').trim()||'Mike Okoth',amount:0};fundTraderSheet();}
function fundTraderSheet(){
  openSheet(`<div class="sheet-grip"></div>
    <div style="text-align:center;font-size:17px;font-weight:800">Fund your trading wallet</div>
    <p class="muted" style="text-align:center;font-size:12.5px;margin:8px 4px 6px;line-height:1.5">Start with a minimum of <b>KES 100,000</b> of your own capital. For your first <b>90 days</b> you trade only your own money while the AI builds your profile — then you become eligible to be backed.</p>
    <div class="amt-display"><small>KES </small><span id="tamtV">0</span></div>
    <div id="tWarn" style="display:none;text-align:center;color:var(--red);font-size:12px;font-weight:700;margin-bottom:4px">Minimum is KES 100,000</div>
    <div class="chips" style="flex-wrap:wrap">${[100000,250000,500000,1000000].map(a=>`<button class="chip" onclick="tset(${a})">${fmt(a)}</button>`).join('')}</div>
    <div class="keypad">${[1,2,3,4,5,6,7,8,9,'000',0,'⌫'].map(k=>`<button onclick="tkey('${k}')">${k}</button>`).join('')}</div>
    <button class="btn" id="tGo" onclick="toTraderPin()">Continue →</button>`);
  traderDraft.amount=0; trenderAmt();
}
function tset(a){traderDraft.amount=a;trenderAmt();}
function tkey(k){let s=String(traderDraft.amount||'');if(k==='⌫')s=s.slice(0,-1);else if(k==='000')s=(s===''||s==='0'?'':s)+'000';else s=(s==='0'?'':s)+k;traderDraft.amount=parseInt(s||'0');trenderAmt();}
function trenderAmt(){const v=document.getElementById('tamtV');if(v)v.textContent=fmt(traderDraft.amount);
  const g=document.getElementById('tGo');if(g)g.style.opacity=traderDraft.amount>=100000?1:.5;
  const w=document.getElementById('tWarn');if(w)w.style.display=(traderDraft.amount>0&&traderDraft.amount<100000)?'block':'none';}
function toTraderPin(){if(traderDraft.amount<100000)return;window.__pin='';
  openSheet(`<div class="sheet-grip"></div><div style="text-align:center;font-size:16px;font-weight:800">Confirm with M-PESA PIN</div>
    <p class="muted" style="text-align:center;font-size:13px;margin:8px 0">Fund trading wallet · <b>${money(traderDraft.amount)}</b></p>
    <div class="pindots" id="pd">${'<div class="pindot"></div>'.repeat(4)}</div>
    <div class="keypad">${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(k=>k===''?'<div></div>':`<button onclick="pinT('${k}')">${k}</button>`).join('')}</div>
    <p class="muted" style="text-align:center;font-size:11px">Demo — enter any 4 digits</p>`);}
function pinT(k){let p=window.__pin;if(k==='⌫')p=p.slice(0,-1);else if(p.length<4)p+=k;window.__pin=p;
  document.querySelectorAll('#pd .pindot').forEach((d,i)=>d.classList.toggle('f',i<p.length));if(p.length===4)setTimeout(confirmTraderRole,240);}
function confirmTraderRole(){
  if(selfId==null){
    const assets={}; ASSETS.forEach(a=>assets[a.k]={hold:Math.round(traderDraft.amount/4),pnl:rnd(-2,6)});
    const t={id:traders.length,name:traderDraft.name,score:rnd(120,240),ret:rnd(-2,8),base:6,equity:1.03,color:'#0e5033',
      own:traderDraft.amount,backers:[],status:'building',day:ri(3,22),
      kyc:{id:'✓ National ID',country:'Kenya 🇰🇪',joined:'Assumed today',trades:ri(4,60)},assets,
      hist:Array.from({length:18},(_,j)=>1+0.03*(j/36)+rnd(-.02,.02)),self:true};
    traders.push(t); selfId=t.id;
  } else { traders[selfId].name=traderDraft.name; traders[selfId].own=traderDraft.amount; }
  traderSelf=selfId; closeSheet(); login('trader');
}
function completeProfile(){const t=traders[selfId];t.status='active';t.day=90;t.score=rnd(430,600);t.base=14;
  t.backers=Array.from({length:ri(9,26)},()=>({name:NAMES[ri(0,NAMES.length-1)][0]+'.',amount:ri(3,120)*1000}));
  openSheet(`<div class="sheet-grip"></div><div class="success-ico">✓</div>
    <div style="text-align:center;font-size:18px;font-weight:800">Profile complete — you can be backed!</div>
    <p class="muted" style="text-align:center;font-size:13px;margin:8px 0">Your 90-day track record is verified. Investors can now allocate capital to you, growing your AUM beyond your own funds.</p>
    <button class="btn" onclick="closeSheet();nav('dash')">See my desk →</button>`);}
function logout(){role=null;traderSelf=null;positions=[];wallet=42500;subTier="Free";invHist=[];
  document.getElementById('nav-investor').style.display='none';document.getElementById('nav-trader').style.display='none';
  document.getElementById('switchBtn').style.display='none';
  document.getElementById('login').classList.remove('hide');closeSheet();}
function nav(tab,keep){
  if(!keep)stack=[tab];
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById(VIEW[tab]).classList.add('active');
  const bar=role==='trader'?'nav-trader':'nav-investor';
  document.querySelectorAll('#'+bar+' .tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  const t=TITLES[tab]||['',''];document.getElementById('barTitle').textContent=t[0];document.getElementById('barSub').textContent=t[1];
  document.getElementById('backbtn').style.display=(tab==='trader')?'flex':'none';
  document.getElementById('views').scrollTop=0;
  const R={home:renderInvHome,leaders:()=>renderLeaders(false),portfolio:renderPortfolio,pro:renderPro,trader:renderTraderProfile,
           dash:renderTDash,markets:renderMarkets,trades:renderTrades,backers:renderBackers,earnings:renderEarnings};
  if(R[tab])R[tab]();
  closeSheet();
}
function goBack(){nav('leaders');}
/* sheet helpers */
function openSheet(html){document.getElementById('sheet').innerHTML=html;document.getElementById('sheet').classList.add('on');document.getElementById('backdrop').classList.add('on');}
function closeSheet(){document.getElementById('sheet').classList.remove('on');document.getElementById('backdrop').classList.remove('on');}

/* ============ INVESTOR ============ */
function renderInvHome(){
  const pv=portValue(),cost=positions.reduce((s,p)=>s+p.amount,0),pl=pv-cost;
  document.getElementById('v-home').innerHTML=`
    <div class="wallet">
      <div class="lbl">Fund wallet · available to invest</div>
      <div class="bal" id="hBal">${money(wallet)}</div>
      <div class="sub">Net worth <b id="hNet">${money(netWorth())}</b></div>
      <div class="acts">
        <button class="solid" onclick="fundSheet()">＋ Fund</button>
        <button onclick="withdrawSheet()">↓ Withdraw</button>
        <button onclick="nav('leaders')">📈 Invest</button>
      </div>
    </div>
    <div class="section-title">Portfolio performance · live</div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:baseline">
        <div><div class="muted" style="font-size:11px;font-weight:600">Invested value</div><div style="font-size:22px;font-weight:800" id="hInv">${money(pv)}</div></div>
        <div style="text-align:right"><div class="muted" style="font-size:11px;font-weight:600">Total P&L</div><div style="font-size:16px;font-weight:800" class="${pl>=0?'up':'down'}" id="hPl">${pl>=0?'+':''}${money(pl).slice(4)}</div></div>
      </div>
      <div id="hChart" style="margin-top:8px">${positions.length?lineChart(invHist.length>1?invHist:[cost,pv],pl>=0?'#12a150':'#e23b3b',64):'<div class="lockmsg">Back a trader to start tracking performance.</div>'}</div>
      <div class="muted" style="font-size:11px">Aggregated across ${positions.length} backing${positions.length===1?'':'s'}</div>
    </div>
    <div class="section-title">Top of the leaderboard</div>
    <div id="homeTop"></div>
    <button class="btn ghost" onclick="nav('leaders')">See full live leaderboard →</button>
    <div class="safety" style="margin-top:14px">🛡️ Money stays in your name. Traders trade it — never withdraw it. Auto-protected at −20%.</div>`;
  homeTop();
}
function homeTop(){const b=document.getElementById('homeTop');if(!b)return;
  b.innerHTML=[...pubTraders()].sort((a,b)=>b.score-a.score).slice(0,3).map((t,i)=>lrow(t,i)).join('');}
function softInvHome(){const b=document.getElementById('hBal');if(!b)return;
  document.getElementById('hNet').textContent=money(netWorth());
  const pv=portValue(),cost=positions.reduce((s,p)=>s+p.amount,0),pl=pv-cost;
  document.getElementById('hInv').textContent=money(pv);
  const e=document.getElementById('hPl');e.textContent=(pl>=0?'+':'')+money(pl).slice(4);e.className='v '+(pl>=0?'up':'down');
  if(positions.length)document.getElementById('hChart').innerHTML=lineChart(invHist.length>1?invHist:[cost,pv],pl>=0?'#12a150':'#e23b3b',64);
  homeTop();
}
/* leaderboard */
function lrow(t,rank){const tier=tierOf(t.score);
  return `<div class="lrow" data-id="${t.id}" onclick="openTrader(${t.id})">
     <div class="rank ${rank<3?'top':''}">${rank+1}</div>
     <div class="avatar" style="background:${t.color}">${t.name[0]}</div>
     <div class="nm"><div class="n">${t.name}</div><div class="meta"><span class="tier t-${tier}">${tier}</span><span class="muted" style="font-size:11px">Score ${Math.round(t.score)}</span></div></div>
     ${spark(t.hist,t.ret>=0?'#12a150':'#e23b3b')}
     <div class="rt"><div class="p ${t.ret>=0?'up':'down'}">${t.ret>=0?'+':''}${t.ret.toFixed(1)}%</div><div class="s">30-day</div></div></div>`;}
function renderLeaders(flip){
  const host=document.getElementById('v-leaders');
  if(!document.getElementById('lbList'))host.innerHTML=`<div class="section-title" style="margin-top:4px">Live · updates every second</div>
    <p class="muted" style="font-size:12px;margin:0 4px 12px">Ranked by AI Arena Score — <b>watch them move.</b></p><div id="lbList"></div>`;
  const cont=document.getElementById('lbList'),sorted=[...pubTraders()].sort((a,b)=>b.score-a.score),first={};
  if(flip)cont.querySelectorAll('.lrow').forEach(el=>first[el.dataset.id]=el.getBoundingClientRect().top);
  cont.innerHTML=sorted.map((t,i)=>lrow(t,i)).join('');
  if(flip)cont.querySelectorAll('.lrow').forEach(el=>{const id=el.dataset.id;if(first[id]!=null){const d=first[id]-el.getBoundingClientRect().top;
    if(Math.abs(d)>1){el.style.transform=`translateY(${d}px)`;el.style.transition='none';requestAnimationFrame(()=>{el.style.transition='transform .6s cubic-bezier(.2,.9,.25,1)';el.style.transform='';});}}});
}
/* portfolio with subtabs */
let portTab='overall';
function renderPortfolio(){
  const host=document.getElementById('v-portfolio');
  if(!positions.length){host.innerHTML=`<div class="empty"><div class="ico">📊</div><div style="font-weight:700;margin-bottom:6px">No investments yet</div>
    <div style="font-size:13px">Back a trader or let the AI invest for you.</div><button class="btn" style="margin-top:16px" onclick="nav('leaders')">Start investing →</button></div>`;return;}
  const pv=portValue(),cost=positions.reduce((s,p)=>s+p.amount,0),pl=pv-cost,plp=cost?pl/cost*100:0;
  host.innerHTML=`
    <div class="wallet" style="background:linear-gradient(125deg,#0a3d2a,#1a7d4a)">
      <div class="lbl">Total invested value</div><div class="bal" id="pTot">${money(pv)}</div>
      <div class="sub">Total P&L <b id="pPl">${pl>=0?'+':''}${money(pl).slice(4)} (${plp>=0?'+':''}${plp.toFixed(1)}%)</b></div>
    </div>
    <div class="subtabs" id="pSub">
      <button data-s="overall" class="${portTab==='overall'?'on':''}" onclick="setPortTab('overall')">Overall</button>
      <button data-s="trader" class="${portTab==='trader'?'on':''}" onclick="setPortTab('trader')">By trader</button>
      <button data-s="asset" class="${portTab==='asset'?'on':''}" onclick="setPortTab('asset')">By asset</button>
    </div>
    <div id="pBody"></div>
    <div class="safety" style="margin-top:6px">🛡️ If any trader falls −20%, your capital auto-exits to your wallet.</div>`;
  renderPortBody();
}
function setPortTab(s){portTab=s;document.querySelectorAll('#pSub button').forEach(b=>b.classList.toggle('on',b.dataset.s===s));renderPortBody();}
function renderPortBody(){
  const body=document.getElementById('pBody');if(!body)return;
  if(portTab==='overall'){
    const pv=portValue(),cost=positions.reduce((s,p)=>s+p.amount,0),pl=pv-cost;
    body.innerHTML=`<div class="card"><div class="muted" style="font-size:12px;font-weight:600">Collective performance over time</div>
      ${lineChart(invHist.length>1?invHist:[cost,pv],pl>=0?'#12a150':'#e23b3b',90)}
      <div class="muted" style="font-size:11px">Across ${positions.length} backing${positions.length===1?'':'s'} · updates live</div></div>`;
  }else if(portTab==='trader'){
    body.innerHTML=positions.map((p,i)=>{const v=posValue(p),pl=v-p.amount,plp=pl/p.amount*100;
      const ico=p.kind==='auto'?'🤖':p.kind==='swarm'?'🐝':'👤',col=p.kind==='trader'?traders[p.ref].color:p.kind==='auto'?'#1a7d4a':'#7b61ff';
      return `<div class="posrow" onclick="manageBacking(${i})" style="cursor:pointer">
        <div class="avatar" style="background:${col};font-size:17px">${p.kind==='trader'?p.label[0]:ico}</div>
        <div class="pi"><div class="pn">${p.label}</div><div class="pm">Backed ${money(p.amount)}${p.risk?' · '+p.risk:''} · tap to manage</div></div>
        <div class="pr"><div class="pv">${money(v)}</div><div class="pp ${pl>=0?'up':'down'}">${pl>=0?'+':''}${money(pl).slice(4)} (${plp>=0?'+':''}${plp.toFixed(1)}%)</div></div></div>`;}).join('');
  }else{
    const agg=assetAgg();
    body.innerHTML=`<div class="card">${ASSETS.map(a=>{const d=agg[a.k],plp=d.cost?(d.val-d.cost)/d.cost*100:0,pct=agg._tot?d.val/agg._tot*100:0;
      return `<div class="bd"><div class="top"><b>${a.ico} ${a.k}</b><span>${money(d.val)} · <span class="${plp>=0?'up':'down'}">${plp>=0?'+':''}${plp.toFixed(1)}%</span></span></div>
        <div class="bar"><i style="width:${pct.toFixed(0)}%;background:${plp>=0?'#12a150':'#e23b3b'}"></i></div></div>`;}).join('')}
      <div class="muted" style="font-size:11px;margin-top:8px">Your money's exposure across asset classes, aggregated from every trader you back.</div></div>`;
  }
}
function assetAgg(){const agg={_tot:0};ASSETS.forEach(a=>agg[a.k]={val:0,cost:0});
  positions.forEach(p=>{const v=posValue(p);
    if(p.kind==='trader'){const t=traders[p.ref],tot=Object.values(t.assets).reduce((s,x)=>s+x.hold,0);
      ASSETS.forEach(a=>{const wgt=t.assets[a.k].hold/tot;agg[a.k].val+=v*wgt;agg[a.k].cost+=p.amount*wgt;});}
    else ASSETS.forEach(a=>{agg[a.k].val+=v/4;agg[a.k].cost+=p.amount/4;});});
  agg._tot=ASSETS.reduce((s,a)=>s+agg[a.k].val,0);return agg;}
function softPortfolio(){if(!document.getElementById('pTot'))return;
  const pv=portValue(),cost=positions.reduce((s,p)=>s+p.amount,0),pl=pv-cost,plp=cost?pl/cost*100:0;
  document.getElementById('pTot').textContent=money(pv);
  document.getElementById('pPl').textContent=(pl>=0?'+':'')+money(pl).slice(4)+' ('+(plp>=0?'+':'')+plp.toFixed(1)+'%)';
  renderPortBody();
}

/* AI PRO (subscription tiers + sentiment) */
const TIERS={Free:{price:0},Insights:{price:500},Auto:{price:1000}};
function renderPro(){
  const sent=[
    {a:"FX",m:"EUR/USD",lab:"Bullish",conf:72,r:"Dollar softening on rate-cut expectations; momentum turning up."},
    {a:"Crypto",m:"BTC/USDT",lab:"Bullish",conf:65,r:"Inflows rising; on-chain accumulation by large holders."},
    {a:"Futures",m:"Gold",lab:"Neutral",conf:50,r:"Range-bound; watching real yields and risk sentiment."},
    {a:"Shares",m:"SCOM",lab:"Bearish",conf:58,r:"Profit-taking after earnings; short-term pullback likely."}];
  const paid=subTier!=='Free', auto=subTier==='Auto';
  document.getElementById('v-pro').innerHTML=`
    <div class="section-title" style="margin-top:4px">Your plan</div>
    ${tierCard('Free','KES 0','Free',['Live leaderboard & backing','Portfolio tracking'],['AI sentiment advice','AI Swarm auto-investing'])}
    ${tierCard('Insights','KES 500/mo','Insights',['Everything in Free','AI sentiment advice on every market','Weekly Arena report'],['AI Swarm auto-investing'])}
    ${tierCard('Auto','KES 1,000/mo','Auto',['Everything in Insights','AI invests for you via Swarm Intelligence','Priority −20% protection'],[])}
    <div class="section-title">AI sentiment advice ${paid?'':'<span class="muted" style="font-weight:600;text-transform:none">· subscribe to unlock</span>'}</div>
    <div class="${paid?'':'lock'}">
      ${sent.map(s=>{const b=s.lab==='Bullish'?'sb-bull':s.lab==='Bearish'?'sb-bear':'sb-neu',ic=s.lab==='Bullish'?'📈':s.lab==='Bearish'?'📉':'➖';
        return `<div class="sent"><div class="si" style="background:#f3f7f4">${ic}</div>
        <div class="sc"><div class="h">${s.m} <span class="sbadge ${b}">${s.lab} ${s.conf}%</span></div><div class="d">${s.r}</div></div></div>`;}).join('')}
    </div>
    ${!paid?'<div class="lockmsg">🔒 Subscribe to Insights to see live AI sentiment.</div>':''}
    ${auto?`<div class="card" style="margin-top:14px"><div style="font-weight:800;font-size:15px">🐝 AI Swarm auto-investing</div>
      <div class="muted" style="font-size:12.5px;margin:6px 0 12px">Let the AI deploy your idle wallet into a Swarm Intelligence portfolio and manage it for you.</div>
      <button class="btn" onclick="openSwarm()">Deploy wallet into Swarm →</button></div>`:''}`;
}
function tierCard(name,price,key,has,not){const active=subTier===key;
  return `<div class="tier-card ${active?'active':''}">
    <div class="th"><span class="nm">${name} ${active?'<span class="curtag">CURRENT</span>':''}</span><span class="pr">${price}</span></div>
    <ul>${has.map(h=>`<li>${h}</li>`).join('')}${not.map(n=>`<li class="no">${n}</li>`).join('')}</ul>
    ${active?'':`<button class="btn ${key==='Free'?'ghost':''}" style="margin-top:12px" onclick="subscribe('${key}')">${key==='Free'?'Downgrade to Free':'Subscribe · '+price}</button>`}</div>`;
}
function subscribe(key){
  if(key==='Free'){subTier='Free';renderPro();return;}
  openSheet(`<div class="sheet-grip"></div><div class="success-ico">✓</div>
    <div style="text-align:center;font-size:18px;font-weight:800">${key} activated</div>
    <p class="muted" style="text-align:center;font-size:13px;margin:8px 0">You're now on Arena ${key} · ${TIERS[key].price===500?'KES 500':'KES 1,000'}/month.</p>
    <div class="mirror-note">${key==='Auto'?'The AI can now invest for you using <b>Swarm Intelligence</b>, plus full sentiment advice.':'You now get <b>AI sentiment advice</b> on every market and the weekly Arena report.'}</div>
    <button class="btn" onclick="closeSheet();subTier='${key}';nav('pro')">Done</button>`);
}
/* TRADER PROFILE (investor viewing) */
function openTrader(id){currentTrader=id;nav('trader',true);}
let currentTrader=null;
function renderTraderProfile(){
  const t=traders[currentTrader],tier=tierOf(t.score),rank=[...traders].sort((a,b)=>b.score-a.score).findIndex(x=>x.id===t.id)+1;
  const backing=investorBackingTo(t.id);
  document.getElementById('v-trader').innerHTML=`
    <div class="card">
      <div class="prof-head"><div class="avatar" style="background:${t.color};width:58px;height:58px;font-size:22px">${t.name[0]}</div>
        <div style="flex:1"><div style="font-size:19px;font-weight:800">${t.name}</div>
          <div style="margin-top:5px"><span class="tier t-${tier}">${tier}</span> <span class="muted" style="font-size:12px">Rank #<b id="tpRank">${rank}</b> · Score <b id="tpScore">${Math.round(t.score)}</b></span></div></div>
        <span class="verified">✓ KYC</span></div>
      <div class="grid2" style="margin-top:14px">
        <div class="bigstat"><div class="k">30-day return</div><div class="v ${t.ret>=0?'up':'down'}" id="tpRet">${t.ret>=0?'+':''}${t.ret.toFixed(1)}%</div></div>
        <div class="bigstat"><div class="k">Total AUM</div><div class="v">${money(traderAUM(t.id))}</div></div>
      </div>
    </div>
    <div class="section-title">KYC & identity</div>
    <div class="card"><div class="kyc">
      <div class="row"><div class="k">Identity</div><div class="v">${t.kyc.id}</div></div>
      <div class="row"><div class="k">Country</div><div class="v">${t.kyc.country}</div></div>
      <div class="row"><div class="k">On Arena since</div><div class="v">${t.kyc.joined}</div></div>
      <div class="row"><div class="k">Verified trades</div><div class="v">${fmt(t.kyc.trades)}</div></div>
    </div></div>
    <div class="section-title">Portfolio · trading now</div>
    <div class="card" id="tpAssets">${assetRows(t)}</div>
    ${backing?`<div class="safety" style="margin-top:14px;background:#eef6ff;border-color:#cfe2fb;color:#1663b0">You're backing ${t.name.split(' ')[0]} with ${money(backing)}.</div>
      <div style="display:flex;gap:10px;margin-top:12px"><button class="btn" style="flex:1" onclick="openBack(${t.id})">＋ Increase</button>
      <button class="btn red" style="flex:1" onclick="withdrawBacking(${t.id})">Withdraw backing</button></div>`
      :`<button class="btn" style="margin-top:16px" onclick="openBack(${t.id})">Back ${t.name.split(' ')[0]} →</button>`}
    <div class="safety" style="margin-top:12px">✓ Verified track record · reconciled against custody · min 30-day history</div>`;
}
function assetRows(t){return ASSETS.map(a=>{const o=t.assets[a.k];return `<div class="assetrow">
   <div class="aico" style="background:${a.bg}">${a.ico}</div>
   <div class="ai"><div class="an">${a.k}</div><div class="ah">Holding ${money(o.hold)}</div></div>
   <div class="ap"><div class="v">${money(o.hold*(1+o.pnl/100))}</div><div class="pl ${o.pnl>=0?'up':'down'}">${o.pnl>=0?'+':''}${o.pnl.toFixed(1)}%</div></div></div>`;}).join('');}
function softTraderProfile(){const t=traders[currentTrader];if(!document.getElementById('tpRet'))return;
  const e=document.getElementById('tpRet');e.textContent=(t.ret>=0?'+':'')+t.ret.toFixed(1)+'%';e.className='v '+(t.ret>=0?'up':'down');
  document.getElementById('tpScore').textContent=Math.round(t.score);
  document.getElementById('tpRank').textContent=[...traders].sort((a,b)=>b.score-a.score).findIndex(x=>x.id===t.id)+1;
  document.getElementById('tpAssets').innerHTML=assetRows(t);
}
/* backing sheets */
let draft={};
function openBack(id){const t=traders[id];draft={amount:0,label:t.name,kind:'trader',ref:id,risk:null};amountSheet('Back '+t.name.split(' ')[0]);}
function openAuto(){draft={amount:0,label:'Arena Auto',kind:'auto',ref:null,risk:'Balanced'};amountSheet('Invest with Arena Auto');}
function openSwarm(){draft={amount:0,label:'Swarm Intelligence',kind:'swarm',ref:null,risk:null};amountSheet('Invest with Swarm');}
function amountSheet(title){openSheet(`<div class="sheet-grip"></div>
  <div style="text-align:center;font-size:16px;font-weight:800">${title}</div>
  <div class="amt-display"><small>KES </small><span id="amtV">0</span></div>
  <div class="muted" style="text-align:center;font-size:12px">Available: ${money(wallet)}</div>
  <div class="chips">${[1000,5000,10000,25000].map(a=>`<button class="chip" onclick="setAmt(${a})">${fmt(a)}</button>`).join('')}</div>
  <div class="keypad">${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(k=>k===''?'<div></div>':`<button onclick="key('${k}')">${k}</button>`).join('')}</div>
  <button class="btn" id="amtGo" onclick="toPin()">Continue →</button>`);draft.amount=0;renderAmt();}
function setAmt(a){draft.amount=Math.min(a,wallet);renderAmt();}
function key(k){let s=String(Math.round(draft.amount)||'');if(k==='⌫')s=s.slice(0,-1);else s=(s==='0'?'':s)+k;draft.amount=Math.min(parseInt(s||'0'),wallet);renderAmt();}
function renderAmt(){const v=document.getElementById('amtV');if(v)v.textContent=fmt(draft.amount);const g=document.getElementById('amtGo');if(g){g.style.opacity=draft.amount>=100?1:.5;}}
function toPin(){if(draft.amount<100)return;window.__pin='';
  openSheet(`<div class="sheet-grip"></div><div style="text-align:center;font-size:16px;font-weight:800">Confirm with M-PESA PIN</div>
   <p class="muted" style="text-align:center;font-size:13px;margin:8px 0">Invest <b>${money(draft.amount)}</b> · ${draft.label}</p>
   <div class="pindots" id="pd">${'<div class="pindot"></div>'.repeat(4)}</div>
   <div class="keypad">${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(k=>k===''?'<div></div>':`<button onclick="pin('${k}')">${k}</button>`).join('')}</div>
   <p class="muted" style="text-align:center;font-size:11px">Demo — enter any 4 digits</p>`);}
function pin(k){let p=window.__pin;if(k==='⌫')p=p.slice(0,-1);else if(p.length<4)p+=k;window.__pin=p;
  document.querySelectorAll('#pd .pindot').forEach((d,i)=>d.classList.toggle('f',i<p.length));if(p.length===4)setTimeout(confirmInvest,240);}
function confirmInvest(){const entryEq=draft.kind==='trader'?traders[draft.ref].equity:draft.kind==='auto'?autoIndex():swarmIndex();
  wallet-=draft.amount;positions.push({kind:draft.kind,ref:draft.ref,label:draft.label,amount:draft.amount,entryEq,risk:draft.risk});
  openSheet(`<div class="sheet-grip"></div><div class="success-ico">✓</div>
   <div style="text-align:center;font-size:19px;font-weight:800">You're in the Arena!</div>
   <p class="muted" style="text-align:center;font-size:13px;margin:8px 0">${money(draft.amount)} now backing <b>${draft.label}</b>.</p>
   <div class="mirror-note">Your money now <b>mirrors ${draft.label}</b> across FX, Crypto, Futures & Shares — cumulatively. Track it in Portfolio.</div>
   <button class="btn" onclick="closeSheet();nav('portfolio')">View Portfolio →</button>`);}
function manageBacking(i){const p=positions[i],v=posValue(p),pl=v-p.amount;
  openSheet(`<div class="sheet-grip"></div><div style="text-align:center;font-size:17px;font-weight:800">${p.label}</div>
   <p class="muted" style="text-align:center;font-size:13px;margin:6px 0">Value ${money(v)} · <span class="${pl>=0?'up':'down'}">${pl>=0?'+':''}${money(pl).slice(4)}</span></p>
   ${p.kind==='trader'?`<button class="btn" onclick="closeSheet();openBack(${p.ref})">＋ Increase backing</button>`:''}
   <button class="btn red" style="margin-top:10px" onclick="exitPosition(${i})">Withdraw · ${money(v)} to wallet</button>
   <button class="btn ghost" style="margin-top:10px" onclick="closeSheet()">Cancel</button>`);}
function exitPosition(i){wallet+=posValue(positions[i]);positions.splice(i,1);if(!positions.length)invHist=[];closeSheet();nav('portfolio');}
function withdrawBacking(id){const i=positions.findIndex(p=>p.kind==='trader'&&p.ref===id);if(i>=0)exitPosition(i);}
/* fund & withdraw */
function fundSheet(){openSheet(`<div class="sheet-grip"></div><div style="text-align:center;font-size:17px;font-weight:800">Fund your wallet</div>
  <p class="muted" style="text-align:center;font-size:12.5px;margin:6px 0 10px">Top up from your M-PESA balance.</p>
  <div class="chips" style="flex-wrap:wrap">${[1000,5000,10000,50000].map(a=>`<button class="chip" onclick="fund(${a})">+${fmt(a)}</button>`).join('')}</div>
  <button class="btn ghost" style="margin-top:8px" onclick="closeSheet()">Done</button>`);}
function fund(a){wallet+=a;closeSheet();nav('home');}
function withdrawSheet(){openSheet(`<div class="sheet-grip"></div><div style="text-align:center;font-size:17px;font-weight:800">Withdraw to M-PESA</div>
  <div class="amt-display"><small>KES </small>${fmt(wallet)}</div>
  <p class="muted" style="text-align:center;font-size:12.5px;margin:2px 0 14px">Payouts route only to your own M-PESA number — never anywhere else.</p>
  <button class="btn dark" onclick="wallet=0;closeSheet();nav('home')">Withdraw ${money(wallet)} →</button>
  <button class="btn ghost" style="margin-top:10px" onclick="closeSheet()">Cancel</button>`);}

/* ============ TRADER ============ */
const PLATFORMS=[{n:"FXPesa · Forex",s:"CMA-licensed broker",i:"💱",bg:"#e8f1fb"},
 {n:"VASP Exchange · Crypto",s:"Regulated venue",i:"🪙",bg:"#f0ecfb"},
 {n:"CFD Partner · Futures",s:"Commodity futures",i:"📈",bg:"#e9f7ee"},
 {n:"NSE via Ziidi · Shares",s:"Equities execution",i:"📊",bg:"#fbf3df"}];
function platformList(){return PLATFORMS.map(p=>`<div class="plat"><div class="pl-i" style="background:${p.bg}">${p.i}</div>
  <div class="pl-t"><div class="n">${p.n}</div><div class="s">${p.s}</div></div>
  <div style="display:flex;align-items:center;gap:7px"><span class="dot-on"></span><span style="font-size:11px;font-weight:700;color:var(--up)">Connected</span></div></div>`).join('');}
function renderTDash(){const t=traders[traderSelf],tier=tierOf(t.score),aum=traderAUM(t.id),building=t.status==='building',pct=Math.min(100,Math.round(t.day/90*100));
  document.getElementById('t-dash').innerHTML=`
    <div class="wallet" style="background:linear-gradient(125deg,#08130d,#155c3a)">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="avatar" style="background:${t.color};width:46px;height:46px;font-size:19px">${t.name[0]}</div>
        <div><div style="font-size:12px;opacity:.8">Trader role · trading as</div><div style="font-size:19px;font-weight:800">${t.name}</div>
          <div style="margin-top:4px"><span style="background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.28);padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700">🔐 Can trade · cannot withdraw</span></div></div>
        <span class="tier t-${tier}" style="margin-left:auto">${tier}</span></div>
      <div class="acts" style="margin-top:16px"><button class="solid" onclick="nav('markets')">📈 Trade</button><button onclick="nav('earnings')">💰 Earnings</button></div>
    </div>
    ${building?`<div class="card" style="margin-top:12px;border:2px solid #f0d98a;background:#fffaf0">
      <div style="font-weight:800;font-size:15px">🧠 Building your Arena profile</div>
      <div class="muted" style="font-size:12.5px;margin:6px 0 10px;line-height:1.5">Day <b>${t.day}</b> of 90. Trade your own capital while the AI verifies your track record — risk-adjusted returns, consistency &amp; discipline. <b>Backing unlocks after 90 days.</b></div>
      <div class="bar" style="height:12px"><i style="width:${pct}%;background:var(--gold)"></i></div>
      <div class="muted" style="font-size:11px;margin-top:5px">${pct}% complete · not yet eligible for backing</div>
      <button class="btn" style="margin-top:12px" onclick="completeProfile()">▶ Simulate 3 months (demo)</button></div>`:''}
    <div class="grid2" style="margin-top:12px">
      ${building?`<div class="bigstat"><div class="k">Trading wallet (your capital)</div><div class="v">${money(t.own)}</div></div>
      <div class="bigstat"><div class="k">Profile</div><div class="v">Day ${t.day}<small>/90</small></div></div>
      <div class="bigstat"><div class="k">30-day return</div><div class="v ${t.ret>=0?'up':'down'}" id="dRet">${t.ret>=0?'+':''}${t.ret.toFixed(1)}%</div></div>
      <div class="bigstat"><div class="k">Backing</div><div class="v" style="color:var(--muted)">🔒 Locked</div></div>`
      :`<div class="bigstat"><div class="k">Total AUM (money you manage)</div><div class="v" id="dAum">${money(aum)}</div></div>
      <div class="bigstat"><div class="k">People backing you</div><div class="v" id="dBk">${traderBackerCount(t.id)}</div></div>
      <div class="bigstat"><div class="k">30-day return</div><div class="v ${t.ret>=0?'up':'down'}" id="dRet">${t.ret>=0?'+':''}${t.ret.toFixed(1)}%</div></div>
      <div class="bigstat"><div class="k">Your own capital</div><div class="v">${money(t.own)}</div></div>`}
    </div>
    <div class="section-title">Performance by asset class</div>
    <div class="card" id="dBreak">${assetBars(t)}</div>
    <div class="section-title">Connected platforms · orchestrated via API</div>
    ${platformList()}
    <div class="safety" style="margin-top:12px">🔗 Arena only orchestrates &amp; monitors. Every order routes to these licensed venues and is time-stamped.</div>`;
}
function assetBars(t){const tot=Object.values(t.assets).reduce((s,a)=>s+a.hold,0);
  return ASSETS.map(a=>{const o=t.assets[a.k],pct=o.hold/tot*100;
    return `<div class="bd"><div class="top"><b>${a.ico} ${a.k}</b><span>${money(o.hold)} · <span class="${o.pnl>=0?'up':'down'}">${o.pnl>=0?'+':''}${o.pnl.toFixed(1)}%</span></span></div>
      <div class="bar"><i style="width:${pct.toFixed(0)}%;background:${o.pnl>=0?'#12a150':'#e23b3b'}"></i></div></div>`;}).join('');}
function softTDash(){const t=traders[traderSelf];const rt=document.getElementById('dRet');if(!rt)return;
  const aum=document.getElementById('dAum');if(aum)aum.textContent=money(traderAUM(t.id));
  rt.textContent=(t.ret>=0?'+':'')+t.ret.toFixed(1)+'%';rt.className='v '+(t.ret>=0?'up':'down');
  const b=document.getElementById('dBreak');if(b)b.innerHTML=assetBars(t);}
/* MARKETS — live candles */
function renderMarkets(){
  document.getElementById('t-markets').innerHTML=`
    <div class="mkt-pills" id="mktPills">${ASSETS.map(a=>`<button class="mkt-pill ${a.mkt===curMkt?'on':''}" onclick="setMkt('${a.mkt}')">${a.mkt}</button>`).join('')}</div>
    <div class="chartcard"><div class="ch-top"><div><div style="font-size:12px;opacity:.7" id="mkName">${curMkt}</div><div class="pr" id="mkPx"></div></div>
      <div id="mkChg" style="font-weight:800"></div></div>
      <div id="mkChart"></div></div>
    <div style="display:flex;gap:10px;margin-top:12px"><button class="btn" style="flex:1;background:var(--up);box-shadow:none" onclick="placeTrade('BUY')">Buy</button>
      <button class="btn red" style="flex:1;box-shadow:none" onclick="placeTrade('SELL')">Sell</button></div>
    <div class="section-title">Connected platforms</div>${platformList()}
    <div class="safety" style="margin-top:6px">🔗 Prices & execution stream from licensed venues via consumed APIs. Arena monitors — it never holds the risk.</div>`;
  softMarkets();
}
function setMkt(m){curMkt=m;document.querySelectorAll('#mktPills .mkt-pill').forEach(b=>b.classList.toggle('on',b.textContent===m));softMarkets();}
function softMarkets(){const arr=candles[curMkt];if(!arr||!document.getElementById('mkChart'))return;
  const a=ASSETS.find(x=>x.mkt===curMkt),last=arr[arr.length-1],first=arr[0].o,chg=(last.c-first)/first*100;
  document.getElementById('mkName').textContent=curMkt;
  document.getElementById('mkPx').textContent=last.c.toLocaleString('en-US',{minimumFractionDigits:a.dp,maximumFractionDigits:a.dp});
  const e=document.getElementById('mkChg');e.textContent=(chg>=0?'▲ +':'▼ ')+chg.toFixed(2)+'%';e.style.color=chg>=0?'#2fd06e':'#ff5a5a';
  document.getElementById('mkChart').innerHTML=candleChart(arr,180);}
function placeTrade(side){const a=ASSETS.find(x=>x.mkt===curMkt),px=candles[curMkt][candles[curMkt].length-1].c;
  tradeLog.unshift({side,asset:a.k,mkt:a.mkt,qty:ri(1,25),px,dp:a.dp,t:clock()});
  const o=traders[traderSelf].assets[a.k];o.pnl+=side==='BUY'?rnd(0,0.5):rnd(-0.3,0.3);
  openSheet(`<div class="sheet-grip"></div><div class="success-ico" style="background:${side==='BUY'?'#12a150':'#e23b3b'}">${side==='BUY'?'↑':'↓'}</div>
    <div style="text-align:center;font-size:18px;font-weight:800">${side} ${a.mkt}</div>
    <p class="muted" style="text-align:center;font-size:13px;margin:8px 0">Order routed to the connected venue and time-stamped. Your backers mirror this automatically.</p>
    <button class="btn" onclick="closeSheet();nav('trades')">View activity →</button>`);}
/* TRADES feed */
function renderTrades(){const host=document.getElementById('t-trades');
  if(!tradeLog.length){host.innerHTML=`<div class="empty"><div class="ico">📿</div><div style="font-weight:700">Monitoring…</div><div style="font-size:13px;margin-top:4px">Your trades will appear here in real time.</div></div>`;return;}
  host.innerHTML=`<div class="section-title" style="margin-top:4px">Live activity · every order monitored</div>
    ${tradeLog.map((x,i)=>`<div class="tfeed ${i===0?'newflash':''}"><div class="tside ${x.side.toLowerCase()}">${x.side}</div>
      <div class="ti"><div class="a">${x.mkt} <span class="muted" style="font-weight:600">· ${x.asset}</span></div><div class="m">Qty ${x.qty} @ ${x.px.toLocaleString('en-US',{minimumFractionDigits:x.dp,maximumFractionDigits:x.dp})} · ${x.t}</div></div>
      <div class="tp muted">routed ✓</div></div>`).join('')}`;}
/* BACKERS */
function renderBackers(){const t=traders[traderSelf];
  if(t.status==='building'){document.getElementById('t-backers').innerHTML=`<div class="empty"><div class="ico">🔒</div>
    <div style="font-weight:700;margin-bottom:6px">Backing not unlocked yet</div>
    <div style="font-size:13px;max-width:280px;margin:0 auto">You're on day ${t.day} of your 90-day profile build. Once complete, investors can back you and your AUM grows beyond your own capital.</div>
    <button class="btn" style="margin-top:16px" onclick="completeProfile()">▶ Simulate 3 months (demo)</button></div>`;return;}
  const aum=traderAUM(t.id);
  const list=[...t.backers,...positions.filter(p=>p.kind==='trader'&&p.ref===t.id).map(p=>({name:'You',amount:p.amount}))];
  document.getElementById('t-backers').innerHTML=`
    <div class="grid2"><div class="bigstat"><div class="k">Total AUM</div><div class="v" id="bkAum">${money(aum)}</div></div>
      <div class="bigstat"><div class="k">Backers</div><div class="v">${list.length}</div></div></div>
    <div class="section-title">Who's backing you</div>
    <div class="card">${list.sort((a,b)=>b.amount-a.amount).map(b=>`<div class="backer-row">
      <div class="ba" style="background:${b.name==='You'?'#12a150':AV[b.name.charCodeAt(0)%AV.length]}">${b.name[0]}</div>
      <div class="bn">${b.name==='You'?'You (via investor login)':b.name+' •••'}</div><div class="bm">${money(b.amount)}</div></div>`).join('')}</div>
    <div class="safety" style="margin-top:12px">🛡️ You trade this capital — you can never withdraw it. It stays in each backer's name.</div>`;}
function softBackers(){if(document.getElementById('bkAum'))document.getElementById('bkAum').textContent=money(traderAUM(traderSelf));}
/* EARNINGS */
function earnCalc(){const t=traders[traderSelf],aum=traderAUM(t.id),gross=aum*(t.ret/100);
  if(gross<=0)return{aum,gross,carry:0,company:0,net:0,inv:gross};
  const carry=gross*0.175,company=carry*0.275,net=carry-company,inv=gross-carry;return{aum,gross,carry,company,net,inv};}
function renderEarnings(){const t=traders[traderSelf];
  if(t.status==='building'){document.getElementById('t-earnings').innerHTML=`<div class="empty"><div class="ico">💰</div>
    <div style="font-weight:700;margin-bottom:6px">No carry yet — you're in profile build</div>
    <div style="font-size:13px;max-width:290px;margin:0 auto">For your first 90 days you trade only your own capital, so there's no backer profit to share yet. Once backing unlocks, you earn <b>17.5% carry</b> on the profit you make for investors.</div>
    <button class="btn" style="margin-top:16px" onclick="completeProfile()">▶ Simulate 3 months (demo)</button></div>`;return;}
  const e=earnCalc();
  document.getElementById('t-earnings').innerHTML=`
    <div class="wallet" style="background:linear-gradient(125deg,#0a3d2a,#1a7d4a)">
      <div class="lbl">Profit you'd earn (this period)</div><div class="bal" id="eNet">${money(e.net)}</div>
      <div class="sub">On ${money(e.aum)} AUM · ${(traders[traderSelf].ret).toFixed(1)}% return</div></div>
    <div class="section-title">How the profit splits</div>
    <div class="card">
      <div class="split" id="eSplit"></div>
      <div class="earn-row"><span class="lab">Gross profit generated</span><span class="amt" id="eGross">${money(e.gross)}</span></div>
      <div class="earn-row"><span class="lab">↳ Investors keep (their gains)</span><span class="amt">${money(e.inv)}</span></div>
      <div class="earn-row"><span class="lab">↳ Your carry (17.5%)</span><span class="amt up" id="eCarry">${money(e.carry)}</span></div>
      <div class="earn-row"><span class="lab">↳ Arena / Safaricom cut (27.5% of carry)</span><span class="amt" id="eCo">${money(e.company)}</span></div>
      <div class="earn-row" style="border-top:2px solid var(--line);margin-top:4px;padding-top:10px"><span class="lab" style="font-weight:800;color:var(--ink)">You take home</span><span class="amt up" style="font-size:16px">${money(e.net)}</span></div>
    </div>
    <div class="mirror-note">You earn <b>17.5% of the profit</b> you make for backers. Arena takes <b>27.5% of your carry</b> as the platform fee. High-water mark: you only earn on <b>new</b> profit above your last peak — no profit, no fee.</div>
    <div class="safety">✓ Every figure reconciled against custody records · paid only on realised gains</div>`;
  drawSplit(e);
}
function drawSplit(e){const el=document.getElementById('eSplit');if(!el)return;const tot=e.gross||1;
  const iv=Math.max(0,e.inv/tot*100),ca=Math.max(0,e.net/tot*100),co=Math.max(0,e.company/tot*100);
  el.innerHTML=`<div style="width:${iv}%;background:#1a7d4a">${iv>14?'Investors':''}</div><div style="width:${ca}%;background:#12a150">${ca>12?'You':''}</div><div style="width:${co}%;background:var(--gold)">${co>10?'Arena':''}</div>`;}
function softEarnings(){const e=earnCalc();if(!document.getElementById('eNet'))return;
  document.getElementById('eNet').textContent=money(e.net);document.getElementById('eGross').textContent=money(e.gross);
  document.getElementById('eCarry').textContent=money(e.carry);document.getElementById('eCo').textContent=money(e.company);drawSplit(e);}

/* ============ INIT ============ */
setInterval(tick,1400);
