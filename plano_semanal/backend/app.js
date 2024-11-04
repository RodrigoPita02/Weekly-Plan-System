const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const activitiesRouter = require('./routes/activities');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/activities', activitiesRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
