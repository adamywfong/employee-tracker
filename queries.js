const viewer = {
    department: `SELECT * FROM department`,
    role: `SELECT role.id, title, department.name AS department, salary FROM role JOIN department on role.department_id = department.id`,
    employee: `SELECT employee.id, first_name, last_name, role.title, department.name AS department, role.salary FROM employee JOIN role on employee.role_id = role.id JOIN department on role.department_id = department.id`
}

// const adder = {
//     department: `SELECT * FROM department`,
//     role: `SELECT role.id, title, department.name AS department, salary FROM role JOIN department on role.department_id = department.id`,
//     employee: `SELECT employee.id, first_name, last_name, role.title, department.name AS department, role.salary JOIN role on employee.role_id = role.id JOIN department on role.department_id = department.id`
// }

module.exports = {viewer};