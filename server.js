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
  console.log('\nNow connected to the company database...\n')
);

// Function to start app with command line prompts
const startApp = () => {
  // Begin command line prompt to select option from main menu
  inquirer.prompt([
    {
      type: 'list',
      message: 'Please select an option from the menu below:\n',
      name: 'mainMenu',
      choices: [
        'View Departments',
        'View Roles',
        'View Employees',
        'Add New Department',
        'Add New Role',
        'Add New Employee',
        'Update Employee Role',
        'Exit'
      ]
    }
    // Conditionals routing to correct function based on user selection
  ]).then(userInput => {
    if (userInput.mainMenu === 'View Departments') {
      viewDepts();
    }
    if (userInput.mainMenu === 'View Roles') {
      viewRoles();
    }
    if (userInput.mainMenu === 'View Employees') {
      viewEmps();
    }
    if (userInput.mainMenu === 'Add New Department') {
      addDept();
    }
    if (userInput.mainMenu === 'Add New Role') {
      addRole();
    }
    if (userInput.mainMenu === 'Add New Employee') {
      addEmp();
    }
    if (userInput.mainMenu === 'Update Employee Role') {
      updateRole();
    }
    if (userInput.mainMenu === 'Exit') {
      process.exit();
    };
  });
};

// Function to view all departments
const viewDepts = () => {
  // Assigning variable to SQL syntax that returns departments view
  const deptsView = `SELECT departments.id AS "ID", departments.dept_name AS "DEPARTMENT" FROM departments ORDER BY departments.dept_name ASC`;
  // Method to check for error and display SQL query results for departments view
  connection.query(deptsView, (error, deptDisplay) => {
    if (error) throw error;
    console.log('\n• • • COMPANY DEPARTMENTS • • •\n');
    console.table(deptDisplay);
    // Calling function returning to main menu
    return startApp();
  });
};

// Function to view all roles
const viewRoles = () => {
  // Assigning variable to SQL syntax that returns roles view
  const rolesView = `SELECT roles.id AS "ID", roles.title AS "TITLE", departments.dept_name AS "DEPARTMENT", CONCAT('$', format(roles.salary,2)) AS "SALARY" FROM roles LEFT JOIN departments ON roles.dept_id = departments.id ORDER BY roles.title ASC`;
  // Method to check for error and display SQL query results for roles view
  connection.query(rolesView, (error, results) => {
    if (error) throw error;
    console.log('\n• • • COMPANY ROLES • • •\n');
    console.table(results);
    // Calling function returning to main menu
    return startApp();
  });
};

// Function to view all employees
const viewEmps = () => {
  // Assigning variable to SQL syntax that returns employees view
  const empsView = `SELECT employees.id AS "ID", CONCAT(employees.first_name, ' ', employees.last_name) AS "NAME", roles.title AS "TITLE", departments.dept_name AS "DEPARTMENT", CONCAT('$', format(roles.salary,2)) AS "SALARY", CONCAT(manager.first_name, ' ', manager.last_name) AS "MANAGER" FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.dept_id = departments.id LEFT JOIN employees manager ON employees.mgr_id = manager.id ORDER BY employees.last_name ASC`;
  // Method to check for error and display SQL query results for employees view
  connection.query(empsView, (error, results) => {
    if (error) throw error;
    console.log('\n• • • COMPANY EMPLOYEES • • •\n');
    console.table(results);
    // Calling function returning to main menu
    return startApp();
  });
};

// Function to add new department
const addDept = () => {
  // Begin command line prompt to add new department
  inquirer.prompt([
    {
      type: 'input',
      message: 'Please enter the new department name:',
      name: 'deptAdd',
      // Validation to ensure user inputs department name
      validate: deptName => {
        if (deptName) {
          return true;
        } else {
            console.log('\n⛔ Please enter a department name.\n');
            return false;
          }
      }
    }
  ]).then(userInput => {
    // Assigning variable to SQL syntax that inserts new department into table
    const sqlSyntax = `INSERT INTO departments (dept_name) VALUES (?)`;
    // Assigning array variable to access user input from prompts
    const params = userInput.deptAdd;
    // Method to check for error and execute SQL query to add new department
    connection.query(sqlSyntax, params, (error) => {
      if (error) throw error;
      console.log('\n✅ New department has been successfully added to the company database. Please see updated departments list below.');
      // Calling function to display departments
      return viewDepts();
    });
  });
};

// Function to add new role
const addRole = () => {
  // Assigning variable to SQL syntax that returns department names
  const sqlSyntax = `SELECT dept_name, id FROM departments ORDER BY dept_name ASC`;
  // Method to check for error and execute SQL query to return list of departments
  connection.query(sqlSyntax, (error, results) => {
    if (error) throw error;
    // Storing list of departments to use in prompt below
    const deptList = results.map(({dept_name, id}) => ({name: dept_name, value: id}));
    // Begin command line prompt to add new role
    inquirer.prompt([
      {
        type: 'input',
        message: 'Please enter the title for this new role:',
        name: 'roleTitleAdd',
        // Validation to ensure user inputs role title
        validate: roleTitle => {
          if (roleTitle) {
            return true;
          } else {
              console.log('\n⛔ Please enter a role title.\n');
              return false;
            }
        }
      },
      {
        type: 'input',
        message: 'Please enter the salary for this new role:',
        name: 'roleSalaryAdd',
        // Validation to ensure user inputs role salary
        validate: roleSalary => {
          if (roleSalary) {
            return true;
          } else {
              console.log('\n⛔ Please enter a role salary.\n');
              return false;
            }
        }
      },
      {
        type: 'list',
        message: 'Please select a department from the list below for this new role:\n',
        name: 'roleDeptAdd',
        // Inserting stored list of departments as choices
        choices: deptList
      }
    ]).then(userInput => {
      // Assigning variable to SQL syntax that inserts new role into table
      const sqlSyntax = `INSERT INTO roles (title, salary, dept_id) VALUES (?, ?, ?)`;
      // Assigning array variable to access user input from prompts
      const params = [userInput.roleTitleAdd, userInput.roleSalaryAdd, userInput.roleDeptAdd];
      // Method to check for error and execute SQL query to add new role
      connection.query(sqlSyntax, params, (error) => {
        if (error) throw error;
        console.log('\n✅ New role has been successfully added to the company database. Please see updated roles list below.');
        // Calling function to display roles
        return viewRoles();
      });
    });
  });
};

