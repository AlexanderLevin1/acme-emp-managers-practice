const conn = require('./conn');
const { Sequelize } = conn;

const Employee = conn.define('employee', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
}, {
        getterMethods: {
            name: function () {
                return this.email.split('@')[0];
            },
            emailProivder: function () {
                return this.email.split('@')[1];
            }
    }
});

Employee.createFromForm = function(body) {
    if(body.managerId === '-1') {
        delete body.managerId;
    }
    return this.create(body)
}

Employee.belongsTo(Employee, { as: 'manager'})
Employee.hasMany(Employee, { as: 'workers', foreignKey: 'managerId'})

module.exports = Employee;