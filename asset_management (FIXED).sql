select * from user;
select * from asset;
select * from authorities;
select * from request;
select * from assignment;
select * from category;
SELECT * from authorities a where a.user_id = 14;
USE asset_management;
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema asset_management
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema asset_management
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `asset_management` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `asset_management` ;

-- -----------------------------------------------------
-- Table `asset_management`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `asset_management`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `dob` DATE NULL DEFAULT NULL,
  `joined_date` DATE NULL DEFAULT NULL,
  `gender` VARCHAR(10) NULL DEFAULT NULL,
  `staff_code` CHAR(6) NULL DEFAULT NULL,
  `username` VARCHAR(50) NULL DEFAULT NULL,
  `location` VARCHAR(50) NULL DEFAULT NULL,
  `status` VARCHAR(10) NULL DEFAULT NULL,
  `password` VARCHAR(1000) NULL DEFAULT NULL,
  `default_password` VARCHAR(50) NULL DEFAULT NULL,
  `first_login` VARCHAR(5) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 23
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `asset_management`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `asset_management`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `prefix` VARCHAR(10) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `asset_management`.`asset`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `asset_management`.`asset` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `asset_code` CHAR(8) NULL DEFAULT NULL,
  `asset_name` VARCHAR(500) NULL DEFAULT NULL,
  `specification` VARCHAR(1000) NULL DEFAULT NULL,
  `installed_date` DATE NULL DEFAULT NULL,
  `state` TINYINT(1) NULL DEFAULT NULL,
  `location` VARCHAR(100) NULL DEFAULT NULL,
  `user_id` INT NULL DEFAULT NULL,
  `category_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `category_id` (`category_id` ASC) VISIBLE,
  CONSTRAINT `asset_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `asset_management`.`user` (`id`),
  CONSTRAINT `asset_ibfk_2`
    FOREIGN KEY (`category_id`)
    REFERENCES `asset_management`.`category` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 36
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `asset_management`.`assignment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `asset_management`.`assignment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `asset_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `assigned_date` DATE NULL DEFAULT NULL,
  `assigned_by` VARCHAR(50) NULL DEFAULT NULL,
  `state` TINYINT(1) NULL DEFAULT NULL,
  `note` VARCHAR(1000) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `asset_id` (`asset_id` ASC) VISIBLE,
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `assignment_ibfk_1`
    FOREIGN KEY (`asset_id`)
    REFERENCES `asset_management`.`asset` (`id`),
  CONSTRAINT `assignment_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `asset_management`.`user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 90
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `asset_management`.`authorities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `asset_management`.`authorities` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `authority` VARCHAR(5) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `authorities_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `asset_management`.`user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 22
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `asset_management`.`request`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `asset_management`.`request` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `assignment_id` INT NOT NULL,
  `accepted_by` VARCHAR(50) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT '',
  `returned_date` DATE NULL DEFAULT NULL,
  `state` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK_request_assignment` (`assignment_id` ASC) VISIBLE,
  CONSTRAINT `FK_request_assignment`
    FOREIGN KEY (`assignment_id`)
    REFERENCES `asset_management`.`assignment` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 78
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
