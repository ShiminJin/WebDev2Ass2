-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: charityevents_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb3_bin NOT NULL,
  `description` text COLLATE utf8mb3_bin,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Marathon Run','Long-distance running events for charity causes','2025-10-04 10:49:45'),(2,'Gala Evening','Formal dinners and social gatherings for fundraising','2025-10-04 10:49:45'),(3,'Art Auction','Bidding events featuring artwork and collectibles','2025-10-04 10:49:45'),(4,'Music Festival','Live music performances and concerts','2025-10-04 10:49:45'),(5,'Workshop Series','Educational and skill-building sessions','2025-10-04 10:49:45'),(6,'Community Fair','Local community gatherings with activities and stalls','2025-10-04 10:49:45'),(7,'Adventure Challenge','Outdoor and adventure-based fundraising events','2025-10-04 10:49:45'),(8,'Virtual Event','Online-based charity activities and campaigns','2025-10-04 10:49:45');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb3_bin NOT NULL,
  `description` text COLLATE utf8mb3_bin NOT NULL,
  `short_description` text COLLATE utf8mb3_bin,
  `event_date` datetime NOT NULL,
  `location` varchar(255) COLLATE utf8mb3_bin NOT NULL,
  `venue_name` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `category_id` int NOT NULL,
  `organization_id` int NOT NULL,
  `ticket_price` decimal(10,2) DEFAULT NULL,
  `fundraising_goal` decimal(15,2) DEFAULT NULL,
  `current_amount` decimal(15,2) DEFAULT '0.00',
  `max_attendees` int DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8mb3_bin DEFAULT '/images/events/default-event.jpg',
  `is_active` tinyint(1) DEFAULT '1',
  `is_suspended` tinyint(1) DEFAULT '0',
  `registration_deadline` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `organization_id` (`organization_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Celestial Marathon 2025','A breathtaking 10K run through scenic coastal routes at sunrise, raising funds for youth arts education. Participants will enjoy stunning ocean views and conclude with a community breakfast.','Sunrise 10K coastal run for youth arts','2025-09-15 06:00:00','Sydney, NSW','Coastal Reserve Park',1,1,35.00,75000.00,18500.00,1200,'/images/events/celestial-marathon.jpg',1,0,NULL,'2025-10-04 10:49:45','2025-10-04 10:49:45'),(2,'Aurora Gala Night','An elegant black-tie evening featuring gourmet dining, live jazz ensemble, and exclusive silent auction with unique art pieces and experiences.','Exclusive black-tie charity dinner','2025-10-22 19:00:00','Melbourne, VIC','Crystal Grand Ballroom',2,2,200.00,120000.00,45000.00,400,'/images/events/aurora-gala.jpg',1,0,NULL,'2025-10-04 10:49:45','2025-10-04 10:49:45'),(3,'Nexus Art Spectacular','Premier art auction showcasing emerging digital artists, with virtual reality installations and interactive exhibits. All proceeds support technology education programs.','Digital art auction with VR experiences','2025-11-08 17:30:00','Brisbane, QLD','Modern Art Pavilion',3,4,50.00,60000.00,12500.00,300,'/images/events/nexus-art.jpg',1,0,NULL,'2025-10-04 10:49:45','2025-10-04 10:49:45'),(4,'Harmony Music Fest','Two-day outdoor music festival featuring indie bands, food trucks, and sustainability workshops. Family-friendly environment with dedicated kids zone.','Weekend music festival for sustainability','2025-12-05 12:00:00','Perth, WA','Riverside Gardens',4,2,65.00,90000.00,22000.00,1500,'/images/events/harmony-fest.jpg',1,0,NULL,'2025-10-04 10:49:45','2025-10-04 10:49:45'),(5,'Future Skills Workshop','Hands-on workshops covering coding, robotics, and renewable energy technologies for students and young professionals in regional areas.','Tech education workshop series','2025-08-25 09:00:00','Adelaide, SA','Innovation Hub Center',5,4,0.00,25000.00,8000.00,80,'/images/events/future-skills.jpg',1,0,NULL,'2025-10-04 10:49:45','2025-10-04 10:49:45'),(6,'Community Harvest Fair','Traditional country fair with artisan markets, farm-to-table food experiences, and family entertainment supporting local agriculture initiatives.','Agricultural community celebration','2025-09-30 10:00:00','Canberra, ACT','Heritage Fairgrounds',6,1,10.00,35000.00,9500.00,NULL,'/images/events/harvest-fair.jpg',1,0,NULL,'2025-10-04 10:49:45','2025-10-04 10:49:45'),(7,'Wilderness Trek Challenge','Three-day guided hiking adventure through national parks, combining outdoor exploration with environmental education and conservation efforts.','Adventure hiking for conservation','2025-10-18 07:00:00','Hobart, TAS','Mountain Trail Base',7,3,150.00,80000.00,28000.00,60,'/images/events/wilderness-trek.jpg',1,0,NULL,'2025-10-04 10:49:45','2025-10-04 10:49:45'),(8,'Winter Solstice Run 2024','Annual winter marathon that attracted over 800 participants last year, successfully funding multiple community art projects.','2024 winter charity marathon','2024-06-21 08:00:00','Sydney, NSW','Winter Park Stadium',1,1,30.00,60000.00,72000.00,800,'/images/events/solstice-run.jpg',1,0,NULL,'2025-10-04 10:49:45','2025-10-04 10:49:45'),(9,'Starlight Gala 2024','Last year\'s spectacular gala dinner that exceeded fundraising targets and launched three new youth mentorship programs.','2024 annual charity gala','2024-11-15 18:30:00','Melbourne, VIC','Grand Heritage Hotel',2,1,180.00,100000.00,135000.00,350,'/images/events/starlight-gala.jpg',1,0,NULL,'2025-10-04 10:49:45','2025-10-04 10:49:45');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb3_bin NOT NULL,
  `description` text COLLATE utf8mb3_bin,
  `contact_email` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `contact_phone` varchar(50) COLLATE utf8mb3_bin DEFAULT NULL,
  `address` text COLLATE utf8mb3_bin,
  `website_url` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `logo_url` varchar(255) COLLATE utf8mb3_bin DEFAULT '/images/logos/default-org-logo.png',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` VALUES (1,'Starlight Foundation','Dedicated to supporting creative arts programs for underprivileged youth in urban communities','info@starlightfound.org','+61 2 8765 4321','88 Creative Lane, Sydney NSW 2000','https://starlightfound.org','/images/logos/starlight-logo.png','2025-10-04 10:49:45'),(2,'Veridian Guardians','Focused on environmental conservation and sustainable community development initiatives','contact@veridianguardians.org','+61 3 7654 3210','45 Green Valley Road, Melbourne VIC 3000','https://veridianguardians.org','/images/logos/veridian-logo.jpg','2025-10-04 10:49:45'),(3,'Aether Rescue Alliance','Committed to animal welfare and providing sanctuary for abandoned and injured wildlife','support@aetherrescue.org','+61 7 6543 2109','12 Wildlife Sanctuary Drive, Brisbane QLD 4000','https://aetherrescue.org','/images/logos/aether-logo.png','2025-10-04 10:49:45'),(4,'Quantum Hope Initiative','Working to advance scientific education and technology access in rural communities','hello@quantumhope.org','+61 8 5432 1098','67 Innovation Boulevard, Perth WA 6000','https://quantumhope.org','/images/logos/quantum-logo.jpg','2025-10-04 10:49:45');
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-04 19:18:52
