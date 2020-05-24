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

-- Dumping data for table smart medication dispenser.medicationtable: ~3 rows (approximately)
DELETE FROM `medicationtable`;
/*!40000 ALTER TABLE `medicationtable` DISABLE KEYS */;
INSERT INTO `medicationtable` (`Index`, `Patient Id`, `Name`, `Indication`, `Dosage_mg`, `Doses`, `Frequency`, `Remaining Doses`, `Restrictions`, `Progress Variables`) VALUES
	(1, 00023, 'Tylenol', 'Headache', 00250, 02, 'bd', 00010, '{"IDs": [1,4]}', '{"IDs": [2,4]}'),
	(2, 00023, 'Mircette', 'Weight', 00050, 01, 'od', 00045, '{"IDs": [3]}', '{"IDs": [1,2,3]}'),
	(3, 00023, 'Seratonin', 'Depression', 00075, 02, 'tds', 00045, '{"IDs": [1,5]}', '{"IDs": [3]}');
/*!40000 ALTER TABLE `medicationtable` ENABLE KEYS */;

-- Dumping data for table smart medication dispenser.patients: ~1 rows (approximately)
DELETE FROM `patients`;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` (`Id`, `Name`) VALUES
	(23, 'John Snow'),
	(24, 'Bellatrix Lestrange');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;

-- Dumping data for table smart medication dispenser.progressvariables: ~4 rows (approximately)
DELETE FROM `progressvariables`;
/*!40000 ALTER TABLE `progressvariables` DISABLE KEYS */;
INSERT INTO `progressvariables` (`Id`, `Variable`, `Dates`) VALUES
	(1, 'Dizziness', '{"dates": ["1/3", "1/9"]}'),
	(2, ' Nausea', '{"dates": ["1/5","1/6","1/7","1/9"]}'),
	(3, 'Sadness', '{"dates": ["1/3","1/9"]}'),
	(4, ' Anger', NULL);
/*!40000 ALTER TABLE `progressvariables` ENABLE KEYS */;

-- Dumping data for table smart medication dispenser.restrictions: ~5 rows (approximately)
DELETE FROM `restrictions`;
/*!40000 ALTER TABLE `restrictions` DISABLE KEYS */;
INSERT INTO `restrictions` (`Id`, `Restriction`) VALUES
	(1, 'Take with food'),
	(2, 'Take before food'),
	(3, 'Take after food'),
	(4, 'Avoid alcohol'),
	(5, 'Avoid fiber');
/*!40000 ALTER TABLE `restrictions` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
