const Title = require("./assets/js/appTitle");
const inquirer = require("inquirer");
const mysql = require("mysql");

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
    if(err) throw err;
    console.log("connected as id " + connection.threadId + "\n\n");

    title.titleLogo();
    menuInquirer();
});





function menuInquirer(){
    inquirer
        .prompt([
            {
                type: "list",
                message : "What woud you like to do?",
                name: "menu",
                choices: [
                    "View All Employees",
                    "View All Employees By Department",
                    "View All Employees By Manager",
                    "Add Employees",
                    "Remove Employee",
                    "Update Employee Role",
                    "Update Employee Manager"
                ]
            }
        ]).then(res => {
            console.log(res);
            viewSql();
        })
};

//////////////////////////////////////////////////////////////////////////////////////////
// SQL

function viewSql(){
    connection.query(
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary 
        FROM role r
        JOIN department d ON r.department_id =d.id
        RIGHT JOIN employee e ON r.id = e.manager_id`,
        function(err, res) {
            if(err) throw err;
            console.log(res);
        }
    );
}