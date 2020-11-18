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
    let order = "";
    inquirer
        .prompt([
            {
                type: "rawlist",
                message : "What woud you like to do?",
                name: "menu",
                choices: [
                    "View All Employees",
                    "View All Employees By Department",
                    "View All Employees By Manager",
                    "Add Employees",
                    "Remove Employee",
                    "Update Employee Role",
                    "Update Employee Manager",
                    "EXIT"
                ]
            }
        ]).then(res => {
            console.log(res);
            if(res.menu === "EXIT"){
                console.log("Close App...");
                connection.end();
                return;
            }else if(res.menu === "View All Employees"){
                order = "ORDER BY id"
                viewSql(order);
            }else if(res.menu === "View All Employees By Department"){
                order = "ORDER BY department"
                viewSql(order);
            }else if(res.menu === "View All Employees By Manager"){
                order = "ORDER BY manager"
                viewSql(order);
            }
            
        })
};

//////////////////////////////////////////////////////////////////////////////////////////
// SQL
function viewSql(order){
    connection.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name,' ',m.last_name) AS manager
    FROM employee e
    JOIN role r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
    ${order};`,
        function(err, res) {
            if(err) throw err;
            console.log(res);
            menuInquirer();
        }
    );
}