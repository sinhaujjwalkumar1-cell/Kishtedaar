/* ===============================
   KISHTEDAAR – SPA (LocalStorage)
   =============================== */
const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => [...root.querySelectorAll(q)];
const toast = (msg) => {
  const t = document.createElement('div');
  t.className = 'card';
  t.textContent = msg;
  $('#toast').appendChild(t);
  setTimeout(()=>t.remove(), 2500);
};

// --------- Seed (first run) ----------
const seed = () => {
  if (localStorage.getItem('kishtedaar_seed')) return;
  const demo = {
    slogan: 'Smart Loan & EMI Management',
    users: [
      {email:'admin@kishtedaar.com', pass:'Admin@123', role:'admin', name:'Admin'},
      {email:'seller@kishtedaar.com', pass:'Seller@123', role:'seller', name:'Prime Seller'},
      {email:'user@kishtedaar.com', pass:'User@123', role:'customer', name:'John Customer'}
    ],
    products: [
      {id:id(), name:'4K Smart TV 55"', price:45000, down:5000, months:12,
       img:'https://images.unsplash.com/photo-1583225272834-cc965de0b58b?q=80&w=1200&auto=format&fit=crop'},
      {id:id(), name:'Laptop i5 16GB', price:62000, down:7000, months:12,
       img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop'},
      {id:id(), name:'Double Door Refrigerator', price:38000, down:4000, months:10,
       img:'https://images.unsplash.com/photo-1596944924616-7b38e9bf5a3a?q=80&w=1200&auto=format&fit=crop'}
    ],
    offers: [{id:id(), title:'New Year Sale', desc:'Zero processing fee for 30 days!'}],
    loans: [
      // sample loan for customer
      makeLoan({customer:'user@kishtedaar.com', amount:20000, rate:12, months:12, purpose:'Washing Machine', shop:'ABC Electronics'})
    ],
    cart: [],
  };
  localStorage.setItem('k_data', JSON.stringify(demo));
  localStorage.setItem('kishtedaar_seed', '1');
};
const id = () => Math.random().toString(36).slice(2,9);
const read = () => JSON.parse(localStorage.getItem('k_data') || '{}');
const write = (obj) => localStorage.setItem('k_data', JSON.stringify(obj));

// Loan helper
function makeLoan({customer, amount, rate, months, purpose, shop}){
  const {emi, totalInterest, schedule} = calcEMI(amount, rate, months);
  return {
    id:id(), customer, amount, rate, months, purpose, shop,
    start: new Date().toISOString().slice(0,10),
    end: addMonths(new Date(), months).toISOString().slice(0,10),
    emi: Math.round(emi), interest: Math.round(totalInterest), schedule
  };
}
function addMonths(d,m){ const x=new Date(d); x.setMonth(x.getMonth()+Number(m)); return x; }

// EMI math
function calcEMI(P, Rpa, N){
  const r = (Rpa/12)/100;
  const emi = (P*r*Math.pow(1+r,N))/(Math.pow(1+r,N)-1);
  let bal = P, totalInterest = 0;
  const schedule = [];
  for(let i=1;i<=N;i++){
    const interest = bal*r;
    const principal = emi - interest;
    bal -= principal;
    totalInterest += interest;
    schedule.push({i, due: addMonths(new Date(), i).toISOString().slice(0,10), emi: Math.round(emi), paid:false});
  }
  return {emi, totalInterest, schedule};
}

// --------- State ----------
seed();
let state = {
  route: 'home',
  tab: {},
  me: JSON.parse(localStorage.getItem('k_user') || 'null'),
  data: read()
};

// --------- Router ----------
function go(route, extra){
  state.route = route;
  $$('.page').forEach(p=>p.classList.remove('active'));
  $(`#${route}`).classList.add('active');
  $$('.links a').forEach(a=>a.classList.toggle('active', a.dataset.route===route));
  if (extra?.tab) switchTab(extra.tab);
  render();
}
$$('.links a,[data-route]').forEach(el=>{
  el.addEventListener('click', e=>{
    const r = el.dataset.route;
    const tab = el.dataset.tab;
    if (r) go(r, {tab});
  });
});

// Tabs
function switchTab(name){
  const panes = $$('#'+state.route+' .tabpane');
  const tabs = $$('#'+state.route+' .tab');
  panes.forEach(x=>x.classList.remove('active'));
  tabs.forEach(x=>x.classList.remove('active'));
  const pane = $('#pane-'+name);
  const tab = $(`.tab[data-tab="${name}"]`, $('#'+state.route));
  if(pane) pane.classList.add('active');
  if(tab) tab.classList.add('active');
}
$$('.tab').forEach(t=> t.addEventListener('click', ()=>switchTab(t.dataset.tab)));

// --------- Auth ----------
const auth = $('#auth');
$('#loginBtn').onclick = ()=> auth.showModal();
$('[data-close]')?.addEventListener('click', ()=> auth.close());
$('#loginForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = $('#email').value.trim();
  const pass = $('#password').value.trim();
  const role = $('#role').value;
  const u = state.data.users.find(x=>x.email===email && x.pass===pass && x.role===role);
  if(!u) return toast('Invalid credentials');
  state.me = {email:u.email, role:u.role, name:u.name};
  localStorage.setItem('k_user', JSON.stringify(state.me));
  auth.close();
  $('#loginBtn').classList.add('hide');
  $('#logoutBtn').classList.remove('hide');
  toast(`Welcome ${u.name}!`);
  if(role==='admin') go('admin');
  else if(role==='seller') go('seller');
  else go('home');
});
$('#logoutBtn').onclick = ()=>{
  state.me = null; localStorage.removeItem('k_user');
  $('#logoutBtn').classList.add('hide'); $('#loginBtn').classList.remove('hide');
  go('home'); toast('Logged out');
};

