// server.js
const express = require('express');
const bodyParser = require('body-parser');
const scheduleRoutes = require('./routes/schedule');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api', scheduleRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta http://localhost:3000');
});