// Function to add new employee
const addEmp = () => {
  // Assigning variable to SQL syntax that returns role titles
  const sqlSyntax = `SELECT title, id FROM roles ORDER BY title ASC`;
  // Method to check for error and execute SQL query to return list of departments
  connection.query(sqlSyntax, (error, results) => {
    if (error) throw error;
    // Storing list of roles to use in prompt below
    const roleList = results.map(({title, id}) => ({name: title, value: id}));
    // Begin command line prompt to add new employee
    inquirer.prompt([
      {
        type: 'input',
        message: 'Please enter the new employee\'s first name:',
        name: 'empFirstNameAdd',
        // Validation to ensure user inputs first name
        validate: firstName => {
          if (firstName) {
            return true;
          } else {
              console.log('\n⛔ Please enter a first name.\n');
              return false;
            }
        }
      },
      {
        type: 'input',
        message: 'Please enter the new employee\'s last name:',
        name: 'empLastNameAdd',
        // Validation to ensure user inputs last name
        validate: lastName => {
          if (lastName) {
            return true;
          } else {
              console.log('\n⛔ Please enter a last name.\n');
              return false;
            }
        }
      },
      {
        type: 'list',
        message: 'Please select a role for the new employee from the list below:\n',
        name: 'empRoleAdd',
        // Inserting stored list of roles as choices
        choices: roleList
      }
    ]).then(userInput => {
      // Assigning array variable to access user input from prompts
      const params = [userInput.empFirstNameAdd, userInput.empLastNameAdd, userInput.empRoleAdd];
      // Assigning variable to SQL syntax that returns employee names to use for manager selection
      const sqlSyntax = `SELECT first_name, last_name, id FROM employees ORDER BY last_name ASC`;
      // Method to check for error and execute SQL query to return list of employees
      connection.query(sqlSyntax, (error, results) => {
        if (error) throw error;
        // Storing list of managers to use in prompt below
        const mgrList = results.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
        // Continue command line prompt to add new employee
        inquirer.prompt([
          {
            type: 'list',
            message: 'Please select a manager for the new employee from the list below:\n',
            name: 'empMgrAdd',
            // Inserting stored list of managers as choices
            choices: mgrList
          }
        ]).then(userInput => {
          // Adding user input from prompt above for manager to previously assigned array variable
          params.push(userInput.empMgrAdd);
          // Assigning variable to SQL syntax that inserts new employee into table
          const sqlSyntax = `INSERT INTO employees (first_name, last_name, role_id, mgr_id) VALUES (?, ?, ?, ?)`;
          // Method to check for error and execute SQL query to add new employee
          connection.query(sqlSyntax, params, (error) => {
            if (error) throw error;
            console.log('\n✅ New employee has been successfully added to the company database. Please see updated employees list below.');
            // Calling function to display employees
            return viewEmps();
          });
        });
      });
    });
  });
};

// Function to update employee role
const updateRole = () => {
  // Assigning variable to SQL syntax that returns employee names
  const sqlSyntax = `SELECT first_name, last_name, id FROM employees ORDER BY last_name ASC`;
  // Method to check for error and execute SQL query to return list of employees
  connection.query(sqlSyntax, (error, results) => {
    if (error) throw error;
    // Storing list of employees to use in prompt below
    const empList = results.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
    // Begin command line prompt to update employee role
    inquirer.prompt([
      {
        type: 'list',
        message: 'Please select an employee from the list below to update their role:\n',
        name: 'empSelect',
        // Inserting stored list of employees as choices
        choices: empList
      }
    ]).then(userInput => {
      // Assigning array variable to access user input from prompts
      const params = [userInput.empSelect];
      // Assigning variable to SQL syntax that returns role titles
      const sqlSyntax = `SELECT title, id FROM roles ORDER BY title ASC`;
      // Method to check for error and execute SQL query to return list of roles
      connection.query(sqlSyntax, (error, results) => {
        if (error) throw error;
        // Storing list of roles to use in prompt below
        const roleList = results.map(({title, id}) => ({name: title, value: id}));
        // Continue command line prompt to update employee role
        inquirer.prompt([
          {
            type: 'list',
            message: 'Please select a new role for the employee from the list below:\n',
            name: 'roleSelect',
            // Inserting stored list of roles as choices
            choices: roleList
          }
        ]).then(userInput => {
          // Adding user input from prompt above for role to previously assigned array variable
          params.unshift(userInput.roleSelect);
          // Assigning variable to SQL syntax that updates employee role into table
          const sqlSyntax = `UPDATE employees SET role_id = ? WHERE id = ?`;
          // Method to check for error and execute SQL query to update employee role
          connection.query(sqlSyntax, params, (error) => {
            if (error) throw error;
            console.log('\n✅ Employee role has been successfully updated in the company database. Please see updated employees list below.');
            // Calling function to display employees
            return viewEmps();
          });
        });
      });
    });
  });
};

// Calling function to start the app
startApp();