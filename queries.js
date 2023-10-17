const viewer = {
    department: `SELECT * FROM department;`,
    role: `SELECT role.id, title, department.name AS department, salary 
    FROM role LEFT OUTER JOIN department on role.department_id = department.id;`,
    employee: `SELECT emp.id,emp.first_name, emp.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee emp
    LEFT OUTER JOIN role ON emp.role_id = role.id 
    LEFT OUTER JOIN department ON role.department_id = department.id
    LEFT OUTER JOIN employee manager ON emp.manager_id = manager.id;`,
    manager: `SELECT employee.id, first_name, last_name, role.title, department.name AS department, role.salary
    FROM employee
    LEFT OUTER JOIN role ON employee.role_id = role.id
    LEFT OUTER JOIN department ON role.department_id = department.id
    WHERE manager_id = ?;`,
    byDept: `SELECT emp.id, emp.first_name, emp.last_name, role.title, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee emp
    LEFT OUTER JOIN role ON emp.role_id = role.id
    LEFT OUTER JOIN employee manager ON emp.manager_id = manager.id
    WHERE role.department_id = ?;`
}

const chooser = {
    department: `SELECT id AS value, name FROM department;`,
    role: `SELECT id AS value, title AS name FROM role;`,
    employee: `SELECT id AS value, CONCAT(first_name, ' ', last_name) AS name FROM employee;`
}

const adder = {
    department: `INSERT INTO department (name) VALUES (?);`,
    role: `INSERT INTO role (title,salary,department_id) VALUES (?, ?, ?);`,
    employee: `INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?, ?, ?, ?);`
}

module.exports = {viewer, chooser, adder};