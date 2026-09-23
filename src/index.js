import { DurableObject } from "cloudflare:workers";

const TYPES = ["팝니다", "구합니다", "레슨", "서비스", "수제품"];

const PAGE = String.raw`<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>틈 — 필요한 사람과 할 수 있는 사람</title>
<meta name="description" content="필요한 사람과 할 수 있는 사람을 연결합니다.">
<style>
:root{--bg:#f4f1e9;--paper:#fffdf8;--ink:#171717;--muted:#77716a;--line:#e5dfd4;--lime:#d8ff50;--dark:#171816;--soft:#ece8de}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,"Noto Sans KR",system-ui,sans-serif;letter-spacing:-.025em}
button,input,textarea,select{font:inherit}button{cursor:pointer}.wrap{max-width:1160px;margin:auto;padding:0 20px}
header{position:sticky;top:0;z-index:30;background:#fffdf8ee;border-bottom:1px solid var(--line);backdrop-filter:blur(16px)}
.nav{min-height:68px;display:flex;align-items:center;gap:12px}.logo{font-size:25px;font-weight:950;letter-spacing:-.08em;margin-right:auto;text-decoration:none;color:var(--ink)}.logo small{font-size:10px;color:#8d877e;margin-left:5px}
.navlinks{display:flex;gap:18px;color:#666158;font-size:14px}.navlinks a{text-decoration:none;color:inherit}
.btn{border:1px solid #ddd6ca;background:var(--paper);padding:10px 14px;border-radius:11px;font-weight:800}.btn.dark{background:var(--dark);color:#fff;border-color:var(--dark)}.btn.lime{background:var(--lime);border-color:#bcdf37}
.hero{padding:72px 0 44px;display:grid;grid-template-columns:1.05fr .95fr;gap:35px;align-items:end}.kicker{display:inline-block;background:var(--soft);padding:7px 11px;border-radius:999px;font-weight:850;font-size:11px}.hero h1{font-size:60px;line-height:1.02;letter-spacing:-.075em;margin:17px 0}.hero p{font-size:17px;line-height:1.75;color:var(--muted);margin:0}
.search{display:flex;background:var(--paper);border:1px solid var(--line);border-radius:15px;padding:6px;box-shadow:0 18px 40px #28241c0d}.search input{flex:1;border:0;outline:0;background:transparent;padding:14px}.search button{border:0;background:var(--dark);color:#fff;border-radius:10px;padding:0 20px;font-weight:900}
.pills{display:flex;gap:8px;overflow:auto;padding:4px 0 8px}.pill{white-space:nowrap}.pill.active{background:var(--dark);color:#fff;border-color:var(--dark)}
.section{padding:26px 0 50px}.section h2{font-size:28px;letter-spacing:-.055em;margin:0}.sub{font-size:13px;color:var(--muted);margin-top:4px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:16px}.card{background:var(--paper);border:1px solid var(--line);border-radius:17px;overflow:hidden}.thumb{aspect-ratio:1.6;background:linear-gradient(135deg,#e9e3d8,#f5f0e7);display:flex;align-items:center;justify-content:center;font-size:34px;overflow:hidden}.thumb img{width:100%;height:100%;object-fit:cover}.body{padding:17px}.tag{font-size:11px;font-weight:900;background:var(--soft);padding:5px 8px;border-radius:999px}.card h3{font-size:18px;line-height:1.32;margin:11px 0 8px}.desc{font-size:13px;color:#77716a;line-height:1.6;min-height:42px}.meta{display:flex;justify-content:space-between;gap:10px;margin-top:15px;font-size:12px;color:#8b847b}.price{color:#111;font-size:15px;font-weight:950}.empty{background:var(--paper);border:1px dashed #d8d0c3;border-radius:16px;padding:35px;text-align:center;color:#898278}
.feature{display:grid;grid-template-columns:1fr 1fr;gap:14px}.featurebox{border-radius:20px;padding:30px;min-height:205px;background:var(--dark);color:#fff}.featurebox.lime{background:var(--lime);color:var(--ink)}.featurebox span{font-size:11px;font-weight:900;opacity:.65}.featurebox h3{font-size:29px;line-height:1.08;letter-spacing:-.06em;margin:30px 0 9px}.featurebox p{font-size:13px;color:#aaa;margin:0}.featurebox.lime p{color:#525a2c}
footer{border-top:1px solid var(--line);padding:30px 0 60px;color:#8c857c;font-size:12px}.modalbg{display:none;position:fixed;inset:0;background:#15151566;z-index:50;padding:18px;align-items:center;justify-content:center}.modal{width:min(650px,100%);max-height:91vh;overflow:auto;background:var(--paper);border-radius:20px;padding:23px}.close{float:right;border:0;background:none;font-size:23px}.field{margin:11px 0}.field label{display:block;font-size:12px;color:#777;margin-bottom:6px;font-weight:750}.field input,.field textarea,.field select{width:100%;background:#fff;border:1px solid #ded7ca;border-radius:10px;padding:11px;outline:0}.field textarea{min-height:110px;resize:vertical}.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.small{font-size:12px;color:#8a8379;line-height:1.6}.toast{display:none;position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:70;background:#111;color:#fff;padding:12px 16px;border-radius:11px}
.bottom{display:none}
@media(max-width:820px){.navlinks{display:none}.hero{grid-template-columns:1fr;padding-top:47px}.hero h1{font-size:46px}.grid{grid-template-columns:1fr 1fr}.feature{grid-template-columns:1fr}.bottom{display:flex;position:fixed;z-index:35;bottom:0;left:0;right:0;background:#fffdf8;border-top:1px solid var(--line);justify-content:space-around;padding:9px}.bottom button{border:0;background:transparent;font-size:11px;color:#716b62}.bottom b{display:block;font-size:17px;margin-bottom:2px}}
@media(max-width:540px){.grid{grid-template-columns:1fr}.hero h1{font-size:40px}.wrap{padding:0 16px}}
</style>
</head>
<body>
<header><div class="wrap nav">
<a class="logo" href="/">틈<small>TEUM</small></a>
<nav class="navlinks"><a href="#feed">마켓</a><a href="#wanted">구합니다</a><a href="#lesson">레슨</a><a href="#made">수제품</a></nav>
<span id="who" class="small"></span><button id="auth" class="btn" onclick="auth()">로그인</button><button class="btn dark" onclick="postForm()">+ 올리기</button>
</div></header>
<main class="wrap">
<section class="hero">
<div><span class="kicker">NEED × CAN DO</span><h1>필요한 사람과<br>할 수 있는 사람.</h1><p>물건을 사고팔고, 저렴하게 배우고,<br>남는 시간과 재능까지 서로 연결합니다.</p></div>
<div><div class="search"><input id="q" placeholder="기타, 일본어, 아이패드, 사진 촬영..."><button onclick="loadPosts()">찾기</button></div><div class="small" style="margin:9px 4px">가장 먼저 <b>구합니다</b>를 찾아보세요.</div></div>
</section>
<div class="pills" id="pills"></div>
<section class="section" id="feed"><h2>지금 올라온 것</h2><div class="sub">가까운 거래와 새로운 재능</div><div id="cards" class="grid"></div></section>
<section class="section" id="wanted"><h2>🔎 사람들이 구합니다</h2><div class="sub">수요가 먼저 올라오면 공급이 찾아옵니다.</div><div id="wcards" class="grid"></div></section>
<section class="section" id="lesson"><div class="feature"><div class="featurebox"><span>LESSON</span><h3>내가 아는 걸<br>저렴하게 가르쳐요.</h3><p>기타 · 언어 · 공부 · 영상 · 음악</p></div><div class="featurebox lime"><span>HANDMADE & SERVICE</span><h3>남는 시간과<br>재능도 상품이 됩니다.</h3><p>수제품 · 사진 · PC 도움 · 작은 서비스</p></div></div></section>
<section class="section" id="made"><h2>틈의 원칙</h2><div class="sub">비싸게가 아니라, 서로에게 필요한 가격으로.</div></section>
</main>
<footer><div class="wrap">틈 TEUM · 필요한 사람과 할 수 있는 사람을 연결합니다.</div></footer>
<nav class="bottom"><button onclick="window.scrollTo({top:0,behavior:'smooth'})"><b>⌂</b>홈</button><button onclick="location.hash='wanted'"><b>⌕</b>구합니다</button><button onclick="postForm()"><b>＋</b>올리기</button><button onclick="messages()"><b>☷</b>메시지</button><button onclick="auth()"><b>○</b>내 정보</button></nav>
<div class="modalbg" id="bg"><div class="modal" id="modal"></div></div><div class="toast" id="toast"></div>
<script>
var cats=["전체","팝니다","구합니다","레슨","서비스","수제품"],active="전체",me=null;
var icons={팝니다:"🛍️",구합니다:"🔎",레슨:"🎓",서비스:"🛠️",수제품:"✦"};
function $(s){return document.querySelector(s)}
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]})}
function won(n){if(n==null||n==="")return "협의";var x=Number(n);return Number.isFinite(x)?x.toLocaleString()+"원":String(n)}
async function api(u,o){o=o||{};var opt=Object.assign({},o,{credentials:"include",headers:Object.assign({"Content-Type":"application/json"},o.headers||{})});var r=await fetch(u,opt);var d=await r.json().catch(function(){return {}});if(!r.ok)throw Error(d.error||"요청에 실패했습니다.");return d}
function modal(h){$("#modal").innerHTML=h;$("#bg").style.display="flex"}
function closeModal(){$("#bg").style.display="none"}
$("#bg").addEventListener("click",function(e){if(e.target.id==="bg")closeModal()})
function toast(t){$("#toast").textContent=t;$("#toast").style.display="block";setTimeout(function(){$("#toast").style.display="none"},1800)}
$("#pills").innerHTML=cats.map(function(c){return '<button class="btn pill '+(c==="전체"?"active":"")+'" data-cat="'+esc(c)+'">'+esc(c)+'</button>'}).join("")
document.querySelectorAll(".pill").forEach(function(el){el.addEventListener("click",function(){active=el.getAttribute("data-cat");document.querySelectorAll(".pill").forEach(function(x){x.classList.remove("active")});el.classList.add("active");loadPosts()})})
$("#q").addEventListener("keydown",function(e){if(e.key==="Enter")loadPosts()})
async function loadMe(){try{me=(await api("/api/me")).user}catch(e){me=null}$("#who").textContent=me?me.name:"";$("#auth").textContent=me?"로그아웃":"로그인"}
async function loadPosts(){try{var q=encodeURIComponent($("#q").value||"");var u="/api/posts?q="+q+(active!=="전체"?"&type="+encodeURIComponent(active):"");var a=(await api(u)).posts;$("#cards").innerHTML=a.slice(0,15).map(card).join("")||'<div class="empty">아직 게시글이 없습니다.</div>';$("#wcards").innerHTML=a.filter(function(x){return x.type==="구합니다"}).slice(0,9).map(card).join("")||'<div class="empty">아직 구하는 글이 없습니다.</div>'}catch(e){toast(e.message)}}
function card(p){var image=p.image?'<img src="'+esc(p.image)+'" alt="">':'<span>'+esc(icons[p.type]||"◌")+'</span>';return '<article class="card"><div class="thumb">'+image+'</div><div class="body"><span class="tag">'+esc(p.type)+'</span><h3>'+esc(p.title)+'</h3><div class="desc">'+esc(p.description)+'</div><div class="meta"><span>'+esc(p.city||"지역 미정")+' · '+esc(p.name)+'</span><span class="price">'+won(p.price)+'</span></div><div class="actions"><button class="btn" onclick="viewPost('+p.id+')">자세히</button></div></div></article>'}
async function viewPost(id){try{var d=await api("/api/posts/"+id),p=d.post;var h='<button class="close" onclick="closeModal()">×</button><span class="tag">'+esc(p.type)+'</span><h2>'+esc(p.title)+'</h2>';if(p.image)h+='<img src="'+esc(p.image)+'" style="width:100%;max-height:330px;object-fit:cover;border-radius:14px" alt="">';h+='<p style="line-height:1.8;color:#69635b">'+esc(p.description)+'</p><p><b>'+won(p.price)+'</b> · '+esc(p.city||"지역 미정")+' · '+esc(p.name)+'</p>';if(me&&me.id!==p.user_id)h+='<div class="field"><label>메시지</label><textarea id="mb" placeholder="안녕하세요. 아직 가능한가요?"></textarea></div><div class="actions"><button class="btn" onclick="closeModal()">닫기</button><button class="btn dark" onclick="sendMsg('+p.id+','+p.user_id+')">보내기</button></div>';modal(h)}catch(e){toast(e.message)}}
function auth(){if(me){api("/api/logout",{method:"POST"}).then(function(){me=null;loadMe();toast("로그아웃했습니다.")}).catch(function(e){toast(e.message)});return}modal('<button class="close" onclick="closeModal()">×</button><h2>로그인</h2><div class="field"><label>아이디</label><input id="lu"></div><div class="field"><label>비밀번호</label><input id="lp" type="password"></div><div class="actions"><button class="btn" onclick="registerForm()">회원가입</button><button class="btn dark" onclick="loginDo()">로그인</button></div>')}
function registerForm(){modal('<button class="close" onclick="closeModal()">×</button><h2>회원가입</h2><div class="row"><div class="field"><label>아이디</label><input id="rn"></div><div class="field"><label>이름</label><input id="rname"></div></div><div class="field"><label>비밀번호 (6자 이상)</label><input id="rp" type="password"></div><div class="field"><label>지역</label><input id="rc" placeholder="김해"></div><div class="actions"><button class="btn" onclick="closeModal()">취소</button><button class="btn dark" onclick="registerDo()">가입하기</button></div>')}
async function loginDo(){try{await api("/api/login",{method:"POST",body:JSON.stringify({username:$("#lu").value,password:$("#lp").value})});await loadMe();closeModal();toast("로그인했습니다.")}catch(e){toast(e.message)}}
async function registerDo(){try{await api("/api/register",{method:"POST",body:JSON.stringify({username:$("#rn").value,name:$("#rname").value,password:$("#rp").value,city:$("#rc").value})});await loadMe();closeModal();toast("가입되었습니다.")}catch(e){toast(e.message)}}
function postForm(){if(!me){auth();toast("로그인한 뒤 게시글을 올릴 수 있어요.");return}modal('<button class="close" onclick="closeModal()">×</button><h2>새 글 올리기</h2><div class="row"><div class="field"><label>종류</label><select id="pt">'+cats.slice(1).map(function(c){return "<option>"+esc(c)+"</option>"}).join("")+'</select></div><div class="field"><label>지역</label><input id="pc" value="'+esc(me.city||"")+'"></div></div><div class="field"><label>제목</label><input id="ph"></div><div class="field"><label>설명</label><textarea id="pd"></textarea></div><div class="row"><div class="field"><label>가격 / 예산</label><input id="pp" type="number" min="0"></div><div class="field"><label>태그</label><input id="pg" placeholder="기타, 김해"></div></div><div class="field"><label>사진 (선택)</label><input id="pi" type="file" accept="image/jpeg,image/png,image/webp"></div><div class="actions"><button class="btn" onclick="closeModal()">취소</button><button class="btn dark" onclick="postDo()">등록하기</button></div>')}
async function postDo(){try{var image="",f=$("#pi").files[0];if(f){if(f.size>800000)throw Error("사진은 800KB 이하로 올려주세요.");var data=await new Promise(function(ok,no){var fr=new FileReader();fr.onload=function(){ok(fr.result)};fr.onerror=no;fr.readAsDataURL(f)});image=(await api("/api/upload",{method:"POST",body:JSON.stringify({data:data})})).url}await api("/api/posts",{method:"POST",body:JSON.stringify({type:$("#pt").value,title:$("#ph").value,description:$("#pd").value,price:$("#pp").value,city:$("#pc").value,tags:$("#pg").value,image:image})});closeModal();await loadPosts();toast("게시글이 등록되었습니다.")}catch(e){toast(e.message)}}
async function sendMsg(post_id,receiver_id){try{await api("/api/messages",{method:"POST",body:JSON.stringify({post_id:post_id,receiver_id:receiver_id,body:$("#mb").value})});closeModal();toast("메시지를 보냈습니다.")}catch(e){toast(e.message)}}
async function messages(){if(!me){auth();return}try{var d=await api("/api/messages"),list=d.messages||[];var h='<button class="close" onclick="closeModal()">×</button><h2>메시지</h2>';h+=list.length?list.map(function(m){return '<div style="padding:11px 0;border-bottom:1px solid #eee"><b>'+esc(m.sender_name)+'</b> · '+esc(m.title)+'<p class="small">'+esc(m.body)+'</p></div>'}).join(""):'<div class="empty">메시지가 없습니다.</div>';modal(h)}catch(e){toast(e.message)}}
loadMe().then(loadPosts);
</script>
</body>
</html>`;

