require('dotenv').config({ path: ['.env.local', '.env'] });

const express = require('express');
const app = express();  
const cors = require('cors');

const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors({ origin: ["http://localhost:5173", "http://198.18.9.170:5173", "http://172.20.1.169:5173"], methods: ["GET",, "POST", "PUT", "DELETE",], credentials: false }));
app.use(express.static('dist')); // Serve static files

// Sample route

app.use('/api', require('./routers')); // Use the routers

console.log('API Key:', process.env.OPENAI_API_KEY);    

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