// --------- Renderers ----------
function render(){
  state.data = read();

  // slogan
  $('#sloganText').textContent = state.data.slogan || 'Smart Loan & EMI Management';

  // products grid
  const wrap = $('#productGrid'); if(wrap){
    const term = ($('#searchProducts')?.value||'').toLowerCase();
    wrap.innerHTML = '';
    state.data.products
      .filter(p => !term || p.name.toLowerCase().includes(term))
      .forEach(p=>{
        const card = document.createElement('div');
        card.className = 'card product';
        card.innerHTML = `
          <img alt="${p.name}" src="${p.img||'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop'}"/>
          <div class="meta">
            <div>
              <div class="name">${p.name}</div>
              <div class="muted small">Down ₹${fmt(p.down||0)} • ${p.months}m EMI</div>
            </div>
            <div class="price">₹${fmt(p.price)}</div>
          </div>
          <div class="grid2">
            <button class="btn outline" data-add="${p.id}">Add to Cart</button>
            <button class="btn" data-apply="${p.id}">Apply Loan</button>
          </div>`;
        wrap.appendChild(card);
      });
    // wire actions
    $$('[data-add]', wrap).forEach(b=> b.onclick = ()=>addToCart(b.dataset.add));
    $$('[data-apply]', wrap).forEach(b=> b.onclick = ()=>applyLoanForProduct(b.dataset.apply));
    $('#cartCount').textContent = (state.data.cart||[]).length;
  }

  // admin products list
  const ap = $('#adminProductList');
  if(ap){
    ap.innerHTML = '';
    state.data.products.forEach(p=>{
      const c = document.createElement('div');
      c.className = 'card product';
      c.innerHTML = `
        <img src="${p.img||''}" alt="${p.name}"/>
        <div class="meta">
          <div><div class="name">${p.name}</div><div class="muted small">₹${fmt(p.price)}</div></div>
          <div class="badge">${p.months}m</div>
        </div>
        <div class="grid2">
          <button class="btn outline" data-del="${p.id}">Delete</button>
          <button class="btn" data-dupe="${p.id}">Duplicate</button>
        </div>`;
      ap.appendChild(c);
    });
    $$('[data-del]', ap).forEach(b=> b.onclick = ()=>{
      state.data.products = state.data.products.filter(x=>x.id!==b.dataset.del);
      write(state.data); render(); toast('Product removed');
    });
    $$('[data-dupe]', ap).forEach(b=> b.onclick = ()=>{
      const p = state.data.products.find(x=>x.id===b.dataset.dupe);
      state.data.products.unshift({...p, id:id(), name:p.name+' (copy)'});
      write(state.data); render(); toast('Product duplicated');
    });
  }

  // offers
  const list = $('#offerList');
  if(list){
    list.innerHTML = '';
    state.data.offers.forEach(o=>{
      const li = document.createElement('li');
      li.className='card';
      li.innerHTML = `<div class="meta"><div><b>${o.title}</b><div class="muted small">${o.desc}</div></div>
        <button class="btn outline" data-orem="${o.id}">Remove</button></div>`;
      list.appendChild(li);
    });
    $$('[data-orem]', list).forEach(b=> b.onclick = ()=>{
      state.data.offers = state.data.offers.filter(x=>x.id!==b.dataset.orem);
      write(state.data); render(); toast('Offer removed');
    })
  }

  // my loans
  const ll = $('#loanList');
  if(ll){
    const mine = state.data.loans.filter(l => !state.me || state.me.role==='admin' ? true : l.customer===state.me.email);
    ll.innerHTML = '';
    if(mine.length===0){ ll.innerHTML = `<div class="card">No loans yet.</div>`; }
    mine.forEach(l=>{
      const card = document.createElement('div');
      card.className='card loan';
      const sched = l.schedule.map(s=>`<div class="tick ${s.paid?'paid':''}" data-pay="${l.id}:${s.i}">${s.i}</div>`).join('');
      card.innerHTML = `
        <div class="head"><b>${l.purpose}</b><span class="badge">${l.months} months</span></div>
        <div class="muted small">Account: ${l.id.toUpperCase()} • Shop: ${l.shop} • Start ${l.start} • End ${l.end}</div>
        <div class="grid3">
          <div class="stat">Amount ₹${fmt(l.amount)}</div>
          <div class="stat">EMI ₹${fmt(l.emi)}</div>
          <div class="stat">Interest ₹${fmt(l.interest)}</div>
        </div>
        <div class="schedule">${sched}</div>`;
      ll.appendChild(card);
    });
    // mark paid
    $$('[data-pay]', ll).forEach(t=> t.onclick = ()=>{
      const [loanId, i] = t.dataset.pay.split(':');
      const loan = state.data.loans.find(x=>x.id===loanId);
      const slot = loan.schedule.find(s=>s.i==i);
      slot.paid = !slot.paid;
      write(state.data); render();
    });
  }

  // header buttons visibility
  if(state.me){ $('#loginBtn').classList.add('hide'); $('#logoutBtn').classList.remove('hide'); }
  else { $('#logoutBtn').classList.add('hide'); $('#loginBtn').classList.remove('hide'); }
}