const APPLY = [
"<!doctype html><html lang='ko'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>",
"<title>TEUM 등록</title>",
"<style>body{margin:0;background:#f5f2ea;color:#171717;font-family:Arial,'Noto Sans KR',sans-serif}.wrap{max-width:700px;margin:auto;padding:32px 18px}.brand{font-size:26px;font-weight:900;margin-bottom:28px}.box{background:#fffdf8;border:1px solid #e5dfd4;border-radius:20px;padding:24px}.muted{color:#77716a;font-size:13px;line-height:1.65}.field{margin:13px 0}.field label{display:block;font-size:12px;font-weight:800;margin-bottom:6px}.field input,.field textarea,.field select{width:100%;box-sizing:border-box;border:1px solid #ddd5ca;border-radius:10px;padding:12px;background:#fff;font:inherit}.field textarea{min-height:120px;resize:vertical}.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.actions{display:flex;justify-content:flex-end;gap:8px;margin-top:18px}.btn{display:inline-block;border:1px solid #ddd5ca;background:#fff;border-radius:10px;padding:12px 15px;font-weight:800;cursor:pointer;text-decoration:none;color:#171717}.dark{background:#171717;color:#fff;border-color:#171717}@media(max-width:600px){.row{grid-template-columns:1fr}}</style>",
"</head><body><main class='wrap'><div class='brand'>틈 <span style='font-size:10px;color:#888'>TEUM</span></div>",
"<div class='box'><h1 style='letter-spacing:-.05em'>필요한 것, 팔고 싶은 것,<br>할 수 있는 것을 남겨주세요.</h1>",
"<p class='muted'>연락처는 공개되지 않습니다. 운영자가 확인한 뒤 조건이 맞는 사람을 연결합니다.</p>",
"<form method='post' action='/apply'>",
"<div class='field'><label>종류</label><select name='type'><option>구합니다</option><option>팝니다</option><option>레슨</option><option>서비스</option><option>수제품</option></select></div>",
"<div class='field'><label>닉네임</label><input name='nickname' maxlength='40' required></div>",
"<div class='field'><label>무엇이 필요한가요 / 무엇을 제공하나요?</label><input name='title' maxlength='120' required></div>",
"<div class='row'><div class='field'><label>지역</label><input name='city' maxlength='80' placeholder='김해 / 부산 / 온라인'></div><div class='field'><label>가격 / 예산</label><input name='price' maxlength='50' placeholder='50,000원 / 협의'></div></div>",
"<div class='field'><label>가능한 시간</label><input name='time' maxlength='100' placeholder='토요일 오후 / 평일 저녁 / 언제든'></div>",
"<div class='field'><label>상세 내용</label><textarea name='description' maxlength='4000' required></textarea></div>",
"<div class='field'><label>연락받을 방법</label><input name='contact' maxlength='300' placeholder='오픈채팅 링크 / 이메일' required></div>",
"<div class='field'><label>연결 동의</label><select name='consent'><option value='yes'>네, 조건이 맞는 사람과 연결해주세요.</option><option value='no'>아니요.</option></select></div>",
"<div class='actions'><a class='btn' href='/'>돌아가기</a><button class='btn dark' type='submit'>등록하기</button></div>",
"</form></div></main></body></html>"
].join("");

