const db = require('../config/db');

const Activity = {
    getAllActivities: (callback) => {
        db.query('SELECT * FROM plano_atividades', callback);
    },
    createActivity: (data, callback) => {
        db.query('INSERT INTO plano_atividades SET ?', data, callback);
    },
};

module.exports = Activity;
