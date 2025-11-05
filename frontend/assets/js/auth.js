function isLoggedIn(){ return !!localStorage.getItem('token'); }
function isAdmin(){ return localStorage.getItem('role') === 'admin'; }
function requireAdmin(){ if(!isLoggedIn() || !isAdmin()){ alert('Admin only. Please login as admin.'); location.href='/login.html'; } }
function logout(){ localStorage.removeItem('token'); localStorage.removeItem('role'); }

async function login(email, password){
  const res = await api('POST','/api/auth/login',{email,password});
  if(res.token){ localStorage.setItem('token',res.token); localStorage.setItem('role',res.role); return {ok:true}; }
  return res;
}

async function register(name, email, password){
  return await api('POST','/api/auth/register',{name,email,password});
}
