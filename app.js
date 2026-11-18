const CAMPUS={lat:11.0168,lng:76.9558,name:"Your campus canteen"};
const PARTNERS=[
{id:1,n:"Anbu Illam Orphanage",t:"Orphanage",lat:11.0262,lng:76.9701,ph:"+91 90000 11001",cap:60},
{id:2,n:"Annai Teresa Children's Home",t:"Orphanage",lat:11.0071,lng:76.9402,ph:"+91 90000 11002",cap:45},
{id:3,n:"Thulir Food Bank (NGO)",t:"NGO",lat:11.0410,lng:76.9460,ph:"+91 90000 11003",cap:120},
{id:4,n:"Seva Community Kitchen",t:"Collection centre",lat:10.9890,lng:76.9810,ph:"+91 90000 11004",cap:150},
{id:5,n:"Karunai Old Age Home",t:"NGO",lat:11.0620,lng:77.0120,ph:"+91 90000 11005",cap:40},
{id:6,n:"Hope Street Shelter",t:"Collection centre",lat:10.9560,lng:76.9290,ph:"+91 90000 11006",cap:80},
{id:7,n:"Green Valley Dairy Farm",t:"Cattle farm",farm:1,lat:11.0305,lng:76.9120,ph:"+91 90000 33001",cap:200},
{id:8,n:"Kamadhenu Goshala",t:"Cattle farm",farm:1,lat:10.9780,lng:76.9950,ph:"+91 90000 33002",cap:150},
{id:9,n:"Sri Murugan Cattle Farm",t:"Cattle farm",farm:1,lat:11.0520,lng:76.9840,ph:"+91 90000 33003",cap:120}];
const km=(a,b,c,d)=>{const r=x=>x*Math.PI/180,h=Math.sin(r(c-a)/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(r(d-b)/2)**2;return 12742*Math.asin(Math.sqrt(h))};
PARTNERS.forEach(p=>{p.d=km(CAMPUS.lat,CAMPUS.lng,p.lat,p.lng);p.b=Math.atan2(p.lng-CAMPUS.lng,p.lat-CAMPUS.lat)});
PARTNERS.sort((a,b)=>a.d-b.d);
const AG=["0-5 yrs","6-12 yrs","13-17 yrs","18-59 yrs","60+ yrs"];
const RES={1:[6,20,18,4,0],2:[4,14,16,3,0],3:[10,25,20,45,20],4:[15,35,30,50,20],5:[0,0,0,8,32],6:[5,10,10,40,15]};
const CAT={7:120,8:85,9:60};PARTNERS.forEach(p=>{if(p.farm){p.res=CAT[p.id];p.ag=null}else{p.ag=RES[p.id];p.res=p.ag.reduce((a,b)=>a+b,0)}});
const agTxt=a=>a.map((n,i)=>n?AG[i]+": "+n:"").filter(Boolean).join(" · ");
const SL=[["b","Breakfast"],["l","Lunch"],["s","Snack"],["d","Dinner"]];
const POOL={veg:{b:["Pongal & puttu","Idiyappam & upma","Idly","Dosa","Poori","Noodles"],
l:["White rice + sambar","White rice + kara kozhambu","White rice + vatha kozhambu","White rice + mor kozhambu","Sambar rice","Curd rice + pickle","Pudina rice","Tomato rice","Tamarind rice"],
s:["Vada","Bajji","Veg puff","Samosa","Biscuit","Black chenna / peanut","Kara sev"],
d:["Ghee rice","Veg biriyani","Paratha","Idly","Veg pulao","Chappathi","White rice & sambar"]},
nonveg:{l:["White rice + chicken kuzhambu","White rice + fish kuzhambu","White rice + egg kuzhambu","White rice + mutton kuzhambu"],
d:["Chicken biriyani","Mutton biriyani","Egg biriyani","Chappathi + chicken curry"]}};
const pool=(m,s)=>POOL[m][s]||POOL.veg[s];
const NVD=[1,4];
const served=(m,i)=>m==="veg"||NVD.includes(i);
const TD=new Date(new Date().setHours(0,0,0,0)),WD0=(TD.getDay()+6)%7;
const START=new Date(TD);START.setDate(START.getDate()+7-WD0);
const DAYS=[...Array(7)].map((_,i)=>{const d=new Date(START);d.setDate(d.getDate()+i);return d});
const opts=(m,i,s)=>{const P=pool(m,s);return[0,1,2].map(k=>P[(i*3+k)%P.length])};
const seed=(m,i,s,k)=>((i*7+k*13+(m==="veg"?3:5)+s.charCodeAt(0)%7)*37)%41+8;
let S={user:null,mode:"veg",tab:"vote",day:0,votes:{},sent:[],sel:{},fb:[],att:{},msgs:[],notes:[],ov:{},vw:{from:"08:00",to:"20:00"},pend:[],seen:0,dmsg:[],conf:[],prof:{},acc:{},sp:{reqs:[],pick:{}},chat:[],cs:{}};
const SB=(SUPABASE_URL&&SUPABASE_ANON_KEY&&window.supabase)?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
const WK=START.toLocaleDateString("en-CA");
S.vr={};let VT=null;
try{const x=JSON.parse(localStorage.getItem("sfs2")||"null");if(x){S.vr=x.vr||{};S.sent=x.sent||[];S.fb=x.fb||[];S.att=x.att||{};S.msgs=x.msgs||[];S.notes=x.notes||[];S.ov=x.ov||{};S.vw=x.vw||S.vw;S.pend=x.pend||[];S.seen=x.seen||0;S.dmsg=x.dmsg||[];S.conf=x.conf||[];S.prof=x.prof||{};S.acc=x.acc||{};S.sp=x.sp||S.sp;S.chat=x.chat||[];S.cs=x.cs||{}}}catch(e){}
let _rp=false;
const safeNow=()=>!BKF&&!FW&&!(document.activeElement&&document.activeElement.matches&&document.activeElement.matches("input,textarea,select"));
const liveRender=()=>{const y=scrollY;render();scrollTo(0,y)};
function onRemote(){VT=null;clearTimeout(onRemote.t);onRemote.t=setTimeout(()=>{if(!S.user)return;if(S.user.role==="authority")notifyConf("a");if(S.user.role==="donor")notifyConf("d",S.user.name);if(safeNow())liveRender();else _rp=true},120)}
setInterval(()=>{if(_rp&&S.user&&safeNow()){_rp=false;liveRender()}},1000);
setInterval(()=>SYNC.pull().then(ch=>{if(ch)onRemote()}),20000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)SYNC.pull().then(ch=>{if(ch)onRemote()})});
const SYNC=createSync(S,SB,localStorage,onRemote);
let _sw=0;function syncWarn(e){if(Date.now()-_sw<15000)return;_sw=Date.now();toast("Cloud sync problem: "+((e&&(e.code||e.message))||"unknown")+". Changes are only on this device for now.")}
if(!SYNC.enabled)setTimeout(()=>toast("Cloud sync is OFF: add your config at the top of the script. Data stays on this device."),4600);
const save=()=>{try{localStorage.setItem("sfs2",JSON.stringify({vr:S.vr,sent:S.sent,fb:S.fb,att:S.att,msgs:S.msgs,notes:S.notes,ov:S.ov,vw:S.vw,pend:S.pend,seen:S.seen,dmsg:S.dmsg,conf:S.conf,prof:S.prof,acc:S.acc,sp:S.sp,chat:S.chat,cs:S.cs}))}catch(e){}VT=null;SYNC.push()};
setTimeout(()=>SYNC.start(),0);
const tally=()=>{if(VT)return VT;VT={};for(const id in S.vr){const r=S.vr[id];if(r.w!==WK)continue;const k=[r.m,r.i,r.s,r.k]+"";VT[k]=(VT[k]||0)+1}return VT};
const vid=(m,i,s)=>WK+"|"+S.user.name+"|"+m+"|"+i+"|"+s;
const castVote=(m,i,s,k)=>{S.vr[vid(m,i,s)]={w:WK,u:S.user.name,m,i,s,k,t:Date.now()};VT=null};
const voteTotal=()=>Object.values(S.vr).filter(r=>r.w===WK).length;

const cnt=(m,i,s,k)=>seed(m,i,s,k)+(tally()[[m,i,s,k]]||0);
const mine=(m,i,s)=>{const r=S.user&&S.vr[vid(m,i,s)];return r?r.k:undefined};
const win=(m,i,s)=>{const ov=S.ov[m+"|"+i];if(ov&&ov[s])return ov[s];const o=opts(m,i,s);let b=0;o.forEach((_,k)=>{if(cnt(m,i,s,k)>cnt(m,i,s,b))b=k});return o[b]};
const twin=(m,s)=>{const mm=served(m,WD0)?m:"veg",o=opts(mm,WD0,s);let b=0;o.forEach((_,k)=>{if(seed(mm,WD0,s,k)>seed(mm,WD0,s,b))b=k});return o[b]};
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fd=d=>d.toLocaleDateString("en-IN",{day:"numeric",month:"short"});
const NP=()=>S.user&&S.user.role==="partner"?S.sent.filter(s=>{const t=s.to.find(t=>t[2]===S.user.pid);return t&&(t[3]||"Pending")==="Pending"}).length:0;
const det=s=>{const a=s.to.find(t=>t[3]==="Accepted");if(!a||!a[4])return"";const d=a[4];return`<div class="note" style="margin-top:10px"><b>Collector details · ${esc(a[0])}</b><br>${esc(d.n)} · ${esc(d.ph)}${d.v?" · "+esc(d.v):""}<br>${d.c} people coming · arriving ${d.ar}<br>${d.f?d.r+" cattle":d.r+" people present: "+AG.map((g,i)=>d.ag[i]?g+" "+d.ag[i]:"").filter(Boolean).join(", ")}</div>`};
const bk=s=>{const a=s.to.find(t=>t[3]==="Accepted");return a?"Booked by "+a[0]:"Open for booking"};
const ico={star:'<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',vote:'<path d="M5 12l5 5L20 7"/>',menu:'<path d="M4 6h16M4 12h16M4 18h10"/>',map:'<path d="M12 21s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',bell:'<path d="M6 16V11a6 6 0 1112 0v5l2 2H4zM10 21h4"/>',log:'<path d="M5 4h14v16H5zM9 9h6M9 13h6"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'};
const MESS=[{id:1,n:"Hostel mess",kind:"Veg and non-veg",sup:"Mr. Selvam",ph:"+91 90000 22001",svc:"Breakfast, lunch, snacks, dinner",cap:1000}];
const tk=()=>new Date().toLocaleDateString("en-CA");
const hm=s=>{const a=s.split(":");return +a[0]*60+ +a[1]};
const vopen=()=>{const d=new Date(),m=d.getHours()*60+d.getMinutes();return m>=hm(S.vw.from)&&m<hm(S.vw.to)};
const UN=()=>S.notes.filter(n=>n.t>S.seen).length;
const MN=()=>S.user&&S.user.role==="mess"?S.msgs.filter(m=>m.kind==="ins"&&m.mess===S.user.pid&&!m.reply).length:0;
const RN=()=>S.msgs.filter(m=>m.reply&&!m.rseen).length;
const THS=r=>r==="institution"?["authority|institution","institution|mess"]:r==="authority"?["authority|institution"]:r==="mess"?["institution|mess"]:[];
const thN=(r,th)=>S.chat.filter(m=>m.th===th&&m.from!==r&&m.t>(S.cs[r+"@"+th]||0)).length;
const CN=()=>{const r=S.user&&S.user.role;return r?THS(r).reduce((n,th)=>n+thN(r,th),0):0};
const attN=d=>d?(d.n!=null?d.n:(d.rows?Object.values(d.rows).reduce((a,r)=>a+r[0]+r[1],0):0)):0;
const bdg=k=>{const n=k==="inbox"?NP():k==="upd"?UN():k==="minbox"?MN():k==="mess"?RN():k==="dm"?DN():k==="im"||k==="msg"?CN():0;return n?`<i class="bdg">${n}</i>`:""};
const net=()=>{const e=document.querySelector("#net");if(e){e.textContent=navigator.onLine?(typeof SYNC!=="undefined"&&!SYNC.enabled?"Local only":"Online"):"Offline";e.style.background=navigator.onLine?"#d9f2e4":"#ffe0d6"}};
const pinfo=p=>p.farm?`<b>${p.res} cattle</b> · uses food waste as feed`:`<b>${p.res} people</b> · ${agTxt(p.ag)}`;
let FOR="people";
let AC=null;
const ac=()=>{try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==="suspended")AC.resume();return AC}catch(e){return null}};
const tone=(f,t0,d,v,ty)=>{const a=ac();if(!a)return;const o=a.createOscillator(),g=a.createGain(),n=a.currentTime+t0;o.type=ty||"sine";o.frequency.value=f;g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(v,n+.012);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(a.destination);o.start(n);o.stop(n+d+.05)};
const chime=()=>{tone(392,0,.18,.12,"triangle");[523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,.08+i*.11,.55,.16,"triangle"));tone(1568,.5,.5,.06)};
const bell=()=>{[[880,1.5,.26],[2429,1,.1],[4752,.6,.05],[1320,1.1,.08]].forEach(x=>tone(x[0],0,x[1],x[2]));[[880,1.4,.2],[2429,.9,.08]].forEach(x=>tone(x[0],.5,x[1],x[2]))};
const say=t=>{try{if(window.speechSynthesis){const u=new SpeechSynthesisUtterance(t);u.rate=1;speechSynthesis.cancel();speechSynthesis.speak(u)}}catch(e){}};
function pop(t,s){
 document.querySelectorAll(".pop").forEach(x=>x.remove());
 const e=document.createElement("div");e.className="pop";e.setAttribute("role","status");
 e.innerHTML=`<div><span style="flex:1"><b>${esc(t)}</b><span class="mu">${esc(s)}</span></span><svg class="bell" viewBox="0 0 24 24" width="28" height="28"><path d="M12 3a6 6 0 00-6 6v4l-2 3h16l-2-3V9a6 6 0 00-6-6z" fill="#f5a623"/><path d="M10 19a2 2 0 004 0z" fill="#d98a0b"/></svg></div>`;
 document.body.append(e);bell();say(t);e.onclick=()=>e.remove();setTimeout(()=>e.remove(),5500);
}
function notifyConf(f,name){const L=S.conf.filter(c=>!c[f]&&(f==="a"||c.src===name));if(!L.length)return;L.forEach(c=>c[f]=1);save();pop("Order confirmed",L.length===1?L[0].food+" · "+L[0].q+" count booked by "+L[0].partner:L.length+" orders were confirmed by partners")}
function toast(t){const e=document.createElement("div");e.className="toast";e.setAttribute("role","status");e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),3200)}
/* ---- Accounts: nobody has a default password. Each person registers with their own profile and sets their own password. ---- */
const SH=(()=>{const K=[],H0=[];let n=2,c=0;while(c<64){let p=true;for(let i=2;i*i<=n;i++)if(n%i===0){p=false;break}if(p){if(c<8)H0[c]=(Math.pow(n,.5)%1*4294967296)|0;K[c++]=(Math.cbrt(n)%1*4294967296)|0}n++}
 return s=>{const b=[...new TextEncoder().encode(s)],l=b.length*8;b.push(128);while(b.length%64!==56)b.push(0);for(let i=7;i>=0;i--)b.push(i>3?0:(l>>>(i*8))&255);
  const h=H0.slice(),w=new Array(64);
  for(let o=0;o<b.length;o+=64){for(let i=0;i<16;i++)w[i]=(b[o+i*4]<<24)|(b[o+i*4+1]<<16)|(b[o+i*4+2]<<8)|b[o+i*4+3];
   for(let i=16;i<64;i++){const x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(((x>>>7)|(x<<25))^((x>>>18)|(x<<14))^(x>>>3))+w[i-7]+(((y>>>17)|(y<<15))^((y>>>19)|(y<<13))^(y>>>10)))|0}
   let [a,bb,cc,d,e,f,g,hh]=h;
   for(let i=0;i<64;i++){const t1=(hh+(((e>>>6)|(e<<26))^((e>>>11)|(e<<21))^((e>>>25)|(e<<7)))+((e&f)^(~e&g))+K[i]+w[i])|0,t2=((((a>>>2)|(a<<30))^((a>>>13)|(a<<19))^((a>>>22)|(a<<10)))+((a&bb)^(a&cc)^(bb&cc)))|0;hh=g;g=f;f=e;e=(d+t1)|0;d=cc;cc=bb;bb=a;a=(t1+t2)|0}
   [a,bb,cc,d,e,f,g,hh].forEach((v,i)=>h[i]=(h[i]+v)|0)}
  return h.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("")}})();
