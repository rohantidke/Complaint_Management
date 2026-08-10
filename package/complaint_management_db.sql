-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: complaint_management_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `complaint_feedback`
--

DROP TABLE IF EXISTS `complaint_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaint_feedback` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `complaint_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `rating` int NOT NULL,
  `comment` varchar(1000) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_feedback_complaint` (`complaint_id`),
  KEY `fk_feedback_user` (`user_id`),
  CONSTRAINT `fk_feedback_complaint` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`id`),
  CONSTRAINT `fk_feedback_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `chk_feedback_rating` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaint_feedback`
--

LOCK TABLES `complaint_feedback` WRITE;
/*!40000 ALTER TABLE `complaint_feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `complaint_feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaint_history`
--

DROP TABLE IF EXISTS `complaint_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaint_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment` varchar(2000) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `new_status` enum('ASSIGNED','CLOSED','ESCALATED','IN_PROGRESS','REJECTED','REOPENED','RESOLVED','SUBMITTED','UNDER_REVIEW') NOT NULL,
  `old_status` enum('ASSIGNED','CLOSED','ESCALATED','IN_PROGRESS','REJECTED','REOPENED','RESOLVED','SUBMITTED','UNDER_REVIEW') DEFAULT NULL,
  `changed_by` bigint DEFAULT NULL,
  `complaint_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5i0y29qftf54xlaxydsodl0vn` (`changed_by`),
  KEY `FK6mj1hwu1judn3ftqdm20ty8cs` (`complaint_id`),
  CONSTRAINT `FK5i0y29qftf54xlaxydsodl0vn` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FK6mj1hwu1judn3ftqdm20ty8cs` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaint_history`
--

LOCK TABLES `complaint_history` WRITE;
/*!40000 ALTER TABLE `complaint_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `complaint_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaints` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  `closed_at` datetime(6) DEFAULT NULL,
  `complaint_number` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(3000) NOT NULL,
  `location` varchar(500) DEFAULT NULL,
  `priority` enum('CRITICAL','HIGH','LOW','MEDIUM') NOT NULL,
  `resolved_at` datetime(6) DEFAULT NULL,
  `sla_deadline` datetime(6) DEFAULT NULL,
  `status` enum('ASSIGNED','CLOSED','ESCALATED','IN_PROGRESS','REJECTED','REOPENED','RESOLVED','SUBMITTED','UNDER_REVIEW') NOT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `assigned_staff_id` bigint DEFAULT NULL,
  `department_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK348qxg8v14l5t9lp4a9sxxyt6` (`complaint_number`),
  KEY `idx_complaint_number` (`complaint_number`),
  KEY `idx_complaint_status` (`status`),
  KEY `idx_complaint_priority` (`priority`),
  KEY `idx_complaint_created_at` (`created_at`),
  KEY `FK7cdmvoc4ggo0016kq7m5vt1un` (`assigned_staff_id`),
  KEY `FKrtes9yyruyvj69lxh3c9k05yf` (`department_id`),
  KEY `FK83j5gqkd7ku4vc908g4rtmglr` (`user_id`),
  CONSTRAINT `FK7cdmvoc4ggo0016kq7m5vt1un` FOREIGN KEY (`assigned_staff_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK83j5gqkd7ku4vc908g4rtmglr` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKrtes9yyruyvj69lxh3c9k05yf` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints`
--

LOCK TABLES `complaints` WRITE;
/*!40000 ALTER TABLE `complaints` DISABLE KEYS */;
INSERT INTO `complaints` VALUES (1,'Maintenance',NULL,'CMP-2026-9AFD1899','2026-08-08 03:48:11.388151','There is continuous water leakage near classroom 205.','Building A, Classroom 205','HIGH','2026-08-08 19:19:03.441256',NULL,'RESOLVED','Water leakage in classroom','2026-08-08 19:19:03.446136',NULL,1,2);
/*!40000 ALTER TABLE `complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `active` bit(1) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKj6cwks7xecs5jov19ro8ge3qk` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'2026-08-08 03:58:22.386852','Handles building maintenance and repair complaints.','Maintenance',_binary '','2026-08-10 02:52:16.542155'),(2,'2026-08-09 14:08:44.831774','Electrical related complaints','Electrical',_binary '','2026-08-10 02:52:19.351099'),(3,'2026-08-10 00:19:31.978234','Water Suppy Management','Water',_binary '','2026-08-10 00:19:31.978234'),(4,'2026-08-10 01:10:59.944488','Network and Internet Issues','Network',_binary '','2026-08-10 01:10:59.944488');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `message` varchar(255) NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(6) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `is_read` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_notification_user` (`user_id`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (8,'Your complaint CMP-2026-0457EE19 has been resolved by Rohan Tidke.',0,'2026-08-10 01:49:58.183856',2,_binary '\0'),(10,'Complaint CMP-2026-3653C579 has been resolved by Rohan Tidke.',0,'2026-08-10 02:09:12.152482',2,_binary '\0');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expires_at` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `used` bit(1) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK71lqwbwtklmljk3qlsugr1mig` (`token`),
  KEY `FKk3ndxg5xp6v7wd4gjyusp15gq` (`user_id`),
  CONSTRAINT `FKk3ndxg5xp6v7wd4gjyusp15gq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES (12,'2026-08-10 14:38:35.491478','d1db61ca-ef7b-4c89-851b-39dc64a2e93f',_binary '\0',2);
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `enabled` bit(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','STAFF','USER') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `department_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  KEY `FKsbg59w8q63i0oo53rlgvlcnjq` (`department_id`),
  CONSTRAINT `FKsbg59w8q63i0oo53rlgvlcnjq` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'2026-08-08 03:16:10.975539','surajbade2004@gmail.com',_binary '','Suraj Bade','$2a$10$MWbKFS6S6/BGhCp1K4v8iO59.GqdKJvDPh16tR9nE.nE4piDLq01G','9876543210','ADMIN','2026-08-10 12:39:07.720389',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-10 14:17:05
