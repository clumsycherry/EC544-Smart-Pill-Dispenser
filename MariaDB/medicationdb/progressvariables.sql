-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.12-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping data for table smart medication dispenser.progressvariables: ~4 rows (approximately)
DELETE FROM `progressvariables`;
/*!40000 ALTER TABLE `progressvariables` DISABLE KEYS */;
INSERT INTO `progressvariables` (`Id`, `Variable`, `Dates`) VALUES
	(1, 'Dizziness', '{"dates": ["1/3", "1/9"]}'),
	(2, ' Nausea', '{"dates": ["1/5","1/6","1/7","1/9"]}'),
	(3, 'Sadness', '{"dates": ["1/3","1/9"]}'),
	(4, ' Anger', NULL);
/*!40000 ALTER TABLE `progressvariables` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
