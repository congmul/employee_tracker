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
            // console.log(res);
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
            }else if(res.menu === "Add Employees"){
                order = "ORDER BY manager"
                addSql();
            }else if(res.menu === "Remove Employee"){
                deleteSql();
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
            console.log();
            console.log(`id  first_name  last_name   title               department    salary      manager`);
            console.log(`--  ----------  ----------  ------------------  ------------  ----------  -------------------`);
            for(obj of res){
                
                console.log(String(obj.id).padEnd(4) + obj.first_name.padEnd(12) + obj.last_name.padEnd(12) + obj.title.padEnd(20) + obj.department.padEnd(14) + String(obj.salary).padEnd(12) + obj.manager);
                
            }
            console.log();
            menuInquirer();
        }
    );
}

function addSql(){
    inquirer
        .prompt([
            {
                type: "input",
                message : "What is the employee's first name?",
                name: "first_name"
            },
            {
                type: "input",
                message : "What is the employee's last name?",
                name: "last_name"
            },
            {
                type: "rawlist",
                message : "What is the employee's role?",
                name: "role",
                choices: ["sales Lead", "salesperson"]
            },
            {
                type: "rawlist",
                message : "Who is the employee's manager?",
                name: "managerName",
                choices: ["Jehyun Jung", "Nayeon Kang"]
            }
        ]).then((res) => {
            console.log(res);
            console.log(`Added ${res.first_name} ${res.last_name} to the database`);
            console.log();
            menuInquirer();
        })

    // connection.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name,' ',m.last_name) AS manager
    // FROM employee e
    // JOIN role r ON e.role_id = r.id
    // JOIN department d ON r.department_id = d.id
    // LEFT JOIN employee m ON e.manager_id = m.id
    // ${order};`,
    //     function(err, res) {
    //         if(err) throw err;
    //         console.log();
    //         console.log(`id  first_name  last_name   title               department    salary      manager`);
    //         console.log(`--  ----------  ----------  ------------------  ------------  ----------  -------------------`);
    //         for(obj of res){
                
    //             console.log(String(obj.id).padEnd(4) + obj.first_name.padEnd(12) + obj.last_name.padEnd(12) + obj.title.padEnd(20) + obj.department.padEnd(14) + String(obj.salary).padEnd(12) + obj.manager);
                
    //         }
    //         console.log();
    //         menuInquirer();
    //     }
    // );
}

function deleteSql(){
    connection.query(`SELECT CONCAT(first_name,' ',last_name) AS name
    FROM employee;`,
        function(err, res) {
            if(err) throw err;
            let nameArr = [];
            for(obj of res){
                nameArr.push(obj.name);
            }
            nameArr.push("CANCEL");
            inquirer
                .prompt([
                    {
                        type: "rawlist",
                        message : "Which employee do you want to remove?",
                        name: "name",
                        choices: nameArr
                    }
                ]).then((res) => {
                    if(res.name === "CANCEL"){
                        menuInquirer();
                    }else{
                        connection.query("DELETE FROM employee WHERE CONCAT(first_name,' ',last_name) = ?", [res.name]);
                        console.log("Removed employee from the database");
                        console.log();
                        menuInquirer();
                    }
                });
        }
    );
}

