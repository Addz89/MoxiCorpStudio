const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const menuBtn=$('#menuBtn'),navLinks=$('#navLinks');if(menuBtn&&navLinks){menuBtn.addEventListener('click',()=>navLinks.classList.toggle('active'));$$('.nav-links a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('active')))}
const light=document.createElement('div');light.className='cursor-light';document.body.appendChild(light);window.addEventListener('pointermove',e=>{light.style.left=e.clientX+'px';light.style.top=e.clientY+'px'});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});$$('.reveal').forEach(el=>io.observe(el));
$$('.tilt').forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;card.style.transform=`perspective(900px) rotateX(${(y/r.height-.5)*-8}deg) rotateY(${(x/r.width-.5)*8}deg) translateY(-8px)`});card.addEventListener('mouseleave',()=>card.style.transform='')});
$$('.faq-q').forEach(q=>q.addEventListener('click',()=>q.parentElement.classList.toggle('active')));
let selectedPackage={name:'',price:0};
function openCheckout(name,price){selectedPackage={name,price};$('#checkoutPackageName').textContent=name;$('#checkoutPrice').textContent=price;$('#purchaseModal').classList.add('active')}
function closeCheckout(){$('#purchaseModal').classList.remove('active')}
function redirectToStripe(){
  const links={
    'Starter Pack':'https://buy.stripe.com/14AaEXd9U09edD31ApfIs03',
    'Growth Pack':'https://buy.stripe.com/5kQ28r6Lw2hm56x3IxfIs01',
    'Elite Pack':'https://buy.stripe.com/6oUcN58TE9JO1UlfrffIs02'
  };
  window.location.href=links[selectedPackage.name]||'https://buy.stripe.com/';
}
window.openCheckout=openCheckout;window.closeCheckout=closeCheckout;window.redirectToStripe=redirectToStripe;
const counters=$$('[data-count]');const counterIO=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting||e.target.dataset.done)return;e.target.dataset.done='1';const target=+e.target.dataset.count;let n=0;const step=Math.max(1,Math.ceil(target/70));const t=setInterval(()=>{n+=step;if(n>=target){n=target;clearInterval(t)}e.target.textContent=n+(e.target.dataset.suffix||'')},22)}),{threshold:.5});counters.forEach(c=>counterIO.observe(c));