const hpw=(pw,salt)=>{let h=SH(salt+"|"+pw);for(let i=0;i<2000;i++)h=SH(h+salt);return h};
const sal=()=>{try{return Array.from(crypto.getRandomValues(new Uint8Array(12)),x=>x.toString(16).padStart(2,"0")).join("")}catch(e){return Math.random().toString(36).slice(2)+Date.now().toString(36)}};
const ORGR=r=>r==="partner"||r==="mess"||r==="donor";
const ORGL=r=>r==="mess"?MESS:r==="donor"?DONORS.concat([OTHER]):PARTNERS;
const pfFields=(role,pid)=>PF[role].filter(([f])=>!(role==="student"&&f==="id")&&!(ORGR(role)&&f==="org")&&!(role==="donor"&&pid===99&&["ct","ph","addr"].includes(f)));
function startSession(role,name,pid,ex,ak){
 S.user={name,role,pid,...ex,ak};S.tab={student:"vote",authority:"att",institution:"ov",mess:"minbox",partner:"inbox",donor:"offer"}[role];render();
 if(role==="partner"&&NP())toast("You have "+NP()+" new surplus food alert"+(NP()>1?"s":""));
 if(role==="student"&&UN())toast("You have "+UN()+" new menu update"+(UN()>1?"s":""));if(role==="authority")notifyConf("a");if(role==="donor")notifyConf("d",S.user.name)}
