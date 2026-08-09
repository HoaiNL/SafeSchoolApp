/* ==========================================================================
   SAFESCHOOL INTERACTIVE JAVASCRIPT
   AI Support, Anonymous Report Workflow, Auth Modal, Forum Interactivity
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  console.log("SafeSchool Platform initialized.");

  // 1. AI Chat Drawer Controls
  const fabBtn = document.getElementById("aiChatFab");
  const drawer = document.getElementById("aiChatDrawer");
  const closeChat = document.getElementById("closeAiChat");

  if (fabBtn && drawer) {
    fabBtn.addEventListener("click", () => {
      drawer.classList.toggle("active");
    });
  }

  if (closeChat && drawer) {
    closeChat.addEventListener("click", () => {
      drawer.classList.remove("active");
    });
  }

  // AI Send Message
  const sendBtn = document.getElementById("sendAiMsgBtn");
  const inputEl = document.getElementById("aiMsgInput");
  const chatMessages = document.getElementById("chatMessages");

  if (sendBtn && inputEl && chatMessages) {
    function sendAiMsg() {
      const text = inputEl.value.trim();
      if (!text) return;

      // Add user bubble
      appendMessage("user", text);
      inputEl.value = "";

      // Show typing indicator
      const typingId = "typing-" + Date.now();
      appendMessage("ai", "💬 AI đang suy nghĩ...", typingId);

      // Call API
      fetch("/api/AiSupport/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      })
        .then(res => res.json())
        .then(data => {
          const el = document.getElementById(typingId);
          if (el) el.remove();
          appendMessage("ai", data.message);
        })
        .catch(err => {
          console.error(err);
          const el = document.getElementById(typingId);
          if (el) el.remove();
          appendMessage("ai", "Xin lỗi em, kết nối với AI Support đang gián đoạn. Vui lòng gọi trực tiếp hotline 111 để được hỗ trợ tức thì!");
        });
    }

    sendBtn.addEventListener("click", sendAiMsg);
    inputEl.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendAiMsg();
    });
  }

  function appendMessage(sender, text, customId) {
    if (!chatMessages) return;
    const msgDiv = document.createElement("div");
    msgDiv.className = "msg-bubble " + (sender === "user" ? "msg-user" : "msg-ai");
    if (customId) msgDiv.id = customId;
    msgDiv.innerHTML = text.replace(/\n/g, "<br>");
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 2. Auth Modal Tabs & Actions
  const loginModal = document.getElementById("authModal");
  const openLoginBtn = document.getElementById("openLoginModalBtn");
  const closeLoginBtn = document.getElementById("closeAuthModalBtn");

  if (openLoginBtn && loginModal) {
    openLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.classList.add("active");
    });
  }

  if (closeLoginBtn && loginModal) {
    closeLoginBtn.addEventListener("click", () => {
      loginModal.classList.remove("active");
    });
  }

  // Tab Switching
  window.switchAuthTab = function (tabName) {
    document.querySelectorAll(".auth-tab-content").forEach(el => el.style.display = "none");
    document.querySelectorAll(".tab-btn").forEach(el => el.classList.remove("active"));

    const targetTab = document.getElementById("tab-" + tabName);
    const targetBtn = document.getElementById("btn-tab-" + tabName);

    if (targetTab) targetTab.style.display = "block";
    if (targetBtn) targetBtn.classList.add("active");
  };

  // Login Handlers
  window.handlePhoneLogin = function (e) {
    e.preventDefault();
    const phone = document.getElementById("authPhone").value;
    const pass = document.getElementById("authPhonePass").value;

    fetch("/Auth/LoginByPhone", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `phoneNumber=${encodeURIComponent(phone)}&password=${encodeURIComponent(pass)}`
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(data.message);
          window.location.reload();
        } else {
          alert(data.message);
        }
      });
  };

  window.handleUsernameLogin = function (e) {
    e.preventDefault();
    const user = document.getElementById("authUser").value;
    const pass = document.getElementById("authUserPass").value;

    fetch("/Auth/LoginByUsername", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(data.message);
          window.location.reload();
        } else {
          alert(data.message);
        }
      });
  };

  window.handleGmailLogin = function () {
    fetch("/Auth/LoginWithGmail", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `gmailToken=simulated_token_123`
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(data.message);
          window.location.reload();
        }
      });
  };

  // 3. Anonymous Report Toggle logic
  const anonSwitch = document.getElementById("isAnonymousCheckbox");
  const reporterDetailsGroup = document.getElementById("reporterInfoFields");

  if (anonSwitch && reporterDetailsGroup) {
    anonSwitch.addEventListener("change", function () {
      if (this.checked) {
        reporterDetailsGroup.style.display = "none";
      } else {
        reporterDetailsGroup.style.display = "block";
      }
    });
  }

  // 4. Forum Like Interaction
  window.likePost = function (postId, btnEl) {
    fetch("/Forum/LikePost/" + postId, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const countSpan = btnEl.querySelector(".like-count");
          if (countSpan) {
            countSpan.textContent = parseInt(countSpan.textContent) + 1;
          }
          btnEl.style.color = "#ef4444";
        }
      });
  };
});
