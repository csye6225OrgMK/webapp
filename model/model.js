const {
    DataTypes
} = require('sequelize');
const sequelize = require('../dbconnection');

const {
    Sequelize
} = require('sequelize');
//require('dotenv').config();

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: 'mysql',
//   logging: false
// });


const User = sequelize.define('User', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        readOnly: true,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        writeOnly: true
    },
    account_created: {
        type: DataTypes.DATE,
        readOnly: true,
        allowNull: false,
        defaultValue: sequelize.fn('NOW')
    },
    account_updated: {
        type: DataTypes.DATE,
        readOnly: true,
        allowNull: false,
        defaultValue: sequelize.fn('NOW')
    }
}, {
    timestamps: false
});

const Assignment = sequelize.define('Assignment', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: {
                msg: 'Points must be whole number'
            },
            min: 1,
            max: 100
        }
    },
    attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 10
        }
    },
    deadline: {
        type: DataTypes.STRING,
        allowNull: false
    },
    assignment_created_by_user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        readOnly: true
    },
    assignment_created: {
        type: DataTypes.DATE,
        readOnly: true,
        allowNull: false,
        defaultValue: sequelize.fn('NOW')
    },
    assignment_updated: {
        type: DataTypes.DATE,
        readOnly: true,
        allowNull: false,
        defaultValue: sequelize.fn('NOW')
    }
}, {
    timestamps: false
});


const Submission = sequelize.define('Submission', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        readOnly: true
    },
    assignment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        readOnly: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    submission_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true,
        },
    },
    submission_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        readOnly: true
    },
    submission_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        readOnly: true
    }
}, {
    timestamps: false
});


sequelize.authenticate()
    .then(() => {
        console.log('Creating tables ...');
        sequelize.sync().then(() => {
                console.log('Tables created per model');
            })
            .catch(err => {
                console.error('Unable to create tables ...', err);
            })
    })
    .catch(err => {
        console.error('Unable to connect to the database ...', err);
    });

module.exports = {
    User,
    Assignment,
    Submission
}

