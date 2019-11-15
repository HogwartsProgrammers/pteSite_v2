const bcrypt = require('bcryptjs')
const db = require('./database')

// Таблица Lids
db.execute('CREATE TABLE IF NOT EXISTS `lids` (`id` INT(11) NOT NULL AUTO_INCREMENT,`phone` CHAR(10) NULL DEFAULT NULL,`title` VARCHAR(120) NULL DEFAULT "",`req_data` TEXT NULL,`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,`state` TINYINT(3) UNSIGNED NOT NULL DEFAULT "0",`lid_data` JSON NULL DEFAULT NULL,`manager_id` INT(11) NOT NULL DEFAULT "0",`step_id` INT(11) NOT NULL DEFAULT "0",`tunnel_id` INT(11) NOT NULL DEFAULT "0",`stage` TINYINT(3) UNSIGNED NOT NULL DEFAULT "0",`gi` DOUBLE NOT NULL DEFAULT "0" COMMENT "Главноя цена",`cgi` DOUBLE NOT NULL DEFAULT "0" COMMENT "Маржа",`prepayment` DOUBLE NOT NULL DEFAULT "0",`restpayment` DOUBLE NOT NULL DEFAULT "0",`holder` INT(10) UNSIGNED NULL DEFAULT NULL,`sub_holders` TEXT NULL,`responsible` INT(10) UNSIGNED NULL DEFAULT NULL,`active` INT(11) NULL DEFAULT NULL,PRIMARY KEY (`id`))COLLATE="utf8_general_ci" ENGINE=InnoDB AUTO_INCREMENT=31;')

// Таблица Users
db.execute('CREATE TABLE IF NOT EXISTS `users` (`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,`login` VARCHAR(80) NOT NULL COLLATE "utf8_general_ci", `password` VARCHAR(120) NOT NULL,`fio` VARCHAR(120) NOT NULL,`role` TINYINT(3) UNSIGNED NOT NULL,`org_id` INT(10) UNSIGNED NOT NULL DEFAULT "0",`active` TINYINT(3) UNSIGNED NOT NULL DEFAULT "0",`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,`posts` VARCHAR(250) NOT NULL DEFAULT "",	PRIMARY KEY (`id`),UNIQUE INDEX `login` (`login`),INDEX `org_id` (`org_id`))COLLATE="utf8_general_ci"ENGINE=InnoDB AUTO_INCREMENT=6;')

// Таблица Pipes
db.execute('CREATE TABLE IF NOT EXISTS `pipes` (`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,`parrent_id` INT(11) NOT NULL DEFAULT "0",`title` VARCHAR(120) NOT NULL DEFAULT "",`kanban` JSON NULL DEFAULT NULL,`active` TINYINT(4) NOT NULL DEFAULT "1",PRIMARY KEY (`id`),INDEX `parrent_id` (`parrent_id`))COLLATE=`utf8_general_ci` ENGINE=InnoDB AUTO_INCREMENT=7;')

// Таблица Steps
db.execute('CREATE TABLE IF NOT EXISTS `steps` (`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,`pipe_id` INT(11) NOT NULL DEFAULT "0",`parents` LONGTEXT NULL,`title` VARCHAR(120) NOT NULL DEFAULT "",`active` TINYINT(4) NOT NULL DEFAULT "1",`vis_data` JSON NULL DEFAULT NULL,PRIMARY KEY (`id`),INDEX `pipe_id` (`pipe_id`))COLLATE=`utf8_general_ci` ENGINE= InnoDB AUTO_INCREMENT=9;')

// Таблица Chanels
db.execute('CREATE TABLE IF NOT EXISTS `chanels` (`id` INT(11) NOT NULL AUTO_INCREMENT,`title` VARCHAR(120) NULL DEFAULT NULL,`step` INT(11) NULL DEFAULT NULL,`active` TINYINT(4) NULL DEFAULT "1",`abbr` VARCHAR(120) NULL DEFAULT NULL,PRIMARY KEY (`id`))COLLATE="utf8_general_ci" ENGINE=InnoDB;')

