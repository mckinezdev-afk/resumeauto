# Vue Job Submitter


A tiny Vue 3 app (Vite) that posts job data to a backend.


## Run locally


```bash
npm i
npm run dev
```


The dev server runs at `http://localhost:5173`. API requests to `/api/*` are proxied to `http://localhost:3000`.


## Configure your backend


Update the `vite.config.js` proxy target (or remove the proxy and use a full URL in `postJSON('/api/jobs', ...)`).


## Example Express backend (optional)


```js
import express from 'express'
import cors from 'cors'


const app = express()
app.use(cors())
app.use(express.json())


app.post('/api/jobs', (req, res) => {
const { jobTitle, jobDescription, note } = req.body || {}
if (!jobTitle || !jobDescription) {
return res.status(400).json({ error: 'jobTitle and jobDescription are required' })
}
// Save to DB here...
return res.json({ message: 'Job received', received: { jobTitle, jobDescription, note } })
})


app.listen(3000, () => console.log('API on http://localhost:3000'))