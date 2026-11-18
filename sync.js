/* ---- Supabase sync layer: mirrors the shared parts of S into one `records` table ---- */
function createSync(S,SB,store,onRemote){
 const arr=(order,get,set)=>({
  list:()=>get().map(x=>[String(x.t),x]),
  put:(id,o)=>{const a=get(),i=a.findIndex(x=>String(x.t)===id);if(i>=0)a[i]=o;else{a.push(o);a.sort((x,y)=>order*(x.t-y.t))}},
  del:id=>set(get().filter(x=>String(x.t)!==id))});
 const map=get=>({list:()=>Object.entries(get()),put:(id,o)=>{get()[id]=o},del:id=>{delete get()[id]}});
 const COLS={
  sent:arr(-1,()=>S.sent,v=>S.sent=v),fb:arr(-1,()=>S.fb,v=>S.fb=v),msgs:arr(-1,()=>S.msgs,v=>S.msgs=v),
  notes:arr(-1,()=>S.notes,v=>S.notes=v),dmsg:arr(-1,()=>S.dmsg,v=>S.dmsg=v),
  conf:arr(1,()=>S.conf,v=>S.conf=v),chat:arr(1,()=>S.chat,v=>S.chat=v),reqs:arr(1,()=>S.sp.reqs,v=>S.sp.reqs=v),
  att:map(()=>S.att),ov:map(()=>S.ov),pick:map(()=>S.sp.pick),prof:map(()=>S.prof),acc:map(()=>S.acc),votes:map(()=>S.vr),
  vw:{list:()=>[["main",S.vw]],put:(id,o)=>{S.vw=o},del:()=>{}}};
 let LAST={};try{LAST=JSON.parse(store.getItem("sfs2_last")||"{}")}catch(e){}
 const keep=()=>{try{store.setItem("sfs2_last",JSON.stringify(LAST))}catch(e){}};
 const cur=(c,id)=>{const e=COLS[c].list().find(x=>x[0]===id);return e&&e[1]};
 const dirty=(c,id)=>{const o=cur(c,id);return o!==undefined&&JSON.stringify(o)!==(LAST[c]||{})[id]};
 let busy=false,again=false,tm=null,ok=!!SB;
 async function flush(){
  if(!SB)return true;
  if(busy){again=true;return true}
  busy=true;let good=true;
  try{do{again=false;
   const up=[],dl=[];
   for(const c in COLS){const m=new Map(COLS[c].list()),l=LAST[c]||(LAST[c]={});
    for(const [id,o] of m){const j=JSON.stringify(o);if(l[id]!==j)up.push({c,id,o,j,prev:l[id]})}
    for(const id in l)if(!m.has(id))dl.push({c,id,prev:l[id]})}
   if(!up.length&&!dl.length)break;
   up.forEach(u=>LAST[u.c][u.id]=u.j);dl.forEach(d=>delete LAST[d.c][d.id]);
   try{
    for(let i=0;i<up.length;i+=200){
     const {error}=await SB.from("records").upsert(up.slice(i,i+200).map(u=>({coll:u.c,id:u.id,data:u.o})),{onConflict:"coll,id"});
     if(error)throw error}
    for(const d of dl){const {error}=await SB.from("records").delete().eq("coll",d.c).eq("id",d.id);if(error)throw error}
   }catch(e){
    up.forEach(u=>{if(u.prev===undefined)delete LAST[u.c][u.id];else LAST[u.c][u.id]=u.prev});
    dl.forEach(d=>LAST[d.c][d.id]=d.prev);throw e}
  }while(again)}
  catch(e){good=false;console.warn("D-mealz sync failed, will retry",e);if(typeof syncWarn==="function")syncWarn(e)}
  finally{busy=false;keep()}
  return good}
 const push=()=>{if(!SB)return;clearTimeout(tm);tm=setTimeout(flush,150)};
 function applyPut(c,id,o){
  if(!COLS[c])return false;const l=LAST[c]||(LAST[c]={}),j=JSON.stringify(o);
  if(l[id]===j)return false;
  const wasDirty=dirty(c,id);l[id]=j;
  if(wasDirty)return false;           /* local edit not yet sent wins, it will be sent next */
  COLS[c].put(id,o);return true}
 function applyDel(c,id){
  if(!COLS[c]||c==="vw")return false;const l=LAST[c]||(LAST[c]={});
  const had=id in l,d=dirty(c,id);delete l[id];if(d)return false;
  const there=cur(c,id)!==undefined;if(there)COLS[c].del(id);return had||there}
 async function pull(){
  if(!SB)return false;
  const seen={};let from=0,changed=false;
  for(;;){
   const {data,error}=await SB.from("records").select("coll,id,data").order("coll").order("id").range(from,from+999);
   if(error){console.warn("D-mealz pull failed",error);if(typeof syncWarn==="function")syncWarn(error);return false}
   data.forEach(r=>{(seen[r.coll]||(seen[r.coll]={}))[r.id]=1;if(applyPut(r.coll,r.id,r.data))changed=true});
   if(data.length<1000)break;from+=1000}
  for(const c in COLS){if(c==="vw")continue;
   for(const [id] of COLS[c].list())if(!(seen[c]&&seen[c][id])&&(LAST[c]||{})[id]!==undefined&&!dirty(c,id)){applyDel(c,id);changed=true}}
  keep();await flush();return changed}
 let subbed=false,wasUp=false;
 function start(){
  if(!SB)return;
  pull().then(ch=>{if(ch)onRemote()});
  if(subbed)return;subbed=true;
  SB.channel("dmealz-records").on("postgres_changes",{event:"*",schema:"public",table:"records"},p=>{
   const r=p.eventType==="DELETE"?p.old:p.new;if(!r||!r.coll)return;
   const ch=p.eventType==="DELETE"?applyDel(r.coll,r.id):applyPut(r.coll,r.id,r.data);
   if(ch){keep();onRemote()}
  }).subscribe(st=>{if(st==="SUBSCRIBED"){if(wasUp)pull().then(ch=>{if(ch)onRemote()});wasUp=true}})}
 return{push,flush,pull,start,enabled:!!SB,_LAST:()=>LAST,_apply:applyPut,_del:applyDel};
}