const express = require('express');
const router = express.Router();
const Activity = require('../models/activity');

// Obter todas as atividades
router.get('/', (req, res) => {
    Activity.getAllActivities((err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Criar uma nova atividade
router.post('/', (req, res) => {
    const newActivity = req.body;
    Activity.createActivity(newActivity, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: results.insertId, ...newActivity });
    });
});

module.exports = router;
