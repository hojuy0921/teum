import { DurableObject } from "cloudflare:workers";

const TYPES = ["팝니다","구합니다","레슨","서비스","수제품"];

const PAGE = String.raw`<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>틈 — 필요한 사람과 할 수 있는 사람</title>
<meta name="description" content="중고물품, 레슨, 수제품, 작은 서비스를 연결하는 커뮤니티">
<style>
:root{--bg:#f4f1e9;--paper:#fffdf8;--ink:#161616;--muted:#777268;--line:#e5dfd4;--lime:#d8ff50;--dark:#171816;--soft:#ece8de}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,"Noto Sans KR",system-ui,sans-serif;letter-spacing:-.025em}
button,input,textarea,select{font:inherit}button{cursor:pointer}.wrap{max-width:1160px;margin:auto;padding:0 20px}
header{position:sticky;top:0;z-index:30;background:#fffdf8dd;border-bottom:1px solid var(--line);backdrop-filter:blur(18px)}
.nav{height:68px;display:flex;align-items:center;gap:12px}.logo{font-size:25px;font-weight:950;letter-spacing:-.08em;margin-right:auto}.logo small{font-size:10px;color:#8d877e;margin-left:5px}.navlinks{display:flex;gap:18px;color:#666158;font-size:14px}.navlinks a{text-decoration:none;color:inherit}
.btn{border:1px solid #ddd6ca;background:var(--paper);padding:10px 14px;border-radius:11px;font-weight:800}.btn.dark{background:var(--dark);color:#fff;border-color:var(--dark)}.btn.lime{background:var(--lime);border-color:#bcdf37}
.hero{padding:74px 0 48px;display:grid;grid-template-columns:1.2fr .8fr;gap:35px;align-items:end}.kicker{display:inline-block;background:var(--soft);padding:7px 11px;border-radius:999px;font-weight:850;font-size:11px}.hero h1{font-size:61px;line-height:1.01;letter-spacing:-.07em;margin:17px 0}.hero p{font-size:17px;line-height:1.75;color:var(--muted);margin:0}
.search{display:flex;background:var(--paper);border:1px solid var(--line);border-radius:15px;padding:6px;box-shadow:0 18px 40px #28241c0d}.search input{flex:1;border:0;outline:0;background:transparent;padding:14px}.search button{border:0;background:var(--dark);color:#fff;border-radius:10px;padding:0 20px;font-weight:900}
.pills{display:flex;gap:8px;overflow:auto;padding-bottom:8px}.pill{white-space:nowrap}.pill.active{background:var(--dark);color:#fff;border-color:var(--dark)}
.section{padding:24px 0 48px}.section h2{font-size:27px;letter-spacing:-.055em;margin:0}.sub{font-size:13px;color:var(--muted);margin-top:4px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:16px}
.card{background:var(--paper);border:1px solid var(--line);border-radius:17px;overflow:hidden}.thumb{aspect-ratio:1.6;background:linear-gradient(135deg,#e9e3d8,#f5f0e7);display:flex;align-items:center;justify-content:center;font-size:34px;overflow:hidden}.thumb img{width:100%;height:100%;object-fit:cover}.body{padding:17px}.tag{font-size:11px;font-weight:900;background:var(--soft);padding:5px 8px;border-radius:999px}.card h3{font-size:18px;line-height:1.32;margin:11px 0 8px}.desc{font-size:13px;color:#77716a;line-height:1.6;min-height:42px}.meta{display:flex;justify-content:space-between;gap:10px;margin-top:15px;font-size:12px;color:#8b847b}.price{color:#111;font-size:15px;font-weight:950}.empty{background:var(--paper);border:1px dashed #d8d0c3;border-radius:16px;padding:35px;text-align:center;color:#898278}
.feature{display:grid;grid-template-columns:1fr 1fr;gap:14px}.featurebox{border-radius:20px;padding:30px;min-height:205px;background:var(--dark);color:#fff}.featurebox.lime{background:var(--lime);color:var(--ink)}.featurebox span{font-size:11px;font-weight:900;opacity:.65}.featurebox h3{font-size:29px;line-height:1.08;letter-spacing:-.06em;margin:30px 0 9px}.featurebox p{font-size:13px;color:#aaa;margin:0}.featurebox.lime p{color:#525a2c}
footer{border-top:1px solid var(--line);padding:30px 0 60px;color:#8c857c;font-size:12px}.modalbg{display:none;position:fixed;inset:0;background:#15151566;z-index:50;padding:18px;align-items:center;justify-content:center}.modal{width:min(650px,100%);max-height:91vh;overflow:auto;background:var(--paper);border-radius:20px;padding:23px}.close{float:right;border:0;background:none;font-size:23px}.field{margin:11px 0}.field label{display:block;font-size:12px;color:#777;margin-bottom:6px;font-weight:750}.field input,.field textarea,.field select{width:100%;background:#fff;border:1px solid #ded7ca;border-radius:10px;padding:11px;outline:0}.field textarea{min-height:110px;resize:vertical}.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.small{font-size:12px;color:#8a8379;line-height:1.6}.toast{display:none;position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:70;background:#111;color:#fff;padding:12px 16px;border-radius:11px}
.bottom{display:none}
@media(max-width:820px){.navlinks{display:none}.hero{grid-template-columns:1fr;padding-top:47px}.hero h1{font-size:46px}.grid{grid-template-columns:1fr 1fr}.feature{grid-template-columns:1fr}.bottom{display:flex;position:fixed;z-index:35;bottom:0;left:0;right:0;background:#fffdf8;border-top:1px solid var(--line);justify-content:space-around;padding:9px}.bottom button{border:0;background:transparent;font-size:11px;color:#716b62}.bottom b{display:block;font-size:17px;margin-bottom:2px}}
@media(max-width:540px){.grid{grid-template-columns:1fr}.hero h1{font-size:40px}.wrap{padding:0 16px}}
</style></head>
<body>
<header><div class="wrap nav"><a class="logo" href="/">틈<small>TEUM</small></a><nav class="navlinks"><a href="#feed">마켓</a><a href="#wanted">구합니다</a><a href="#lesson">레슨</a><a href="#made">수제품</a></nav><span id="who" class="small"></span><button id="auth" class="btn" onclick="auth()">로그인</button><button class="btn dark" onclick="postForm()">+ 올리기</button></div></header>
<main class="wrap">
<section class="hero"><div><span class="kicker">NEED × CAN DO</span><h1>필요한 사람과<br>할 수 있는 사람.</h1><p>물건을 사고팔고, 저렴하게 배우고,<br>남는 시간과 재능까지 서로 연결합니다.</p></div><div><div class="search"><input id="q" placeholder="기타, 일본어, 아이패드, 사진 촬영..." oninput="loadPosts()"><button onclick="loadPosts()">찾기</button></div><div class="small" style="margin:9px 4px">가장 먼저 <b>구합니다</b>를 찾아보세요.</div></div></section>
<div class="pills" id="pills"></div>
<section class="section" id="feed"><h2>지금 올라온 것</h2><div class="sub">가까운 거래와 새로운 재능</div><div id="cards" class="grid"></div></section>
<section class="section" id="wanted"><h2>🔎 사람들이 구합니다</h2><div class="sub">수요가 먼저 올라오면 공급이 찾아옵니다.</div><div id="wcards" class="grid"></div></section>
<section class="section" id="lesson"><div class="feature"><div class="featurebox"><span>LESSON</span><h3>내가 아는 걸<br>저렴하게 가르쳐요.</h3><p>기타 · 언어 · 공부 · 영상 · 음악</p></div><div class="featurebox lime"><span>HANDMADE & SERVICE</span><h3>남는 시간과<br>재능도 상품이 됩니다.</h3><p>수제품 · 사진 · PC 도움 · 작은 서비스</p></div></div></section>
<section class="section" id="made"><h2>틈의 원칙</h2><div class="sub">비싸게가 아니라, 서로에게 필요한 가격으로.</div></section>
</main>
<footer><div class="wrap">틈 TEUM · 필요한 사람과 할 수 있는 사람을 연결합니다.</div></footer>
<nav class="bottom"><button onclick="scrollTo({top:0,behavior:'smooth'})"><b>⌂</b>홈</button><button onclick="location.hash='wanted'"><b>⌕</b>구합니다</button><button onclick="postForm()"><b>＋</b>올리기</button><button onclick="messages()"><b>☷</b>메시지</button><button onclick="auth()"><b>○</b>내 정보</button></nav>
<div class="modalbg" id="bg"><div class="modal" id="modal"></div></div><div class="toast" id="toast"></div>
<script>
const cats=["전체","팝니다","구합니다","레슨","서비스","수제품"];let active="전체",me=null;
const icons={팝니다:"🛍️",구합니다:"🔎",레슨:"🎓",서비스:"🛠️",수제품:"✦"};const $=x=>document.querySelector(x),esc=x=>String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));const won=n=>n==null||n===""?"협의":Number(n).toLocaleString()+"원";
async function api(u,o={}){const r=await fetch(u,{credentials:"include",headers:{"Content-Type":"application/json",...(o.headers||{})},...o});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||"요청에 실패했습니다.");return d}
function modal(h){$("#modal").innerHTML=h;$("#bg").style.display="flex"}function close(){ $("#bg").style.display="none" }$("#bg").onclick=e=>{if(e.target.id==="bg")close()};function toast(t){$("#toast").textContent=t;$("#toast").style.display="block";setTimeout(()=>$("#toast").style.display="none",1800)}
$("#pills").innerHTML=cats.map(c=>`<button class="btn pill ${c==="전체"?"active":""}" onclick="setCat('${c}',this)">${c}</button>`).join("");
function setCat(c,e){active=c;document.querySelectorAll(".pill").forEach(x=>x.classList.remove("active"));e.classList.add("active");loadPosts()}
async function loadMe(){try{me=(await api("/api/me")).user}catch{me=null}$("#who").textContent=me?me.name:"";$("#auth").textContent=me?"로그아웃":"로그인"}
async function loadPosts(){try{const q=encodeURIComponent($("#q").value||"");let u="/api/posts?q="+q+(active!=="전체"?"&type="+encodeURIComponent(active):"");const d=await api(u);const a=d.posts;$("#cards").innerHTML=a.slice(0,15).map(card).join("")||'<div class="empty">게시글이 없습니다.</div>';$("#wcards").innerHTML=a.filter(x=>x.type==="구합니다").slice(0,9).map(card).join("")||'<div class="empty">아직 구하는 글이 없습니다.</div>'}catch(e){toast(e.message)}}
function card(p){return `<article class="card"><div class="thumb">${p.image?`<img src="${esc(p.image)}">`:`<span>${icons[p.type]||"◌"}</span>`}</div><div class="body"><span class="tag">${esc(p.type)}</span><h3>${esc(p.title)}</h3><div class="desc">${esc(p.description)}</div><div class="meta"><span>${esc(p.city||"지역 미정")} · ${esc(p.name)}</span><span class="price">${won(p.price)}</span></div><div class="actions"><button class="btn" onclick="view(${p.id})">자세히</button></div></div></article>`}
async function view(id){try{const d=await api("/api/posts/"+id),p=d.post;modal(`<button class="close" onclick="close()">×</button><span class="tag">${esc(p.type)}</span><h2>${esc(p.title)}</h2>${p.image?`<img src="${esc(p.image)}" style="width:100%;max-height:330px;object-fit:cover;border-radius:14px">`:""}<p style="line-height:1.8;color:#69635b">${esc(p.description)}</p><p><b>${won(p.price)}</b> · ${esc(p.city||"지역 미정")} · ${esc(p.name)}</p>${d.matches?.length?`<div style="margin-top:20px"><b>이 글과 잘 맞는 글</b>${d.matches.map(m=>`<p class="small">→ ${esc(m.title)} · 매칭 ${m.score.toFixed(1)}</p>`).join("")}</div>`:""}${me&&me.id!==p.user_id?`<div class="field"><label>메시지</label><textarea id="mb" placeholder="안녕하세요. 아직 거래 가능한가요?"></textarea></div><div class="actions"><button class="btn" onclick="close()">닫기</button><button class="btn dark" onclick="sendMsg(${p.id},${p.user_id})">보내기</button></div>`:""}`)}catch(e){toast(e.message)}}
function auth(){if(me){api("/api/logout",{method:"POST"}).then(()=>{me=null;loadMe();toast("로그아웃했습니다.")});return}modal(`<button class="close" onclick="close()">×</button><h2>로그인</h2><div class="field"><label>아이디</label><input id="lu"></div><div class="field"><label>비밀번호</label><input id="lp" type="password"></div><div class="actions"><button class="btn" onclick="registerForm()">회원가입</button><button class="btn dark" onclick="loginDo()">로그인</button></div>`)}
function registerForm(){modal(`<button class="close" onclick="close()">×</button><h2>회원가입</h2><div class="row"><div class="field"><label>아이디</label><input id="rn"></div><div class="field"><label>이름</label><input id="rname"></div></div><div class="field"><label>비밀번호 (6자 이상)</label><input id="rp" type="password"></div><div class="field"><label>지역</label><input id="rc" placeholder="김해"></div><div class="actions"><button class="btn" onclick="close()">취소</button><button class="btn dark" onclick="registerDo()">가입하기</button></div>`)}
async function loginDo(){try{await api("/api/login",{method:"POST",body:JSON.stringify({username:$("#lu").value,password:$("#lp").value})});await loadMe();close();toast("로그인했습니다.")}catch(e){toast(e.message)}}
async function registerDo(){try{await api("/api/register",{method:"POST",body:JSON.stringify({username:$("#rn").value,name:$("#rname").value,password:$("#rp").value,city:$("#rc").value})});await loadMe();close();toast("가입되었습니다.")}catch(e){toast(e.message)}}
function postForm(){if(!me){auth();return}modal(`<button class="close" onclick="close()">×</button><h2>새 글 올리기</h2><div class="row"><div class="field"><label>종류</label><select id="pt">${cats.slice(1).map(c=>`<option>${c}</option>`).join("")}</select></div><div class="field"><label>지역</label><input id="pc" value="${esc(me.city||"")}"></div></div><div class="field"><label>제목</label><input id="ph"></div><div class="field"><label>설명</label><textarea id="pd"></textarea></div><div class="row"><div class="field"><label>가격 / 예산</label><input id="pp" type="number" min="0"></div><div class="field"><label>태그</label><input id="pg" placeholder="기타 악기"></div></div><div class="field"><label>상품 사진 (선택)</label><input id="pi" type="file" accept="image/jpeg,image/png,image/webp"></div><div class="actions"><button class="btn" onclick="close()">취소</button><button class="btn dark" onclick="postDo()">등록하기</button></div>`)}
async function postDo(){try{let image="";const f=$("#pi").files[0];if(f){if(f.size>800000)throw Error("사진은 800KB 이하로 올려주세요.");const data=await new Promise((ok,no)=>{const fr=new FileReader();fr.onload=()=>ok(fr.result);fr.onerror=no;fr.readAsDataURL(f)});image=(await api("/api/upload",{method:"POST",body:JSON.stringify({data})})).url}await api("/api/posts",{method:"POST",body:JSON.stringify({type:$("#pt").value,title:$("#ph").value,description:$("#pd").value,price:$("#pp").value,city:$("#pc").value,tags:$("#pg").value,image})});close();await loadPosts();toast("게시글이 등록되었습니다.")}catch(e){toast(e.message)}}
async function sendMsg(post_id,receiver_id){try{await api("/api/messages",{method:"POST",body:JSON.stringify({post_id,receiver_id,body:$("#mb").value})});close();toast("메시지를 보냈습니다.")}catch(e){toast(e.message)}}
async function messages(){if(!me){auth();return}try{const d=await api("/api/messages");modal(`<button class="close" onclick="close()">×</button><h2>메시지</h2>${d.messages.map(m=>`<div style="padding:11px 0;border-bottom:1px solid #eee"><b>${esc(m.sender_name)}</b> · ${esc(m.title)}<p class="small">${esc(m.body)}</p></div>`).join("")||'<div class="empty">메시지가 없습니다.</div>'}`) }catch(e){toast(e.message)}}
loadMe().then(loadPosts);
</script></body></html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      const id = env.TEUM_DB.idFromName("global");
      return env.TEUM_DB.get(id).fetch(request);
    }
    return new Response(PAGE,{headers:{"content-type":"text/html; charset=UTF-8","cache-control":"no-store"}});
  }
};

export class TeumDatabase extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        city TEXT DEFAULT '',
        bio TEXT DEFAULT '',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS sessions(
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS posts(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER,
        city TEXT DEFAULT '',
        tags TEXT DEFAULT '',
        image TEXT DEFAULT '',
        status TEXT DEFAULT 'OPEN',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS messages(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        body TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS reviews(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reviewer_id INTEGER NOT NULL,
        reviewee_id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        rating INTEGER NOT NULL,
        body TEXT DEFAULT '',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(reviewer_id,post_id)
      );
      CREATE TABLE IF NOT EXISTS reports(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reporter_id INTEGER NOT NULL,
        post_id INTEGER,
        reason TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
  async fetch(req) {
    const u=new URL(req.url),m=req.method;
    try{
      if(m==="GET"&&u.pathname==="/api/health")return j({ok:true});
      if(m==="GET"&&u.pathname==="/api/me"){const x=this.me(req);return j({user:x?safeUser(x):null})}
      if(m==="POST"&&u.pathname==="/api/register")return this.register(req);
      if(m==="POST"&&u.pathname==="/api/login")return this.login(req);
      if(m==="POST"&&u.pathname==="/api/logout")return this.logout(req);
      if(m==="GET"&&u.pathname==="/api/posts")return this.posts(u);
      if(m==="POST"&&u.pathname==="/api/posts")return this.createPost(req);
      if(m==="GET"&&/^\/api\/posts\/\d+$/.test(u.pathname))return this.post(+u.pathname.split("/").pop());
      if(m==="POST"&&u.pathname==="/api/upload")return this.upload(req);
      if(m==="POST"&&u.pathname==="/api/messages")return this.sendMessage(req);
      if(m==="GET"&&u.pathname==="/api/messages")return this.messages(req);
      if(m==="POST"&&u.pathname==="/api/review")return this.review(req);
      if(m==="POST"&&u.pathname==="/api/report")return this.report(req);
      return j({error:"Not Found"},404);
    }catch(e){console.error(e);return j({error:"서버 오류가 발생했습니다."},500)}
  }
  me(req){const t=cookies(req).teum;return t?this.sql.exec("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires>?",t,Date.now()).toArray()[0]:null}
  async register(req){const b=await req.json();if(!b.username||!b.password||String(b.password).length<6)return j({error:"아이디와 6자 이상 비밀번호가 필요합니다."},400);try{const hashv=await makeHash(String(b.password));const r=this.sql.exec("INSERT INTO users(username,password_hash,name,city,bio) VALUES(?,?,?,?,?)",String(b.username).trim().slice(0,30),hashv,String(b.name||b.username).trim().slice(0,50),String(b.city||"").slice(0,80),String(b.bio||"").slice(0,500));const id=Number(r.lastInsertRowId);return sessionResponse(this,id)}catch{return j({error:"이미 사용 중인 아이디입니다."},409)}}
  async login(req){const b=await req.json(),u=this.sql.exec("SELECT * FROM users WHERE username=?",String(b.username||"").trim()).toArray()[0];if(!u||!(await verifyHash(String(b.password||""),u.password_hash)))return j({error:"아이디 또는 비밀번호가 올바르지 않습니다."},401);return sessionResponse(this,u.id)}
  logout(req){const t=cookies(req).teum;if(t)this.sql.exec("DELETE FROM sessions WHERE token=?",t);return new Response(JSON.stringify({ok:true}),{headers:{"content-type":"application/json; charset=utf-8","Set-Cookie":"teum=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0"}})}
  posts(u){const t=u.searchParams.get("type")||"",q=(u.searchParams.get("q")||"").toLowerCase();let a=this.sql.exec("SELECT p.*,u.name FROM posts p JOIN users u ON u.id=p.user_id WHERE p.status<>'HIDDEN' AND (?='' OR p.type=?) ORDER BY p.id DESC LIMIT 100",t,t).toArray();if(q)a=a.filter(x=>(x.title+" "+x.description+" "+x.tags+" "+x.city).toLowerCase().includes(q));return j({posts:a})}
  createPost=async(req)=>{const u=this.me(req);if(!u)return j({error:"로그인이 필요합니다."},401);const b=await req.json();if(!TYPES.includes(b.type)||!b.title||!b.description)return j({error:"종류·제목·설명을 입력하세요."},400);const price=b.price===""||b.price==null?null:Math.max(0,Math.floor(Number(b.price)));if(price!==null&&!Number.isFinite(price))return j({error:"가격을 확인하세요."},400);const r=this.sql.exec("INSERT INTO posts(user_id,type,title,description,price,city,tags,image) VALUES(?,?,?,?,?,?,?,?)",u.id,b.type,String(b.title).trim().slice(0,100),String(b.description).trim().slice(0,3000),price,String(b.city||u.city||"").slice(0,80),String(b.tags||"").slice(0,300),String(b.image||"").slice(0,1500000));return j({post:this.sql.exec("SELECT p.*,u.name FROM posts p JOIN users u ON u.id=p.user_id WHERE p.id=?",Number(r.lastInsertRowId)).toArray()[0]},201)}
  post(id){const p=this.sql.exec("SELECT p.*,u.name FROM posts p JOIN users u ON u.id=p.user_id WHERE p.id=?",id).toArray()[0];if(!p)return j({error:"게시글이 없습니다."},404);const ms=p.type==="구합니다"?this.match(p):[];return j({post:p,matches:ms,reviews:this.sql.exec("SELECT r.*,u.name FROM reviews r JOIN users u ON u.id=r.reviewer_id WHERE r.post_id=? ORDER BY r.id DESC",id).toArray()})}
  match(w){const a=this.sql.exec("SELECT p.*,u.name FROM posts p JOIN users u ON u.id=p.user_id WHERE p.status='OPEN' AND p.type IN ('팝니다','레슨','서비스','수제품') AND p.id<>? ORDER BY p.id DESC LIMIT 100",w.id).toArray();const wt=new Set((w.title+" "+w.description+" "+w.tags).toLowerCase().split(/[^0-9a-z가-힣]+/i).filter(x=>x.length>1));return a.map(p=>{let s=0;const pt=(p.title+" "+p.description+" "+p.tags).toLowerCase();for(const t of wt)if(pt.includes(t))s+=Math.min(4,t.length/3);if(w.city&&p.city&&(w.city.includes(p.city)||p.city.includes(w.city)))s+=3;if(w.price&&p.price&&Number(p.price)<=Number(w.price))s+=3;return {...p,score:s}}).filter(x=>x.score>=3).sort((a,b)=>b.score-a.score).slice(0,8)}
  upload=async(req)=>{const u=this.me(req);if(!u)return j({error:"로그인이 필요합니다."},401);const b=await req.json();const m=String(b.data||"").match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);if(!m)return j({error:"JPG/PNG/WEBP만 가능합니다."},400);if(m[2].length>1100000)return j({error:"사진은 800KB 이하로 올려주세요."},400);const id=crypto.randomUUID();this.sql.exec("CREATE TABLE IF NOT EXISTS images(id TEXT PRIMARY KEY,data TEXT NOT NULL,mime TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP)");this.sql.exec("INSERT INTO images(id,data,mime) VALUES(?,?,?)",id,m[2],m[1]);return j({url:"/api/image/"+id},201)}
  image=async(id)=>{const x=this.sql.exec("SELECT data,mime FROM images WHERE id=?",id).toArray()[0];if(!x)return new Response("Not Found",{status:404});const bin=Uint8Array.from(atob(x.data),c=>c.charCodeAt(0));return new Response(bin,{headers:{"content-type":x.mime,"cache-control":"public,max-age=31536000"}})}
  sendMessage=async(req)=>{const u=this.me(req);if(!u)return j({error:"로그인이 필요합니다."},401);const b=await req.json(),p=this.sql.exec("SELECT * FROM posts WHERE id=?",+b.post_id).toArray()[0];if(!p||p.user_id===u.id)return j({error:"메시지를 보낼 수 없습니다."},400);const body=String(b.body||"").trim();if(!body||body.length>2000)return j({error:"메시지를 확인하세요."},400);const r=this.sql.exec("INSERT INTO messages(post_id,sender_id,receiver_id,body) VALUES(?,?,?,?)",p.id,u.id,p.user_id,body);return j({message:this.sql.exec("SELECT m.*,s.name sender_name,p.title FROM messages m JOIN users s ON s.id=m.sender_id JOIN posts p ON p.id=m.post_id WHERE m.id=?",Number(r.lastInsertRowId)).toArray()[0]},201)}
  messages(req){const u=this.me(req);if(!u)return j({error:"로그인이 필요합니다."},401);return j({messages:this.sql.exec("SELECT m.*,s.name sender_name,p.title FROM messages m JOIN users s ON s.id=m.sender_id JOIN posts p ON p.id=m.post_id WHERE m.sender_id=? OR m.receiver_id=? ORDER BY m.id ASC LIMIT 200",u.id,u.id).toArray()})}
  review=async(req)=>{const u=this.me(req);if(!u)return j({error:"로그인이 필요합니다."},401);const b=await req.json(),p=this.sql.exec("SELECT * FROM posts WHERE id=?",+b.post_id).toArray()[0];if(!p||p.user_id===u.id)return j({error:"후기를 남길 수 없습니다."},400);try{this.sql.exec("INSERT INTO reviews(reviewer_id,reviewee_id,post_id,rating,body) VALUES(?,?,?,?,?)",u.id,p.user_id,p.id,Math.max(1,Math.min(5,+b.rating||0)),String(b.body||"").slice(0,1000));return j({ok:true},201)}catch{return j({error:"이미 후기를 남겼습니다."},409)}}
  report=async(req)=>{const u=this.me(req);if(!u)return j({error:"로그인이 필요합니다."},401);const b=await req.json();if(!b.reason)return j({error:"신고 사유가 필요합니다."},400);this.sql.exec("INSERT INTO reports(reporter_id,post_id,reason) VALUES(?,?,?)",u.id,b.post_id?+b.post_id:null,String(b.reason).slice(0,1000));return j({ok:true},201)}
}

async function makeHash(password){const salt=crypto.randomUUID();const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:new TextEncoder().encode(salt),iterations:120000,hash:"SHA-256"},key,256);return salt+":"+buf(bits)}
async function verifyHash(password,stored){const [salt,want]=String(stored).split(":");const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:new TextEncoder().encode(salt),iterations:120000,hash:"SHA-256"},key,256);return buf(bits)===want}
function buf(x){return [...new Uint8Array(x)].map(v=>v.toString(16).padStart(2,"0")).join("")}
function cookies(req){return Object.fromEntries((req.headers.get("Cookie")||"").split(";").filter(Boolean).map(x=>{const i=x.indexOf("=");return [x.slice(0,i).trim(),decodeURIComponent(x.slice(i+1))]}))}
function safeUser(x){return {id:x.id,username:x.username,name:x.name,city:x.city,bio:x.bio}}
function j(d,s=200,h={}){return new Response(JSON.stringify(d),{status:s,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store",...h}})}
function sessionResponse(db,id){const token=crypto.randomUUID()+crypto.randomUUID();db.sql.exec("INSERT INTO sessions(token,user_id,expires) VALUES(?,?,?)",token,id,Date.now()+2592000000);return j({ok:true},{status:200,headers:{"Set-Cookie":`teum=${token}; HttpOnly; Path=/; SameSite=Lax; Secure; Max-Age=2592000`}})}
