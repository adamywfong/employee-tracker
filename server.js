const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
const {viewer, chooser, adder} = require('./queries');

const db = mysql.createConnection({
  host: 'localhost',
  // MySQL username,
  user: process.env.DB_USER,
  // MySQL password
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).promise();

// Displays list of options and executes functions based on response
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
            break;
        }
    })
    .catch((err) => console.log(err));
}

// Opens requested table
const viewDB = (table) => {
  switch (table) {
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

// Populates choices for inquirer prompts
const choices = async (selection) => {
  switch (selection) {
    case 'department':
      const departments = await db.query(chooser.department,  (err,rows) => {
        if(err) throw err;
      });
      return departments[0];
    case 'role' :
      const roles = await db.query(chooser.role,  (err,rows) => {
        if(err) throw err;
      });
      return roles[0];
    case 'employee' :
      const employees = await db.query(chooser.employee,  (err,rows) => {
        if(err) throw err;
      });
      return employees[0]
    case 'manager' :
      const managers = await db.query(chooser.employee,  (err,rows) => {
        if(err) throw err;
      });
      return managers[0].push({value: null, name: 'None'});
    default:
      break;
  }
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
      db.query(adder.department, response.department,  (err,rows) => {
        if(err) throw err;
        console.log(rows);
        optionSelect();
      })
    }).catch((err) => console.log(err));
} 

const addRole = async () => {
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
        choices: await choices('department')
      }
    ]).then((response) => {
      db.query(adder.role, [response.title,response.salary,response.department], (err,rows) => {
        if(err) throw err;
        console.log(rows);
        optionSelect();
      })
    }).catch((err) => console.log(err));
}

const addEmployee = async () => {
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
        choices: await choices('role')
      },
      {
        type: 'list',
        message: 'Who is the employee\'s manager(none if no manager)?',
        name: 'manager',
        choices: await choices('manager')
      }
    ]).then((response) => {
      db.query(adder.employee,[response.firstName,response.lastName,response.role,response.manager],  (err,rows) => {
        if(err) throw err;
        console.log(rows);
        optionSelect();
      })
    }).catch((err) => console.log(err));
}

const updateEmployeeRole = async () => {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'Which employee are you updating?',
        name: 'employee',
        choices: await choices('employee')
      },
      {
        type: 'list',
        message: 'What role does this employee have?',
        name: 'role',
        choices: await choices('role')
      },
    ]).then((response) => {
      db.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, [response.role, response.employee],(err,rows) => {
        if(err) throw err;
        console.log(rows);
        optionSelect();
      })
    })
}

optionSelect();