function login(mode){const reg=mode==="reg";document.body.classList.remove("nv","about-bg","bg-veg","bg-nv");
 $("#app").innerHTML=`<div style="padding-top:6vh">
 <h1 style="margin-top:6px">Plan meals. Waste less. Share the rest.</h1>
 <div class="card" style="margin-top:16px"><h2 style="margin:0 0 6px">${reg?"Create your account":"Sign in"}</h2>
 <label for="rl">${reg?"Register as":"Sign in as"}</label><select id="rl"><option value="student">Student</option><option value="authority">Dining admin</option><option value="institution">Institution authority</option><option value="mess">Mess</option><option value="partner">Partner (orphanage, NGO, cattle farm)</option><option value="donor">Food donor (anyone)</option></select>
 <div id="uw"><label for="u">Name or ID</label><input id="u" autocomplete="username" placeholder="e.g. 22CS104"></div>
 <div id="pw" hidden><label for="po">Organisation</label><select id="po"></select></div>
 <div id="ow" hidden>${reg?`<label for="on2">Your name</label><input id="on2" autocomplete="name">`:""}<label for="op2">Phone number${reg?"":" (your login ID)"}</label><input id="op2" inputmode="tel" maxlength="10" placeholder="10 digits">${reg?`<label for="oa2">Area / address</label><input id="oa2" placeholder="Street, area">`:""}</div>
 ${reg?`<div id="pfw"></div>`:""}
 <label for="p">${reg?"Create a password":"Password"}</label><input id="p" type="password" autocomplete="${reg?"new-password":"current-password"}"${reg?' placeholder="At least 6 characters"':""}>
 ${reg?`<label for="p2">Confirm password</label><input id="p2" type="password" autocomplete="new-password">`:""}
 <div id="er" class="mu" style="color:var(--nv);min-height:20px"></div><button class="btn" id="go">${reg?"Create account":"Sign in"}</button>
 <button class="btn g" id="sw" style="width:100%;margin-top:8px">${reg?"I already have an account":"New here? Create account"}</button></div></div>`;
 const oth=()=>$("#rl").value==="donor"&&$("#po").value==="99";
 const rpf=()=>{if(!reg)return;const r=$("#rl").value;$("#pfw").innerHTML=pfFields(r,ORGR(r)?+$("#po").value:0).map(([f,l,t,p])=>t==="select"?`<label for="rf_${f}">${l}</label><select id="rf_${f}">${p.map(o=>`<option>${o}</option>`).join("")}</select>`:`<label for="rf_${f}">${l}</label><input id="rf_${f}" type="${t}" ${t==="number"?'min="0" inputmode="numeric"':""} placeholder="${esc(p)}">`).join("")};
 const ow=()=>{$("#ow").hidden=!oth();rpf()};
 const opt=r=>{const o=ORGR(r);$("#uw").hidden=o;$("#pw").hidden=!o;$("#po").innerHTML=ORGL(r).map(p=>`<option value="${p.id}">${esc(p.n)}</option>`).join("");ow()};
 opt("student");$("#rl").onchange=()=>opt($("#rl").value);$("#po").onchange=ow;
 const go=()=>{const role=$("#rl").value,org=ORGR(role),er=m=>{$("#er").textContent=m},pw=$("#p").value,
   o=org?ORGL(role).find(p=>p.id==$("#po").value):null,ot=org&&o.id===99,ph=ot?$("#op2").value.trim():"";
  let name,ak,ex={};
  if(!org){name=$("#u").value.trim();if(!name)return er("Enter your name or ID.");ak=role+"|"+name.toLowerCase()}
  else if(!ot){name=o.n;ak=role+"|#"+o.id}
  else{if(!/^\d{10}$/.test(ph))return er("Enter a valid 10-digit phone number.");ak="donor|99|"+ph;name=reg?$("#on2").value.trim():""}
  if(!pw)return er("Enter your password.");
  if(reg){
   if(ot){if(!name)return er("Enter your name.");const ad=$("#oa2").value.trim();if(!ad)return er("Enter your area or address.");ex={ph,addr:ad}}
   const prof={};pfFields(role,org?o.id:0).forEach(([f])=>{const e=$("#rf_"+f);const v=e?e.value.trim():"";if(v)prof[f]=v});
   const pv=ot?ph:(prof.ph||"");
   if(!/^(\+?91)?\d{10}$/.test(pv.replace(/[\s-]/g,"")))return er("Enter a valid 10-digit phone number.");
   if(prof.em&&!/^\S+@\S+\.\S+$/.test(prof.em))return er("Enter a valid email address.");
   if(pw.length<6)return er("Password must be at least 6 characters.");
   if(pw!==$("#p2").value)return er("The two passwords do not match.");
   if(S.acc[ak])return er("An account already exists for this ID. Please sign in.");
   const s=sal();S.acc[ak]={s,h:hpw(pw,s),n:name,...(ot?ex:{})};
   if(Object.keys(prof).length)S.prof[role+"|"+name]=prof;
   save();toast("Account created");startSession(role,name,org?o.id:0,ex,ak);return}
  const fin=()=>{const a=S.acc[ak];if(!a)return 0;if(a.h!==hpw(pw,a.s))return -1;startSession(role,a.n||name,org?o.id:0,ot?{ph:a.ph,addr:a.addr}:{},ak);return 1};
  const r=fin();if(r===1)return;if(r===-1)return er("Wrong password.");
  er("Checking...");Promise.resolve(SYNC.pull()).catch(()=>0).then(()=>{const r2=fin();if(r2===-1)er("Wrong password.");else if(r2===0)er("No account found. Tap Create account to register first.")})};
 $("#go").onclick=go;$("#sw").onclick=()=>login(reg?"in":"reg");$("#p").onkeydown=e=>{if(e.key==="Enter"&&!reg)go()};
}
const TABS={student:[["vote","Vote","vote"],["menu","Menu","menu"],["sp","Special menu","star"],["upd","Updates","bell"],["fb","Feedback","star"]],
authority:[["att","Attendance","log"],["sp","Special menu","star"],["im","Institution","info"],["mess","Mess","menu"],["dm","Donor messages","bell"],["chg","Menu change","vote"],["surplus","Surplus","bell"],["menu","Votes","menu"],["map","Partners","map"],["log","Sent","log"]],
institution:[["ov","Overview","menu"],["sp","Special menu","star"],["msg","Messages","bell"]],
mess:[["minbox","Instructions","bell"],["im","Institution","info"]],
partner:[["inbox","Alerts","bell"]],
donor:[["offer","Offer food","bell"],["mine","My messages","log"]]};
const ROLE={student:"Student",authority:"Dining admin",institution:"Institution authority",mess:"Mess",partner:"Partner",donor:"Food donor"};
function render(){
 if(!S.user)return login();
 document.body.classList.toggle("nv",S.mode==="nonveg"&&S.user.role==="student"&&S.tab!=="about");document.body.classList.toggle("about-bg",S.tab==="about");{const st=S.user.role==="student"&&S.tab!=="about";document.body.classList.toggle("bg-veg",st&&S.mode==="veg");document.body.classList.toggle("bg-nv",st&&S.mode==="nonveg")}
 const r=S.user.role,tabs=TABS[r],sm=r==="student"&&S.tab==="vote";
 $("#app").innerHTML=`<div class="top"><div class="dml"><img src="assets/logo.png" width="38" height="38" alt="" style="border-radius:50%;background:#fff"><span>D-mealz</span></div><div style="display:flex;gap:6px;align-items:center"><span id="net" class="tag"></span><button class="btn g tb pf ${S.tab==="profile"?"on":""}" id="pf" aria-label="My profile" title="My profile">${esc(S.user.name.trim().charAt(0).toUpperCase()||"?")}</button><button class="btn g tb ${S.tab==="about"?"on":""}" id="ab">About</button><button class="btn g tb" id="lo">Sign out</button></div></div>
 <div class="seg" id="md" role="group" aria-label="Diet mode" ${sm?"":'style="display:none"'}><button data-m="veg" class="${S.mode==="veg"?"on":""}">Veg mode</button><button data-m="nonveg" class="${S.mode==="nonveg"?"on":""}">Non-veg mode</button></div>
 <div class="mu" style="margin:8px 0 14px">${esc(S.user.name)} · ${ROLE[r]}</div><div id="v"></div>
 <nav class="nav">${tabs.map(t=>`<button data-t="${t[0]}" class="${S.tab===t[0]?"on":""}"><svg viewBox="0 0 24 24">${ico[t[2]]}</svg>${t[1]}${bdg(t[0])}</button>`).join("")}</nav>`;
 $("#lo").onclick=()=>{S.user=null;render()};
 $("#pf").onclick=()=>{S.tab="profile";render();scrollTo(0,0)};
 $("#ab").onclick=()=>{S.tab="about";render();scrollTo(0,0)};
 $("#md").onclick=e=>{if(e.target.dataset.m){S.mode=e.target.dataset.m;render()}};
 document.querySelector(".nav").onclick=e=>{const b=e.target.closest("button");if(b){S.tab=b.dataset.t;render();scrollTo(0,0)}};
 ({vote:vVote,menu:vMenu,map:vMap,surplus:vSurplus,log:vLog,about:vAbout,inbox:vInbox,fb:vFeedback,upd:vUpd,att:vAtt,mess:vMess,chg:vChg,ov:vOv,minbox:vMinbox,sp:vSpecial,im:vChat,msg:vChat,dm:vDm,offer:vOffer,mine:vMine,profile:vProfile})[S.tab]();
 net();
}
function vVote(){
 const m=S.mode,open=vopen(),list=DAYS.map((_,k)=>k).filter(k=>served(m,k));
 if(!list.includes(S.day))S.day=list[0];
 const i=S.day,wk=fd(DAYS[0])+" to "+fd(DAYS[6]);
 const msg=open?"Voting is open until "+S.vw.to+".":"Voting is closed. Opens "+S.vw.from+" to "+S.vw.to+".";
 $("#v").innerHTML=`<h1>Vote for next week</h1>
 <div class="note" style="margin-bottom:10px">${msg}${S.pend.length?` <b>${S.pend.length} vote${S.pend.length>1?"s":""} saved offline, will sync when you are online.</b>`:""}</div>
 <div class="days" id="ds">${list.map(k=>{const d=DAYS[k];return`<button class="d ${k===i?"on":""}" data-i="${k}"><small>${d.toLocaleDateString("en-IN",{weekday:"short"})}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString("en-IN",{month:"short"})}</small></button>`}).join("")}</div>
 ${SL.map(([s,label])=>{const o=opts(m,i,s),tot=o.reduce((a,_,k)=>a+cnt(m,i,s,k),0),w=win(m,i,s);
 return`<h2>${label} · ${fd(DAYS[i])}</h2>`+(s==="l"&&m==="veg"?`<p class="mu" style="margin:-4px 0 8px">Served with rasam, poriyal / koottu, pickle and butter milk.</p>`:"")+o.map((n,k)=>`<button class="opt ${mine(m,i,s)===k?"me":""}" style="${open?"":"opacity:.65"}" data-s="${s}" data-k="${k}"><div class="bar" style="width:${cnt(m,i,s,k)/tot*100}%"></div><div class="row"><span class="dots"><i></i>${esc(n)}</span><span><b>${cnt(m,i,s,k)}</b> ${n===w?'<span class="tag">Leading</span>':""}</span></div></button>`).join("")}).join("")}`;
 $("#ds").onclick=e=>{const b=e.target.closest(".d");if(b){S.day=+b.dataset.i;render()}};
 document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{if(!open){toast("Voting is closed right now.");return}
  const s=b.dataset.s,k=+b.dataset.k,p=mine(m,i,s);if(p===k)return;
  castVote(m,i,s,k);

  if(!navigator.onLine)S.pend.push({t:Date.now(),m,i,s,k});save();render()});
}
function vMenu(){
 const adm=S.user.role!=="student",ms=adm?["veg","nonveg"]:[S.mode],wk=fd(DAYS[0])+" to "+fd(DAYS[6]);
 $("#v").innerHTML=`<h1>${adm?"Vote results":"Menu"}</h1>`+ms.map(m=>`${adm?`<h2>${m==="veg"?"Vegetarian":"Non-vegetarian (Tue and Fri)"}</h2>`:""}`+DAYS.map((d,i)=>{if(!served(m,i))return"";const o=S.ov[m+"|"+i]||{};return`<div class="card" style="padding:10px 12px"><div class="row"><b>${d.toLocaleDateString("en-IN",{weekday:"long"})}</b><span class="mu">${fd(d)}</span></div><table>${SL.map(([s,l])=>`<tr><td class="mu" style="width:84px">${l}</td><td>${esc(win(m,i,s))}${o[s]?' <span class="tag">Updated</span>':""}</td></tr>`).join("")}</table></div>`}).join("")).join("");
}
function vMap(){
 const W=320,c=W/2,max=Math.max(...PARTNERS.concat(DONORS).map(p=>p.d))*1.15,sc=(c-24)/max;
 const rings=[2,4,6,8].filter(r=>r<max);
 $("#v").innerHTML=`<h1>Nearby partners, cattle farms and food sources</h1>
 <div class="card"><svg viewBox="0 0 ${W} ${W}" width="100%" role="img" aria-label="Map of partners around the campus">
 ${rings.map(r=>`<circle cx="${c}" cy="${c}" r="${r*sc}" fill="none" stroke="var(--ln)" stroke-dasharray="3 3"/><text x="${c+4}" y="${c-r*sc-2}" font-size="9" fill="var(--mu)">${r} km</text>`).join("")}
 ${PARTNERS.map((p,k)=>{const x=c+Math.sin(p.b)*p.d*sc,y=c-Math.cos(p.b)*p.d*sc;return`<circle cx="${x}" cy="${y}" r="9" fill="${p.farm?"#8fae4a":"var(--ac)"}"/><text x="${x}" y="${y+3.5}" font-size="10" font-weight="700" text-anchor="middle" fill="#2a1d00">${k+1}</text>`}).join("")}
 ${DONORS.map((p,k)=>{const x=c+Math.sin(p.b)*p.d*sc,y=c-Math.cos(p.b)*p.d*sc;return`<rect x="${x-8}" y="${y-8}" width="16" height="16" rx="4" fill="#2f80ed"/><text x="${x}" y="${y+3.5}" font-size="9" font-weight="700" text-anchor="middle" fill="#fff">${PARTNERS.length+k+1}</text>`}).join("")}<circle cx="${c}" cy="${c}" r="8" fill="var(--pr)"/><text x="${c}" y="${c+22}" font-size="10" text-anchor="middle" fill="var(--tx)">Campus</text></svg></div>
 ${PARTNERS.map((p,k)=>`<div class="card"><div class="row"><b>${k+1}. ${esc(p.n)}</b><span class="dist">${p.d.toFixed(1)} km</span></div><div class="mu">${p.t} · takes up to ${p.cap} servings · ${p.ph}</div><div class="mu">${pinfo(p)}</div><p style="margin:8px 0 0"><a href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}" target="_blank" rel="noopener">Open in Maps</a></p></div>`).join("")}${donorList()}`;
}
let SF=[{n:"",ty:"veg",q:""}],SFX={c:"",p:"",x:""};
function syncSF(){document.querySelectorAll("[data-sk]").forEach(e=>{const r=SF[+e.dataset.sk];if(r)r[e.dataset.sf]=e.value});if($("#fc")){SFX.c=$("#fc").value;SFX.p=$("#fp").value;SFX.x=$("#fx").value}}
function vSurplus(){
 PARTNERS.forEach(p=>{if(!(p.id in S.sel))S.sel[p.id]=p.d<=6});
 const tot=()=>SF.reduce((a,r)=>a+(+r.q>0?+r.q:0),0);
 $("#v").innerHTML=`<h1>Report surplus food</h1>${foodList()}<div class="seg" id="ff" style="margin:10px 0 14px"><button data-f="people" class="${FOR==="people"?"on":""}">Food for people</button><button data-f="cattle" class="${FOR==="cattle"?"on":""}">Waste for cattle feed</button></div>
 <div class="st"><div><b>${S.sent.length}</b><span class="mu">Alerts sent</span></div><div><b>${S.sent.reduce((a,s)=>a+(s.to.some(t=>t[3]==="Accepted")?s.q:0),0)}</b><span class="mu">Quantity accepted</span></div><div><b>${S.sent.reduce((a,s)=>a+s.to.filter(t=>t[3]==="Accepted").length,0)}</b><span class="mu">Pickups confirmed</span></div></div>
 ${SF.map((r,k)=>`<div class="card" style="padding:12px 14px"><div class="row"><b>Food ${k+1}</b>${SF.length>1?`<button class="btn g" data-srm="${k}" style="width:auto;padding:5px 12px;font-size:12px">Remove</button>`:""}</div>
 <label for="sn${k}">Food name</label><input id="sn${k}" data-sf="n" data-sk="${k}" list="fl" autocomplete="off" value="${esc(r.n)}" placeholder="Pick from the list or type">
 <div class="two"><div><label for="st${k}">Type</label>${typeSel("st"+k,`data-sf="ty" data-sk="${k}"`,r.ty)}</div>
 <div><label for="sq${k}">Quantity / count</label><input id="sq${k}" data-sf="q" data-sk="${k}" type="number" min="1" inputmode="numeric" value="${r.q}"></div></div></div>`).join("")}
 <button class="btn g" id="sadd" style="width:100%;margin:2px 0 12px">+ Add food</button>
 <div class="card"><div class="row"><b>Total quantity / count</b><b id="stot">${tot()}</b></div>
 <div class="two"><div><label for="fc">Cooked at</label><input id="fc" type="time" value="${SFX.c}"></div><div><label for="fp">Pickup by</label><input id="fp" type="time" value="${SFX.p}"></div></div>
 <label for="fx">Notes (storage, allergens)</label><textarea id="fx" rows="2" placeholder="Kept hot in covered containers">${esc(SFX.x)}</textarea>
 <label class="chk" style="font-weight:500"><input type="checkbox" id="fs"><span>I confirm this food is fresh, stored safely and fit to eat.</span></label></div>
 <h2>Send to</h2>${PARTNERS.filter(p=>!!p.farm===(FOR==="cattle")).map(p=>`<label class="chk"><input type="checkbox" data-p="${p.id}" ${S.sel[p.id]?"checked":""}><span style="flex:1"><b>${esc(p.n)}</b><br><span class="mu">${p.t} · up to ${p.cap} servings</span><br><span class="mu">${pinfo(p)}</span></span><span class="dist">${p.d.toFixed(1)} km</span></label>`).join("")}
 <div id="er" class="mu" style="color:var(--nv);min-height:20px"></div><button class="btn" id="sn">Send notification</button>`;
 $("#ff").onclick=e=>{const f=e.target.dataset.f;if(f){syncSF();FOR=f;render()}};
 document.querySelectorAll("[data-sk]").forEach(e=>e.oninput=()=>{SF[+e.dataset.sk][e.dataset.sf]=e.value;$("#stot").textContent=tot()});
 $("#sadd").onclick=()=>{syncSF();SF.push({n:"",ty:"veg",q:""});render();setTimeout(()=>{const i=$("#sn"+(SF.length-1));if(i)i.focus()},50)};
 document.querySelectorAll("[data-srm]").forEach(b=>b.onclick=()=>{syncSF();SF.splice(+b.dataset.srm,1);render()});
 document.querySelectorAll("[data-p]").forEach(c=>c.onchange=()=>S.sel[c.dataset.p]=c.checked);
 $("#sn").onclick=()=>{syncSF();const rows=SF.filter(r=>r.n.trim()||r.q!==""),to=PARTNERS.filter(p=>S.sel[p.id]&&!!p.farm===(FOR==="cattle"));
  const bad=rows.find(r=>!r.n.trim()||!(+r.q>0));
  const err=!rows.length?"Add at least one food item.":bad?(!bad.n.trim()?"Enter the food name for each row.":"Enter a quantity / count for "+bad.n.trim()+"."):!SFX.p?"Set a pickup-by time.":!to.length?"Select at least one partner.":!$("#fs").checked?"Confirm the food is safe to share.":"";
  $("#er").textContent=err;if(err)return;
  const items=rows.map(r=>({n:r.n.trim(),ty:r.ty,q:+r.q})),ts=[...new Set(items.map(i=>i.ty))],ty=ts.length===1?ts[0]:"both";
  S.sent.unshift({t:Date.now(),fw:FOR==="cattle",n:items.map(i=>i.n+" × "+i.q).join(", "),ty,q:items.reduce((a,i)=>a+i.q,0),items,c:SFX.c,p:SFX.p,x:SFX.x.trim(),to:to.map(p=>[p.n,p.d,p.id,"Pending"])});save();
  SF=[{n:"",ty:"veg",q:""}];SFX={c:"",p:"",x:""};
  S.tab="log";render();toast("Alert sent to "+to.length+" partner"+(to.length>1?"s":""))};
}
function vLog(){
 $("#v").innerHTML=`<h1>Sent notifications</h1>`+(S.sent.length?S.sent.map(s=>`<div class="card"><div class="row"><b>${esc(s.n)}</b><span class="tag">${tyl(s.ty)}</span></div>${itemsHtml(s)}
 <div class="mu">${s.src?`<b>${esc(s.src.n)}</b> · `:""}<b style="color:var(--pr)">${bk(s)}</b> · ${s.q} count · ${s.c?"cooked "+s.c+" · ":""}pickup by ${s.p} · ${new Date(s.t).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</div>${s.x?`<p style="margin:6px 0 0">${esc(s.x)}</p>`:""}
 <table style="margin-top:8px">${s.to.map(t=>`<tr><td>${esc(t[0])}</td><td>${esc(t[3]||"Pending")}</td><td class="dist" style="text-align:right">${t[1].toFixed(1)} km</td></tr>`).join("")}</table>${det(s)}</div>`).join("")
 :`<div class="card"><p>No alerts sent yet.</p><button class="btn" id="g">Report surplus food</button></div>`);
 const g=$("#g");if(g)g.onclick=()=>{S.tab="surplus";render()};
}
let FB={it:0,r:0,tags:[],c:""};
function vFeedback(){
 const m=S.mode,items=SL.map(([x,l])=>[l,twin(m,x)]),tg=["Tasty","Hot and fresh","Good portion","Too salty","Too oily","Served cold"];
 const L=S.fb.filter(f=>f.u===S.user.name).slice(0,5);
 const avg=n=>{const a=S.fb.filter(f=>f.n===n);return a.length?(a.reduce((s,f)=>s+f.r,0)/a.length).toFixed(1)+" out of 5 from "+a.length:"No ratings yet"};
 $("#v").innerHTML=`<h1>Rate today's food</h1>
 <div class="card"><label for="fi">What are you rating?</label><select id="fi">${items.map((t,k)=>`<option value="${k}" ${k===FB.it?"selected":""}>${t[0]}: ${esc(t[1])}</option>`).join("")}</select>
 <div class="mu" style="margin:-6px 0 10px">Average so far: ${avg(items[FB.it][1])}</div>
 <label>Your rating</label><div class="stars" id="sr" role="radiogroup" aria-label="Rating">${[1,2,3,4,5].map(n=>`<button class="${n<=FB.r?"on":""}" data-n="${n}" role="radio" aria-checked="${n===FB.r}" aria-label="${n} star${n>1?"s":""}">&#9733;</button>`).join("")}</div>
 <label>Quick tags</label><div class="tags" id="tg">${tg.map(t=>`<button class="${FB.tags.includes(t)?"on":""}" data-g="${t}">${t}</button>`).join("")}</div>
 <label for="fc2">Comments (optional)</label><textarea id="fc2" rows="3" maxlength="300" placeholder="Tell us more">${esc(FB.c)}</textarea>
 <div id="er" class="mu" style="color:var(--nv);min-height:20px"></div><button class="btn" id="fsb">Submit feedback</button></div>
 <h2>Your recent feedback</h2>`+(L.length?L.map(f=>`<div class="card"><div class="row"><b>${esc(f.n)}</b><span class="stl">${"★".repeat(f.r)}${"☆".repeat(5-f.r)}</span></div><div class="mu">${new Date(f.t).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}${f.g.length?" · "+f.g.join(", "):""}</div>${f.c?`<p style="margin:6px 0 0">${esc(f.c)}</p>`:""}</div>`).join(""):`<p class="mu">You have not rated anything yet.</p>`);
 const sync=()=>{FB.c=$("#fc2").value;FB.it=+$("#fi").value};
 $("#fi").onchange=()=>{sync();render()};
 $("#sr").onclick=e=>{const b=e.target.closest("button");if(b){sync();FB.r=+b.dataset.n;render()}};
 $("#tg").onclick=e=>{const b=e.target.closest("button");if(b){sync();const t=b.dataset.g,i=FB.tags.indexOf(t);i<0?FB.tags.push(t):FB.tags.splice(i,1);render()}};
 $("#fsb").onclick=()=>{sync();if(!FB.r){$("#er").textContent="Choose a star rating first.";return}
  S.fb.unshift({t:Date.now(),u:S.user.name,n:items[FB.it][1],ty:m,r:FB.r,g:FB.tags.slice(),c:FB.c.trim()});save();
  FB={it:FB.it,r:0,tags:[],c:""};render();toast("Thanks for your feedback")};
}
let BKF=null;
function vBook(){
 const id=S.user.pid,p=PARTNERS.find(x=>x.id===id),s=S.sent.find(x=>x.t===BKF),f=!!p.farm;
 $("#v").innerHTML=`<h1>Confirm your booking</h1>
 <div class="card"><h2 style="margin-top:0">Collector</h2><label for="bn">Collector name</label><input id="bn" autocomplete="name"><div class="two"><div><label for="bp">Phone number</label><input id="bp" inputmode="tel" maxlength="10" placeholder="10 digits"></div><div><label for="bv">Vehicle number</label><input id="bv" placeholder="Optional"></div></div><div class="two"><div><label for="bc">People coming</label><input id="bc" type="number" min="1" value="1"></div><div><label for="ba">Arrival time</label><input id="ba" type="time"></div></div></div>
 <div class="card"><h2 style="margin-top:0">${f?"Cattle at ":"People at "}${esc(p.n)}</h2><label for="br">${f?"Number of cattle":"Total people present today"}</label><input id="br" type="number" min="0" value="${p.res}">${f?"":`<div class="two">${AG.map((g,i)=>`<div><label for="g${i}">${g}</label><input id="g${i}" type="number" min="0" value="${p.ag[i]}"></div>`).join("")}</div>`}</div>
 <label class="chk" style="font-weight:400"><input type="checkbox" id="bk"><span>I confirm these details are correct and we will collect before ${s.p}.</span></label>
 <div id="er" class="mu" style="color:var(--nv);min-height:20px"></div><div class="two"><button class="btn g" id="bx" style="width:100%;padding:11px">Cancel</button><button class="btn" id="bo">Confirm booking</button></div>`;
 $("#bx").onclick=()=>{BKF=null;render()};
 $("#bo").onclick=()=>{const n=$("#bn").value.trim(),ph=$("#bp").value.trim(),ar=$("#ba").value,c=+$("#bc").value,r=+$("#br").value,ag=f?[]:AG.map((_,i)=>+$("#g"+i).value||0),sum=ag.reduce((a,b)=>a+b,0);
  const err=!n?"Enter the collector's name.":!/^\d{10}$/.test(ph)?"Enter a valid 10-digit phone number.":!(c>0)?"Enter how many people are coming.":!ar?"Set your arrival time.":(!f&&sum!==r)?"Age groups add up to "+sum+" but total people present is "+r+".":!$("#bk").checked?"Tick the confirmation to continue.":"";
  $("#er").textContent=err;if(err)return;
  if(s.to.some(t=>t[3]==="Accepted")){BKF=null;render();toast("Sorry, this food was just booked by another partner");return}
  s.to.forEach(t=>{if(t[2]===id){t[3]="Accepted";t[4]={n,ph,v:$("#bv").value.trim(),c,ar,r,ag,f}}else if((t[3]||"Pending")==="Pending")t[3]="Out of stock"});
  S.conf.push({t:Date.now(),food:s.n,q:s.q,partner:p.n,src:s.src?s.src.n:"",a:0,d:0});BKF=null;save();render();pop("Order confirmed",s.n+" · "+s.q+" count. Collect before "+s.p)};
}
function vInbox(){
 if(BKF)return vBook();const id=S.user.pid,p=PARTNERS.find(x=>x.id===id),L=S.sent.filter(s=>s.to.some(t=>t[2]===id));
 $('#v').innerHTML=`<h1>Food alerts</h1>`+(L.length?L.map(s=>{const t=s.to.find(t=>t[2]===id),sv=t[3]||"Pending";return`<div class="card" style="${sv==="Out of stock"?"opacity:.6":""}"><div class="row"><b>${esc(s.n)}</b><span class="tag">${tyl(s.ty)}</span></div>${itemsHtml(s)}<div class="mu">${s.src?"From "+esc(s.src.n)+" ("+esc(s.src.type)+")"+(s.src.ph?" · "+s.src.ph:"")+" · ":""}${s.q} count · pickup by ${s.p} · ${(s.src?t[1]:p.d).toFixed(1)} km away</div>${s.x?`<p style="margin:6px 0">${esc(s.x)}</p>`:""}<p style="margin:8px 0"><a href="https://www.google.com/maps/search/?api=1&query=${s.src?s.src.lat:CAMPUS.lat},${s.src?s.src.lng:CAMPUS.lng}" target="_blank" rel="noopener">${s.src?"Directions to "+esc(s.src.n):"Directions to canteen"}</a></p>${sv==="Pending"?`<div class="two"><button class="btn" data-a="Accepted" data-t="${s.t}">Book this food</button><button class="btn g" data-a="Declined" data-t="${s.t}">Decline</button></div>`:sv==="Out of stock"?`<span class="tag" style="background:var(--nv);color:#fff">Out of stock</span> <span class="mu">Already booked by another partner</span>`:`<span class="tag">${sv==="Accepted"?"Booked by you":sv}</span>`}</div>`}).join(""):`<div class="card"><p>No alerts yet. Surplus food alerts from the canteen appear here.</p></div>`);
 document.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{const s=S.sent.find(x=>x.t==b.dataset.t);
  if(b.dataset.a==="Accepted"&&s.to.some(t=>t[3]==="Accepted")){render();toast("Sorry, this food was just booked by another partner");return}
  if(b.dataset.a==="Accepted"){BKF=s.t;render();scrollTo(0,0);return}s.to.find(t=>t[2]===id)[3]=b.dataset.a;
  if(b.dataset.a==="Accepted")s.to.forEach(t=>{if(t[2]!==id&&(t[3]||"Pending")==="Pending")t[3]="Out of stock"});
  save();render();toast(b.dataset.a==="Accepted"?"Booked. Please collect before "+s.p:"Declined")});
}
function vUpd(){
 const sn=S.seen;
 $("#v").innerHTML=`<h1>Menu updates</h1>`+(S.notes.length?S.notes.map(n=>`<div class="card"><div class="row"><b>${esc(n.title)}</b>${n.t>sn?'<span class="tag">New</span>':""}</div><p style="margin:6px 0 4px">${esc(n.body)}</p><div class="mu">${new Date(n.t).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</div></div>`).join(""):`<div class="card"><p>No updates yet.</p></div>`);
 S.seen=Date.now();save();const b=document.querySelector('[data-t="upd"] .bdg');if(b)b.remove();
}
function vChg(){
 $("#v").innerHTML=`<h1>Menu changes and voting hours</h1>
 <h2>Voting hours for students</h2><div class="card"><div class="two"><div><label for="vf">Opens</label><input id="vf" type="time" value="${S.vw.from}"></div><div><label for="vt">Closes</label><input id="vt" type="time" value="${S.vw.to}"></div></div><div id="e1" class="mu" style="color:var(--nv)"></div><button class="btn" id="vs">Save voting hours</button></div>
 <h2>Change a day's menu</h2><div class="card"><div class="two"><div><label for="cd">Day</label><select id="cd">${DAYS.map((d,k)=>`<option value="${k}">${fd(d)} · ${d.toLocaleDateString("en-IN",{weekday:"short"})}</option>`).join("")}</select></div><div><label for="cm">Applies to</label><select id="cm"><option value="both">Veg and non-veg</option><option value="veg">Veg only</option><option value="nonveg">Non-veg only</option></select></div></div>
 <label for="cb">New breakfast (empty keeps the current one)</label><input id="cb"><label for="cn">New lunch (empty keeps the current one)</label><input id="cn"><label for="cs">New snack (empty keeps the current one)</label><input id="cs"><label for="cdn">New dinner (empty keeps the current one)</label><input id="cdn"><label for="cr">Reason</label><input id="cr" placeholder="e.g. Vegetable delivery delayed">
 <div id="er" class="mu" style="color:var(--nv);min-height:20px"></div><button class="btn" id="cp">Publish and notify students</button></div>
 <h2>Recent notifications</h2>`+(S.notes.slice(0,5).map(n=>`<div class="card"><b>${esc(n.title)}</b><p class="mu" style="margin:4px 0 0">${esc(n.body)}</p></div>`).join("")||`<p class="mu">None sent yet.</p>`);
 $("#vs").onclick=()=>{const f=$("#vf").value,t=$("#vt").value;if(!f||!t||hm(f)>=hm(t)){$("#e1").textContent="Closing time must be later than opening time.";return}S.vw={from:f,to:t};save();toast("Voting hours saved")};
 $("#cp").onclick=()=>{const d=+$("#cd").value,sc=$("#cm").value,rs=$("#cr").value.trim(),nv={b:$("#cb").value.trim(),l:$("#cn").value.trim(),s:$("#cs").value.trim(),d:$("#cdn").value.trim()};
  if(!SL.some(([k])=>nv[k])){$("#er").textContent="Enter at least one new item.";return}
  const tg=(sc==="both"?["veg","nonveg"]:[sc]).filter(m=>served(m,d));
  if(!tg.length){$("#er").textContent="Non-veg is served only on Tuesday and Friday.";return}
  tg.forEach(m=>{const k=m+"|"+d,o=Object.assign({},S.ov[k]);SL.forEach(([x])=>{if(nv[x])o[x]=nv[x]});S.ov[k]=o});
  S.notes.unshift({t:Date.now(),title:"Menu updated for "+fd(DAYS[d]),body:(tg.length>1?"Veg and non-veg":tg[0]==="veg"?"Veg":"Non-veg")+": "+SL.filter(([x])=>nv[x]).map(([x,l])=>l+" is now "+nv[x]+". ").join("")+(rs?"Reason: "+rs:"")});
  save();render();toast("Students have been notified")};
}
function vAtt(){
 const d=S.att[tk()],H=Object.keys(S.att).sort().reverse().slice(0,7);
 $("#v").innerHTML=`<h1>Today's attendance</h1>
 <div class="card"><label for="an">Students present today</label><input id="an" type="number" min="0" inputmode="numeric" value="${d?attN(d):""}">
 <div id="er" class="mu" style="color:var(--nv);min-height:20px"></div><button class="btn" id="as">${d?"Update count":"Save count"}</button>${d?`<p class="mu" style="margin:10px 0 0">Updated ${ft(d.t)}</p>`:""}</div>
 ${H.length?`<h2>Last 7 days</h2><div class="card"><table><tr><th>Date</th><th>Attendance</th></tr>${H.map(k=>`<tr><td>${new Date(k+"T00:00:00").toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}</td><td><b>${attN(S.att[k])}</b></td></tr>`).join("")}</table></div>`:""}
 ${d?`<button class="btn g" id="tm" style="width:100%">Send this count to the mess</button>`:""}`;
 $("#as").onclick=()=>{const v=$("#an").value;if(v===""||!(+v>=0)||!Number.isInteger(+v)){$("#er").textContent="Enter a whole number, 0 or more.";return}
  S.att[tk()]={n:+v,by:S.user.name,t:Date.now()};save();render();toast("Attendance saved")};
 const t=$("#tm");if(t)t.onclick=()=>{S.tab="mess";render()};
}
function vOv(){
 const d=S.att[tk()],tot=attN(d),fb=S.fb,av=fb.length?(fb.reduce((a,f)=>a+f.r,0)/fb.length).toFixed(1):"-",acc=S.sent.reduce((a,s)=>a+s.to.filter(t=>t[3]==="Accepted").length,0),vt=voteTotal(),tile=(n,l)=>`<div><b>${n}</b><span class="mu">${l}</span></div>`;
 $("#v").innerHTML=`<h1>Institution overview</h1>
 <div class="st">${tile(d?tot:"-","Attendance today")}${tile(vt,"Votes cast")}${tile(av,"Avg food rating")}</div>
 <div class="st">${tile(S.sent.length,"Surplus alerts")}${tile(acc,"Pickups confirmed")}${tile(Object.keys(S.ov).length,"Menu changes")}</div>
 <h2>Today's menu</h2><div class="card"><table><tr><th></th><th>Veg</th><th>Non-veg</th></tr>${SL.map(([x,l])=>`<tr><td><b>${l}</b></td><td>${esc(twin("veg",x))}</td><td>${served("nonveg",WD0)?esc(twin("nonveg",x)):'<span class="mu">Not served today</span>'}</td></tr>`).join("")}</table></div>
 <h2>Mess communication</h2><div class="card"><p style="margin:0">${S.msgs.filter(m=>m.kind==="ins").length} instructions sent, ${S.msgs.filter(m=>m.reply).length} replies received.</p></div>
 ${(()=>{const H=Object.keys(S.att).sort().reverse().slice(0,7);return H.length?`<h2>Attendance, last 7 days</h2><div class="card"><table><tr><th>Date</th><th>Count</th></tr>${H.map(k=>`<tr><td>${new Date(k+"T00:00:00").toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}</td><td><b>${attN(S.att[k])}</b></td></tr>`).join("")}</table></div>`:""})()}
 <div class="two"><button class="btn" id="gm" data-p="authority">Message dining admin</button><button class="btn g" id="gx" data-p="mess" style="width:100%">Message mess</button></div>`;
 $("#gm").onclick=$("#gx").onclick=e=>{CH.peer=e.currentTarget.dataset.p;S.tab="msg";render()};
}
let MS={mess:1,meal:"Lunch",t:""};
function vMess(){
 const d=S.att[tk()],M={Breakfast:1,Lunch:1,Snacks:1,Dinner:1},ms=MESS.find(x=>x.id===MS.mess),c=attN(d),buf=Math.ceil(c*1.05);
 $("#v").innerHTML=`<h1>Mess coordination</h1>
 <h2>Mess details</h2>${MESS.map(x=>`<div class="card"><div class="row"><b>${esc(x.n)}</b><span class="tag">${x.kind}</span></div><div class="mu">Supervisor: ${esc(x.sup)} · ${x.ph}</div><div class="mu">Provides: ${x.svc} · Capacity ${x.cap} servings per meal</div></div>`).join("")}
 <h2>Send instruction</h2><div class="card"><div class="two"><div><label for="mm">Mess</label><select id="mm">${MESS.map(x=>`<option value="${x.id}" ${x.id===MS.mess?"selected":""}>${esc(x.n)}</option>`).join("")}</select></div><div><label for="ml">Meal</label><select id="ml">${Object.keys(M).map(k=>`<option ${k===MS.meal?"selected":""}>${k}</option>`).join("")}</select></div></div>
 <div class="note" style="margin-bottom:12px">${d?`Attendance today: <b>${c}</b> students. Suggested count with a 5% buffer: <b>${buf}</b>.`:"Attendance has not been submitted yet. Enter the count yourself."}</div>
 <label for="mc">Servings to prepare</label><input id="mc" type="number" min="1" value="${buf||""}"><label for="mt">Instruction</label><textarea id="mt" rows="3" placeholder="e.g. Serve by 12:30. Reduce rice by 10 percent.">${esc(MS.t)}</textarea>
 <div id="er" class="mu" style="color:var(--nv);min-height:20px"></div><button class="btn" id="ms">Send to mess</button></div>
 <h2>Conversation</h2>`+(S.msgs.filter(m=>m.kind==="ins").map(m=>`<div class="card"><div class="row"><b>${esc((MESS.find(x=>x.id===m.mess)||MESS[0]).n)}</b><span class="tag">${m.reply?"Replied":"Awaiting reply"}</span></div><div class="mu">${m.meal} · ${m.count} servings · ${new Date(m.t).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</div>${m.text?`<p style="margin:6px 0">${esc(m.text)}</p>`:""}${m.reply?`<div class="note"><b>Mess reply:</b> ${esc(m.reply.text)}</div>`:""}</div>`).join("")||`<p class="mu">No instructions sent yet.</p>`);
 const sy=()=>{MS.t=$("#mt").value;MS.mess=+$("#mm").value;MS.meal=$("#ml").value};
 $("#mm").onchange=()=>{sy();render()};$("#ml").onchange=()=>{sy();render()};
 $("#ms").onclick=()=>{sy();const n=+$("#mc").value;if(!(n>0)){$("#er").textContent="Enter how many servings to prepare.";return}
  S.msgs.unshift({t:Date.now(),kind:"ins",mess:MS.mess,meal:MS.meal,count:n,text:MS.t.trim(),reply:null,rseen:false});MS.t="";save();render();toast("Instruction sent to the mess")};
 let u=0;S.msgs.forEach(m=>{if(m.reply&&!m.rseen){m.rseen=true;u=1}});if(u){save();const b=document.querySelector('[data-t="mess"] .bdg');if(b)b.remove()}
}
function vMinbox(){
 const id=S.user.pid,L=S.msgs.filter(m=>m.kind==="ins"&&m.mess===id);
 $("#v").innerHTML=`<h1>Instructions from the dining admin</h1>`+(L.length?L.map(m=>`<div class="card"><div class="row"><b>${m.meal}: ${m.count} servings</b><span class="tag">${m.reply?"Replied":"Needs reply"}</span></div><div class="mu">${new Date(m.t).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</div>${m.text?`<p style="margin:8px 0">${esc(m.text)}</p>`:""}`+(m.reply?`<div class="note"><b>Your reply:</b> ${esc(m.reply.text)}</div>`:`<textarea id="r${m.t}" rows="2" placeholder="Type a reply, for example a shortage or delay"></textarea><div class="two"><button class="btn g" style="width:100%;padding:10px" data-q="${m.t}">Confirm count</button><button class="btn" data-r="${m.t}">Send reply</button></div>`)+`</div>`).join(""):`<div class="card"><p>No instructions yet.</p></div>`);
 const rp=(t,x)=>{const m=S.msgs.find(y=>y.t==t);m.reply={t:Date.now(),text:x};save();render();toast("Reply sent to the dining admin")};
 document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{const m=S.msgs.find(y=>y.t==b.dataset.q);rp(b.dataset.q,"Confirmed. We will prepare "+m.count+" servings of "+m.meal.toLowerCase()+".")});
 document.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{const x=$("#r"+b.dataset.r).value.trim();if(!x){toast("Type a reply first");return}rp(b.dataset.r,x)});
}
const DONORS=[
{id:11,n:"Sri Lakshmi Marriage Hall",t:"Marriage hall",lat:11.0230,lng:76.9650,ph:"+91 90000 44001",ct:"Mr. Raghavan"},
{id:12,n:"Rathna Kalyana Mandapam",t:"Marriage hall",lat:11.0035,lng:76.9720,ph:"+91 90000 44002",ct:"Mrs. Revathi"},
{id:13,n:"Green Park Convention Hall",t:"Marriage hall",lat:11.0450,lng:76.9330,ph:"+91 90000 44003",ct:"Mr. Arun"},
{id:14,n:"City Central Canteen",t:"Canteen",lat:11.0100,lng:76.9480,ph:"+91 90000 44004",ct:"Mr. Mohan"},
{id:15,n:"Tech Park Canteen",t:"Canteen",lat:11.0390,lng:76.9780,ph:"+91 90000 44005",ct:"Mrs. Latha"},
{id:16,n:"Sri Ram Engineering College Hostel",t:"College hostel",lat:10.9950,lng:76.9390,ph:"+91 90000 44006",ct:"Warden Mr. Kumar"},
{id:17,n:"Meenakshi Women's College Hostel",t:"College hostel",lat:11.0580,lng:76.9990,ph:"+91 90000 44007",ct:"Warden Mrs. Devi"}
].map(p=>({...p,d:km(CAMPUS.lat,CAMPUS.lng,p.lat,p.lng),b:Math.atan2(p.lng-CAMPUS.lng,p.lat-CAMPUS.lat)})).sort((a,b)=>a.d-b.d);
const DN=()=>S.dmsg.filter(m=>m.status==="New").length;
const OTHER={id:99,n:"Others (anyone can donate)",t:"Other donor",lat:CAMPUS.lat,lng:CAMPUS.lng,d:0,ph:"",ct:""};
const dOf=m=>m.from===99?{...OTHER,n:m.dn||"Other donor",ph:m.dp||"",ct:m.dn||"",addr:m.da||"",has:m.la!=null,lat:m.la!=null?m.la:CAMPUS.lat,lng:m.la!=null?m.ln:CAMPUS.lng,d:m.la!=null?km(CAMPUS.lat,CAMPUS.lng,m.la,m.ln):0}:DONORS.find(x=>x.id===m.from);
const tyl=t=>t==="veg"?"Veg":t==="nonveg"?"Non-veg":"Veg & non-veg";
const itemsHtml=m=>m.items&&m.items.length?`<table style="margin:8px 0 0">${m.items.map(i=>`<tr><td>${esc(i.n)}</td><td class="mu">${tyl(i.ty)}</td><td style="text-align:right"><b>${i.q}</b></td></tr>`).join("")}</table>`:"";
const mapLink=(d,m)=>{const u=d.id===99?(d.has?`${d.lat},${d.lng}`:d.addr?encodeURIComponent(d.addr):""):`${d.lat},${d.lng}`;return u?`<p style="margin:8px 0 0"><a href="https://www.google.com/maps/search/?api=1&query=${u}" target="_blank" rel="noopener">Open location in Maps</a></p>`:""};
const donorList=()=>`<h2>Nearby food sources (marriage halls, canteens, hostels)</h2>`+DONORS.map((p,k)=>`<div class="card"><div class="row"><b>${PARTNERS.length+k+1}. ${esc(p.n)}</b><span class="dist">${p.d.toFixed(1)} km</span></div><div class="mu">${p.t} · Contact: ${esc(p.ct)} · ${p.ph}</div><p style="margin:8px 0 0"><a href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}" target="_blank" rel="noopener">Open in Maps</a></p></div>`).join("");
const ft=t=>new Date(t).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});
const FOODS=["Veg biryani","Chicken biryani","Mutton biryani","Sambar rice","Curd rice","Lemon rice","Tomato rice","Fried rice","Plain rice","Meals (rice, sambar, curry)","Chapati","Parotta","Idli","Dosa","Pongal","Upma","Vegetable kurma","Chicken curry","Egg curry","Fish fry","Sweets","Payasam","Bread","Snacks","Fruits","Juice / drinks"];
const foodList=()=>`<datalist id="fl">${FOODS.map(f=>`<option value="${f}">`).join("")}</datalist>`;
const typeSel=(id,at,v)=>`<select id="${id}" ${at}><option value="veg" ${v==="veg"?"selected":""}>Veg</option><option value="nonveg" ${v==="nonveg"?"selected":""}>Non-veg</option><option value="both" ${v==="both"?"selected":""}>Both</option></select>`;
const blankOF=()=>[0,1,2].map(()=>({n:"",ty:"veg",q:""}));
let OF=blankOF(),OFX={c:"",p:"",x:""},OFL=null;
function syncOF(){document.querySelectorAll("[data-f]").forEach(e=>{const r=OF[+e.dataset.k];if(r)r[e.dataset.f]=e.value});if($("#oc")){OFX.c=$("#oc").value;OFX.p=$("#op").value;OFX.x=$("#ox").value}}
function vOffer(){
 const own=S.user.pid===99,d=own?{n:S.user.name,t:"Other donor"}:DONORS.find(x=>x.id===S.user.pid);
 const tot=()=>OF.reduce((a,r)=>a+(+r.q>0?+r.q:0),0);
 $("#v").innerHTML=`<h1>Offer surplus food</h1>${foodList()}
 ${OF.map((r,k)=>`<div class="card" style="padding:12px 14px"><div class="row"><b>Food ${k+1}</b>${OF.length>1?`<button class="btn g" data-rm="${k}" style="width:auto;padding:5px 12px;font-size:12px">Remove</button>`:""}</div>
 <label for="fn${k}">Food name</label><input id="fn${k}" data-f="n" data-k="${k}" list="fl" autocomplete="off" value="${esc(r.n)}" placeholder="Pick from the list or type">
 <div class="two"><div><label for="ft${k}">Type</label>${typeSel("ft"+k,`data-f="ty" data-k="${k}"`,r.ty)}</div>
 <div><label for="fq${k}">Quantity / count</label><input id="fq${k}" data-f="q" data-k="${k}" type="number" min="1" inputmode="numeric" value="${r.q}"></div></div></div>`).join("")}
 <button class="btn g" id="oadd" style="width:100%;margin:2px 0 12px">+ Add food</button>
 <div class="card"><div class="row"><b>Total quantity / count</b><b id="otot">${tot()}</b></div>
 <div class="two"><div><label for="oc">Cooked at</label><input id="oc" type="time" value="${OFX.c}"></div><div><label for="op">Collect by</label><input id="op" type="time" value="${OFX.p}"></div></div>
 ${own?`<button class="btn g" id="oloc" style="width:100%;margin-top:10px">${S.user.la!=null?"Location shared. Update":"Share my location (optional)"}</button>`:""}
 <label for="ox">Notes (storage, allergens)</label><textarea id="ox" rows="2">${esc(OFX.x)}</textarea>
 <label class="chk" style="font-weight:400"><input type="checkbox" id="os"><span>I confirm this food is fresh, stored safely and fit to eat.</span></label>
 <div id="er" class="mu" style="color:var(--nv);min-height:20px"></div><button class="btn" id="osn">Send to the dining admin</button></div>`;
 document.querySelectorAll("[data-f]").forEach(e=>e.oninput=()=>{OF[+e.dataset.k][e.dataset.f]=e.value;$("#otot").textContent=tot()});
 $("#oadd").onclick=()=>{syncOF();OF.push({n:"",ty:"veg",q:""});render();setTimeout(()=>{const i=$("#fn"+(OF.length-1));if(i)i.focus()},50)};
 document.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{syncOF();OF.splice(+b.dataset.rm,1);render()});
 const lc=$("#oloc");if(lc)lc.onclick=()=>{syncOF();if(!navigator.geolocation){toast("Location is not available on this device");return}navigator.geolocation.getCurrentPosition(g=>{S.user.la=g.coords.latitude;S.user.ln=g.coords.longitude;toast("Location saved");render()},()=>toast("Could not get your location"),{timeout:8000})};
 $("#osn").onclick=()=>{syncOF();const rows=OF.filter(r=>r.n.trim()||r.q!==""),c=OFX.c,pk=OFX.p;
  const bad=rows.find(r=>!r.n.trim()||!(+r.q>0));
  const err=!rows.length?"Add at least one food item.":bad?(!bad.n.trim()?"Enter the food name for each row.":"Enter a quantity for "+bad.n.trim()+"."):!pk?"Set a collect-by time.":!$("#os").checked?"Confirm the food is safe to share.":"";
  $("#er").textContent=err;if(err)return;
  const items=rows.map(r=>({n:r.n.trim(),ty:r.ty,q:+r.q})),ts=[...new Set(items.map(i=>i.ty))],ty=ts.length===1?ts[0]:"both";
  const m={t:Date.now(),from:S.user.pid,n:items.map(i=>i.n+" × "+i.q).join(", "),ty,q:items.reduce((a,i)=>a+i.q,0),items,c,p:pk,x:OFX.x.trim(),status:"New"};
  if(own){m.dn=S.user.name;m.dp=S.user.ph;m.da=S.user.addr;if(S.user.la!=null){m.la=S.user.la;m.ln=S.user.ln}}
  S.dmsg.unshift(m);OF=blankOF();OFX={c:"",p:"",x:""};save();S.tab="mine";render();toast("Sent to the dining admin")};
}
function vMine(){
 const L=S.dmsg.filter(m=>m.from===S.user.pid&&(S.user.pid!==99||m.dn===S.user.name));
 $("#v").innerHTML=`<h1>My messages</h1>`+(L.length?L.map(m=>{const s=S.sent.find(x=>x.t===m.sid);return`<div class="card"><div class="row"><b>${ft(m.t)}</b><span class="tag">${m.status}</span></div>${itemsHtml(m)}<div class="mu" style="margin-top:6px">${tyl(m.ty)} · ${m.q} count · collect by ${m.p}</div>${s?`<p style="margin:8px 0 0">Forwarded to ${s.to.length} centre${s.to.length>1?"s":""}. <b>${bk(s)}</b></p>`:""}</div>`}).join(""):`<div class="card"><p>You have not sent any messages yet.</p></div>`);
}
let FW=null;
function vDm(){
 if(FW)return vFwd();
 const L=S.dmsg;
 $("#v").innerHTML=`<h1>Donor messages</h1>`+(L.length?L.map(m=>{const d=dOf(m);return`<div class="card"><div class="row"><b>${esc(d.n)}</b><span class="tag">${m.status}</span></div><div class="mu">${d.t}${d.id===99?"":" · "+d.d.toFixed(1)+" km from campus"}${d.ph?" · "+d.ph:""}${d.addr?" · "+esc(d.addr):""}</div>${itemsHtml(m)}<div class="mu" style="margin-top:6px">${tyl(m.ty)} · ${m.q} count · ${m.c?"Cooked "+m.c+" · ":""}Collect by ${m.p} · ${ft(m.t)}</div>${m.x?`<p style="margin:6px 0 0">${esc(m.x)}</p>`:""}${mapLink(d,m)}`+(m.status==="New"?`<div class="two" style="margin-top:10px"><button class="btn" data-f="${m.t}">Forward to centres</button><button class="btn g" style="width:100%;padding:11px" data-x="${m.t}">Not needed</button></div>`:"")+`</div>`}).join(""):`<div class="card"><p>No messages yet. Marriage halls, canteens and hostels can message you from their own login.</p></div>`);
 document.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{FW=+b.dataset.f;render();scrollTo(0,0)});
 document.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>{S.dmsg.find(m=>m.t==b.dataset.x).status="Declined";save();render()});
}
function vFwd(){
 const m=S.dmsg.find(x=>x.t===FW),d=dOf(m);
 const L=PARTNERS.filter(p=>!p.farm).map(p=>({p,k:km(d.lat,d.lng,p.lat,p.lng)})).sort((a,b)=>a.k-b.k);
 $("#v").innerHTML=`<h1>Forward to collecting centres</h1>
 ${L.map(o=>`<label class="chk"><input type="checkbox" data-c="${o.p.id}" ${o.k<=6?"checked":""}><span style="flex:1"><b>${esc(o.p.n)}</b><br><span class="mu">${o.p.t} · up to ${o.p.cap} servings</span><br><span class="mu">${pinfo(o.p)}</span></span><span class="dist">${o.k.toFixed(1)} km</span></label>`).join("")}
 <label for="fnote">Note for centres (optional)</label><textarea id="fnote" rows="2"></textarea>
 <div id="er" class="mu" style="color:var(--nv);min-height:20px"></div><div class="two"><button class="btn g" id="fx" style="width:100%;padding:11px">Cancel</button><button class="btn" id="fo">Send notification</button></div>`;
 $("#fx").onclick=()=>{FW=null;render()};
 $("#fo").onclick=()=>{const ids=[...document.querySelectorAll("[data-c]")].filter(c=>c.checked).map(c=>+c.dataset.c);
  if(!ids.length){$("#er").textContent="Select at least one centre.";return}
  const to=L.filter(o=>ids.includes(o.p.id)).map(o=>[o.p.n,o.k,o.p.id,"Pending"]),e={t:Date.now(),fw:false,src:{n:d.n,type:d.t,lat:d.lat,lng:d.lng,ph:d.ph},items:m.items,n:m.n,ty:m.ty,q:m.q,c:m.c,p:m.p,x:[m.x,$("#fnote").value.trim()].filter(Boolean).join(" · "),to};
  S.sent.unshift(e);m.status="Forwarded";m.sid=e.t;FW=null;save();render();toast("Forwarded to "+to.length+" centre"+(to.length>1?"s":""))};
}
const LEAD=[{"n": "Mr. K.A. Akbar Basha", "r": "Managing Director", "ps": ["The Managing Director of the college, Mr. K.A. Akbar Basha, is a successful entrepreneur of his own, involving in various segments of business catering from Leather Tannery to Construction for the past fifty years.", "He is a kind-hearted, soft spoken and broad minded personality who wishes his students to enhance their creative skills for achieving the higher quality in technical skills. He is very much interested in helping the needy and in promoting quality education to the students of downtrodden."], "img": "assets/leader-1.jpg"}, {"n": "Mr. A. Thameez Ahamed", "r": "Secretary & CEO", "ps": ["Our Secretary cum Chief Executive Officer, Mr. A. Thameez Ahamed, is the youngest member of the management and has completed his Master’s degree in London.", "He is an idealistic individual who aims to elevate the college to premium standards. He is benevolent, approachable, and prudent in his dealings, and remains steadfast in his principles, striving to deliver his very best in all endeavors.", "The sprawling campus, state-of-the-art infrastructure, and the disciplined student community stand as evidence of the excellence of his administration."], "img": "assets/leader-2.jpg"}, {"n": "Dr. Arul Kulandaivel", "r": "Director", "ps": ["Academician, Researcher, Innovator, and Educational Administrator", "Dr. Arul Kulandaivel is an accomplished academician, researcher, innovator, and educational administrator with a distinguished record of academic excellence, research contributions, innovation, and institutional leadership. He completed his Undergraduate, Postgraduate, and Ph.D. programmes at Anna University and secured the Second Rank among the candidates who appeared for the M.E. Degree Examination at the Anna University level, reflecting his outstanding academic performance.", "His contributions to research and higher education are significant. He has successfully guided two Ph.D. scholars to completion and is currently guiding five Ph.D. scholars at Anna University. He has presented numerous research papers at National and International conferences and has published more than 100 research papers in SCI- and Scopus-indexed journals. His scholarly contributions have earned substantial recognition, with a Google Scholar H-index of 20 and more than 1,000 citations. He has also received the Best Research Paper Award from London Press.", "As an innovator, Dr. Arul Kulandaivel has received one Design Grant, published ten patents, authored six books and five book chapters, and developed more than 10 real-time working products addressing practical challenges and contributing to societal needs. His primary research interests include Machining of Superalloys, Material Characterization, Textured Inserts, and Magnetorheological (MR) Fluids.", "Professional Recognition & Institutional Leadership", "Dr. Arul Kulandaivel's academic and professional excellence has been recognised through several prestigious awards and honours. His notable recognitions include the Young Scientist Award from Tamil Nadu, Shri P.K. Das Best Faculty Award from NGI, Emerging Education Hero Award from EGNIndia, and Best Faculty Awards from IARDO, AIHT, JSRR, and Agni. He has also received multiple recognitions from Agni for Highest Cumulative Impact Factor, Highest Citations, Highest Number of Publications, Best Faculty, and Best Researcher.", "He has received research funding from the Tamil Nadu State Council for Science and Technology (TNSCST) and continues to contribute actively to the advancement of research, innovation, and higher education. He is a Life Member of the International Association of Engineers (IAENG) and a Member of the American Society of Mechanical Engineers (ASME).", "Through his multifaceted experience as an academician, researcher, innovator, and educational administrator, Dr. Arul Kulandaivel continues to contribute towards creating an academic environment that promotes excellence, research, innovation, and holistic institutional development."], "img": "assets/leader-3.jpg"}, {"n": "Dr. John Baruch L.", "r": "Principal", "ps": ["Dr. John Baruch L. is an accomplished academician, researcher, and engineering education professional with approximately 33 years of teaching and research experience in Mechanical and Materials Engineering. He holds a Ph.D. in Friction Stir Processing from the College of Engineering Guindy, Anna University, Chennai, and an M.Tech. in Mechanism and Machine Design from the National Institute of Technology (NIT), Nagpur.", "Throughout his distinguished career, Dr. John Baruch has held various academic and leadership positions at several engineering institutions, including Professor, Dean of Engineering and Technology, Head of Department, and Coordinator of academic programmes. His experience in academic administration, faculty development, research, and curriculum-related activities reflects his commitment to strengthening the quality of technical education.", "His research interests include friction stir processing, metal matrix composites, materials engineering, and advanced manufacturing technologies. His appointment as University Nominee for the Board of Studies in Aeronautical Engineering at Dr. Ambedkar Institute of Technology, Bengaluru, by Visvesvaraya Technological University, Belagavi, further reflects his engagement with academic development and curriculum advancement.", "A Life Member of the Indian Society for Technical Education (ISTE) and the Indian Welding Society (IWS), Dr. John Baruch is committed to promoting academic excellence, research and innovation, and industry-oriented education.", "As Principal, he envisions fostering a vibrant and student-centric academic environment that nurtures technical competence, critical thinking, ethical values, leadership, and lifelong learning."], "img": "assets/leader-4.jpg"}];
const LSUB=["Academician, Researcher, Innovator, and Educational Administrator","Professional Recognition & Institutional Leadership"];
function leadHtml(){return`<h2>Management and leadership</h2>`+LEAD.map(x=>{const f=x.ps[0],rest=x.ps.slice(1);return`<div class="card"><div class="row" style="justify-content:flex-start;gap:12px"><img src="${x.img}" alt="${esc(x.n)}" width="64" height="64" style="width:64px;height:64px;border-radius:50%;object-fit:cover;flex:none;box-shadow:0 0 0 2px #fff,0 4px 10px rgba(0,0,0,.2)"><div><b>${esc(x.n)}</b><div class="mu">${esc(x.r)}</div></div></div><p style="margin:10px 0 0">${esc(f)}</p>${rest.length?`<details style="margin-top:6px"><summary style="cursor:pointer;font-weight:700;color:var(--pr)">Read more</summary>${rest.map(t=>LSUB.includes(t)?`<p style="margin:10px 0 0"><b>${esc(t)}</b></p>`:`<p style="margin:10px 0 0">${esc(t)}</p>`).join("")}</details>`:""}</div>`}).join("")}

