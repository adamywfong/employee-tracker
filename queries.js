const viewer = {
    department: `SELECT * FROM department`,
    role: `SELECT role.id, title, department.name AS department, salary FROM role JOIN department on role.department_id = department.id`,
    employee: `SELECT employee.id, first_name, last_name, role.title, department.name AS department, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id`
}

const chooser = {
    department: `SELECT id AS value, name FROM department`,
    role: `SELECT id AS value, title AS name FROM role`,
    employee: `SELECT id AS value, CONCAT(first_name, ' ', last_name) AS name FROM employee`
}

const adder = {
    department: `INSERT INTO department (name) VALUES (?);`,
    role: `INSERT INTO role (title,salary,department_id) VALUES (?, ?, ?);`,
    employee: `INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?, ?, ?, ?);`
}

module.exports = {viewer, chooser, adder};