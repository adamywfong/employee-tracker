const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
const {viewer} = require('./queries');

const db = mysql.createConnection({
  host: 'localhost',
  // MySQL username,
  user: process.env.DB_USER,
  // MySQL password
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
  },
  console.log('connected to server')
);

function optionSelect() {
  inquirer
    .prompt([
      {
      type: 'list',
      message: 'What would you like to do?',
      name: 'option',
      choices: ['View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Quit'
              ]
      }
  ])
    .then((response) => {
        switch (response.option) {
          case 'View all departments' :
            viewDB('department');
            break;
          case 'View all roles' :
            viewDB('role');
            break;
          case 'View all employees' :
            viewDB('employee');
            break;
          case 'Add a department' :
            addDepartment();
            break;
          case 'Add a role' :
            addRole();
            break;
          case 'Add an employee' :
            addEmployee();
            break;
          case 'Update an employee role':
            updateEmployeeRole();
            break;
          default:
            console.log('hello');
            break;
        }
    })
    .catch((err) => console.log(err));
}

const viewDB = (database) => {
  switch (database) {
    case 'department':
      db.query(viewer.department,  (err,rows) => {
        if(err) throw err;
        console.log(rows);
      });
      break;
    case 'role':
      db.query(viewer.role,  (err,rows) => {
        if(err) throw err;
        console.log(rows);
      });
      break;
    case 'employee':
      db.query(viewer.employee,  (err,rows) => {
        if(err) throw err;
        console.log(rows);
      });
      break;
  } 
  optionSelect(); 
}

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: 'text',
        message: 'What is the name of the new department?',
        name: 'department'
      }
    ]).then((response) => {
      db.query(`INSERT INTO department (name) VALUES (?);`, response.department,  (err,rows) => {
        if(err) throw err;
        console.log(rows);
        optionSelect();
      })
    }).catch((err) => console.log(err));
} 

const addRole = () => {
  inquirer
    .prompt([
      {
        type: 'text',
        message: 'What is the title of the new role?',
        name: 'title'
      },
      {
        type: 'text',
        message: 'What is the salary of the new role?',
        name: 'salary'
      },
      {
        type: 'list',
        message: 'What department does this role belong to?',
        name: 'department',
        choices: []
      }
    ]).then((response) => {
      db.query(`INSERT INTO role (title,salary,department_id) VALUES (?, ?, ?);`, [response.title,response.salary,], (err,rows) => {
        if(err) throw err;
        console.log(rows);
        optionSelect();
      })
    }).catch((err) => console.log(err));
}

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: 'text',
        message: "What is the employee's first name?",
        name: 'firstName'
      },
      {
        type: 'text',
        message: "What is the employee's last name?",
        name: 'lastName'
      },
      {
        type: 'list',
        message: 'What is the employee\'s role?',
        name: 'role',
        choices: []
      },
      {
        type: 'list',
        message: 'Who is the employee\'s manager(none if no manager)?',
        name: 'manager',
        choices: []
      }
    ]).then((response) => {
      db.query(`INSERT INTO role (first_name,last_name,role_id,manager_id) VALUES ("?", "?", ?, ?);`,[response.firstName,response.lastName,,],  (err,rows) => {
        if(err) throw err;
        console.log(rows);
        optionSelect();
      })
    }).catch((err) => console.log(err));
}

const updateEmployeeRole = () => {
  inquirer
    .prompt
}

optionSelect();