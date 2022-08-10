-- View Departments:
SELECT departments.dept_name AS "DEPARTMENT", departments.id AS "ID" FROM departments ORDER BY departments.dept_name ASC;

-- View Roles:
SELECT roles.title AS "TITLE", roles.id AS "ID", departments.dept_name AS "DEPARTMENT", CONCAT('$', format(roles.salary,2)) AS "SALARY" FROM roles LEFT JOIN departments ON roles.dept_id = departments.id ORDER BY roles.title ASC;

-- View Employees:
SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS "NAME", employees.id AS "ID", roles.title AS "TITLE", departments.dept_name AS "DEPARTMENT", CONCAT('$', format(roles.salary,2)) AS "SALARY", CONCAT(manager.first_name, ' ', manager.last_name) AS "MANAGER" FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.dept_id = departments.id LEFT JOIN employees manager ON employees.mgr_id = manager.id ORDER BY employees.last_name ASC;