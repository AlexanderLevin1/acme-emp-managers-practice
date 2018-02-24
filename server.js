// require all
const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
nunjucks.configure({ noCache: true });
app.use(require('body-parser').urlencoded());
app.use(require('method-override')('_method'));
const path = require('path');

app.set('view engine', 'html')
app.engine('html', nunjucks.render)

app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));

// require models from database
const db = require('./db');
const { Employee } = db.models;

// create methods to be used - "employeeCount" and "managerCount"
app.use((req, res, next) => {
    res.locals.path = req.url
    Employee.findAll()
        .then( employees => {
            res.locals.employeeCount = employees.length 
        })
        .then( () => {
            Employee.count({
                include: ['manager'],
                distinct: true,
                col: 'managerId'
            })
            .then (result => {
                res.locals.managerCount = result
                next()
            })
        })
        .catch(next)
})

// route - index page
app.get('/', (req, res, next) => {
    res.render('index', { title: 'Home'})
});

//route - employees page
app.get('/employees', (req, res, next) => {
    Employee.findAll({
        include: [{
            model: Employee,
            as: 'manager'
        }, {
            model: Employee,
            as: 'workers'
        }]
    })
    .then((employees) => res.render('employees', { employees, title: 'Employees'}))
    .catch(next)
})

// create a new employee
app.post('/employees', (req, res, next) => {
    Employee.createFromForm(req.body)
    .then(() => res.redirect('/employees'))
    .catch(next);
});

// update an employee
app.put('/employees/:id', (req, res, next) => {
    Employee.findById(req.params.id)
    .then(employee => {
        Object.assign(employee, req.body)
        if (req.body.managerId === '-1') {
            employee.managerId = null
        }
        return employee.save()
    })
    .then (() => res.redirect('/employees'))
    .catch(next)
});

// delete an employee
app.delete('/employees/:id', (req, res, next) => {
    Employee.findById(req.params.id)
    .then(employee => employee.destroy())
    .then(() => res.redirect('/employees'))
    .catch(next)
})

//listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`))

//sync
db.sync()
    .then(() => db.seed());