// currency fmt
const fmt = (n)=> Number(n).toLocaleString('en-IN');

// --------- Search / Cart ----------
$('#searchProducts')?.addEventListener('input', render);

function addToCart(pid){
  state.data.cart = state.data.cart || [];
  const p = state.data.products.find(x=>x.id===pid);
  state.data.cart.push({id:id(), pid, name:p.name, price:p.price});
  write(state.data); render(); toast('Added to cart');
}

$('#viewCartBtn')?.addEventListener('click', ()=>{
  const d = $('#cartDrawer'); renderCart(); d.showModal();
});
$('[data-close]')?.addEventListener('click', ()=> $('#cartDrawer').close());

function renderCart(){
  const list = $('#cartItems'); const items = state.data.cart||[];
  list.innerHTML = '';
  let total = 0;
  items.forEach(it=>{
    const p = state.data.products.find(x=>x.id===it.pid);
    total += p.price;
    const row = document.createElement('div');
    row.className='card';
    row.innerHTML = `<div class="meta"><div><b>${p.name}</b><div class="muted small">₹${fmt(p.price)}</div></div>
      <button class="btn outline" data-rm="${it.id}">Remove</button></div>`;
    list.appendChild(row);
  });
  $('#cartTotal').textContent = fmt(total);
  $$('[data-rm]', list).forEach(b=> b.onclick = ()=>{
    state.data.cart = (state.data.cart||[]).filter(x=>x.id!==b.dataset.rm);
    write(state.data); renderCart(); render();
  });
}

