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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
