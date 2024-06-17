const express = require('express');
const urlRoutes = require('./src/routes/urlRoutes');
const swaggerSetup = require('./swagger');

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use('/url', urlRoutes);
swaggerSetup(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});