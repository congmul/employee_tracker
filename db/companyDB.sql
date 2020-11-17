DROP DATABASE IF EXISTS companyDB;

CREATE DATABASE companyDB;

USE companyDB;

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary INT NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO role(title, salary , department_id)
VALUES ('Sales Lead', '100000', 1),
       ('Salesperson', '80000', 1),
       ('Lead Engineer', '150000', 2),
       ('Software Engineer', '120000', 2),
       ('Accountant', '125000', 3),
       ('Legal Team Lead', '250000', 4),
       ('Lawyer', '190000', 4),
       ('Lead Engineer', '150000', 2);


CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO employee(first_name, last_name , role_id, manager_id)
VALUES ('John', 'Doe', 1, 1),
       ('Mike', 'Chan', 1, 2),
       ('Ashley', 'Rodriguez', 2, null),
       ('Kevin', 'Tupik', 2, 1),
       ('Malia', 'Brown', 3, null),
       ('Sarah', 'Lourd', 4, null),
       ('Tom', 'Allen', 4, 3),
       ('Christian', 'Eckenrode', 2, 4);

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO department(name)
VALUES ('Sales'),
       ('Engineering'),
       ('Finance'),
       ('Legal');