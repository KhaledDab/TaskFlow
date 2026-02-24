require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

connectDB();

const port = 3001;

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
