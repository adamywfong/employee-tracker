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

function init() {
    inquirer
        .prompt(
            {
                type: 'list',
                message: 'Enter up to three characters to include in your logo',
                name: 'choice',
                choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
            }
        ) .then(
            
        )
}

init();