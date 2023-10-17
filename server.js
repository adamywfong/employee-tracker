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
                'Update employee manager',
                'View employees by manager',
                'View employees by department',
                'Delete an entry',
                'View budget by department',
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
            updateEmployee('role');
            break;
          case 'Update employee manager':
            updateEmployee('manager');
            break;
          default:
            break;
        }
    })
    .catch((err) => console.log(err));
}

// Opens requested table
const viewDB = async (table) => {
  let data;
  switch (table) {
    case 'department':
      data = await db.query(viewer.department);
      console.log(data[0]);
      break;
    case 'role':
      data = await db.query(viewer.role);
      console.log(data[0]);
      break;
    case 'employee':
      data = await db.query(viewer.employee);
      console.log(data[0]);
      break;
  } 
  optionSelect(); 
}

// Populates choices for inquirer prompts
const choices = async (selection) => {
  let data;
  switch (selection) {
    case 'department':
      data = await db.query(chooser.department);
      return data[0];
    case 'role' :
      data = await db.query(chooser.role);
      return data[0];
    case 'employee' :
      data = await db.query(chooser.employee);
      return data[0];
    case 'manager' :
      data = await db.query(chooser.employee);
      const managers = data[0];
      managers.push({value: null, name: 'None'});
      return managers;
    default:
      break;
  }
}

// Adds a department
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: 'text',
        message: 'What is the name of the new department?',
        name: 'department'
      }
    ]).then((response) => {
      db.query(adder.department, response.department)
      optionSelect();
    }).catch((err) => console.log(err));
} 

// Adds a new role
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
      db.query(adder.role, [response.title,response.salary,response.department])
      optionSelect();
    }).catch((err) => console.log(err));
}

// Adds a new employee
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
      db.query(adder.employee,[response.firstName,response.lastName,response.role,response.manager])
      optionSelect();
    }).catch((err) => console.log(err));
}

// Changes an employee's role
const updateEmployee = async (update) => {
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
        message: `What ${update} does this employee have?`,
        name: 'update',
        choices: await choices(update)
      },
    ]).then((response) => {
      db.query(`UPDATE employee SET ${update}_id = ? WHERE id = ?;`, [response.update, response.employee])
      optionSelect();
    })
}


optionSelect();