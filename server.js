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
      db.query(adder.department, response.department)
      optionSelect();
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
      db.query(adder.role, [response.title,response.salary,response.department])
      optionSelect();
    }).catch((err) => console.log(err));
}

const addEmployee = async () => {
  const managers = await choices('employee');
  managers.push({value: null, name: 'None'});
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
        choices: managers
      }
    ]).then((response) => {
      console.log(response);
      db.query(adder.employee,[response.firstName,response.lastName,response.role,response.manager])
      optionSelect();
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
      db.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, [response.role, response.employee])
      optionSelect();
    })
}

optionSelect();