const PF={
 student:[["id","Roll number / ID","text","e.g. 22CS104"],["dept","Department","text","e.g. Computer Science"],["yr","Year","select",["1st year","2nd year","3rd year","4th year"]],["res","Stay","select",["Hosteller","Day scholar"]],["ph","Phone number","tel","10 digits"],["em","Email","email","name@example.com"]],
 authority:[["id","Employee ID","text",""],["des","Designation","text","e.g. Dining manager"],["loc","Canteen / dining hall","text","e.g. Main canteen"],["ph","Phone number","tel","10 digits"],["em","Email","email","name@example.com"]],
 institution:[["id","Employee ID","text",""],["des","Designation","text","e.g. Principal"],["dept","Office / department","text",""],["ph","Phone number","tel","10 digits"],["em","Email","email","name@example.com"]],
 donor:[["org","Organisation / venue","text",""],["ct","Contact person","text",""],["ph","Phone number","tel","10 digits"],["addr","Address","text","Street, area"],["em","Email","email","name@example.com"],["usual","Food usually donated","text","e.g. Biryani, meals"]],
 partner:[["org","Organisation","text",""],["kind","Type","text","Orphanage, NGO, cattle farm..."],["ct","Contact person","text",""],["ph","Phone number","tel","10 digits"],["addr","Address","text","Street, area"],["em","Email","email","name@example.com"],["cap","Servings it can take","number",""],["reg","Registration number","text","Optional"]],
 mess:[["org","Mess","text",""],["ct","Supervisor","text",""],["ph","Phone number","tel","10 digits"],["em","Email","email","name@example.com"],["cap","Capacity per meal","number",""]]};
