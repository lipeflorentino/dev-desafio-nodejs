const express = require('express');
const urlRoutes = require('./src/routes/urlRoutes');

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use('/url', urlRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});