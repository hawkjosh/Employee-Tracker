const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'company_db'
  },
  console.log('Now connected to database.' + '\n')
);

// Function to start app with command line prompts
const startApp = () => {
  inquirer.prompt([
    {
      type: 'list',
      message: `Please select an option from the menu below:`,
      name: 'mainMenu',
      choices: [
        'View Departments',
        'View Roles',
        'View Employees',
        'Add Department',
        'Add Role',
        'Add Employee'
        // TODO → NEED TO ADD 'Update Employee Role'
      ]
    }
  ]).then(userChoice => {
    const selection = userChoice.mainMenu;
    if (selection === 'View Departments') {
      viewDepts();
    }
    if (selection === 'View Roles') {
      viewRoles();
    }
    if (selection === 'View Employees') {
      viewEmps();
    }
    if (selection === 'Add Department') {
      addDept();
    }
    if (selection === 'Add Role') {
      addRole();
    }
    if (selection === 'Add Employee') {
      addEmp();
    }
    if (selection === 'Update Employee Role') {
      updateRole();
    };
  });
};

// Function to view all departments
const viewDepts = () => {
  const deptsView = `SELECT departments.dept_name AS "DEPARTMENT", departments.id AS "ID" FROM departments ORDER BY departments.dept_name ASC`;
  connection.query(deptsView, (error, results) => {
    console.table(results);
    return startApp();
  });
};

// Function to view all roles
const viewRoles = () => {
  const rolesView = `SELECT roles.title AS "TITLE", roles.id AS "ID", departments.dept_name AS "DEPARTMENT", CONCAT('$', format(roles.salary,2)) AS "SALARY" FROM roles LEFT JOIN departments ON roles.dept_id = departments.id ORDER BY roles.title ASC`;
  connection.query(rolesView, (error, results) => {
    console.table(results);
    return startApp();
  });
};

// Function to view all employees
const viewEmps = () => {
  const empsView = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS "NAME", employees.id AS "ID", roles.title AS "TITLE", departments.dept_name AS "DEPARTMENT", CONCAT('$', format(roles.salary,2)) AS "SALARY", CONCAT(manager.first_name, ' ', manager.last_name) AS "MANAGER" FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.dept_id = departments.id LEFT JOIN employees manager ON employees.mgr_id = manager.id ORDER BY employees.last_name ASC`;
  connection.query(empsView, (error, results) => {
    console.table(results);
    return startApp();
  });
};

// Function to add department
const addDept = () => {
  return inquirer.prompt([
    {
      type: 'input',
      message: 'Please enter the department name: ',
      name: 'deptAdd'
    }
  ]).then(userInput => {
    const sqlSyntax = `INSERT INTO departments (dept_name) VALUES (?)`;
    const params = userInput.deptAdd;
    connection.query(sqlSyntax, params, (error) => {
      console.log('New department has been successfully added.');
      return viewDepts();
    });
  });
};

// Function to add role
const addRole = () => {
  return inquirer.prompt([
    {
      type: 'input',
      message: 'Please enter the role title: ',
      name: 'roleTitleAdd'
    },
    {
      type: 'input',
      message: 'Please enter the salary for this role: ',
      name: 'roleSalaryAdd'
    },
    {
      type: 'input',
      message: 'Please enter the department ID for this role: ',
      name: 'roleDeptIdAdd'
    }
  ]).then(userInput => {
    const sqlSyntax = `INSERT INTO roles (title, salary, dept_id) VALUES (?, ?, ?)`;
    const params = [userInput.roleTitleAdd, userInput.roleSalaryAdd, userInput.roleDeptIdAdd];
    connection.query(sqlSyntax, params, (error) => {
      console.log('New role has been successfully added.');
      return viewRoles();
    });
  });
};

// Function to add employee
const addEmp = () => {
  return inquirer.prompt([
    {
      type: 'input',
      message: 'Please enter the employee\'s first name: ',
      name: 'empFirstNameAdd'
    },
    {
      type: 'input',
      message: 'Please enter the employee\'s last name: ',
      name: 'empLastNameAdd'
    },
    {
      type: 'input',
      message: 'Please enter the employee\'s role ID: ',
      name: 'empRoleIdAdd'
    },
    {
      type: 'input',
      message: 'Please enter the employee\'s manager ID: ',
      name: 'empMgrIdAdd'
    }
  ]).then(userInput => {
    const sqlSyntax = `INSERT INTO employees (first_name, last_name, role_id, mgr_id) VALUES (?, ?, ?, ?)`;
    const params = [userInput.empFirstNameAdd, userInput.empLastNameAdd, userInput.empRoleIdAdd, userInput.empMgrIdAdd];
    connection.query(sqlSyntax, params, (error) => {
      console.log('New employee has been successfully added.');
      return viewEmps();
    });
  });
};

// TODO → NEED TO FIGURE OUT HOW TO FORM THE LOGIC FOR THE UPDATE EMPLOYEE ROLE FUNCTION BELOW
// Function to update employee role
// const updateRole = () => {

// };

// Calling function to start the app
startApp();