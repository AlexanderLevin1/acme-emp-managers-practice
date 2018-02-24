const conn = require('./conn');

const Employee = require('./employee');
// const Job = require('./Jobs');

const sync = () => {
    return conn.sync({ force: true })
}

const seed = () => {
    return Promise.all([
        Employee.create({ email: 'BarneyRubble@gmail.com' }),
        Employee.create({ email: 'FredFlintstone@gmail.com' }),
        Employee.create({ email: 'KingArthur@gmail.com' })
    ])
        .then(([barney, fred, arthur]) => {
            return Promise.all([
                barney.setManager(arthur),
                fred.setManager(arthur),
                arthur.setManager(barney),
            ])
        })
}

module.exports = {
    sync,
    seed,
    models: {
        Employee
    }
}