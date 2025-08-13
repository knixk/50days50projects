import fetch from "node-fetch";


/*
This works now,
get the all templates info, in a array. and,
loop over that, perform this action,
and the thing is we need to get from one API,
sent to another API,


*/
const API_KEY = "cc89c2b2-8fe2-48b2-b00e-4a76b218dd5c";
const BASE_URL = "https://sdk.iad-03.braze.com"; // Change region if needed

// --- Helper to make Braze API calls ---
async function brazeGet(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  return res.json();
}

async function brazePost(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

// --- Function to duplicate a template ---
async function duplicateTemplate(templateId, suffix = "-copy") {
  // Step 1: Fetch original template
  const original = await brazeGet("/templates/email/info", {
    email_template_id: templateId,
  });

  if (!original || !original.email_template_id) {
    throw new Error("Template not found or invalid response");
  }

  // Step 2: Build new payload (strip read-only fields)
  const newTemplate = {
    template_name: `${original.template_name}${suffix}`,
    subject: original.subject || "Default Subject",
    preheader: original.preheader || "",
    description: original.description || "",
    body: original.body,
    plaintext_body: original.plaintext_body || null,
  };

  // Step 3: Create new template
  const created = await brazePost("/templates/email/create", newTemplate);
  return created;
}

// Example usage
(async () => {
  try {
    const result = await duplicateTemplate(
      "011d98c1-400f-430c-91ba-081865895473"
    );
    console.log("✅ Template duplicated:", result);
  } catch (err) {
    console.error("❌ Error duplicating template:", err);
  }
})();
