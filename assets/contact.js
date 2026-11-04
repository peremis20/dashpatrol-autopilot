// Contact: validated message form, saves to the Neon contact function
(() => {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const form = document.getElementById('contact-form');
  if (!form) return;
  const $ = (id) => document.getElementById(id);
  const name = $('c-name'), email = $('c-email'), topic = $('c-topic'), msg = $('c-msg');
  const err = $('contact-err'), submit = $('contact-submit'), sent = $('contact-sent');
  const fields = [name, email, topic, msg];
  let timer = null;

  const setErr = (text, field) => {
    err.textContent = text;
    err.hidden = !text;
    fields.forEach((f) => f.setAttribute('aria-invalid', String(f === field)));
    if (field) field.focus();
  };
  const setLoading = (on) => {
    submit.textContent = on ? 'Sending…' : 'Send Message →';
    submit.disabled = on;
    fields.forEach((f) => { f.disabled = on; });
    form.setAttribute('aria-busy', String(on));
  };
  // Any edit clears the error, like the prototype's setState({ [k]: value, err: '' })
  [name, email, msg].forEach((el) => el.addEventListener('input', () => setErr('')));
  topic.addEventListener('change', () => setErr(''));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (timer) return;
    const n = name.value.trim(), em = email.value.trim();
    if (!n) return setErr('Please enter your name.', name);
    if (!EMAIL_RE.test(em)) return setErr('Please enter a valid email address.', email);
    if (msg.value.trim().length < 10) return setErr('Please write a short message (10+ characters).', msg);
    setLoading(true);
    timer = true;
    const hp = form.querySelector('[name="website"]');
    const body = new URLSearchParams({ name: n, email: em, topic: topic.value, msg: msg.value.trim(), website: hp ? hp.value : '' });
    fetch('https://br-weathered-mouse-b5ymo8mn-contact.compute.c-7.us-east-2.aws.neon.tech/', { method: 'POST', body })
      .then((r) => r.json().then((j) => { if (!r.ok || !j.ok) throw new Error('send'); }))
      .then(() => {
        timer = null;
        setLoading(false);
        $('sent-name').textContent = n.split(/\s+/)[0] || 'there';
        $('sent-email').textContent = em;
        form.hidden = true;
        sent.hidden = false;
        sent.querySelector('h2').focus();
      })
      .catch(() => {
        timer = null;
        setLoading(false);
        setErr('Sorry, your message could not be sent. Please email hello@dashpatrol.io.');
      });
  });

  $('contact-again').addEventListener('click', () => {
    msg.value = '';
    sent.hidden = true;
    form.hidden = false;
    msg.focus();
  });

  submit.disabled = false; // enabled once this script is running
})();