function pfDef(){const u=S.user,r=u.role;let o=null;
 if(r==="donor")o=u.pid===99?{org:"Individual donor",ct:u.name,ph:u.ph||"",addr:u.addr||""}:(x=>x?{org:x.n,ct:x.ct||"",ph:x.ph||""}:{})(DONORS.find(p=>p.id===u.pid));
 if(r==="partner")o=(x=>x?{org:x.n,kind:x.t||"",ct:x.ct||"",ph:x.ph||"",cap:x.cap||""}:{})(PARTNERS.find(p=>p.id===u.pid));
 if(r==="mess")o=(x=>x?{org:x.n,ct:x.sup||"",ph:x.ph||"",cap:x.cap||""}:{})(MESS.find(p=>p.id===u.pid));
 if(r==="student")o={id:u.name};
 return o||{}}
function vProfile(){
 const u=S.user,r=u.role,k=r+"|"+u.name,v={...pfDef(),...(S.prof[k]||{})};
 $("#v").innerHTML=`<h1>My profile</h1>
 <div class="card"><div class="row" style="justify-content:flex-start;gap:14px"><div class="avatar">${esc(u.name.trim().charAt(0).toUpperCase()||"?")}</div><div><b>${esc(u.name)}</b><div class="mu">${ROLE[r]}</div></div></div>
 ${PF[r].map(([f,l,t,p])=>t==="select"?`<label for="pf_${f}">${l}</label><select id="pf_${f}">${p.map(o=>`<option ${v[f]===o?"selected":""}>${o}</option>`).join("")}</select>`:`<label for="pf_${f}">${l}</label><input id="pf_${f}" type="${t}" ${t==="number"?'min="0" inputmode="numeric"':""} placeholder="${esc(p)}" value="${esc(v[f]==null?"":v[f])}">`).join("")}
 <div id="er" class="mu" style="color:var(--nv);min-height:20px"></div><button class="btn" id="pfs">Save profile</button></div>
 <div class="card"><h2 style="margin:0 0 6px">Change password</h2><label for="cp0">Current password</label><input id="cp0" type="password" autocomplete="current-password"><label for="cp1">New password</label><input id="cp1" type="password" autocomplete="new-password" placeholder="At least 6 characters"><label for="cp2">Confirm new password</label><input id="cp2" type="password" autocomplete="new-password"><div id="er2" class="mu" style="color:var(--nv);min-height:20px"></div><button class="btn" id="cps">Update password</button></div>`;
 $("#pfs").onclick=()=>{const o={};PF[r].forEach(([f])=>o[f]=$("#pf_"+f).value.trim());
  if(o.ph&&!/^(\+?91)?\d{10}$/.test(o.ph.replace(/[\s-]/g,""))){$("#er").textContent="Enter a valid 10-digit phone number.";return}
  if(o.em&&!/^\S+@\S+\.\S+$/.test(o.em)){$("#er").textContent="Enter a valid email address.";return}
  S.prof[k]=o;save();toast("Profile saved")};
 $("#cps").onclick=()=>{const a=S.acc[u.ak],e=m=>{$("#er2").textContent=m},n1=$("#cp1").value;
  if(!a)return e("Account not found. Please sign out and sign in again.");
  if(a.h!==hpw($("#cp0").value,a.s))return e("Current password is wrong.");
  if(n1.length<6)return e("New password must be at least 6 characters.");
  if(n1!==$("#cp2").value)return e("The two new passwords do not match.");
  const s=sal();S.acc[u.ak]={...a,s,h:hpw(n1,s)};save();["#cp0","#cp1","#cp2"].forEach(x=>$(x).value="");e("");toast("Password updated")};
}

