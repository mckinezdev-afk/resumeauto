<template>
  <form class="card" @submit.prevent="onSubmit">
    <div class="grid">
      <div class="field">
        <label for="name">Full Name</label>
        <select v-model="selectedUser" :disabled="loading" class="custom-select">
          <option value="" disabled>Select your name</option>
          <option v-for="uname in usernames" :key="uname" :value="uname">{{ uname }}</option>
        </select>
        <small v-if="errors.name" class="err">{{ errors.name }}</small>
      </div>
      <div class="field">
        <label for="title">Job Title</label>
        <input id="title" v-model.trim="jobtitle" type="text"  placeholder="Frontend Engineer" :disabled="loading" />
        <small v-if="errors.title" class="err">{{ errors.title }}</small>
      </div>

      <div class="field">
        <label for="description">Job Description</label>
        <textarea id="description" v-model.trim="form.description" rows="6" placeholder="Paste the JD here..."
          :disabled="loading"></textarea>
        <small v-if="errors.description" class="err">{{ errors.description }}</small>
      </div>
    </div>

    <div class="field">
      <label for="note">Notes</label>
      <textarea id="note" v-model.trim="form.note" type="text" placeholder="Any extra note" :disabled="loading"
        rows="4"></textarea>
      <small v-if="errors.note" class="err">{{ errors.note }}</small>
    </div>

    <div class="row">
      <button type="submit" :disabled="loading">
        {{ loading ? "Submitting…" : "Submit" }}
      </button>
      <button type="button" class="ghost" @click="reset" :disabled="loading">
        Reset
      </button>
    </div>

    <p v-if="server.success" class="ok">✅ {{ server.message }}</p>
    <p v-if="server.error" class="err">❌ {{ server.error }}</p>
  </form>
</template>
<script setup>
import { reactive, ref, onMounted } from "vue";
import { postJSON } from "../lib/api";

const blank = () => ({
  name: "",
  email: "",
  phone: "",
  address: "",
  education: "",
  experience: "",
  title: "",
  description: "",
  note: "",
});

const form = reactive(blank());
const errors = reactive({
  name: "",
  email: "",
  phone: "",
  title: "",
  description: "",
  note: "",
});
const usernames = ref([]);
const jobtitle = ref("Senior Software Engineer");
const selectedUser = ref(null);
const loading = ref(false);
const server = reactive({ success: false, message: "", error: "" });

function validateEmail(v) {
  return typeof v === "string" && v.includes("@") && v.includes(".");
}

onMounted(() => {
  // prefill from user profile if available
  fetch("/api/user/all", { method: "POST" })
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched usernames:", data);
      usernames.value = data || [];
    })
    .catch(() => {
      // ignore
    });
});


function validate() {
  errors.title = jobtitle.value ? "" : "Job title is required.";
  errors.description = form.description ? "" : "Job description is required.";
  errors.note = "";
  return (
    !errors.name && !errors.email && !errors.phone && !errors.title && !errors.description
  );
}

function reset() {
  jobtitle.value = "Senior Software Engineer";
  form.description = "";
  server.success = false;
  server.message = "";
  server.error = "";
}

async function onSubmit() {
  if (!validate()) return;
  loading.value = true;
  server.success = false;
  server.error = "";
  try {
    const payload = {
      name: selectedUser.value,
      job: { title: jobtitle.value, description: form.description },
      note: form.note,
    };
    const res = await postJSON("/api/autogen/answer", payload);
    server.success = true;
    server.message = res?.message || "Submitted successfully.";
    reset();
  } catch (e) {
    server.error = e?.message || "Submission failed.";
  } finally {
    loading.value = false;
  }
}
</script>
<style scoped>
.card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.field {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.35rem;
}
.custom-select {
  padding: 10px;
  border-radius: 6px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  font-size: 16px;
  appearance: none; /* removes default arrow in some browsers */
}

input,
textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  outline: none;
}

input:focus,
textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

small.err {
  color: #b91c1c;
}

.row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  background: #111827;
  color: white;
}

button.ghost {
  background: transparent;
  color: #111827;
  border: 1px solid #111827;
}

.ok {
  color: #166534;
  margin-top: 0.75rem;
}

.err {
  color: #b91c1c;
  margin-top: 0.75rem;
}

.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  /* 3 equal inputs + button */
  gap: 0.5rem;
  align-items: center;
}
</style>