const ADMIN = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TEUM 관리자</title><style>body{margin:0;background:#f5f2ea;color:#171717;font-family:Arial,"Noto Sans KR",sans-serif}.wrap{max-width:1100px;margin:auto;padding:25px 18px}.head{display:flex;justify-content:space-between;align-items:end}.box,.entry{background:#fffdf8;border:1px solid #e5dfd4;border-radius:16px;padding:17px;margin:13px 0}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.entry{background:#fff}.muted{font-size:12px;color:#77716a;line-height:1.6}.row{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.row input{flex:1;min-width:220px;border:1px solid #ddd5ca;border-radius:9px;padding:10px}.btn{border:1px solid #ddd5ca;background:#fff;border-radius:9px;padding:9px 12px;font-weight:800;cursor:pointer}.ok{background:#d9ff51;border-color:#b9df35}.bad{background:#fff1f0;color:#9a2c2c}.hide{display:none}.match{margin-top:11px;padding-top:11px;border-top:1px solid #eee7dc}@media(max-width:700px){.grid{grid-template-columns:1fr}.head{display:block}}</style></head><body><main class="wrap"><div class="head"><div><h1>TEUM 관리자</h1><div class="muted">접수 → 검토 → 공개 → 매칭</div></div><a href="/">사이트</a></div><div id="gate" class="box"><b>관리자 키</b><p class="muted">Cloudflare Secret <code>TEUM_ADMIN_KEY</code>에 설정한 값을 입력하세요.</p><div class="row"><input id="key" type="password" placeholder="관리자 키"><button class="btn" onclick="connect()">접속</button></div></div><div id="app" class="hide"><div class="box"><b id="stats">불러오는 중...</b><button class="btn" style="float:right" onclick="load()">새로고침</button></div><div id="list" class="grid"></div></div><script>var KEY="";function esc(x){return String(x==null?"":x).replace(/[&<>"]/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]})}async function api(u,o){o=o||{};var method=String(o.method||"GET").toUpperCase(),opt=Object.assign({},o);if(method!=="GET"&&method!=="HEAD"){var body=o.body;if(!body){body=JSON.stringify({key:KEY})}else{try{var parsed=JSON.parse(body);parsed.key=KEY;body=JSON.stringify(parsed)}catch(e){}}opt.body=body;opt.headers=Object.assign({"Content-Type":"application/json"},o.headers||{})}var r=await fetch(u,opt),d=await r.json().catch(function(){return {}});if(!r.ok)throw Error(d.error||"실패");return d}async function connect(){KEY=document.getElementById("key").value.trim();sessionStorage.removeItem("teum_admin");try{await load();sessionStorage.setItem("teum_admin",KEY);gate.classList.add("hide");app.classList.remove("hide")}catch(e){alert(e.message)}}async function load(){KEY=KEY||sessionStorage.getItem("teum_admin")||"";var d=await api("/api/admin/submissions",{method:"POST"});stats.textContent="전체 "+d.stats.total+" · 대기 "+d.stats.pending;list.innerHTML=d.entries.map(function(e){var m=(e.matches||[]).map(function(x){return '<div class="muted">→ '+esc(x.title)+' · '+esc(x.nickname)+' · 점수 '+esc(x.score)+'</div>'}).join("");var state=e.status==="APPROVED"?"공개됨":e.status==="HIDDEN"?"숨김":e.status==="REJECTED"?"거절됨":"대기";return '<article class="entry"><b>'+esc(e.type)+'</b><h3>'+esc(e.title)+'</h3><div class="muted">'+esc(e.nickname)+' · '+esc(e.city||"지역 미정")+' · '+esc(e.created_at)+'</div><p>'+esc(e.description)+'</p><div class="muted">상태: <b>'+state+'</b><br>가격/예산: '+esc(e.price||"협의")+' · 시간: '+esc(e.time||"미정")+'<br>연락: <b>'+esc(e.contact)+'</b></div><div class="row"><button type="button" class="btn ok" data-id="'+e.id+'" data-status="APPROVED">공개</button><button type="button" class="btn" data-id="'+e.id+'" data-status="HIDDEN">숨기기</button><button type="button" class="btn bad" data-id="'+e.id+'" data-status="REJECTED">거절</button></div>'+(m?'<div class="match"><b>매칭 후보</b>'+m+'</div>':"")+'</article>'}).join("")||'<div class="box">접수된 항목이 없습니다.</div>';document.querySelectorAll("[data-status]").forEach(function(btn){btn.addEventListener("click",function(){statusDo(Number(btn.getAttribute("data-id")),btn.getAttribute("data-status"))})})}async function statusDo(id,s){var buttons=document.querySelectorAll('[data-id="'+id+'"]');buttons.forEach(function(x){x.disabled=true});try{var d=await api("/api/admin/submissions/"+id+"/status",{method:"POST",body:JSON.stringify({status:s})});alert(d.status==="APPROVED"?"공개 처리되었습니다.":d.status==="HIDDEN"?"숨김 처리되었습니다.":"거절 처리되었습니다.");await load()}catch(e){buttons.forEach(function(x){x.disabled=false});alert(e.message)}}if(sessionStorage.getItem("teum_admin")){KEY=sessionStorage.getItem("teum_admin");load().then(function(){gate.classList.add("hide");app.classList.remove("hide")}).catch(function(){sessionStorage.removeItem("teum_admin")})}</script></main></body></html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/apply" && request.method === "GET") {
      return new Response(APPLY, {headers: {"content-type":"text/html; charset=utf-8","cache-control":"no-store"}});
    }
    if (url.pathname === "/apply" && request.method === "POST") {
      try {
        const form = await request.formData();
        const body = {
          type: String(form.get("type") || ""),
          nickname: String(form.get("nickname") || ""),
          title: String(form.get("title") || ""),
          city: String(form.get("city") || ""),
          price: String(form.get("price") || ""),
          time: String(form.get("time") || ""),
          description: String(form.get("description") || ""),
          contact: String(form.get("contact") || ""),
          consent: String(form.get("consent") || "")
        };
        const apiRequest = new Request(new URL("/api/submissions", request.url), {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify(body)
        });
        const id = env.TEUM_DB.idFromName("global");
        const result = await env.TEUM_DB.get(id).fetch(apiRequest);
        if (!result.ok) {
          const data = await result.json().catch(function(){return {};});
          return new Response(String(data.error || "등록에 실패했습니다."), {status: result.status, headers: {"content-type":"text/plain; charset=utf-8"}});
        }
        return new Response("<!doctype html><html lang='ko'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>TEUM 등록 완료</title><style>body{margin:0;background:#f5f2ea;color:#171717;font-family:Arial,'Noto Sans KR',sans-serif}.box{max-width:700px;margin:80px auto;background:#fffdf8;border:1px solid #e5dfd4;border-radius:20px;padding:32px}a{display:inline-block;background:#171717;color:#fff;text-decoration:none;padding:12px 16px;border-radius:10px;font-weight:800}</style></head><body><div class='box'><h1>등록 완료</h1><p>TEUM 운영자가 확인하고 조건이 맞는 사람을 찾아 연결해드릴게요.</p><a href='/'>TEUM으로 돌아가기</a></div></body></html>", {status: 201, headers: {"content-type":"text/html; charset=utf-8","cache-control":"no-store"}});
      } catch (e) {
        console.error("apply error", e);
        return new Response("<!doctype html><html lang='ko'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>TEUM 오류</title><style>body{font-family:Arial,'Noto Sans KR',sans-serif;background:#f5f2ea;padding:30px}.box{max-width:700px;margin:50px auto;background:#fffdf8;border:1px solid #e5dfd4;border-radius:20px;padding:28px}</style><div class='box'><h1>등록 중 오류가 발생했습니다.</h1><p>잠시 후 다시 시도해주세요.</p><a href='/apply'>등록 페이지로 돌아가기</a></div>", {status: 500, headers: {"content-type":"text/html; charset=utf-8","cache-control":"no-store"}});
      }
    }
    if (url.pathname === "/api/admin-check" && request.method === "GET") {
      return j({version:"1506",adminConfigured:!!String(env.TEUM_ADMIN_KEY||"").trim()});
    }
    if (url.pathname === "/admin") return new Response(ADMIN, {headers: {"content-type":"text/html; charset=utf-8","cache-control":"no-store"}});
    if (url.pathname.startsWith("/api/")) {
      const id = env.TEUM_DB.idFromName("global");
      if (url.pathname === "/api/admin/submissions" || (url.pathname.indexOf("/api/admin/submissions/") === 0 && url.pathname.endsWith("/status"))) {
        if (request.method !== "POST") return j({error:"허용되지 않는 요청입니다."},405);
        const body = await request.json().catch(function(){return {};});
        const expected = String(env.TEUM_ADMIN_KEY || "").trim().normalize("NFKC");
        const actual = String(body.key || "").trim().normalize("NFKC");
        if (!expected) return j({error:"Cloudflare에 TEUM_ADMIN_KEY Secret이 설정되지 않았습니다."},500);
        if (!actual || actual !== expected) return j({error:"관리자 키가 올바르지 않습니다."},401);
        delete body.key;
        const headers = new Headers({"Content-Type":"application/json","x-teum-admin-internal":"1"});
        const forwarded = new Request(new URL(url.pathname + url.search, request.url), {
          method:"POST",
          headers,
          body:JSON.stringify(body)
        });
        return env.TEUM_DB.get(id).fetch(forwarded);
      }
      return env.TEUM_DB.get(id).fetch(request);
    }
    return new Response(PAGE, {headers: {"content-type":"text/html; charset=utf-8","cache-control":"no-store"}});
  }
};