/* ---- Special menu: students type one request a month; the most requested food is the special ---- */
const SPSEED=[["Chicken biryani",38],["Mutton biryani",24],["Paneer butter masala with naan",19],["Parotta with chicken kurma",15],["Gobi manchurian fried rice",11]];
const MON=()=>tk().slice(0,7),MONL=()=>new Date().toLocaleDateString("en-IN",{month:"long",year:"numeric"});
const nrm=x=>x.toLowerCase().replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();
function spTally(){const m=new Map();SPSEED.forEach(([n,c],i)=>m.set(nrm(n),{n,c,o:i}));
 S.sp.reqs.filter(r=>r.m===MON()).forEach((r,i)=>{const k=nrm(r.food);if(!k)return;const e=m.get(k);if(e)e.c++;else m.set(k,{n:r.food.charAt(0).toUpperCase()+r.food.slice(1),c:1,o:100+i})});
 return[...m.values()].sort((a,b)=>b.c-a.c||a.o-b.o)}
const dlong=d=>new Date(d+"T00:00:00").toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"});
function vSpecial(){
 const r=S.user.role,L=spTally(),tot=L.reduce((a,x)=>a+x.c,0),top=L[0],pk=S.sp.pick[MON()],my=S.sp.reqs.find(x=>x.m===MON()&&x.u===S.user.name);
 $("#v").innerHTML=`<h1>Special menu · ${MONL()}</h1>
 <div class="card"><div class="row"><b>${pk?"Confirmed special menu":"Leading request"}</b><span class="tag">${pk?"Confirmed":"Not confirmed yet"}</span></div>
 <p style="margin:8px 0 0;font-size:18px;font-weight:700">${esc(pk?pk.food:top.n)}</p>${pk?`<div class="mu">${dlong(pk.date)}</div>`:""}</div>
 ${r==="student"?(my?`<div class="card"><div class="row"><b>Your request</b><span class="tag">Submitted</span></div><p style="margin:8px 0 0">${esc(my.food)}</p></div>`
 :`<div class="card"><label for="sf">Type the food you would like</label><input id="sf" list="spl" maxlength="60" autocomplete="off" placeholder="e.g. Chicken biryani">
 <div id="er" class="mu" style="color:var(--nv);min-height:20px"></div><button class="btn" id="sb">Submit request</button><p class="mu" style="margin:10px 0 0">One request per month.</p></div>`):""}
 <datalist id="spl">${L.map(x=>`<option value="${esc(x.n)}">`).join("")}</datalist>
 <h2>Most requested</h2>${L.slice(0,8).map((x,i)=>`<div class="rk ${i===0?"top1":""}"><div class="bar" style="width:${x.c/top.c*100}%"></div><span class="n">${i+1}</span><span class="t">${esc(x.n)}</span>${i===0?'<span class="tag">Most requested</span>':""}<b>${x.c}</b></div>`).join("")}
 <p class="mu">${tot} requests this month</p>
 ${r==="authority"?`<h2>Confirm special menu</h2><div class="card"><label for="cf">Food</label><input id="cf" list="spl" maxlength="60" value="${esc(pk?pk.food:top.n)}">
 <label for="cdt">Serve on</label><input id="cdt" type="date" min="${tk()}" value="${pk?pk.date:""}">
 <div id="er" class="mu" style="color:var(--nv);min-height:20px"></div><button class="btn" id="cb">${pk?"Update special menu":"Confirm and notify students"}</button></div>`:""}`;
 const sb=$("#sb");if(sb)sb.onclick=()=>{const f=$("#sf").value.trim().replace(/\s+/g," ");if(f.length<2){$("#er").textContent="Type the food you would like.";return}
  S.sp.reqs.push({m:MON(),u:S.user.name,food:f,t:Date.now()});save();render();toast("Request submitted")};
 const cb=$("#cb");if(cb)cb.onclick=()=>{const f=$("#cf").value.trim(),d=$("#cdt").value;if(!f){$("#er").textContent="Enter the food.";return}if(!d){$("#er").textContent="Choose the date to serve it.";return}
  S.sp.pick[MON()]={food:f,date:d,by:S.user.name,t:Date.now()};
  S.notes.unshift({t:Date.now(),title:"Special menu: "+f,body:"Served on "+dlong(d)+". It was the most requested food this month."});save();render();toast("Special menu confirmed. Students are notified.")};
}
/* ---- Messages: institution <-> dining admin, institution <-> mess ---- */
let CH={peer:"authority",t:""};
function vChat(){
 const r=S.user.role,peers=r==="institution"?[["authority","Dining admin"],["mess","Mess"]]:[["institution","Institution authority"]];
 if(!peers.some(p=>p[0]===CH.peer))CH.peer=peers[0][0];
 const peer=CH.peer,th=[r,peer].sort().join("|"),L=S.chat.filter(m=>m.th===th).sort((a,b)=>a.t-b.t),pn=peers.find(p=>p[0]===peer)[1];
 $("#v").innerHTML=`<h1>${peers.length>1?"Messages":"Messages with "+pn}</h1>`
 +(peers.length>1?`<div class="seg" id="pr">${peers.map(p=>{const n=thN(r,[r,p[0]].sort().join("|"));return`<button data-p="${p[0]}" class="${p[0]===peer?"on":""}">${p[1]}${n&&p[0]!==peer?` <i class="bdg">${n}</i>`:""}</button>`}).join("")}</div>`:"")
 +(L.length?`<div class="thread">${L.map(m=>`<div class="msg ${m.from===r?"me":""}">${esc(m.text)}<small>${m.from===r?"You":ROLE[m.from]} · ${ft(m.t)}</small></div>`).join("")}</div>`:`<div class="card"><p class="mu" style="margin:0">No messages yet.</p></div>`)
 +`<div class="card"><label for="ct">Message to ${pn}</label><textarea id="ct" rows="3" maxlength="500">${esc(CH.t)}</textarea><div id="er" class="mu" style="color:var(--nv);min-height:20px"></div><button class="btn" id="cs">Send</button></div>`;
 $("#ct").oninput=()=>CH.t=$("#ct").value;
 const pr=$("#pr");if(pr)pr.onclick=e=>{const b=e.target.closest("button");if(b){CH.peer=b.dataset.p;render()}};
 $("#cs").onclick=()=>{const x=$("#ct").value.trim();if(!x){$("#er").textContent="Type a message first.";return}
  S.chat.push({t:Date.now(),th,from:r,text:x});CH.t="";save();render();toast("Message sent to "+pn)};
 S.cs[r+"@"+th]=Date.now();save();
 const b=document.querySelector('[data-t="im"] .bdg,[data-t="msg"] .bdg');if(b){const n=CN();n?b.textContent=n:b.remove()}
}
function vAbout(){
 const li=a=>'<ul style="margin:0;padding-left:18px">'+a.map(x=>'<li style="margin-bottom:6px">'+x+'</li>').join('')+'</ul>';
 $('#v').innerHTML=`<h1>Why we built this</h1>
 <h2>The problem</h2><div class="card">
 ${li(['Extra food is often left over in homes, hostels and college canteens.','Edible food gets thrown away while people nearby need food support.','Meals are planned by guesswork, so too much or too little is cooked.','There is no quick, trusted way to connect safe leftovers with people who can use them.'])}
 <p class="note" style="margin:12px 0 0">Globally, about 1.05 billion tonnes of food were wasted by households, food service and retail in 2022 (UNEP Food Waste Index Report 2024).</p></div>
 <h2>Our solution</h2><div class="card">
 ${li(['<b>Estimate:</b> students vote on the next week of meals and snacks, so the canteen cooks what people will eat.','<b>Track:</b> the dining admin records leftover servings, meal details and preparation time.','<b>Share safely:</b> the dining admin alerts nearby orphanages, NGOs and collection centres, with distance and a pickup window, so safe surplus is collected on time.'])}</div>
 <h2>Objectives</h2><div class="card">${li(['Estimate the amount of food needed.','Prevent avoidable food waste.','Encourage responsible meal planning and safe food sharing.'])}</div>
 <h2>What it can measure in a pilot</h2><div class="card"><div class="two"><div><b>kg</b><br><span class="mu">food wasted, before and after</span></div><div><b>Servings</b><br><span class="mu">shared with partners</span></div><div><b>Participants</b><br><span class="mu">students voting each week</span></div><div><b>Pickup time</b><br><span class="mu">alert to collection</span></div></div>
 </div>
 <h2>Futuristic benefits and impact</h2>
 <div class="card"><b>Environmental</b>${li(['Less avoidable food waste and better use of water, energy and land that went into the food.','Fewer food scraps going to landfill.','Dashboards that turn kg saved into estimated carbon and water savings.'])}</div>
 <div class="card"><b>Social</b>${li(['Safe surplus reaches children, families and shelters through verified partners.','Students build the habit of taking only what they need.','A community network that links campuses, canteens, hostels and events with local NGOs.'])}</div>
 <div class="card"><b>Economic</b>${li(['Better planning can reduce food purchasing and disposal costs.','Less over-cooking means fewer wasted ingredients and labour.','Partners get regular, predictable food support.'])}</div>
 <div class="card"><b>Next versions</b>${li(['Demand prediction from past votes, attendance and events.','Real push, SMS and email alerts with live partner accept or decline.','Partner login and QR-verified pickup confirmation.','Route and arrival time to each partner.','Photo and temperature checks for food safety.','Multi-campus and city-wide donation network.'])}</div>
 ${leadHtml()}
 <div class="card"><b>Team Squadex</b><p class="mu" style="margin:4px 0 0">Dhaanish Ahmed Institute of Technology<br>M. Gokila, M. Ifthikar Shreen, K. Mallika, G. Malkija</p></div>
 <p class="mu">Source: UNEP, Food Waste Index Report 2024. FAO, Food Loss and Food Waste.</p>`;
}
addEventListener("online",()=>{SYNC.flush().then(ok=>{if(S.pend.length&&ok){S.pend=[];save();toast("Back online. Your offline votes are synced.")}});SYNC.pull().then(ch=>{if(ch)onRemote()});net();if(S.user)render()});
addEventListener("offline",()=>{net();toast("You are offline. Voting and results still work and will sync later.")});


