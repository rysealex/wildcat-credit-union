-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema wcu_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema wcu_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `wcu_db` DEFAULT CHARACTER SET utf8 ;
USE `wcu_db` ;

-- -----------------------------------------------------
-- Table `wcu_db`.`bank_account`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wcu_db`.`bank_account` (
  `ssn` CHAR(9) NOT NULL,
  `balance` FLOAT NOT NULL,
  PRIMARY KEY (`ssn`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wcu_db`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wcu_db`.`user` (
  `fname` VARCHAR(40) NOT NULL,
  `lname` VARCHAR(40) NOT NULL,
  `email` VARCHAR(45) NOT NULL UNIQUE,
  `ssn` CHAR(9) NOT NULL,
  `password` VARCHAR(25) NOT NULL,
  `phone_number` CHAR(10) NOT NULL UNIQUE,
  `account_number` CHAR(12) NOT NULL,
  PRIMARY KEY (`ssn`),
  CONSTRAINT `user_fk_bank_account`
    FOREIGN KEY (`ssn`)
    REFERENCES `wcu_db`.`bank_account` (`ssn`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wcu_db`.`transaction_history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wcu_db`.`transaction_history` (
  `transaction_id` INT NOT NULL AUTO_INCREMENT,
  `ssn` CHAR(9) NOT NULL,
  `date` DATE NOT NULL,
  `transaction_type` ENUM('Welcome', 'Deposit', 'Withdrawal', 'Transfer', 'Receive') NOT NULL,
  `transaction_amount` FLOAT NOT NULL,
  PRIMARY KEY (`transaction_id`),
  INDEX `fk_transaction_history_bank_account_idx` (`ssn` ASC) VISIBLE,
  CONSTRAINT `transaction_history_fk_bank_account`
    FOREIGN KEY (`ssn`)
    REFERENCES `wcu_db`.`bank_account` (`ssn`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT INTO bank_account VALUES
  ('112233445', '500.00'),
    ('123456789', '500.00')
;

INSERT INTO user VALUES
  ('Franklin', 'Wong', 'franklin@gmail.com', '112233445', '123Password!', '9876543210', '123456789abc'),
    ('John', 'Smith', 'john@gmail.com', '123456789', 'Password123!', '0123456789', 'abc123456789')
;

INSERT INTO transaction_history VALUES
  (1, '112233445', '2025-05-29', 'Welcome', '500.00'),
    (2, '123456789', '2025-05-29', 'Welcome', '500.00')
;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;