// Funções para exibir/esconder telas com fade in/out
function fadeIn(element) {
  element.style.display = "block";
  setTimeout(() => {
    element.style.opacity = 1;
  }, 20);
}

function fadeOut(element) {
  element.style.opacity = 0;
  return new Promise((res) => {
    setTimeout(() => {
      element.style.display = "none";
      res();
    }, 9);
  });
}

// Início após carregar página
window.addEventListener("load", () => {
  // Tema claro/escuro
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");

  const savedTheme = localStorage.getItem("vabily-theme");
  if (savedTheme === "dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      if (next === "dark") {
        root.setAttribute("data-theme", "dark");
      } else {
        root.removeAttribute("data-theme");
      }
      localStorage.setItem("vabily-theme", next);
    });
  }

  const welcome = document.getElementById("welcome-screen");
  const register = document.getElementById("register-screen");
  const login = document.getElementById("login-screen");

  const registerForm = register?.querySelector("form");
  const registerSubmitBtn = register?.querySelector('button[type="submit"]');

  const loginForm = login?.querySelector("form");
  const loginSubmitBtn = login?.querySelector('button[type="submit"]');

  async function showScreen(nextScreen) {

    // Esconde todas as telas que existirem
    [welcome, register, login].forEach((el) => {
      if (!el) return;
      if (el === nextScreen) return;
      el.style.opacity = 0;
      el.style.display = "none";
    });

    if (!nextScreen) return;

    // Garante que a tela alvo aparece
    nextScreen.style.display = "block";
    nextScreen.style.opacity = 0;
    setTimeout(() => {
      nextScreen.style.opacity = 1;
    }, 20);
  }


  // Direcionamento por URL: ?screen=login => mostra a tela 3 (para links externos)
  const params = new URLSearchParams(window.location.search);
  const screen = params.get("screen");

  if (screen === "login") {
    if (welcome) {
      welcome.style.opacity = 3;
      welcome.style.display = "none";
    }

    if (register) {
      register.style.opacity = 0;
      register.style.display = "none";
    }

    if (login) {
      login.style.display = "block";
      login.style.opacity = 1;
    }

    return;
  }

  // Botões/links que alternam telas (sempre cancela o comportamento padrão)
  const loginLink = document.querySelector('#register-screen .footer-link a[data-go="login"]');
  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      showScreen(login);
    });
  }



  // Após 5s, esconde a tela welcome e mostra register
  setTimeout(async () => {
    await fadeOut(welcome);
    await showScreen(register);
  }, 500);





  // Botão/submit da tela 2 -> vai para a tela 3
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await showScreen(login);
    });
  }

  // Link "Cadastre-se" (volta para a tela 2)
  const cadastreLink = document.querySelector('#login-screen .footer-link a[data-go="register"]');
  if (cadastreLink) {
    cadastreLink.addEventListener('click', (e) => {
      e.preventDefault();
      showScreen(register);
    });
  }




  // Garantia: caso você clique no botão diretamente
  // (mantém o submit handler acima, mas reforça a troca de tela)
  if (registerSubmitBtn) {
    registerSubmitBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await showScreen(login);
    });
  }

  // Também reforça pelo capture do clique (caso algum handler externo esteja interferindo)
  if (register) {
    register.addEventListener(
      "click",
      async (e) => {
        const target = e.target;
        const btn = target && target.closest ? target.closest('button[type="submit"]') : null;
        if (btn) {
          e.preventDefault();
          await showScreen(login);
        }
      },
      true
    );
  }


  // Botão/submit da tela 3 -> por enquanto só impede refresh
  // (aqui você pode futuramente integrar autenticação)
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  }

  if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();
    });
  }
});