addEventListener("pointerdown",()=>ac(),{once:true});
render();
(function(){const s=document.getElementById("splash");if(!s)return;
/* Logo sound design: every sound is fired by the matching logo animation, so picture and sound stay in step */
let M=null;
const live=()=>{const a=ac();if(!a||a.state!=="running")return null;if(!M||M.ctx!==a){const g=a.createGain(),c=a.createDynamicsCompressor();g.gain.value=.9;g.connect(c);c.connect(a.destination);M={ctx:a,out:g}}return M};
const tn=(m,f,t,d,v,ty,f2)=>{const a=m.ctx,T=a.currentTime+t,o=a.createOscillator(),g=a.createGain();o.type=ty||"sine";o.frequency.setValueAtTime(f,T);if(f2)o.frequency.exponentialRampToValueAtTime(f2,T+d);g.gain.setValueAtTime(0,T);g.gain.linearRampToValueAtTime(v,T+.008);g.gain.exponentialRampToValueAtTime(.0001,T+d);o.connect(g);g.connect(m.out);o.start(T);o.stop(T+d+.05)};
const nz=(m,t,d,f1,f2,v,q)=>{const a=m.ctx,T=a.currentTime+t,n=Math.ceil(a.sampleRate*d),b=a.createBuffer(1,n,a.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=Math.random()*2-1;
 const r=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();r.buffer=b;f.type="bandpass";f.Q.value=q||1;f.frequency.setValueAtTime(f1,T);f.frequency.exponentialRampToValueAtTime(f2,T+d);g.gain.setValueAtTime(0,T);g.gain.linearRampToValueAtTime(v,T+d*.4);g.gain.exponentialRampToValueAtTime(.0001,T+d);r.connect(f);f.connect(g);g.connect(m.out);r.start(T)};
const pl=(m,f,t,v)=>{tn(m,f,t,1,v);tn(m,f*2,t,.35,v*.15)};
const chord=(m,t)=>{[261.63,329.63,392,523.25].forEach(f=>tn(m,f,t,2,.07));tn(m,1046.5,t+.05,1.6,.035)};
const PENT=[523.25,587.33,659.25,783.99,880,1046.5,1174.66];
const chs=()=>[...s.querySelectorAll(".dm-ch")];
/* only three soft cues: the bowl lands, each letter plucks in, and a warm chord closes the logo */
const on={
 dmdrop:m=>{tn(m,125,.54,.35,.3,"sine",55)},
 dmgrow:(m,e)=>{const i=Math.max(0,chs().indexOf(e.target));pl(m,PENT[i%7],.2,.09)},
 dmdraw:m=>{chord(m,.95)}
};
if(!matchMedia("(prefers-reduced-motion:reduce)").matches){
 const h=e=>{const f=on[e.animationName];if(!f)return;const m=live();if(m)f(m,e)};
 s.addEventListener("animationstart",h);s.addEventListener("animationiteration",h)}
const end=()=>{s.classList.add("out");setTimeout(()=>s.remove(),350)};
/* browsers keep sound locked until the first tap or key press; unlock as early as possible and, if the
   logo is still showing, close it with the chord */
ac();const u=()=>{removeEventListener("pointerdown",u);removeEventListener("keydown",u);const vis=!!document.getElementById("splash")&&!s.classList.contains("out"),a=ac();Promise.resolve(a&&a.resume?a.resume():0).catch(()=>{}).then(()=>{if(vis&&!cho){const m=live();if(m)chord(m,.05)}})};
let cho=false;s.addEventListener("animationstart",e=>{if(e.animationName==="dmdraw")cho=true});
addEventListener("pointerdown",u);addEventListener("keydown",u);
s.addEventListener("click",end);
setTimeout(end,4300)})();