CREATE DATABASE  IF NOT EXISTS `plano_semanal` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `plano_semanal`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: plano_semanal
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `plano_atividades`
--

DROP TABLE IF EXISTS `plano_atividades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plano_atividades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `data` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fim` time NOT NULL,
  `tipo_atividade_id` int DEFAULT NULL,
  `valencia_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tipo_atividade_id` (`tipo_atividade_id`),
  KEY `valencia_id` (`valencia_id`),
  CONSTRAINT `plano_atividades_ibfk_1` FOREIGN KEY (`tipo_atividade_id`) REFERENCES `tipo_atividades` (`id`),
  CONSTRAINT `plano_atividades_ibfk_2` FOREIGN KEY (`valencia_id`) REFERENCES `valencias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plano_atividades`
--

LOCK TABLES `plano_atividades` WRITE;
/*!40000 ALTER TABLE `plano_atividades` DISABLE KEYS */;
INSERT INTO `plano_atividades` VALUES (69,'2024-11-13','10:00:00','12:00:00',4,4),(70,'2024-11-12','09:00:00','10:00:00',6,7),(71,'2024-11-19','13:00:00','15:00:00',7,6);
/*!40000 ALTER TABLE `plano_atividades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_atividades`
--

DROP TABLE IF EXISTS `tipo_atividades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_atividades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_atividades`
--

LOCK TABLES `tipo_atividades` WRITE;
/*!40000 ALTER TABLE `tipo_atividades` DISABLE KEYS */;
INSERT INTO `tipo_atividades` VALUES (1,'Música'),(2,'Motricidade'),(3,'Yoga'),(4,'Natação'),(5,'Trampolim'),(6,'Jujitsu'),(7,'Ciências'),(8,'Atendimento Pais');
/*!40000 ALTER TABLE `tipo_atividades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `valencias`
--

DROP TABLE IF EXISTS `valencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `valencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) NOT NULL,
  `cor` varchar(7) DEFAULT '#000000',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valencias`
--

LOCK TABLES `valencias` WRITE;
/*!40000 ALTER TABLE `valencias` DISABLE KEYS */;
INSERT INTO `valencias` VALUES (1,'Berçário','#FF6347'),(2,'Creche 12','#4682B4'),(3,'Creche 18','#32CD32'),(4,'Creche 2','#FFD700'),(5,'Pré 1','#6A5ACD'),(6,'Pré 2','#FF4500'),(7,'ATL','#8A2BE2');
/*!40000 ALTER TABLE `valencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'plano_semanal'
--

--
-- Dumping routines for database 'plano_semanal'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-12 12:16:42