export class TeumDatabase extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.env = env;
    this.sql = ctx.storage.sql;
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,name TEXT NOT NULL,city TEXT DEFAULT '',bio TEXT DEFAULT '',created_at TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id INTEGER NOT NULL,expires INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,type TEXT NOT NULL,title TEXT NOT NULL,description TEXT NOT NULL,price INTEGER,city TEXT DEFAULT '',tags TEXT DEFAULT '',image TEXT DEFAULT '',status TEXT DEFAULT 'OPEN',created_at TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY AUTOINCREMENT,post_id INTEGER NOT NULL,sender_id INTEGER NOT NULL,receiver_id INTEGER NOT NULL,body TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS reviews(id INTEGER PRIMARY KEY AUTOINCREMENT,reviewer_id INTEGER NOT NULL,reviewee_id INTEGER NOT NULL,post_id INTEGER NOT NULL,rating INTEGER NOT NULL,body TEXT DEFAULT '',created_at TEXT DEFAULT CURRENT_TIMESTAMP,UNIQUE(reviewer_id,post_id));
      CREATE TABLE IF NOT EXISTS reports(id INTEGER PRIMARY KEY AUTOINCREMENT,reporter_id INTEGER NOT NULL,post_id INTEGER,reason TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS images(id TEXT PRIMARY KEY,data TEXT NOT NULL,mime TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS submissions(id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT NOT NULL,nickname TEXT NOT NULL,title TEXT NOT NULL,city TEXT DEFAULT '',price TEXT DEFAULT '',time TEXT DEFAULT '',description TEXT NOT NULL,contact TEXT NOT NULL,consent TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'PENDING',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    `);
  }

    try { this.sql.exec("ALTER TABLE posts ADD COLUMN source_submission_id INTEGER"); } catch(e) {}
    this.sql.exec("CREATE INDEX IF NOT EXISTS idx_posts_source_submission ON posts(source_submission_id)");
    this.sql.exec("INSERT OR IGNORE INTO users(username,password_hash,name,city,bio) VALUES(?,?,?,?,?)","__teum_operator__","SYSTEM","TEUM 운영팀","","");
  async fetch(req) {
    const u = new URL(req.url);
    try {
      if(req.method==="GET" && u.pathname==="/api/health") return j({ok:true});
      if(req.method==="GET" && u.pathname==="/api/me"){const x=this.me(req);return j({user:x?safeUser(x):null})}
      if(req.method==="POST" && u.pathname==="/api/register") return this.register(req);
      if(req.method==="POST" && u.pathname==="/api/login") return this.login(req);
      if(req.method==="POST" && u.pathname==="/api/logout") return this.logout(req);
      if(req.method==="GET" && u.pathname==="/api/posts") return this.posts(u);
      if(req.method==="POST" && u.pathname==="/api/posts") return this.createPost(req);
      if(req.method==="GET" && u.pathname.indexOf("/api/posts/")===0) return this.post(Number(u.pathname.split("/").pop()));
      if(req.method==="POST" && u.pathname==="/api/upload") return this.upload(req);
      if(req.method==="GET" && u.pathname.indexOf("/api/image/")===0) return this.image(u.pathname.split("/").pop());
      if(req.method==="POST" && u.pathname==="/api/messages") return this.sendMessage(req);
      if(req.method==="GET" && u.pathname==="/api/messages") return this.messages(req);
      if(req.method==="POST" && u.pathname==="/api/review") return this.review(req);
      if(req.method==="POST" && u.pathname==="/api/report") return this.report(req);
      if(req.method==="POST" && u.pathname==="/api/submissions") return this.submitRequest(req);
      if((req.method==="GET" || req.method==="POST") && u.pathname==="/api/admin/submissions") return this.adminSubmissions(req);
      if(req.method==="POST" && u.pathname.indexOf("/api/admin/submissions/")===0 && u.pathname.endsWith("/status")) return this.adminStatus(req);
      return j({error:"Not Found"},404);
    } catch(e) {
      console.error(e);
      return j({error:"서버 오류가 발생했습니다."},500);
    }
  }

  me(req){const t=cookies(req).teum;return t?this.sql.exec("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires>?",t,Date.now()).toArray()[0]:null}
  async register(req){const b=await req.json();const username=String(b.username||"").trim();const password=String(b.password||"");if(!username||password.length<6)return j({error:"아이디와 6자 이상 비밀번호가 필요합니다."},400);const cleanUser=username.slice(0,30);if(this.sql.exec("SELECT id FROM users WHERE username=?",cleanUser).toArray()[0])return j({error:"이미 사용 중인 아이디입니다."},409);try{const hashed=await makeHash(password);this.sql.exec("INSERT INTO users(username,password_hash,name,city,bio) VALUES(?,?,?,?,?)",cleanUser,hashed,String(b.name||username).trim().slice(0,50),String(b.city||"").slice(0,80),String(b.bio||"").slice(0,500));const user=this.sql.exec("SELECT id FROM users WHERE username=?",cleanUser).toArray()[0];if(!user)return j({error:"회원가입에 실패했습니다."},500);return sessionResponse(this,user.id)}catch(e){console.error("register error",e);return j({error:"회원가입 처리 중 오류가 발생했습니다."},500)}}
  async login(req){const b=await req.json();const u=this.sql.exec("SELECT * FROM users WHERE username=?",String(b.username||"").trim()).toArray()[0];if(!u||!(await verifyHash(String(b.password||""),u.password_hash)))return j({error:"아이디 또는 비밀번호가 올바르지 않습니다."},401);return sessionResponse(this,u.id)}
  logout(req){const t=cookies(req).teum;if(t)this.sql.exec("DELETE FROM sessions WHERE token=?",t);return j({ok:true},200,{"Set-Cookie":"teum=; HttpOnly; Path=/; SameSite=Lax; Secure; Max-Age=0"})}
  posts(u){const t=u.searchParams.get("type")||"",q=(u.searchParams.get("q")||"").toLowerCase();let a=this.sql.exec("SELECT p.*,u.name FROM posts p JOIN users u ON u.id=p.user_id WHERE p.status='OPEN' AND (?='' OR p.type=?) ORDER BY p.id DESC LIMIT 100",t,t).toArray();if(q)a=a.filter(function(x){return (x.title+" "+x.description+" "+x.tags+" "+x.city).toLowerCase().includes(q)});return j({posts:a})}
  async createPost(req){const u=this.me(req);if(!u)return j({error:"로그인이 필요합니다."},401);const b=await req.json();if(!TYPES.includes(b.type)||!b.title||!b.description)return j({error:"종류·제목·설명을 입력하세요."},400);const n=b.price===""||b.price==null?null:Number(b.price);if(n!==null && (!Number.isFinite(n)||n<0))return j({error:"가격을 확인하세요."},400);this.sql.exec("INSERT INTO posts(user_id,type,title,description,price,city,tags,image) VALUES(?,?,?,?,?,?,?,?)",u.id,b.type,String(b.title).trim().slice(0,120),String(b.description).trim().slice(0,3000),n===null?null:Math.floor(n),String(b.city||u.city||"").slice(0,80),String(b.tags||"").slice(0,300),String(b.image||"").slice(0,200000));const post=this.sql.exec("SELECT p.*,u.name FROM posts p JOIN users u ON u.id=p.user_id WHERE p.user_id=? ORDER BY p.id DESC LIMIT 1",u.id).toArray()[0];return j({post:post},201)}
  post(id){const p=this.sql.exec("SELECT p.*,u.name FROM posts p JOIN users u ON u.id=p.user_id WHERE p.id=?",id).toArray()[0];if(!p)return j({error:"게시글이 없습니다."},404);return j({post:p,reviews:this.sql.exec("SELECT r.*,u.name FROM reviews r JOIN users u ON u.id=r.reviewer_id WHERE r.post_id=? ORDER BY r.id DESC",id).toArray()})}
  async upload(req){const u=this.me(req);if(!u)return j({error:"로그인이 필요합니다."},401);const b=await req.json();const raw=String(b.data||"");const comma=raw.indexOf(",");if(comma<0)return j({error:"이미지 데이터가 올바르지 않습니다."},400);const header=raw.slice(0,comma);const data=raw.slice(comma+1);const mime=header.indexOf("image/jpeg")>=0?"image/jpeg":header.indexOf("image/png")>=0?"image/png":header.indexOf("image/webp")>=0?"image/webp":"";if(!mime)return j({error:"JPG/PNG/WEBP만 가능합니다."},400);if(data.length>1100000)return j({error:"사진은 800KB 이하로 올려주세요."},400);const id=crypto.randomUUID();this.sql.exec("INSERT INTO images(id,data,mime) VALUES(?,?,?)",id,data,mime);return j({url:"/api/image/"+id},201)}
  image(id){const x=this.sql.exec("SELECT data,mime FROM images WHERE id=?",id).toArray()[0];if(!x)return new Response("Not Found",{status:404});const bytes=Uint8Array.from(atob(x.data),function(c){return c.charCodeAt(0)});return new Response(bytes,{headers:{"content-type":x.mime,"cache-control":"public,max-age=31536000"}})}
  async sendMessage(req){const u=this.me(req);if(!u)return j({error:"로그인이 필요합니다."},401);const b=await req.json(),p=this.sql.exec("SELECT * FROM posts WHERE id=?",Number(b.post_id)).toArray()[0];if(!p||p.user_id===u.id)return j({error:"메시지를 보낼 수 없습니다."},400);const body=String(b.body||"").trim();if(!body)return j({error:"메시지를 입력하세요."},400);this.sql.exec("INSERT INTO messages(post_id,sender_id,receiver_id,body) VALUES(?,?,?,?)",p.id,u.id,p.user_id,body.slice(0,2000));return j({ok:true},201)}
  messages(req){const u=this.me(req);if(!u)return j({error:"로그인이 필요합니다."},401);return j({messages:this.sql.exec("SELECT m.*,s.name sender_name,p.title FROM messages m JOIN users s ON s.id=m.sender_id JOIN posts p ON p.id=m.post_id WHERE m.sender_id=? OR m.receiver_id=? ORDER BY m.id ASC LIMIT 200",u.id,u.id).toArray()})}
  async review(req){const u=this.me(req);if(!u)return j({error:"로그인이 필요합니다."},401);const b=await req.json(),p=this.sql.exec("SELECT * FROM posts WHERE id=?",Number(b.post_id)).toArray()[0];if(!p||p.user_id===u.id)return j({error:"후기를 남길 수 없습니다."},400);const rating=Math.max(1,Math.min(5,Number(b.rating)||0));try{this.sql.exec("INSERT INTO reviews(reviewer_id,reviewee_id,post_id,rating,body) VALUES(?,?,?,?,?)",u.id,p.user_id,p.id,rating,String(b.body||"").slice(0,1000));return j({ok:true},201)}catch(e){return j({error:"이미 후기를 남겼습니다."},409)}}
  async report(req){const u=this.me(req);if(!u)return j({error:"로그인이 필요합니다."},401);const b=await req.json();if(!b.reason)return j({error:"신고 사유가 필요합니다."},400);this.sql.exec("INSERT INTO reports(reporter_id,post_id,reason) VALUES(?,?,?)",u.id,b.post_id?Number(b.post_id):null,String(b.reason).slice(0,1000));return j({ok:true},201)}
  authorizedKey(req){return req.headers.get("x-teum-admin-internal")==="1"}
  async submitRequest(req){const ct=String(req.headers.get("content-type")||"").toLowerCase();let b={};if(ct.includes("application/json")){b=await req.json()}else{const f=await req.formData();b=Object.fromEntries(f.entries())}const v={type:String(b.type||""),nickname:String(b.nickname||"").trim(),title:String(b.title||"").trim(),city:String(b.city||"").trim(),price:String(b.price||"").trim(),time:String(b.time||"").trim(),description:String(b.description||"").trim(),contact:String(b.contact||"").trim(),consent:String(b.consent||"")};if(!TYPES.includes(v.type)||!v.nickname||!v.title||!v.description||!v.contact||v.consent!=="yes")return j({error:"필수 항목을 모두 입력해주세요."},400);this.sql.exec("INSERT INTO submissions(type,nickname,title,city,price,time,description,contact,consent,status) VALUES(?,?,?,?,?,?,?,?,?,'PENDING')",v.type,v.nickname.slice(0,40),v.title.slice(0,120),v.city.slice(0,80),v.price.slice(0,50),v.time.slice(0,100),v.description.slice(0,4000),v.contact.slice(0,300),v.consent);if(!ct.includes("application/json"))return new Response("<!doctype html><html lang='ko'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>TEUM 등록 완료</title><style>body{margin:0;background:#f5f2ea;color:#171717;font-family:Arial,'Noto Sans KR',sans-serif}.box{max-width:700px;margin:80px auto;background:#fffdf8;border:1px solid #e5dfd4;border-radius:20px;padding:32px}a{display:inline-block;background:#171717;color:#fff;text-decoration:none;padding:12px 16px;border-radius:10px;font-weight:800}</style></head><body><div class='box'><h1>등록 완료</h1><p>TEUM 운영자가 확인하고 조건이 맞는 사람을 찾아 연결해드릴게요.</p><a href='/'>TEUM으로 돌아가기</a></div></body></html>",{status:201,headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}});return j({ok:true},201)}
  async adminSubmissions(req){if(!this.authorizedKey(req))return j({error:"관리자 인증이 필요합니다."},401);const rows=this.sql.exec("SELECT * FROM submissions ORDER BY id DESC LIMIT 300").toArray();return j({entries:rows.map(x=>Object.assign({},x,{matches:this.submissionMatches(x.id)})),stats:{total:rows.length,pending:rows.filter(x=>x.status==="PENDING").length}})}
  submissionMatches(id){const w=this.sql.exec("SELECT * FROM submissions WHERE id=?",id).toArray()[0];if(!w)return[];const wanted=w.type==="구합니다";const other=wanted?["팝니다","레슨","서비스","수제품"]:["구합니다"];const q="SELECT id,type,nickname,title,city,price,description FROM submissions WHERE id<>? AND status IN ('PENDING','APPROVED') AND type IN ("+other.map(function(){return "?"}).join(",")+") ORDER BY id DESC LIMIT 200";const a=this.sql.exec(q,id,...other).toArray();const words=new Set((w.title+" "+w.description).toLowerCase().split(/[^0-9a-z가-힣]+/i).filter(function(x){return x.length>1}));return a.map(function(p){var score=0,txt=(p.title+" "+p.description).toLowerCase();words.forEach(function(t){if(txt.includes(t))score+=Math.min(4,t.length/3)});if(w.city&&p.city&&(w.city.includes(p.city)||p.city.includes(w.city)))score+=3;var wn=Number(String(w.price).replace(/[^0-9]/g,"")),pn=Number(String(p.price).replace(/[^0-9]/g,""));if(wn&&pn&&((wanted&&pn<=wn)||(!wanted&&wn<=pn)))score+=3;return Object.assign({},p,{score:Number(score.toFixed(1))})}).filter(function(x){return x.score>=3}).sort(function(a,b){return b.score-a.score}).slice(0,6)}
  async adminStatus(req){if(!this.authorizedKey(req))return j({error:"관리자 인증이 필요합니다."},401);const b=await req.json().catch(function(){return {}});const id=Number(new URL(req.url).pathname.split("/")[4]);if(!Number.isInteger(id)||id<1)return j({error:"접수 항목을 찾을 수 없습니다."},400);if(!["PENDING","APPROVED","HIDDEN","REJECTED"].includes(b.status))return j({error:"상태값이 올바르지 않습니다."},400);const current=this.sql.exec("SELECT * FROM submissions WHERE id=?",id).toArray()[0];if(!current)return j({error:"접수 항목을 찾을 수 없습니다."},404);this.sql.exec("UPDATE submissions SET status=? WHERE id=?",b.status,id);if(b.status==="APPROVED"){const operator=this.sql.exec("SELECT id FROM users WHERE username=?","__teum_operator__").toArray()[0];if(!operator)return j({error:"운영 계정을 만들지 못했습니다."},500);const existing=this.sql.exec("SELECT id FROM posts WHERE source_submission_id=?",id).toArray()[0];const rawPrice=String(current.price||"").replace(/[^0-9]/g,"");const price=rawPrice?Math.floor(Number(rawPrice)):null;const desc=String(current.description||"")+(current.time?"\n\n가능한 시간: "+String(current.time):"");if(existing){this.sql.exec("UPDATE posts SET type=?,title=?,description=?,price=?,city=?,tags=?,status='OPEN' WHERE source_submission_id=?",current.type,current.title,desc,price,current.city||"",current.time?("운영접수,"+current.time):"운영접수",id)}else{this.sql.exec("INSERT INTO posts(user_id,type,title,description,price,city,tags,image,status,source_submission_id) VALUES(?,?,?,?,?,?,?,?,?,?)",operator.id,current.type,current.title,desc,price,current.city||"",current.time?("운영접수,"+current.time):"운영접수","","OPEN",id)}}else if(b.status==="HIDDEN"||b.status==="REJECTED"){this.sql.exec("UPDATE posts SET status=? WHERE source_submission_id=?",b.status,id)}else if(b.status==="PENDING"){this.sql.exec("UPDATE posts SET status='HIDDEN' WHERE source_submission_id=?",id)}const updated=this.sql.exec("SELECT status FROM submissions WHERE id=?",id).toArray()[0];return j({ok:true,id:id,status:updated.status})}
}

async function makeHash(password){const salt=crypto.randomUUID();const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:new TextEncoder().encode(salt),iterations:100000,hash:"SHA-256"},key,256);return salt+":"+buf(bits)}
async function verifyHash(password,stored){const parts=String(stored).split(":");if(parts.length!==2)return false;const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:new TextEncoder().encode(parts[0]),iterations:100000,hash:"SHA-256"},key,256);return buf(bits)===parts[1]}
function buf(x){return Array.from(new Uint8Array(x)).map(function(v){return v.toString(16).padStart(2,"0")}).join("")}
function cookies(req){return Object.fromEntries((req.headers.get("Cookie")||"").split(";").filter(Boolean).map(function(x){var i=x.indexOf("=");return [x.slice(0,i).trim(),decodeURIComponent(x.slice(i+1))]}))}
function safeUser(x){return {id:x.id,username:x.username,name:x.name,city:x.city,bio:x.bio}}
function j(d,s,h){return new Response(JSON.stringify(d),{status:s||200,headers:Object.assign({"content-type":"application/json; charset=utf-8","cache-control":"no-store"},h||{})})}
function sessionResponse(db,id){var token=crypto.randomUUID()+crypto.randomUUID();db.sql.exec("INSERT INTO sessions(token,user_id,expires) VALUES(?,?,?)",token,id,Date.now()+2592000000);return j({ok:true},200,{"Set-Cookie":"teum="+token+"; HttpOnly; Path=/; SameSite=Lax; Secure; Max-Age=2592000"})}
