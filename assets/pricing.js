// Pricing: monthly / yearly billing switch and expanding questions
(() => {
  // Billing switch (defaults to yearly, 20% off)
  const opts = Array.from(document.querySelectorAll('.billing__opt'));
  const plans = Array.from(document.querySelectorAll('.plan'));
  function setBilling(annual) {
    opts.forEach((b) => {
      const on = (b.dataset.billing === 'yearly') === annual;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    plans.forEach((plan) => {
      const m = Number(plan.dataset.m);
      const price = annual ? Math.round(m * 0.8) : m;
      plan.querySelector('.plan__amount').textContent = '$' + price;
      if (!plan.hasAttribute('data-popular')) {
        plan.querySelector('.plan__note').textContent = annual ? 'Billed yearly, $' + (price * 12).toLocaleString('en-US') + '/yr' : 'Billed monthly';
      }
    });
  }
  opts.forEach((b) => b.addEventListener('click', () => setBilling(b.dataset.billing === 'yearly')));
  setBilling(true);

  // Questions: one open at a time, clicking the open one closes it
  const qs = Array.from(document.querySelectorAll('.pq__btn'));
  qs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const wasOpen = btn.getAttribute('aria-expanded') === 'true';
      qs.forEach((other) => {
        const open = other === btn && !wasOpen;
        other.setAttribute('aria-expanded', String(open));
        document.getElementById(other.getAttribute('aria-controls')).hidden = !open;
      });
    });
  });
})();
