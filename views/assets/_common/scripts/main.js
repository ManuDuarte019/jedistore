// Ordem Jedi Store — UI behaviors
(function(){
  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav){
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Active nav link highlight
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.endsWith(path)) a.classList.add('active');
  });

  // Year in footer
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  if (/\/(app|admin)\//.test(location.pathname)) {
    import('../classes/AuthGuard.js').then(({ default: AuthGuard }) => {
      const isAdmin = location.pathname.includes('/admin/');
      const guard = new AuthGuard({
        loginPath: isAdmin ? '../public/login.html?admin=1' : '../public/login.html',
        scope: isAdmin ? 'admin' : 'default'
      });
      if (guard.requireSession()) {
        document.querySelectorAll('[data-logout]').forEach(button => {
          button.addEventListener('click', () => guard.logout());
        });
      }
    });
  }

  document.querySelectorAll('[data-local-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      if (button) button.textContent = form.dataset.successText || 'Operação concluída';
    });
  });

})();