// Таблица calls
db.execute('CREATE TABLE IF NOT EXISTS `calls` (`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,`type` ENUM("in","out","missed") NULL DEFAULT NULL COMMENT "in или out или missed",`diversion` VARCHAR(10) NULL DEFAULT NULL,`user` VARCHAR(80) NULL DEFAULT NULL,`ext` CHAR(3) NULL DEFAULT NULL,`groupRealName` VARCHAR(80) NULL DEFAULT NULL,`phone` CHAR(10) NULL DEFAULT NULL,`start` CHAR(16) NULL DEFAULT NULL,`duration` SMALLINT(5) UNSIGNED NULL DEFAULT NULL,`callid` CHAR(36) NULL DEFAULT NULL,`link` VARCHAR(255) NULL DEFAULT NULL,`status` ENUM("Success","missed","Busy","NotAvailable","NotAllowed") NULL DEFAULT "Success",`callData` TEXT NULL,`created` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY (`id`), INDEX `callid` (`callid`),INDEX `phone` (`phone`),INDEX `type` (`type`))COLLATE="latin1_swedish_ci"ENGINE=InnoDB AUTO_INCREMENT=4;')

// Таблица contacts
db.execute('CREATE TABLE IF NOT EXISTS `contacts` (`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,`title` VARCHAR(50) NULL DEFAULT NULL,`type` SET("person","company") NULL DEFAULT NULL,`parent` INT(10) UNSIGNED NULL DEFAULT NULL,`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY (`id`))COLLATE="utf8_general_ci"ENGINE=InnoDB;')

// Таблица phones
db.execute('CREATE TABLE IF NOT EXISTS `phones` (`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,`phone` VARCHAR(10) NULL DEFAULT NULL,`parent` INT(10) UNSIGNED NULL DEFAULT NULL,PRIMARY KEY (`id`))COLLATE="utf8_general_ci"ENGINE=InnoDB;')

// Таблица privilages
db.execute('CREATE TABLE IF NOT EXISTS `privilages` (`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,`title` VARCHAR(50) NULL DEFAULT NULL,`parent` INT(10) UNSIGNED NULL DEFAULT NULL,`privilage_data` JSON NULL DEFAULT NULL,PRIMARY KEY (`id`),INDEX `parent` (`parent`))COLLATE="utf8_general_ci"ENGINE=InnoDB;')

// Таблица email
db.execute('CREATE TABLE IF NOT EXISTS `email` (`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,`email` TINYTEXT NULL,`parent` INT(10) UNSIGNED NULL DEFAULT NULL,PRIMARY KEY (`id`))ENGINE=InnoDB;')

// Таблица Posts
db.execute('CREATE TABLE IF NOT EXISTS `posts` (`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,`parent` INT(10) UNSIGNED NULL DEFAULT NULL,`title` VARCHAR(120) NULL DEFAULT NULL,`active` TINYINT(1) UNSIGNED NULL DEFAULT "1",`users` VARCHAR(250) NOT NULL DEFAULT "",PRIMARY KEY (`id`),INDEX `parent` (`parent`))COLLATE="utf8_general_ci"ENGINE=InnoDB AUTO_INCREMENT=28;')

CREATE TABLE `stats` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(120) NULL DEFAULT NULL,
	`description` TEXT NULL,
	`reverted` TINYINT(2) UNSIGNED NOT NULL DEFAULT '0',
	`active` TINYINT(2) UNSIGNED NULL DEFAULT '1',
	PRIMARY KEY (`id`),
	INDEX `reverted` (`reverted`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=2
;


console.log('All missing tables have been created!')

db.execute('SELECT * FROM users').then(data => {
    const jsonData = JSON.stringify({lids:"full",main:"full",pipes:"full",tasks:"full",chanels:"full",privilage:"full"})

    if (data[0].length == 0) {
        Promise.all([
            db.execute(`INSERT INTO privilages (title, parent, privilage_data) VALUES ("Администратор", 0, '${jsonData}')`),
            bcrypt.hash('pteAdmin', 12),
        ])
        .then(data => {
            db.execute('INSERT INTO users (login, password, fio, role) VALUES ("admin@pteadmin.ru", "'+data[1]+'", "Администратор", '+data[0][0].insertId+')')
        })
    }
})