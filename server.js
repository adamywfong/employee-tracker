const inquirer = require('inquirer');
const mysql = require('mysql');

const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: process.env.DB_USER,
      // MySQL password
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    console.log(`Connected to the database.`)
  );

const  optionSelect = () => {
  inquirer
    .prompt({
      type: 'list',
      message: 'What would you like to do?',
      name: 'choice',
      choices: ['View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Quit']
    }).then((response) => {
        switch (response.choice) {
          case 'View all departments' :
            viewDepartments();
            break;
            case 'View all roles' :
            viewRoles();
            break;
          case 'View all employees' :
            viewEmployees();
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
}

function init() {
  optionSelect();
}

init();