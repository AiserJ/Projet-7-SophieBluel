document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = 'http://localhost:5678/api/';
  const loginForm = document.querySelector('.login-form');
  const emailInput = document.getElementById('email');
  const pwdInput = document.getElementById('password');
  const submitBtn = loginForm?.querySelector('button[type="submit"]');

  if (!loginForm) return;

  function showError(msg) {
    let errorP = document.querySelector('.login-error');
    if (!errorP) {
      errorP = document.createElement('p');
      errorP.className = 'login-error';
      errorP.style.color = 'crimson';
      errorP.style.marginTop = '10px';
      loginForm.appendChild(errorP);
    }
    errorP.textContent = msg;
  }

  function setSubmitting(state) {
    if (submitBtn) {
      submitBtn.disabled = state;
      submitBtn.textContent = state ? 'Connexion…' : 'Se connecter';
    }
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('');
    setSubmitting(true);

    try {
      const res = await fetch(API_BASE_URL + 'users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.value.trim(),
          password: pwdInput.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Erreur ${res.status}`);
      }

      localStorage.setItem('token', data.token);
      window.location.href = 'index.html';
    } catch (err) {
      console.error('[login error]', err);
      showError('Email ou mot de passe invalide');
    } finally {
      setSubmitting(false);
    }
  });
});