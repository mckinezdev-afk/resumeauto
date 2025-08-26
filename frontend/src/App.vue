<template>
<main class="container">
<h1>Resume Generator</h1>
<p>Enter a job title, job description, and an extra note for your Resume</p>
<JobForm />
</main>
</template>


<script setup>
import JobForm from './components/JobForm.vue'
</script>


<style scoped>
.container {
max-width: 860px;
margin: 2rem auto;
padding: 1rem;
font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
}


h1 { margin-bottom: 0.25rem; }
p { color: #555; margin-bottom: 1.5rem; }
</style>