const apiUrl = "/api/users";
const form = document.querySelector("#feedback-form");
const list = document.querySelector("#feedback-list");
const statusBox = document.querySelector("#status-message");

let feedback = [];

function showStatus(message, isError = false) {
  statusBox.textContent = message;
  statusBox.dataset.error = String(isError);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function request(url, method = "GET", data) {
  const response = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed (${response.status}): ${text || "Bad request"}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function render() {
  if (!feedback.length) {
    list.innerHTML = '<p class="text-secondary mb-0 py-3">No feedback yet.</p>';
    return;
  }

  list.innerHTML = feedback.map((item, index) => {
    const username = escapeHtml(item.username || "Unknown user");
    const phone = escapeHtml(item.phone || "");
    const email = escapeHtml(item.email || "");

    return `
      <article class="list-group-item d-flex justify-content-between align-items-center gap-3">
        <div class="min-w-0">
          <p class="mb-1 fw-semibold text-break">${username}</p>
          <p class="mb-1 text-break">${phone}</p>
          <p class="mb-0 text-break">${email}</p>
        </div>
        <div class="d-flex gap-2 flex-shrink-0">
          <button class="btn btn-sm btn-outline-danger" data-action="delete" data-index="${index}">Delete</button>
        </div>
      </article>
    `;
  }).join("");
}

async function loadFeedback() {
  try {
    const records = await request(apiUrl);
    feedback = Array.isArray(records) ? records : [];
    render();
  } catch (error) {
    showStatus(`Could not load feedback: ${error.message}`, true);
  }
}

list.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const item = feedback[Number(button.dataset.index)];
  if (!item) return;

  if (button.dataset.action === "delete") {
    if (!window.confirm(`Delete user ${item.username || "Unknown user"}?`)) {
      return;
    }

    try {
      await request(`${apiUrl}/${encodeURIComponent(item.id)}`, "DELETE");
      feedback = feedback.filter((record) => record.id !== item.id);

      render();
      showStatus("User deleted.");
    } catch (error) {
      showStatus(`Could not delete user: ${error.message}`, true);
    }
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const username = String(formData.get("username") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  if (!username || !phone || !email) {
    showStatus("Please enter your username, phone number, and email.", true);
    return;
  }

  try {
    const created = await request(apiUrl, "POST", { username, phone, email });
    if (!created || !created.id) {
      throw new Error("The server did not return a valid user ID.");
    }

    feedback.unshift(created);
    showStatus("User registered successfully.");

    form.reset();
    render();
  } catch (error) {
    showStatus(`Could not register user: ${error.message}`, true);
  }
});

loadFeedback();
