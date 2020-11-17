const Title = require("./assets/js/appTitle");
const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({

});

let title = new Title();

title.titleLogo();

menuInquirer();

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
        })
}