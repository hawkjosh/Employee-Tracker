INSERT INTO departments (dept_name)
VALUES ('Production'),
       ('Marketing'),
       ('Accounting'),
       ('Maintenance'),
       ('Human Resources');

INSERT INTO roles (title, salary, dept_id)
VALUES ('Production Supervisor', 121998, 1),
       ('Marketing Supervisor', 154001, 2),
       ('Accounting Supervisor', 148800, 3),
       ('Maintenance Supervisor', 115918, 4),
       ('Human Resources Supervisor', 119792, 5),
       ('Production Assistant', 84527, 1),
       ('Marketing Assistant', 96083, 2),
       ('Accounting Assistant', 117576, 3),
       ('Maintenance Assistant', 64572, 4),
       ('Human Resources Assistant', 81625, 5);

INSERT INTO employees (first_name, last_name, role_id, mgr_id)
VALUES ('Michael', 'Jordan', 1, NULL),
       ('Candace', 'Parker', 2, NULL),
       ('Michael', 'Phelps', 3, NULL),
       ('Abby', 'Wambach', 4, NULL),
       ('Peyton', 'Manning', 5, NULL),
       ('Ronda', 'Rousey', 6, 1),
       ('Bo', 'Jackson', 7, 2),
       ('Misty', 'May-Treanor', 8, 3),
       ('Kareem', 'Abdul-Jabbar', 9, 4),
       ('Natalie', 'Gulbis', 10, 5),
       ('Joe', 'Montana', 6, 1),
       ('Monica', 'Seles', 7, 2),
       ('Ty', 'Cobb', 8, 3),
       ('Mia', 'Hamm', 9, 4),
       ('Tony', 'Hawk', 10, 5),
       ('Anna', 'Kournikova', 6, 1),
       ('Babe', 'Ruth', 7, 2),
       ('Serena', 'Williams', 8, 3),
       ('Wayne', 'Gretzky', 9, 4),
       ('Shawn', 'Johnson', 10, 5);