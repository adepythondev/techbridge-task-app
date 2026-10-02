document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;
  form.setAttribute("novalidate", "");

  let msg = document.getElementById("form-message");
  if (!msg) {
    msg = document.createElement("p");
    msg.id = "form-message";
    msg.setAttribute("aria-live", "polite");
    msg.style.cssText = "margin-top:12px;font-weight:bold;";
    form.appendChild(msg);
  }
  const show = (text, ok) => {
    msg.textContent = text;
    msg.style.color = ok ? "#2ecc71" : "#e74c3c";
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {};
    const missing = [];

    Array.from(form.elements).forEach((el) => {
      const key = el.name || el.id;
      if (!key || ["submit", "button", "reset", "fieldset"].includes(el.type)) return;
      if (el.type === "radio" && !el.checked) return;
      if (el.type === "checkbox") { data[key] = el.checked; return; }
      const value = (el.value || "").trim();
      data[key] = el.type === "email" ? value.toLowerCase() : value;
      if (!value) missing.push(key);
    });

    if (missing.length) {
      show("Please fill in: " + missing.join(", "), false);
      return;
    }

    const emailKey = Object.keys(data).find((k) => /email/i.test(k));
    if (emailKey && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[emailKey])) {
      show("Please enter a valid email address.", false);
      return;
    }

    const nameKey = Object.keys(data).find((k) => /name/i.test(k) && !/github|user/i.test(k));
    const trackKey = Object.keys(data).find((k) => /track|program|course/i.test(k));
    const user = {
      name: nameKey ? data[nameKey] : "",
      track: trackKey ? data[trackKey] : "",
      email: emailKey ? data[emailKey] : "",
      details: data
    };
    try { localStorage.setItem("techbridgeUser", JSON.stringify(user)); } catch (err) {}

    show("Registration successful! Redirecting to your dashboard...", true);
    setTimeout(() => { window.location.href = "dashboard.html"; }, 1500);
  });
});
