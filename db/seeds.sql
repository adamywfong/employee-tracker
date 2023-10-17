INSERT INTO department (name)
VALUES  ('Human Resources'),
        ('Finance'),
        ('Operations');

INSERT INTO role (title, salary, department_id)
VALUES  ('CFO', 450000, 2),
        ('Chief HR Officer', 120000, 1),
        ('COO', 250000, 3),
        ('CPA', 60000, 2),
        ('Hiring Manager', 80000, 1),
        ('Restructuring Analyst', 75000, 3),
        ('Funds Analyst', 47000, 2),
        ('Payroll Clerk', 41000, 1),
        ('Marketer', 45000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('John', 'Money', 1, NULL),
        ('Robin', 'Hiring', 2, NULL),
        ('Francis', "Operator", 3, NULL),
        ('Susan', 'Accounting', 4, 1),
        ('William', 'Employer', 5, 2),
        ('Jenny', 'Paycheck', 8, 5),
        ('Sally', 'Deposit', 8, 5);
