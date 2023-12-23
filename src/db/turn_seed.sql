INSERT INTO `roles` (name) VALUES
('admin'), ('client');

INSERT INTO `auths` (email, password, role_id, verified_at)
VALUES
('admin@example.com', 'admin1234', 1, '2023-12-17'),
('client1@example.com', 'client11234', 1, null),
('client2@example.com', 'client21234', 1, null),
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
('member79@test.org', 'INvojDiLaT', 2, NULL),
('user75@test.org', 'qLGRuTWLyQ', 2, '2023-12-20'),
('member95@test.org', 'r61c4nSYCI', 2, '2023-12-10'),
('contact21@example.com', 'GTo3CtcF7k', 2, NULL),
('member88@example.com', 'nWAUHkxMTi', 2, NULL),
('member68@test.org', 'qobsFoFYn5', 2, NULL),
('user99@example.com', '38rwuXtxLl', 2, '2023-12-24'),
('contact51@test.org', 'k9QxhWRwcC', 2, NULL),
('member52@example.com', 'QZkJpWaoMA', 2, NULL),
('contact29@mail.com', 'c01HcQPSWU', 2, '2023-12-04');


