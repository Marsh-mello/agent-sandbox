/* 合文铸字所 · 登录页原型
   静态原型：校验、密码可见性、模拟提交。无网络请求、无真实账号。 */

(function () {
  "use strict";

  var form = document.getElementById("signin");
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  var reveal = document.getElementById("reveal");
  var submit = document.getElementById("submit");
  var status = document.getElementById("status");
  var statusRow = document.getElementById("status-row");
  var resetDemo = document.getElementById("reset-demo");
  var sso = document.getElementById("sso");

  var emailField = form.querySelector('[data-field="email"]');
  var passwordField = form.querySelector('[data-field="password"]');
  var emailError = document.getElementById("email-error");
  var passwordError = document.getElementById("password-error");

  var timer = null;
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(field, node, input, message) {
    if (message) {
      field.setAttribute("data-invalid", "true");
      node.textContent = message;
      node.hidden = false;
      input.setAttribute("aria-invalid", "true");
      return false;
    }
    field.removeAttribute("data-invalid");
    node.textContent = "";
    node.hidden = true;
    input.removeAttribute("aria-invalid");
    return true;
  }

  function validateEmail() {
    var value = email.value.trim();
    if (!value) return setError(emailField, emailError, email, "请输入邮箱地址。");
    if (!EMAIL.test(value)) {
      return setError(emailField, emailError, email, "邮箱格式看起来不完整，例如 name@studio.cn。");
    }
    return setError(emailField, emailError, email, "");
  }

  /* 登录不校验密码强度：只确认填了，规则提示留给注册与找回密码 */
  function validatePassword() {
    if (!password.value) {
      return setError(passwordField, passwordError, password, "请输入密码。");
    }
    return setError(passwordField, passwordError, password, "");
  }

  function setStatus(text, tone, canReset) {
    status.textContent = text || "";
    if (tone) statusRow.setAttribute("data-tone", tone);
    else statusRow.removeAttribute("data-tone");
    statusRow.hidden = !text;
    resetDemo.hidden = !canReset;
  }

  function busy(state) {
    submit.setAttribute("aria-busy", state ? "true" : "false");
    submit.textContent = state ? "正在登录" : "登录";
  }

  email.addEventListener("blur", function () {
    if (email.value.trim()) validateEmail();
  });

  password.addEventListener("blur", function () {
    if (password.value) validatePassword();
  });

  email.addEventListener("input", function () {
    if (emailField.hasAttribute("data-invalid")) validateEmail();
  });

  password.addEventListener("input", function () {
    if (passwordField.hasAttribute("data-invalid")) validatePassword();
  });

  /* 焦点留在开关上：键盘用户再按一次即可切回，读屏也会读出新的按下状态 */
  reveal.addEventListener("click", function () {
    var shown = password.type === "text";
    password.type = shown ? "password" : "text";
    reveal.setAttribute("aria-pressed", shown ? "false" : "true");
    reveal.textContent = shown ? "显示" : "隐藏";
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (submit.getAttribute("aria-busy") === "true") return;

    var okEmail = validateEmail();
    var okPassword = validatePassword();

    if (!okEmail || !okPassword) {
      setStatus("", "", false);
      (okEmail ? password : email).focus();
      return;
    }

    busy(true);
    setStatus("正在验证账号…", "", false);

    timer = window.setTimeout(function () {
      busy(false);
      setStatus("演示到此为止：这是一个静态原型，未连接账号服务。", "ok", true);
    }, 1200);
  });

  resetDemo.addEventListener("click", function () {
    window.clearTimeout(timer);
    busy(false);
    form.reset();
    password.type = "password";
    reveal.setAttribute("aria-pressed", "false");
    reveal.textContent = "显示";
    setError(emailField, emailError, email, "");
    setError(passwordField, passwordError, password, "");
    setStatus("", "", false);
    email.focus();
  });

  sso.addEventListener("click", function () {
    setStatus("企业 SSO 尚未接入，此处仅演示按钮层级。", "", false);
  });
})();
