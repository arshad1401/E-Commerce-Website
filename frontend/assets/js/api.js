const API_BASE = ''; // same origin by default
document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

async function api(method, path, body){
  const res = await fetch(API_BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    let msg = 'Request failed';
    try { const j = await res.json(); msg = j.error || msg; } catch(e){}
    return { ok: false, error: msg, status: res.status };
  }
  try { return await res.json(); } catch { return { ok: true }; }
}

async function apiAuthed(method, path, body){
  const token = localStorage.getItem('token');
  const res = await fetch(API_BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    let msg = 'Request failed';
    try { const j = await res.json(); msg = j.error || msg; } catch(e){}
    return { ok: false, error: msg, status: res.status };
  }
  try { return await res.json(); } catch { return { ok: true }; }
}
