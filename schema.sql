SHOW TABLES;

CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    age INT
);

INSERT INTO students (name, age) VALUES
('Devang', 22),
('Aman', 21);