$('#checkoutBtn')?.addEventListener('click', ()=>{
  $('#cartDrawer').close();
  toast('Checkout complete (demo)');
});

// --------- Apply loan from product ----------
function applyLoanForProduct(pid){
  if(!state.me || state.me.role!=='customer') { toast('Login as Customer first'); return; }
  const p = state.data.products.find(x=>x.id===pid);
  const loan = makeLoan({
    customer: state.me.email,
    amount: p.price - (p.down||0),
    rate: 12, months: p.months||12,
    purpose: p.name, shop: 'Kishtedaar Seller'
  });
  state.data.loans.unshift(loan);
  write(state.data); go('loans'); toast('Loan created from product');
}

// --------- Admin actions ----------
$('#sloganForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  state.data.slogan = $('#sloganInput').value || 'Smart Loan & EMI Management';
  write(state.data); render(); toast('Slogan updated');
});
$('#addProductForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const p = {
    id:id(),
    name:$('#pName').value.trim(),
    price:Number($('#pPrice').value||0),
    down:Number($('#pDown').value||0),
    months:Number($('#pMonths').value||12),
    img:$('#pImg').value.trim()
  };
  if(!p.name || !p.price) return toast('Name & Price required');
  state.data.products.unshift(p); write(state.data); render(); e.target.reset(); toast('Product added');
});
$('#addOfferForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  state.data.offers.unshift({id:id(), title:$('#oTitle').value, desc:$('#oDesc').value});
  write(state.data); render(); e.target.reset(); toast('Offer added');
});

// --------- Seller create loan ----------
$('#sellerLoanForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const loan = makeLoan({
    customer: $('#slCustomer').value.trim(),
    amount: Number($('#slAmount').value||0),
    rate: Number($('#slRate').value||0),
    months: Number($('#slMonths').value||0),
    purpose: $('#slPurpose').value.trim(),
    shop: $('#slShop').value.trim()
  });
  state.data.loans.unshift(loan);
  write(state.data); toast('Loan created for customer');
});

// --------- Calculators ----------
$('#calcBtn')?.addEventListener('click', ()=>{
  const {emi,totalInterest,schedule} = calcEMI(Number($('#cAmt').value||0), Number($('#cRate').value||0), Number($('#cMon').value||0));
  $('#emiOut').innerHTML = `
    <div class="stat"><b>EMI</b><div>₹${fmt(Math.round(emi))}</div></div>
    <div class="stat"><b>Total interest</b><div>₹${fmt(Math.round(totalInterest))}</div></div>
    <div class="stat"><b>Total payable</b><div>₹${fmt(Math.round(totalInterest + Number($('#cAmt').value||0)))}</div></div>`;
  // amort table
  const rows = schedule.map(s=> `<tr><td>${s.i}</td><td>${s.due}</td><td>₹${fmt(s.emi)}</td></tr>`).join('');
  $('#amort').innerHTML = `<table><thead><tr><th>#</th><th>Due</th><th>EMI</th></tr></thead><tbody>${rows}</tbody></table>`;
});

$('#billCalc')?.addEventListener('click', ()=>{
  const amt = Number($('#billAmt').value||0);
  const rate = Number($('#billRate').value||0);
  const mon = Number($('#billTen').value||0);
  const {emi,totalInterest} = calcEMI(amt, rate, mon);
  $('#billOut').innerHTML = `
    <div class="stat"><b>Monthly EMI</b><div>₹${fmt(Math.round(emi))}</div></div>
    <div class="stat"><b>Total Interest</b><div>₹${fmt(Math.round(totalInterest))}</div></div>
    <div class="stat"><b>Total Payable</b><div>₹${fmt(Math.round(totalInterest+amt))}</div></div>`;
});

// --------- Start ----------
window.addEventListener('load', ()=>{
  // restore session
  if(state.me){ $('#loginBtn').classList.add('hide'); $('#logoutBtn').classList.remove('hide'); }
  // route via hash (#products etc)
  const hash = location.hash.replace('#','');
  if(hash) go(hash); else go('home');
  render();
});
