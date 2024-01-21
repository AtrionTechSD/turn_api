INSERT INTO `roles` (name) VALUES
('admin'), ('client');

INSERT INTO `auths` (email, password, role_id, verified_at)
VALUES
('admin@atriontechsd.com', '$2a$10$/9uukosc6ep7ZNTtxeZjUuyBCtojzm2IX08z9iYpQa9WynC9tht76', 1, '2023-12-17'),
('client1@example.com', '$2a$12$gbRmVvsE62ftM31A6YqCFOmVs1Qjl1QM.T2SYwwmZMKLM35DMbUKW
', 2, null),
('client2@example.com', 'client21234', 2, null),
('user49@example.com', 'xFvMFkc5f4', 2, '2023-12-14'),
('member35@mail.com', 'C1z1dKwtCV', 2, '2023-12-06'),
('member12@mail.com', 'eaQUA2cKEm', 2, NULL),
('user64@test.org', '4N0FkMwg7j', 2, NULL),
('contact88@test.org', 'zmP8Q1QGVn', 2, NULL),
('member17@test.org', 't5GWbPyYyV', 2, '2023-12-12'),
('contact86@test.org', '9zoJk0PZap', 2, '2023-12-27'),
('user41@example.com', 'TEqc0gOXCX', 2, '2023-12-26'),
('contact39@mail.com', '2wnIEIFGz9', 2, '2023-12-03'),
('contact95@example.com', 'x9ZjuW5Wb1', 2, '2023-12-09'),
('member79@test.org', '$2a$12$Jks6nt4B3Rv8OWUS3QibUuJMTCqj1QLpkO7ts2Jvmf5vpnQcnVs2q
', 2, NULL),
('user75@test.org', 'qLGRuTWLyQ', 2, '2023-12-20'),
('member95@test.org', 'r61c4nSYCI', 2, '2023-12-10'),
('contact21@example.com', 'GTo3CtcF7k', 2, NULL),
('member88@example.com', 'nWAUHkxMTi', 2, NULL),
('member68@test.org', 'qobsFoFYn5', 2, NULL),
('user99@example.com', '38rwuXtxLl', 2, '2023-12-24'),
('contact51@test.org', 'k9QxhWRwcC', 2, NULL),
('member52@example.com', 'QZkJpWaoMA', 2, NULL),
('contact29@mail.com', 'c01HcQPSWU', 2, '2023-12-04');

INSERT INTO `institutes` (name, sigla) VALUES
('Universidad Abierta Para Adultos', 'UAPA'),
('Universidad Dominicana O&M', 'O&M'),
('Universidad Nacional Evangélica', 'UNEV'),
('Universidad Autónoma de Santo Domingo', 'UASD'),
('Universidad Tecnológica de Santiago', 'UTESA');


INSERT INTO `careers` (name, sigla, grade) VALUES
('Licenciatura en Educación', 'EDU', 'Grado'),
('Gestión de Centros Educativos', 'GCE', 'Maestría'),
('Licenciatura en Derecho', 'DER', 'Grado'),
('Ingeniería Industrial', 'INGI', 'Grado'),
('Máster en Psicología Clínica', 'MPSIC', 'Maestría');

INSERT INTO `users` (name, lastname,email, address, phone, auth_id, institute_id, career_id) VALUES
('Admin', 'Example', 'admin@atriontechsd.com', 'Calle No. 1, Casa 23, Centro de la Ciudad', '(809) 315-3337',1, 2,1),
('Client', 'One', 'client1@example.com', 'Avenida Central, No. 14, Santiago', '(849) 441-8328',2,1,1),
('Contact', 'Eighty Six', 'client2@example.com', 'Ruta 543, Apto 8A, San Antonio', '(809) 425-3325',3,2,3),
('Member', 'Notch', 'user49@example.com', 'Avenida Carmelo, No. 721, San Juan', '(809) 870-2387',4,3,5),
('Miembro', 'Seventeen', 'member35@mail.com', 'Carretera Vieja, No. 190, Ciudad Central', '(829) 414-0258',5,1,5);

INSERT INTO `orders` (title, description, due_at, price, status, type, client_id) VALUES
("First task for testing", "Esta pretende ser una extensa descripción para la tarea de prueba", "2024-01-17", 750, "Pendiente", "Tarea", 1),
("Second task for testing", "Esta pretende ser una extensa descripción para la tarea de prueba", "2024-01-11", 200, "Proceso", "Tarea", 2),
("Third task for testing", "Esta pretende ser una extensa descripción para la tarea de prueba", "2024-01-23", 4850, "Proceso", "Tesina", 3),
("Fourth task for testing", "Esta pretende ser una extensa descripción para la tarea de prueba", "2024-02-24", 24850, "Pendiente", "Tesis", 4),
("Fifth task for testing", "Esta pretende ser una extensa descripción para la tarea de prueba", "2023-12-22", 24850, "Completado", "Monográfico", 5);