const authModal = document.getElementById("authModal");
const openAuthBtn = document.getElementById("openAuthBtn");
const closeAuth = document.getElementById("closeAuth");

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");

const authMessage = document.getElementById("authMessage");

/* ================= OPEN MODAL ================= */

openAuthBtn.onclick = ()=>{
  authModal.style.display="flex";
  loginForm.style.display="block";   // default
  registerForm.style.display="none";
  authMessage.innerHTML="";
};

/* ================= CLOSE MODAL ================= */

closeAuth.onclick = ()=>{
  authModal.style.display="none";
};

/* Close if clicking outside card */
window.onclick = (e)=>{
  if(e.target === authModal){
    authModal.style.display="none";
  }
};

/* ================= SWITCH FORMS ================= */

showRegister.onclick = ()=>{
  loginForm.style.display="none";
  registerForm.style.display="block";
  authMessage.innerHTML="";
};

showLogin.onclick = ()=>{
  registerForm.style.display="none";
  loginForm.style.display="block";
  authMessage.innerHTML="";
};

/* ================= REGISTER ================= */

registerForm.addEventListener("submit", async (e)=>{
e.preventDefault();

const name = regName.value;
const email = regEmail.value;
const password = regPassword.value;

try{
const res = await fetch("http://localhost:5000/api/auth/register",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({name,email,password})
});

const data = await res.json();

if(res.ok){
localStorage.setItem("token",data.token);
localStorage.setItem("user",JSON.stringify(data.user));
updateHeaderUI();
authMessage.style.color="lime";
authMessage.innerHTML=" Registered!";
setTimeout(()=>authModal.style.display="none",800);
}else{
authMessage.style.color="red";
authMessage.innerHTML=data.msg || "Registration failed";
}

}catch{
authMessage.style.color="red";
authMessage.innerHTML="Server error";
}
});

/* ================= LOGIN ================= */

loginForm.addEventListener("submit", async (e)=>{
e.preventDefault();

const email = loginEmail.value;
const password = loginPassword.value;

try{
const res = await fetch("http://localhost:5000/api/auth/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({email,password})
});

const data = await res.json();

if(res.ok){
localStorage.setItem("token",data.token);
localStorage.setItem("user",JSON.stringify(data.user));
updateHeaderUI();
authMessage.style.color="lime";
authMessage.innerHTML=" Logged In!";
refreshPlayButtons();
applyPlayLockState();
setTimeout(()=>authModal.style.display="none",800);
}else{
authMessage.style.color="red";
authMessage.innerHTML=data.msg || "Login failed";
}

}catch{
authMessage.style.color="red";
authMessage.innerHTML="Server error";
}
});

const userArea = document.getElementById("userArea");

function updateHeaderUI(){

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if(token && user){

  userArea.innerHTML = `
    <div class="user-menu">
      <span class="user-name">👤 ${user.name}</span>
      <button id="logoutBtn" class="logout-btn">Logout</button>
    </div>
  `;

  document.getElementById("logoutBtn").onclick = logout;

}else{

  userArea.innerHTML = `
    <button id="openAuthBtn" class="login-nav-btn">Login</button>
  `;

  document.getElementById("openAuthBtn").onclick = ()=>{
    authModal.style.display="flex";
  };
}
}

/* ================= LOGOUT ================= */
function logout(){
localStorage.removeItem("token");
localStorage.removeItem("user");
updateHeaderUI();
applyPlayLockState();
refreshPlayButtons();
}

updateHeaderUI();