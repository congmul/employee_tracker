const Title = require("./assets/js/appTitle");
const inquirer = require("inquirer");
const mysql = require("mysql");
// require("console.table");

let title = new Title();

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "jung5424",
    database: "companyDB"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n\n");

    title.titleLogo();
    menuInquirer();
});



function menuInquirer() {
    let order = "";
    inquirer
        .prompt([
            {
                type: "rawlist",
                message: "What woud you like to do?",
                name: "menu",
                choices: [
                    "View All Employees",
                    "View All Employees By Department",
                    "View All Employees By Manager",
                    "Add Employees",
                    "Remove Employee",
                    "Update Employee Role",
                    "Update Employee Manager",
                    "View All Roles",
                    "Add Role",
                    "Remove Role",
                    "View All Departments",
                    "Add Departments",
                    "Remove Departments",
                    "EXIT"
                ]
            }
        ]).then(res => {
            // console.log(res);
            if (res.menu === "EXIT") {
                console.log("Close App...");
                connection.end();
                return;
            } else if (res.menu === "View All Employees") {
                order = "ORDER BY id"
                viewSql(order);
            } else if (res.menu === "View All Employees By Department") {
                order = "ORDER BY department"
                viewSql(order);
            } else if (res.menu === "View All Employees By Manager") {
                order = "ORDER BY manager"
                viewSql(order);
            } else if (res.menu === "Add Employees") {
                addSql();
            } else if (res.menu === "Update Employee Manager") {
                updateSql();
            } else if (res.menu === "Remove Employee") {
                deleteSql();
            } else if (res.menu === "Update Employee Role") {
                
            } else if (res.menu === "View All Roles") {
                
            } else if (res.menu === "Add Role") {
                
            } else if (res.menu === "Remove Role") {
                
            } else if (res.menu === "View All Departments") {
                
            } else if (res.menu === "Add Departments") {
                
            } else if (res.menu === "Remove Departments") {
                
            }

        })
};

//////////////////////////////////////////////////////////////////////////////////////////
// SQL
function viewSql(order) {
    connection.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name,' ',m.last_name) AS manager
    FROM employee e
    JOIN role r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
    ${order};`,
        function (err, res) {
            if (err) throw err;
            console.log();
            console.log(`id  first_name  last_name   title               department    salary      manager`);
            console.log(`--  ----------  ----------  ------------------  ------------  ----------  -------------------`);
            for (obj of res) {

                console.log(String(obj.id).padEnd(4) + obj.first_name.padEnd(12) + obj.last_name.padEnd(12) + obj.title.padEnd(20) + obj.department.padEnd(14) + String(obj.salary).padEnd(12) + obj.manager);

            }
            console.log();
            menuInquirer();
        }
    );
}

function addSql() {
    connection.query(`SELECT e.id AS employeeID, r.id AS roleID, CONCAT(first_name,' ',last_name) AS name, r.title 
    FROM employee e JOIN role r ON e.role_id = r.id;`,
        function (err, res) {
            if (err) throw err;
            console.log(res);
            let resultObj = res;
            let nameArr = [];
            let roleArr = [];
            nameArr.push("None");
            for (obj of res) {
                nameArr.push(obj.name);
                roleArr.push(obj.title);
            }
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What is the employee's first name?",
                        name: "first_name"
                    },
                    {
                        type: "input",
                        message: "What is the employee's last name?",
                        name: "last_name"
                    },
                    {
                        type: "rawlist",
                        message: "What is the employee's role?",
                        name: "role",
                        choices: roleArr
                    },
                    {
                        type: "rawlist",
                        message: "Who is the employee's manager?",
                        name: "managerName",
                        choices: nameArr
                    }
                ]).then((res) => {
                    console.log(resultObj);
                    let roleID = 0;
                    let managerID = 0;
                    // let inputName = res.first_name + " " + res.last_name;
                    for (obj of resultObj){
                        if(obj.title === res.role){
                            roleID = obj.roleID;
                        }
                        if(obj.name === res.managerName){
                            managerID = obj.employeeID;
                        }
                    }
                    if(managerID === 0){
                        managerID = null;
                    }
                    console.log(`Added ${res.first_name} ${res.last_name} role_Id: ${roleID} / Manager_Id ${managerID}`);
                    console.log(`Added ${res.first_name} ${res.last_name} to the database`);
                    connection.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("${res.first_name}", "${res.last_name}", ${roleID}, ${managerID});`);
                    console.log();

                    menuInquirer();
                })
        }
    )
}

function updateSql() {
    connection.query(`SELECT id, CONCAT(first_name,' ',last_name) AS name FROM employee`,
        function(err, res){
            if (err) throw err;
            console.log(res);
        })
}

function deleteSql() {
    connection.query(`SELECT CONCAT(first_name,' ',last_name) AS name
    FROM employee;`,
        function (err, res) {
            if (err) throw err;
            let nameArr = [];
            for (obj of res) {
                nameArr.push(obj.name);
            }
            nameArr.push("CANCEL");
            inquirer
                .prompt([
                    {
                        type: "rawlist",
                        message: "Which employee do you want to remove?",
                        name: "name",
                        choices: nameArr
                    }
                ]).then((res) => {
                    if (res.name === "CANCEL") {
                        menuInquirer();
                    } else {
                        connection.query("DELETE FROM employee WHERE CONCAT(first_name,' ',last_name) = ?", [res.name]);
                        console.log("Removed employee from the database");
                        console.log();
                        menuInquirer();
                    }
                });
        }
    );
}

