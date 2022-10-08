const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname+'/database.sqlite',
    logging: false,
});

const Logs = sequelize.define('Logs', {
    'baseUrl': {
        type: Sequelize.STRING,
        allowNull: false,
    },
    'method': {
        type: Sequelize.STRING,
        allowNull: false,
    },
    'originalUrl': {
        type: Sequelize.STRING,
        allowNull: false,
    },
    'query': {
        type: Sequelize.STRING,
        allowNull: false,
    },
    'path': {
        type: Sequelize.STRING,
        allowNull: false,
    },
    'params': {
        type: Sequelize.STRING,
        allowNull: false,
    },
    'ip': {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    // Other model options go here
    timestamps: true
});

const Downloads = sequelize.define('Downloads', {
    // using quotes to match report prop names
    'target': {
        type: Sequelize.STRING,
        allowNull: false,
    },
    'ip': {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    // Other model options go here
    timestamps: true
});

module.exports = {
    Downloads,
    Logs
}