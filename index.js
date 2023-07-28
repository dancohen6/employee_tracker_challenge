const inquirer = require("inquirer");
const mysql2 = require("mysql2");
const Table = require("cli-table3");
const connection = mysql2.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "employee_db",
});

function showMainMenu() {
  return inquirer
    .prompt({
      message: "How would you like to proceed?",
      type: "list",
      name: "main",
      choices: ["View all departments", "View all roles", "View all employees", 'Add department', 'Add role', 'Add employee', 'Update employee role'],
    })
    .then((answer) => {
      if (answer.main === "View all employees") {
        const sql = `SELECT
        employee.id AS id,
        employee.first_name,
        employee.last_name,
        role.title,
        role.salary,
        department.name AS department,
        CONCAT(managers.first_name, " ", managers.last_name) AS manager
        from employee
         JOIN role
         ON role.id  = employee.role_id
         JOIN department 
         ON department.id = role.department_id
         LEFT JOIN employee managers
         ON employee.manager_id = managers.id`;
        connection.query(sql, (err, data) => {
          const table = new Table({
            head: [
              "ID",
              "First Name",
              "Last Name",
              "Title",
              "Salary",
              "Department",
              "Manager",
            ],
            colWidths: [15, 15, 15, 15, 15, 15],
            wordWrap: true,
          });

          data.forEach((row) => {
            table.push([
              row.id,
              row.first_name,
              row.last_name,
              row.title,
              row.salary,
              row.department,
              row.manager,
            ]);
          });

          console.log(table.toString());

          showMainMenu();
        });
      }
      if (answer.main === "View all departments") {
        const sql = "SELECT * FROM department";
        connection.query(sql, (err, data) => {
          const table = new Table({
            head: ["ID", "Department"],
            colWidths: [15, 15],
            wordWrap: true,
          });

          data.forEach((row) => {
            table.push([row.id, row.name]);
          });

          console.log(table.toString());

          showMainMenu();
        });
      }
      if (answer.main === "View all roles") {
        const sql = `
        SELECT
        role.id,
        role.title,
        role.salary,
        department.name AS department
        FROM role
        JOIN department
        ON department.id = role.department_id`;
        connection.query(sql, (err, data) => {
        
          const table = new Table({
            head: ["ID", "Title", "Salary", "Department"],
            colWidths: [15, 15],
            wordWrap: true,
          });

          data.forEach((row) => {
            table.push([row.id, row.title, row.salary, row.department]);
          });

          console.log(table.toString());

          showMainMenu();
        });
      }
      if (answer.main === 'Add department') {
        inquirer.prompt([
            {
                message: 'Enter new department name',
                name: 'department_name',

            }
        ]).then(answer => {
            const sql = `INSERT INTO department (name) VALUES (?)`
            connection.query(sql, [answer.department_name], (err, data) => {
                if (err) throw err;
                console.log('Department added successfully!');
                showMainMenu()
            })
        })
      }
      if (answer.main === 'Add role') {
        inquirer.prompt([
            {
                message: 'Enter the title of the new role',
                name: 'role_name',
            },
            {
                message: 'Enter salary',
                name: 'salary',
            },
            {
                message: 'Enter Department ID',
                name: 'department_id'
            }
        ]).then(answer => {
            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`
            connection.query(sql, [answer.role_name, answer.salary, answer.department_id], (err, data) => {
                if (err) throw err;
                console.log('Role added successfully!');
                showMainMenu()
            })
        })
      }
      if (answer.main === 'Add an employee') {
        inquirer.prompt([
            {
                message: 'Enter first name',
                name: 'first_name',
            },
            {
                message: 'Enter last name',
                name: 'last_name',
            },
            {
                message: 'Enter role ID',
                name: 'role_id'
            },
            {
                message: 'Enter manager ID',
                name: 'manager_id'
            }
        ]).then(answer => {
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`
            connection.query(sql, [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], (err, data) => {
                if (err) throw err;
                console.log('Employee added successfully!');
                showMainMenu()
            })
        })
      }
      if (answer.main === 'Update employee role') {
        inquirer.prompt([
            {
                message: 'Enter the employee ID you would ike to update',
                name: 'employee_id',
            },
            {
                message: 'Enter new role ID',
                name: 'role_id'
            }
        ]).then(answer => {
            const sql = `
                UPDATE employee
                SET role_id = (?)
                WHERE employee.id = (?)
            `
            connection.query(sql, [answer.role_id, answer.employee_id], (err, data) => {
                if (err) throw err;
                console.log('Employee updated successfully!');
                showMainMenu()
            })
        })
      }
    });
}

showMainMenu();