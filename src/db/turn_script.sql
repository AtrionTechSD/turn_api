DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `images`;
DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `institutes`;
DROP TABLE IF EXISTS `careers`;
DROP TABLE IF EXISTS `auths`;
DROP TABLE IF EXISTS `roles`;


CREATE TABLE `auths` (
`id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
`email` VARCHAR(100) NOT NULL UNIQUE,
`password` VARCHAR(255) NOT NULL,
`lastlogin` TIMESTAMP,
`status` INT NOT NULL DEFAULT 0,
`role_id` INT,
`session_id` TEXT,
`verified_at` TIMESTAMP,
`createdAt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
`updatedAt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
`deletedAt` TIMESTAMP);

CREATE TABLE `roles`(
`id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
`name` ENUM ('client','admin') NOT NULL DEFAULT 'client' UNIQUE
);

CREATE TABLE `users` (
`id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
`name` VARCHAR(100) NOT NULL,
`lastname` VARCHAR(100) NOT NULL,
`phone` VARCHAR(20) NOT NULL,
`address` VARCHAR(155) NOT NULL DEFAULT 'Sin dirección',
`email` VARCHAR(65) NOT NULL UNIQUE,
`auth_id` INT ,
`institute_id` INT,
`createdAt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
`updatedAt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
`career_id` INT,
`deletedAt` TIMESTAMP);

CREATE TABLE `orders` (
`id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
`title` VARCHAR(150) NOT NULL,
`description` TEXT NOT NULL ,
`due_at` TIMESTAMP NOT NULL,
`done_at` TIMESTAMP,
`price` INT NOT NULL DEFAULT 0,
`status` ENUM ('Pendiente', 'Proceso', 'Rechazado', 'Completado', 'Cancelado') NOT NULL DEFAULT  'Pendiente',
`type` ENUM ('Tarea', 'Tesis', 'Monográfico', 'Tesina', 'Proyecto', 'Otro') NOT NULL DEFAULT 'Tarea',
`client_id` INT NOT NULL,
`createdAt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
`updatedAt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
`deletedAt` TIMESTAMP);

CREATE TABLE `tasks`(
`id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
`title` VARCHAR(150) NOT NULL,
`status` TINYINT NOT NULL DEFAULT 0 ,
`due_at` TIMESTAMP NOT NULL,
`done_at` TIMESTAMP,
`order_id` INT NOT NULL,
`createdAt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
`updatedAt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
`deletedAt` TIMESTAMP);

CREATE TABLE `images` (
`id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
`url` VARCHAR(255) NOT NULL,
`caption` VARCHAR(155) NOT NULL DEFAULT 'Sin caption',
`imageableId` INT NOT NULL,
`imageableType` VARCHAR(50) NOT NULL,
`createdAt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
`updatedAt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
`deletedAt` TIMESTAMP);

CREATE TABLE `documents` (
`id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
`title` VARCHAR(75) NOT NULL,
`description` VARCHAR(255) NOT NULL DEFAULT 'Sin detalles ',
`url` VARCHAR(155) NOT NULL,
`type` ENUM ('Recurso','Entrega') NOT NULL DEFAULT 'Recurso',
`order_id` INT NOT NULL,
`createdAt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
`updatedAt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
`deletedAt` TIMESTAMP);

CREATE TABLE `institutes` (
`id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
`name` VARCHAR(75) NOT NULL UNIQUE,
`sigla` VARCHAR(10) NOT NULL,
`createdAt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
`updatedAt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
`deletedAt` TIMESTAMP);

CREATE TABLE `careers` (
`id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
`name` VARCHAR (75) NOT NULL UNIQUE,
`sigla` VARCHAR (10) NOT NULL UNIQUE,
`grade` ENUM ('Pregrado','Grado','Maestría','Doctorado','Diplomado','Otro') NOT NULL DEFAULT 'Grado',
`createdAt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
`updatedAt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
`deletedAt` TIMESTAMP);

ALTER TABLE `auths` ADD CONSTRAINT `auths_role_id_roles_id` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE;
ALTER TABLE `users` ADD CONSTRAINT `users_auth_id_auths_id` FOREIGN KEY (`auth_id`) REFERENCES `auths`(`id`) ON DELETE CASCADE;
ALTER TABLE `users` ADD CONSTRAINT `users_institute_id_institutes_id` FOREIGN KEY (`institute_id`) REFERENCES `institutes`(`id`) ON DELETE CASCADE;
ALTER TABLE `users` ADD CONSTRAINT `users_career_id_careers_id` FOREIGN KEY (`career_id`) REFERENCES `careers`(`id`) ON DELETE CASCADE;
ALTER TABLE `orders` ADD CONSTRAINT `orders_client_id_users_id` FOREIGN KEY (`client_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_order_id_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE;
ALTER TABLE `documents` ADD CONSTRAINT `documents_order_id_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE;


