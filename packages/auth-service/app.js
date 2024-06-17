const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const swaggerSetup = require('./swagger');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use('/auth', authRoutes);
swaggerSetup(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});