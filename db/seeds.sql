INSERT INTO department (name) VALUES ('Management'), ('Coaching Staff'), ('Player');

INSERT INTO role (title, salary, department_id) VALUES
    ('General Manager', 3000000, 1),
    ('Coach', 1000000, 2),
    ('Center', 8000000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('Tom', 'Fitzgerald', 1, NULL),
    ('Lindy', 'Ruff', 2, 1),
    ('Nico', 'Hischier', 3, 2),
    ('Jack', 'Hughes', 3, 2);