-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 07, 2025 at 04:54 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u141346348_lms_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `activity_id` int(11) NOT NULL,
  `section_subject_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `due_date` datetime DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `passing_type` varchar(255) NOT NULL,
  `activity_status` varchar(255) NOT NULL DEFAULT 'On Going',
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`activity_id`, `section_subject_id`, `title`, `description`, `due_date`, `file`, `passing_type`, `activity_status`, `status`, `date_created`) VALUES
(1, 1, 'Activity #1', 'This is your activity #1', '2024-12-21 15:00:00', 'public/assets/media/uploads/activities/Module9_Activity.pdf.pdf', 'File', 'On Going', 0, '2024-12-20 16:03:01'),
(2, 1, 'Activity #2', 'This is your activity #2. The link is provided below for you to answer.\n\nhttps://henrydeguzman.site/exams/fre413lq/', '2024-12-21 12:00:00', NULL, 'Link', 'On Going', 0, '2024-12-20 16:09:44'),
(3, 1, 'Activity #3', 'For your activity #3, answer the following questions: (TYPE YOUR ANSWERS HERE)\n\n1. What qualities does a programmer need to be efficient in writing long lines of codes?', '2024-12-21 00:00:00', NULL, 'Text', 'On Going', 0, '2024-12-20 16:14:34'),
(4, 1, 'Activity #4 (marking lates)', 'This is your activity #4', '2024-12-21 00:26:00', NULL, 'File', 'On Going', 0, '2024-12-20 16:25:13'),
(5, 3, 'Activity 1', 'Activity 1, Please submit the latest update regarding your system via file.', '2024-12-21 10:00:00', 'public/assets/media/uploads/activities/Screenshot 2024-11-17 085315.png.png', 'File', 'On Going', 0, '2024-12-21 01:44:33');

-- --------------------------------------------------------

--
-- Table structure for table `activities_complied`
--

CREATE TABLE `activities_complied` (
  `comply_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `link` varchar(255) NOT NULL,
  `file` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activities_complied`
--

INSERT INTO `activities_complied` (`comply_id`, `activity_id`, `student_id`, `text`, `link`, `file`, `status`, `date_created`) VALUES
(1, 1, 59, '', '', 'public/assets/media/uploads/activities_complied/Act4.java.java', 0, '2024-12-20 16:04:44'),
(2, 2, 59, '', 'https://henrydeguzman.site/exams/fre413lq/', '', 0, '2024-12-20 16:10:46'),
(3, 3, 59, 'be smart and have confidence while coding', '', '', 0, '2024-12-20 16:15:12'),
(4, 4, 59, '', '', 'public/assets/media/uploads/activities_complied/Act4.java(1).java', 0, '2024-12-20 16:27:07'),
(5, 5, 62, '', '', 'public/assets/media/uploads/activities_complied/Screenshot 2024-11-17 085315.png.png', 0, '2024-12-21 01:45:51');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `announcement_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `for_view` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `date_start` datetime NOT NULL,
  `date_end` datetime NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`announcement_id`, `user_id`, `for_view`, `title`, `content`, `date_start`, `date_end`, `status`, `date_created`) VALUES
(1, 1, 0, 'FINAL CONSULTATION', '<p>Please prepare your system for CAPSTONE Consultation tomorrow</p>', '2024-12-21 00:10:00', '2024-12-25 00:00:00', 0, '2024-12-20 16:07:49');

-- --------------------------------------------------------

--
-- Table structure for table `classrooms`
--

CREATE TABLE `classrooms` (
  `classroom_id` int(11) NOT NULL,
  `classroom_name` varchar(255) NOT NULL,
  `building` varchar(255) NOT NULL,
  `floor` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classrooms`
--

INSERT INTO `classrooms` (`classroom_id`, `classroom_name`, `building`, `floor`, `status`, `date_created`) VALUES
(1, 'CCS OFFICE', 'Elida Campus', '2ND', 1, '2024-12-20 15:47:17'),
(2, 'EDTECH', 'Elida Campus', '1st', 1, '2024-12-20 16:19:00');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `course_id` int(11) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`course_id`, `course_name`, `description`, `status`, `date_created`) VALUES
(1, 'BSIT', 'Bachelor of Science in Information Technology', 1, '2024-12-20 15:46:54');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(255) NOT NULL,
  `head` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `department_name`, `head`, `status`, `date_created`) VALUES
(1, 'College of Computer Studies', 'Ann Lim', 1, '2024-12-20 15:47:23');

-- --------------------------------------------------------

--
-- Table structure for table `email_verifications`
--

CREATE TABLE `email_verifications` (
  `verification_id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `verification` varchar(255) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_verifications`
--

INSERT INTO `email_verifications` (`verification_id`, `user_id`, `verification`, `date_created`) VALUES
(7, '59', '557900', '2024-12-21 00:43:05'),
(8, '53', '652281', '2024-12-21 01:16:13'),
(12, '61', '607414', '2024-12-21 01:31:35'),
(13, '62', '899617', '2024-12-21 01:34:29'),
(14, '63', '312231', '2024-12-21 01:41:37'),
(17, '1', '920929', '2024-12-21 03:18:43'),
(18, '60', '140182', '2025-01-07 03:41:03'),
(19, '58', '620680', '2025-01-07 03:41:40');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date_start` datetime NOT NULL,
  `date_end` datetime NOT NULL,
  `title` varchar(255) NOT NULL,
  `poster` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`event_id`, `user_id`, `date_start`, `date_end`, `title`, `poster`, `description`, `status`, `date_created`) VALUES
(1, 1, '2024-12-23 00:00:00', '2024-12-26 00:00:00', 'FIELD TRIP', 'public/assets/media/uploads/O.png', '<p>FIELDTRIP 2K24</p>', 0, '2024-12-20 16:08:43'),
(2, 1, '2024-12-25 00:00:00', '2024-12-26 00:00:00', 'RETREAT', 'public/assets/media/uploads/h.jpg', '<p>RETREAT2K24</p>', 0, '2024-12-20 16:09:18');

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `exam_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `section_subject_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `count_items` int(11) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `date_start` datetime DEFAULT NULL,
  `due_date` date NOT NULL,
  `file` varchar(255) NOT NULL,
  `form_id` int(11) NOT NULL,
  `exam_status` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`exam_id`, `section_id`, `section_subject_id`, `title`, `description`, `count_items`, `duration`, `date_start`, `due_date`, `file`, `form_id`, `exam_status`, `status`, `date_created`) VALUES
(1, 1, 1, 'PRELIMINARY EXAMINATION', 'Good luck!', 9, '10', '2024-12-21 00:45:00', '2024-12-21', '', 1, 0, 0, '2024-12-20 16:43:59'),
(2, 1, 1, 'MIDTERMS', 'GOODLUCK', 3, '30', '2024-12-21 08:35:00', '2024-12-22', '', 2, 0, 0, '2024-12-21 00:34:59'),
(3, 1, 1, 'MIDTERMS 2ND WAVE', 'Goodluck', 3, '10', '2024-12-21 08:53:00', '2024-12-21', '', 3, 0, 0, '2024-12-21 00:53:10'),
(4, 1, 3, 'PRELIMS', 'Goodluck!', 3, '30', '2024-12-21 10:00:00', '2024-12-21', '', 4, 0, 0, '2024-12-21 02:00:47');

-- --------------------------------------------------------

--
-- Table structure for table `forms`
--

CREATE TABLE `forms` (
  `form_id` int(11) NOT NULL,
  `professor_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `form_type` varchar(255) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `points` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `forms`
--

INSERT INTO `forms` (`form_id`, `professor_id`, `title`, `description`, `form_type`, `duration`, `points`, `status`, `date_created`) VALUES
(1, 1, 'PRELIMS', 'This will be your preliminary exam. Answer the questions truthfully!', 'Exam', '10', '29', 0, '2024-12-20 16:38:48'),
(2, 1, 'MIDTERMS EXAM', 'THIS IS YOUR MIDTERM EXAM', 'Exam', '30', '21', 0, '2024-12-21 00:33:57'),
(3, 1, 'Midterms 2nd wave', 'Goodluck', 'Exam', '10', '3', 0, '2024-12-21 00:52:25'),
(4, 2, 'PRELIMS', 'This is your prelimenary Exam', 'Exam', '30', '7', 0, '2024-12-21 02:00:06');

-- --------------------------------------------------------

--
-- Table structure for table `form_completions`
--

CREATE TABLE `form_completions` (
  `form_completion_id` int(11) NOT NULL,
  `form_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_completions`
--

INSERT INTO `form_completions` (`form_completion_id`, `form_id`, `user_id`, `parent_id`, `status`, `date_created`) VALUES
(1, 1, 59, 1, 0, '2024-12-20 16:46:19'),
(2, 2, 60, 2, 0, '2024-12-21 00:36:05'),
(3, 2, 59, 2, 0, '2024-12-21 00:45:32'),
(4, 3, 59, 3, 0, '2024-12-21 00:53:28'),
(5, 4, 62, 4, 0, '2024-12-21 02:02:08');

-- --------------------------------------------------------

--
-- Table structure for table `form_completion_answers`
--

CREATE TABLE `form_completion_answers` (
  `form_completion_answer_id` int(11) NOT NULL,
  `form_completion_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `choice_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_completion_answers`
--

INSERT INTO `form_completion_answers` (`form_completion_answer_id`, `form_completion_id`, `question_id`, `type`, `answer`, `choice_id`, `status`, `date_created`) VALUES
(1, 1, 1, 'multiple-choice', '1', 1, 0, '2024-12-20 16:46:19'),
(2, 1, 2, 'paragraph', 'loyal', 0, 0, '2024-12-20 16:46:19'),
(3, 1, 3, 'checkbox', '[\"Playing games\"]', 0, 0, '2024-12-20 16:46:19'),
(4, 1, 4, 'true-false', 'True', 0, 0, '2024-12-20 16:46:19'),
(5, 1, 5, 'fill-blank', '[{\"blankId\":\"blank_1734712480756_1\",\"answer\":\"donald\"}]', 0, 0, '2024-12-20 16:46:19'),
(6, 1, 6, 'dropdown', '', 0, 0, '2024-12-20 16:46:19'),
(7, 1, 7, 'dropdown', 'True', 12, 0, '2024-12-20 16:46:19'),
(8, 1, 8, 'dropdown', 'Option 1', 14, 0, '2024-12-20 16:46:19'),
(9, 1, 9, 'matching', '[\"A\",\"B\",\"C\",\"D\",\"E\",\"F\"]', 0, 0, '2024-12-20 16:46:19'),
(10, 2, 10, 'multiple-choice', 'Eggs', 16, 0, '2024-12-21 00:36:05'),
(11, 2, 11, 'matching', '[\"A\",\"B\"]', 0, 0, '2024-12-21 00:36:05'),
(12, 2, 12, 'fill-blank', '[{\"blankId\":\"blank_1734741150729_1\",\"answer\":\"Yanga\"},{\"blankId\":\"blank_1734741154935_2\",\"answer\":\"Inc\"}]', 0, 0, '2024-12-21 00:36:05'),
(13, 3, 10, 'multiple-choice', 'Eggs', 16, 0, '2024-12-21 00:45:32'),
(14, 3, 11, 'matching', '[\"B\",\"A\"]', 0, 0, '2024-12-21 00:45:32'),
(15, 4, 13, 'multiple-choice', 'Option 1', 20, 0, '2024-12-21 00:53:28'),
(16, 4, 14, 'true-false', 'True', 0, 0, '2024-12-21 00:53:28'),
(17, 4, 15, 'fill-blank', '[{\"blankId\":\"blank_1734742302353_1\",\"answer\":\"Mendoza\"}]', 0, 0, '2024-12-21 00:53:28'),
(18, 5, 16, 'multiple-choice', 'q1', 24, 0, '2024-12-21 02:02:08'),
(19, 5, 17, 'matching', '[\"B\",\"A\"]', 0, 0, '2024-12-21 02:02:08'),
(20, 5, 18, 'true-false', 'False', 0, 0, '2024-12-21 02:02:08');

-- --------------------------------------------------------

--
-- Table structure for table `form_corrections`
--

CREATE TABLE `form_corrections` (
  `correction_id` int(11) NOT NULL,
  `form_id` int(11) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_corrections`
--

INSERT INTO `form_corrections` (`correction_id`, `form_id`, `data`, `date_created`) VALUES
(2, 8, '{\"33\":[\"A\"],\"34\":[\"C\",\"D\"],\"35\":\"C\",\"36\":\"False\",\"37\":[{\"blankId\":\"blank_1734276145628_1\",\"answer\":\"hatdog\"},{\"blankId\":\"blank_1734276151316_2\",\"answer\":\"doghat\"}],\"38\":{\"0\":\"A\",\"1\":\"B\"},\"39\":{\"type\":\"specific\",\"text\":\"sana lahat\"},\"40\":{\"type\":\"keyword\",\"keywords\":[\"hatdog\",\"dog\"]}}', '2024-12-16 14:55:53'),
(3, 1, '{\"1\":[\"1\"],\"2\":{\"type\":\"keyword\",\"keywords\":[\"loyal\"]},\"3\":[\"Reading\",\"Watching sports\",\"Playing the guitar\"],\"4\":\"True\",\"5\":[{\"blankId\":\"blank_1734712480756_1\",\"answer\":\"Joe Biden\"}],\"6\":\"\",\"7\":\"True\",\"8\":\"Option 1\",\"9\":{\"0\":\"A\",\"1\":\"B\",\"2\":\"C\",\"3\":\"D\",\"4\":\"E\",\"5\":\"F\"}}', '2024-12-20 16:41:19'),
(4, 1, '{\"1\":[],\"2\":{\"type\":\"keyword\",\"keywords\":[]},\"3\":[],\"4\":\"True\",\"5\":[{\"blankId\":\"blank_1734712480756_1\",\"answer\":\"Joe Biden\"}],\"6\":\"\",\"7\":\"True\",\"8\":\"Option 1\",\"9\":{\"0\":\"A\",\"1\":\"B\",\"2\":\"C\",\"3\":\"D\",\"4\":\"E\",\"5\":\"F\"}}', '2024-12-20 16:41:19'),
(5, 1, '{\"1\":[],\"2\":{\"type\":\"keyword\",\"keywords\":[]},\"3\":[],\"4\":\"True\",\"5\":[{\"blankId\":\"blank_1734712480756_1\",\"answer\":\"Joe Biden\"}],\"6\":\"\",\"7\":\"True\",\"8\":\"Option 1\",\"9\":{\"0\":\"A\",\"1\":\"B\",\"2\":\"C\",\"3\":\"D\",\"4\":\"E\",\"5\":\"F\"}}', '2024-12-20 16:41:19'),
(6, 1, '{\"1\":[],\"2\":{\"type\":\"keyword\",\"keywords\":[]},\"3\":[],\"4\":\"True\",\"5\":[{\"blankId\":\"blank_1734712480756_1\",\"answer\":\"Joe Biden\"}],\"6\":\"\",\"7\":\"True\",\"8\":\"Option 1\",\"9\":{\"0\":\"A\",\"1\":\"B\",\"2\":\"C\",\"3\":\"D\",\"4\":\"E\",\"5\":\"F\"}}', '2024-12-20 16:41:19'),
(7, 2, '{\"10\":[\"Eggs\"],\"11\":{\"0\":\"A\",\"1\":\"B\"},\"12\":[{\"blankId\":\"blank_1734741150729_1\",\"answer\":\"Yanga\"},{\"blankId\":\"blank_1734741154935_2\",\"answer\":\"Inc\"}]}', '2024-12-21 00:37:46'),
(8, 3, '{\"13\":[\"Option 1\"],\"14\":\"True\",\"15\":[{\"blankId\":\"blank_1734742302353_1\",\"answer\":\"Mendoza\"}]}', '2024-12-21 00:54:14'),
(9, 4, '{\"16\":[\"q1\"],\"17\":{\"0\":\"B\",\"1\":\"A\"},\"18\":\"False\"}', '2024-12-21 02:01:50');

-- --------------------------------------------------------

--
-- Table structure for table `form_correction_check`
--

CREATE TABLE `form_correction_check` (
  `correction_check_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comply_id` int(11) NOT NULL,
  `score` float NOT NULL,
  `total_points` float NOT NULL,
  `grade` varchar(255) NOT NULL,
  `datas` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_correction_check`
--

INSERT INTO `form_correction_check` (`correction_check_id`, `user_id`, `comply_id`, `score`, `total_points`, `grade`, `datas`, `date_created`) VALUES
(2, 10, 9, 2, 8, '25', '[{\"question_id\":33,\"user_answer\":\"A\",\"correct_answer\":[\"A\"]},{\"question_id\":34,\"user_answer\":\"[\"B\",\"C\"]\",\"correct_answer\":[\"C\",\"D\"]},{\"question_id\":35,\"user_answer\":\"D\",\"correct_answer\":\"C\"},{\"question_id\":36,\"user_answer\":\"True\",\"correct_answer\":\"False\"},{\"question_id\":37,\"user_answer\":\"[{\"blankId\":\"blank_1734276145628_1\",\"answer\":\"hatdog\"},{\"blankId\":\"blank_1734276151316_2\",\"answer\":\"doghat\"}]\",\"correct_answer\":[{\"blankId\":\"blank_1734276145628_1\",\"answer\":\"hatdog\"},{\"blankId\":\"blank_1734276151316_2\",\"answer\":\"doghat\"}]},{\"question_id\":38,\"user_answer\":\"[\"A\",\"B\"]\",\"correct_answer\":[\"A\",\"B\"]},{\"question_id\":39,\"user_answer\":\"sat\",\"correct_answer\":{\"type\":\"specific\",\"text\":\"sana lahat\"}},{\"question_id\":40,\"user_answer\":\"awdaw aw wa aw dog\",\"correct_answer\":{\"type\":\"keyword\",\"keywords\":[\"hatdog\",\"dog\"]}}]', '2024-12-17 12:26:34'),
(3, 59, 1, 18, 29, '62.068965517241', '[{\"question_id\":1,\"user_answer\":\"1\",\"correct_answer\":[\"1\"]},{\"question_id\":2,\"user_answer\":\"loyal\",\"correct_answer\":{\"type\":\"keyword\",\"keywords\":[\"loyal\"]}},{\"question_id\":3,\"user_answer\":\"[\"Playing games\"]\",\"correct_answer\":[\"Reading\",\"Watching sports\",\"Playing the guitar\"]},{\"question_id\":4,\"user_answer\":\"True\",\"correct_answer\":\"True\"},{\"question_id\":5,\"user_answer\":\"[{\"blankId\":\"blank_1734712480756_1\",\"answer\":\"donald\"}]\",\"correct_answer\":[{\"blankId\":\"blank_1734712480756_1\",\"answer\":\"Joe Biden\"}]},{\"question_id\":6,\"user_answer\":\"\",\"correct_answer\":\"\"},{\"question_id\":7,\"user_answer\":\"True\",\"correct_answer\":\"True\"},{\"question_id\":8,\"user_answer\":\"Option 1\",\"correct_answer\":\"Option 1\"},{\"question_id\":9,\"user_answer\":\"[\"A\",\"B\",\"C\",\"D\",\"E\",\"F\"]\",\"correct_answer\":[\"A\",\"B\",\"C\",\"D\",\"E\",\"F\"]}]', '2024-12-20 16:48:33'),
(4, 60, 2, 1, 21, '4.7619047619048', '[{\"question_id\":10,\"user_answer\":\"Eggs\",\"correct_answer\":[\"Eggs\"]},{\"question_id\":11,\"user_answer\":\"[\"A\",\"B\"]\",\"correct_answer\":[\"A\",\"B\"]},{\"question_id\":12,\"user_answer\":\"[{\"blankId\":\"blank_1734741150729_1\",\"answer\":\"Yanga\"},{\"blankId\":\"blank_1734741154935_2\",\"answer\":\"Inc\"}]\",\"correct_answer\":[{\"blankId\":\"blank_1734741150729_1\",\"answer\":\"Yanga\"},{\"blankId\":\"blank_1734741154935_2\",\"answer\":\"Inc\"}]}]', '2024-12-21 00:38:20'),
(5, 59, 4, 2, 3, '66.666666666667', '[{\"question_id\":13,\"user_answer\":\"Option 1\",\"correct_answer\":[\"Option 1\"]},{\"question_id\":14,\"user_answer\":\"True\",\"correct_answer\":\"True\"},{\"question_id\":15,\"user_answer\":\"[{\"blankId\":\"blank_1734742302353_1\",\"answer\":\"Mendoza\"}]\",\"correct_answer\":[{\"blankId\":\"blank_1734742302353_1\",\"answer\":\"Mendoza\"}]}]', '2024-12-21 00:54:31'),
(6, 62, 5, 6, 7, '85.714285714286', '[{\"question_id\":16,\"user_answer\":\"q1\",\"correct_answer\":[\"q1\"]},{\"question_id\":17,\"user_answer\":\"[\"B\",\"A\"]\",\"correct_answer\":[\"B\",\"A\"]},{\"question_id\":18,\"user_answer\":\"False\",\"correct_answer\":\"False\"}]', '2024-12-21 02:02:37');

-- --------------------------------------------------------

--
-- Table structure for table `form_questions`
--

CREATE TABLE `form_questions` (
  `form_question_id` int(11) NOT NULL,
  `form_id` int(11) NOT NULL,
  `question_number` varchar(255) NOT NULL,
  `question` text NOT NULL,
  `question_type` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `points` int(11) NOT NULL DEFAULT 1,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_questions`
--

INSERT INTO `form_questions` (`form_question_id`, `form_id`, `question_number`, `question`, `question_type`, `image_url`, `points`, `status`, `date_created`) VALUES
(1, 1, '2', 'How many siblings do you have?', 'multiple-choice', '', 2, 0, '2024-12-20 16:38:48'),
(2, 1, '3', 'How do you describe yourself? Write it in one paragraph', 'paragraph', '', 10, 0, '2024-12-20 16:38:48'),
(3, 1, '4', 'What are your hobbies?', 'checkbox', '', 1, 0, '2024-12-20 16:38:48'),
(4, 1, '5', 'The acronym for CPR is Capstone Project and Research.', 'true-false', '', 1, 0, '2024-12-20 16:38:48'),
(5, 1, '6', '<span class=\"blank-space\" contenteditable=\"false\" data-blank-id=\"blank_1734712480756_1\">[Blank 1]</span>&nbsp;is the president of United States of America.', 'fill-blank', '', 5, 0, '2024-12-20 16:38:48'),
(6, 1, '7', 'The acronym for CPR is Capstone Project and Research.', 'dropdown', '', 1, 0, '2024-12-20 16:38:48'),
(7, 1, '6', 'Untitled Question', 'dropdown', '', 1, 0, '2024-12-20 16:38:48'),
(8, 1, '7', 'Test dropdown question', 'dropdown', '', 3, 0, '2024-12-20 16:38:48'),
(9, 1, '8', '', 'matching', '', 5, 0, '2024-12-20 16:38:48'),
(10, 2, '1', 'What is the main ingredient in an Omelette?', 'multiple-choice', '', 1, 0, '2024-12-21 00:33:57'),
(11, 2, '3', '', 'matching', '', 5, 0, '2024-12-21 00:33:57'),
(12, 2, '4', 'Dr.<span class=\"blank-space\" contenteditable=\"false\" data-blank-id=\"blank_1734741150729_1\">[Blank 1]</span>Colleges<span class=\"blank-space\" contenteditable=\"false\" data-blank-id=\"blank_1734741154935_2\">[Blank 2]</span>.', 'fill-blank', '', 5, 0, '2024-12-21 00:33:57'),
(13, 3, '1', 'Trial question1', 'multiple-choice', '', 1, 0, '2024-12-21 00:52:25'),
(14, 3, '2', 'Today is Saturday', 'true-false', '', 1, 0, '2024-12-21 00:52:25'),
(15, 3, '3', 'Jeff<span class=\"blank-space\" contenteditable=\"false\" data-blank-id=\"blank_1734742302353_1\">[Blank 1]</span>.', 'fill-blank', '', 1, 0, '2024-12-21 00:52:25'),
(16, 4, '1', 'Q1', 'multiple-choice', '', 5, 0, '2024-12-21 02:00:06'),
(17, 4, '2', '', 'matching', '', 1, 0, '2024-12-21 02:00:06'),
(18, 4, '3', 'Today is Saturday', 'true-false', '', 1, 0, '2024-12-21 02:00:06');

-- --------------------------------------------------------

--
-- Table structure for table `form_question_choices`
--

CREATE TABLE `form_question_choices` (
  `form_question_choice_id` int(11) NOT NULL,
  `form_question_id` int(11) NOT NULL,
  `choice_number` varchar(255) NOT NULL,
  `choice` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_question_choices`
--

INSERT INTO `form_question_choices` (`form_question_choice_id`, `form_question_id`, `choice_number`, `choice`, `status`, `date_created`) VALUES
(1, 1, '1', '1', 0, '2024-12-20 16:38:48'),
(2, 1, '2', '2', 0, '2024-12-20 16:38:48'),
(3, 1, '3', '3', 0, '2024-12-20 16:38:48'),
(4, 1, '4', '4', 0, '2024-12-20 16:38:48'),
(5, 1, '5', '5', 0, '2024-12-20 16:38:48'),
(6, 3, '1', 'Playing games', 0, '2024-12-20 16:38:48'),
(7, 3, '2', 'Reading', 0, '2024-12-20 16:38:48'),
(8, 3, '3', 'Watching sports', 0, '2024-12-20 16:38:48'),
(9, 3, '4', 'Playing the guitar', 0, '2024-12-20 16:38:48'),
(10, 4, '1', 'True', 0, '2024-12-20 16:38:48'),
(11, 4, '2', 'False', 0, '2024-12-20 16:38:48'),
(12, 7, '1', 'True', 0, '2024-12-20 16:38:48'),
(13, 7, '2', 'False', 0, '2024-12-20 16:38:48'),
(14, 8, '1', 'Option 1', 0, '2024-12-20 16:38:48'),
(15, 8, '2', 'Option 2', 0, '2024-12-20 16:38:48'),
(16, 10, '1', 'Eggs', 0, '2024-12-21 00:33:57'),
(17, 10, '2', 'Deer', 0, '2024-12-21 00:33:57'),
(18, 10, '3', 'Chips', 0, '2024-12-21 00:33:57'),
(19, 10, '4', 'Pancakes', 0, '2024-12-21 00:33:57'),
(20, 13, '1', 'Option 1', 0, '2024-12-21 00:52:25'),
(21, 13, '2', 'Option 2', 0, '2024-12-21 00:52:25'),
(22, 14, '1', 'True', 0, '2024-12-21 00:52:25'),
(23, 14, '2', 'False', 0, '2024-12-21 00:52:25'),
(24, 16, '1', 'q1', 0, '2024-12-21 02:00:06'),
(25, 16, '2', 'q2', 0, '2024-12-21 02:00:06'),
(26, 16, '3', 'q3', 0, '2024-12-21 02:00:06'),
(27, 16, '4', 'q4', 0, '2024-12-21 02:00:06'),
(28, 18, '1', 'True', 0, '2024-12-21 02:00:06'),
(29, 18, '2', 'False', 0, '2024-12-21 02:00:06');

-- --------------------------------------------------------

--
-- Table structure for table `form_question_options`
--

CREATE TABLE `form_question_options` (
  `form_question_option_id` int(11) NOT NULL,
  `form_question_id` int(11) NOT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`options`)),
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_question_options`
--

INSERT INTO `form_question_options` (`form_question_option_id`, `form_question_id`, `options`, `date_created`) VALUES
(1, 26, '0', '2024-12-15 02:04:40'),
(2, 27, '0', '2024-12-15 02:04:40'),
(3, 31, '{\"type\":\"fill-blank\",\"blanks\":[{\"blankId\":\"blank_1734229434555_1\",\"text\":\"[Blank 1]\"},{\"blankId\":\"blank_1734229438330_2\",\"text\":\"[Blank 2]\"}]}', '2024-12-15 02:24:45'),
(4, 32, '{\"type\":\"matching\",\"questions\":[\"Boy\",\"Girl\"],\"words\":[\"Tama\",\"Mali\"]}', '2024-12-15 02:24:45'),
(5, 37, '{\"type\":\"fill-blank\",\"blanks\":[{\"blankId\":\"blank_1734276145628_1\",\"text\":\"[Blank 1]\"},{\"blankId\":\"blank_1734276151316_2\",\"text\":\"[Blank 2]\"}]}', '2024-12-15 15:23:34'),
(6, 38, '{\"type\":\"matching\",\"questions\":[\"Male\",\"Female\"],\"words\":[\"Tama\",\"Mali\"]}', '2024-12-15 15:23:34'),
(7, 5, '{\"type\":\"fill-blank\",\"blanks\":[{\"blankId\":\"blank_1734712480756_1\",\"text\":\"[Blank 1]\"}]}', '2024-12-20 16:38:48'),
(8, 9, '{\"type\":\"matching\",\"questions\":[\"Llord Andrei\",\"Jainus Elijah\",\"Dela Cruz\",\"Dharrell\",\"Mark Kevin\",\"Stephen Ivan\"],\"words\":[\"Cruz\",\"Aurelio\",\"Linuz Jethro\",\"Montion\",\"Villanueva\",\"Santiago\"]}', '2024-12-20 16:38:48'),
(9, 11, '{\"type\":\"matching\",\"questions\":[\"Lim\",\"Kevin\"],\"words\":[\"Ann\",\"Villanueva\"]}', '2024-12-21 00:33:57'),
(10, 12, '{\"type\":\"fill-blank\",\"blanks\":[{\"blankId\":\"blank_1734741150729_1\",\"text\":\"[Blank 1]\"},{\"blankId\":\"blank_1734741154935_2\",\"text\":\"[Blank 2]\"}]}', '2024-12-21 00:33:57'),
(11, 15, '{\"type\":\"fill-blank\",\"blanks\":[{\"blankId\":\"blank_1734742302353_1\",\"text\":\"[Blank 1]\"}]}', '2024-12-21 00:52:25'),
(12, 17, '{\"type\":\"matching\",\"questions\":[\"Ann\",\"Andrei\"],\"words\":[\"Cruz\",\"Lim\"]}', '2024-12-21 02:00:06');

-- --------------------------------------------------------

--
-- Table structure for table `grade_scores`
--

CREATE TABLE `grade_scores` (
  `grade_score_id` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `category` varchar(255) NOT NULL,
  `grade` float NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grade_scores`
--

INSERT INTO `grade_scores` (`grade_score_id`, `id`, `parent_id`, `category`, `grade`, `status`, `date_created`) VALUES
(1, 1, 1, 'Form', 20.6897, 0, '2024-12-20 16:48:33'),
(2, 1, 1, 'Activity', 84, 0, '2024-12-20 16:54:26'),
(3, 1, 1, 'Activity', 84, 0, '2024-12-20 16:54:34'),
(4, 2, 2, 'Form', 4.7619, 0, '2024-12-21 00:38:20'),
(5, 4, 3, 'Form', 66.6667, 0, '2024-12-21 00:54:31'),
(6, 5, 5, 'Activity', 50, 0, '2024-12-21 01:53:51'),
(7, 5, 4, 'Form', 85.7143, 0, '2024-12-21 02:02:37');

-- --------------------------------------------------------

--
-- Table structure for table `grade_show_requests`
--

CREATE TABLE `grade_show_requests` (
  `grade_show_request_id` int(11) NOT NULL,
  `grading_platform_id` int(11) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grade_show_requests`
--

INSERT INTO `grade_show_requests` (`grade_show_request_id`, `grading_platform_id`, `data`, `status`, `date_created`) VALUES
(1, 1, '[\"59\",\"60\"]', 0, '2024-12-20 16:52:25'),
(2, 2, '[\"62\"]', 0, '2024-12-21 01:57:48');

-- --------------------------------------------------------

--
-- Table structure for table `grading_categories`
--

CREATE TABLE `grading_categories` (
  `grading_category_id` int(11) NOT NULL,
  `grading_platform_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `percentage` float NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grading_categories`
--

INSERT INTO `grading_categories` (`grading_category_id`, `grading_platform_id`, `name`, `percentage`, `status`, `date_created`) VALUES
(1, 1, 'Written Works', 30, 0, '2024-12-20 16:51:35'),
(2, 1, 'Performance Tasks', 50, 0, '2024-12-20 16:51:35'),
(3, 1, 'Exams', 20, 0, '2024-12-20 16:51:35'),
(4, 2, 'Written Works', 30, 0, '2024-12-21 01:57:29'),
(5, 2, 'Performance Tasks', 50, 0, '2024-12-21 01:57:29'),
(6, 2, 'Exams', 20, 0, '2024-12-21 01:57:29');

-- --------------------------------------------------------

--
-- Table structure for table `grading_platforms`
--

CREATE TABLE `grading_platforms` (
  `grading_platform_id` int(11) NOT NULL,
  `section_subject_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grading_platforms`
--

INSERT INTO `grading_platforms` (`grading_platform_id`, `section_subject_id`, `status`, `date_created`) VALUES
(1, 1, 0, '2024-12-20 16:51:35'),
(2, 3, 0, '2024-12-21 01:57:29');

-- --------------------------------------------------------

--
-- Table structure for table `grading_scores`
--

CREATE TABLE `grading_scores` (
  `grading_score_id` int(11) NOT NULL,
  `grading_score_column_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `score` float NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grading_scores`
--

INSERT INTO `grading_scores` (`grading_score_id`, `grading_score_column_id`, `student_id`, `score`, `status`, `date_created`) VALUES
(1, 1, 59, 0, 0, '2024-12-20 16:51:35'),
(2, 2, 59, 0, 0, '2024-12-20 16:54:53'),
(3, 2, 60, 50, 0, '2024-12-21 00:39:50'),
(4, 1, 60, 100, 0, '2024-12-21 00:39:50'),
(5, 3, 62, 50, 0, '2024-12-21 01:57:29');

-- --------------------------------------------------------

--
-- Table structure for table `grading_score_columns`
--

CREATE TABLE `grading_score_columns` (
  `grading_score_column_id` int(11) NOT NULL,
  `grading_category_id` int(11) NOT NULL,
  `column_number` varchar(255) NOT NULL,
  `passing_score` float NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grading_score_columns`
--

INSERT INTO `grading_score_columns` (`grading_score_column_id`, `grading_category_id`, `column_number`, `passing_score`, `status`, `date_created`) VALUES
(1, 3, '1', 100, 0, '2024-12-20 16:51:35'),
(2, 2, '1', 100, 0, '2024-12-20 16:54:53'),
(3, 4, '1', 100, 0, '2024-12-21 01:57:29');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_type` int(11) NOT NULL,
  `content` text NOT NULL,
  `section_subject_id` int(11) DEFAULT 0,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`post_id`, `user_id`, `post_type`, `content`, `section_subject_id`, `status`, `date_created`) VALUES
(3, 58, 2, '<p>nyok</p>', 1, 0, '2024-12-20 15:53:16'),
(4, 1, 2, '<p>Hello, I am the Admin of this website.</p>', 0, 0, '2024-12-20 16:06:51');

-- --------------------------------------------------------

--
-- Table structure for table `post_comments`
--

CREATE TABLE `post_comments` (
  `post_comment_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post_comments`
--

INSERT INTO `post_comments` (`post_comment_id`, `post_id`, `user_id`, `comment`, `status`, `date_created`) VALUES
(1, 1, 58, 'Test comment-- success', 0, '2024-12-20 15:51:19'),
(2, 2, 58, 'asdasdasd', 0, '2024-12-20 15:52:48'),
(3, 3, 59, 'linuz', 0, '2024-12-20 15:53:37'),
(4, 4, 1, 'ASDADAA', 0, '2024-12-20 16:23:16'),
(5, 4, 62, 'Try', 0, '2024-12-21 01:36:59'),
(6, 4, 58, 'Sample', 0, '2024-12-21 02:33:07');

-- --------------------------------------------------------

--
-- Table structure for table `post_likes`
--

CREATE TABLE `post_likes` (
  `post_like_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post_likes`
--

INSERT INTO `post_likes` (`post_like_id`, `post_id`, `user_id`, `date_created`) VALUES
(1, 1, 58, '2024-12-20 15:51:20'),
(2, 2, 58, '2024-12-20 15:52:48'),
(3, 3, 59, '2024-12-20 15:54:44'),
(4, 4, 59, '2024-12-20 16:07:21'),
(5, 4, 62, '2024-12-21 01:36:56');

-- --------------------------------------------------------

--
-- Table structure for table `post_medias`
--

CREATE TABLE `post_medias` (
  `post_medias` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `filepath` text NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `professors`
--

CREATE TABLE `professors` (
  `professor_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `main_course_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `professors`
--

INSERT INTO `professors` (`professor_id`, `user_id`, `main_course_id`, `description`, `status`, `date_created`) VALUES
(1, 58, 1, 'Proficient in Capstone & Research 2, Proficient in Software Engineering', 1, '2024-12-20 15:48:14'),
(2, 63, 1, 'eXAMPLE', 1, '2024-12-21 01:39:34');

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

CREATE TABLE `resources` (
  `resources_id` int(11) NOT NULL,
  `ref` varchar(255) NOT NULL,
  `resources_group_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `section_subject_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `file_size` float NOT NULL,
  `file_type` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resources`
--

INSERT INTO `resources` (`resources_id`, `ref`, `resources_group_id`, `section_id`, `section_subject_id`, `title`, `description`, `file_size`, `file_type`, `file_name`, `file_path`, `status`, `date_created`) VALUES
(1, 'GRP-1734710317-98W28LJX', 1, 1, 1, 'Test Resource #1', 'This is a test resource #1 for students', 400734, 'pdf', 'CCS-MOS-EXAMINATION-SCHEDULE-6-4-2023_final.pdf', 'public/assets/media/resources/GRP-1734710317-98W28LJX/CCS-MOS-EXAMINATION-SCHEDULE-6-4-2023_final.pdf', 0, '2024-12-20 15:58:37');

-- --------------------------------------------------------

--
-- Table structure for table `resources_groups`
--

CREATE TABLE `resources_groups` (
  `resources_group_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `section_subject_id` int(11) NOT NULL,
  `ref` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resources_groups`
--

INSERT INTO `resources_groups` (`resources_group_id`, `section_id`, `section_subject_id`, `ref`, `title`, `description`, `status`, `date_created`) VALUES
(1, 1, 1, 'GRP-1734710317-98W28LJX', 'Test Resource Group #1', 'This is a test resource group #1 for students', 0, '2024-12-20 15:58:37');

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `schedule_id` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `description` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` (`schedule_id`, `id`, `description`, `status`, `date_created`) VALUES
(1, 1, 'Subject Capstone and Research 2 Schedule', 1, '2024-12-20 15:50:20'),
(2, 2, 'Subject Free Elective 3 Schedule', 1, '2024-12-20 16:19:32'),
(3, 3, 'Subject Foreign Language Schedule', 1, '2024-12-21 01:41:14');

-- --------------------------------------------------------

--
-- Table structure for table `schedule_items`
--

CREATE TABLE `schedule_items` (
  `schedule_item_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  `day` varchar(255) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedule_items`
--

INSERT INTO `schedule_items` (`schedule_item_id`, `schedule_id`, `day`, `start_time`, `end_time`, `status`, `date_created`) VALUES
(1, 1, 'Monday', '07:00:00', '10:00:00', 1, '2024-12-20 15:50:20'),
(2, 2, 'Wednesday', '10:00:00', '14:00:00', 1, '2024-12-20 16:19:32'),
(3, 3, 'Tuesday', '07:00:00', '10:00:00', 1, '2024-12-21 01:41:14');

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `section_id` int(11) NOT NULL,
  `section_name` varchar(255) NOT NULL,
  `adviser_id` int(11) NOT NULL,
  `semester` int(11) NOT NULL,
  `year_level` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`section_id`, `section_name`, `adviser_id`, `semester`, `year_level`, `course_id`, `status`, `date_created`) VALUES
(1, 'BSIT 4B', 1, 1, 4, 1, 0, '2024-12-20 15:48:40');

-- --------------------------------------------------------

--
-- Table structure for table `section_students`
--

CREATE TABLE `section_students` (
  `section_student_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `irregular` enum('regular','irregular') NOT NULL DEFAULT 'regular',
  `status` int(11) NOT NULL DEFAULT 1,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section_students`
--

INSERT INTO `section_students` (`section_student_id`, `section_id`, `student_id`, `irregular`, `status`, `date_created`) VALUES
(1, 1, 59, 'regular', 1, '2024-12-20 15:49:25'),
(2, 1, 60, 'irregular', 1, '2024-12-21 00:25:44'),
(3, 1, 62, 'regular', 1, '2024-12-21 01:45:21'),
(4, 1, 64, 'regular', 1, '2024-12-21 01:51:09');

-- --------------------------------------------------------

--
-- Table structure for table `section_student_irregular_subjects`
--

CREATE TABLE `section_student_irregular_subjects` (
  `irregular_subject_id` int(11) NOT NULL,
  `section_student_id` int(11) NOT NULL,
  `section_subject_id` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section_student_irregular_subjects`
--

INSERT INTO `section_student_irregular_subjects` (`irregular_subject_id`, `section_student_id`, `section_subject_id`, `date_created`) VALUES
(1, 2, 1, '2025-01-07 03:43:47');

-- --------------------------------------------------------

--
-- Table structure for table `section_subjects`
--

CREATE TABLE `section_subjects` (
  `section_subject_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `professor_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  `classroom_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section_subjects`
--

INSERT INTO `section_subjects` (`section_subject_id`, `section_id`, `subject_id`, `professor_id`, `schedule_id`, `classroom_id`, `status`, `date_created`) VALUES
(1, 1, 1, 1, 1, 1, 0, '2024-12-20 15:50:04'),
(2, 1, 2, 1, 2, 2, 0, '2024-12-20 16:19:15'),
(3, 1, 3, 2, 3, 2, 0, '2024-12-21 01:40:50');

-- --------------------------------------------------------

--
-- Table structure for table `staffs`
--

CREATE TABLE `staffs` (
  `staff_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sticky_notes`
--

CREATE TABLE `sticky_notes` (
  `sticky_note_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `professor_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  `width` double NOT NULL,
  `height` double NOT NULL,
  `rotation` double NOT NULL,
  `content` text NOT NULL,
  `color` varchar(255) NOT NULL,
  `locked` tinyint(1) NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sticky_notes`
--

INSERT INTO `sticky_notes` (`sticky_note_id`, `section_id`, `professor_id`, `user_id`, `x`, `y`, `width`, `height`, `rotation`, `content`, `color`, `locked`, `status`, `date_created`) VALUES
(1, 1, 2, 63, 0.0305677, 0.0416667, 0.25, 0.3333, 0, 'Goodluck on your prelims!', 'rgb(230, 230, 250)', 0, 0, '2024-12-21 02:04:10'),
(2, 1, 2, 63, 0.228821, 0.28, 0.25, 0.3333, 0, 'Goodluck on your prelims!', 'rgb(230, 230, 250)', 0, 0, '2024-12-21 02:04:39'),
(3, 1, 2, 63, 0, 0, 0.25, 0.3333, 0, '', 'rgb(191, 236, 197)', 0, 0, '2024-12-21 02:04:39'),
(4, 1, 2, 63, 0, 0, 0.25, 0.3333, 0, '', 'rgb(191, 236, 197)', 0, 0, '2024-12-21 02:04:39'),
(5, 1, 2, 63, 0.00174672, 0.00166667, 0.25, 0.3333, 0, '132', 'rgb(230, 230, 250)', 1, 0, '2024-12-21 02:04:39'),
(6, 1, 2, 63, 0.334498, 0.005, 0.25, 0.3333, 0, '123', 'rgb(255, 229, 180)', 0, 0, '2024-12-21 02:04:39'),
(7, 1, 2, 63, 0.639301, 0.145, 0.25, 0.3333, 0, '123', 'rgb(191, 236, 197)', 0, 0, '2024-12-21 02:04:39');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `subject_name` varchar(255) NOT NULL,
  `subject_code` varchar(255) NOT NULL,
  `course_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subject_id`, `subject_name`, `subject_code`, `course_id`, `status`, `date_created`) VALUES
(1, 'Capstone and Research 2', 'CPR413', 1, 1, '2024-12-20 15:47:46'),
(2, 'Free Elective 3', 'FRE413', 1, 1, '2024-12-20 16:18:37'),
(3, 'Foreign Language', 'FL412', 1, 1, '2024-12-21 01:40:26');

-- --------------------------------------------------------

--
-- Table structure for table `subject_attendances`
--

CREATE TABLE `subject_attendances` (
  `attendance_id` int(11) NOT NULL,
  `section_subject_id` int(11) NOT NULL,
  `attendance_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`attendance_data`)),
  `status` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modify` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subject_attendances`
--

INSERT INTO `subject_attendances` (`attendance_id`, `section_subject_id`, `attendance_data`, `status`, `date_created`, `date_modify`) VALUES
(1, 2, '{\"2024-12-01\":{\"59\":\"present\"}}', 0, '2024-12-20 16:49:57', '2024-12-20 16:49:57'),
(2, 1, '{\"2024-12-01\":{\"59\":\"present\"},\"2024-12-02\":{\"59\":\"absent\"},\"2024-12-03\":{\"59\":\"absent\"},\"2024-12-04\":{\"59\":\"late\"}}', 0, '2024-12-20 16:50:17', '2024-12-20 16:50:38'),
(3, 3, '{\"2024-12-01\":{\"62\":\"present\"},\"2024-12-02\":{\"62\":\"absent\"},\"2024-12-03\":{\"62\":\"late\"}}', 0, '2024-12-21 01:55:27', '2024-12-21 01:55:27');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `no` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `displayName` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `middlename` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `birthdate` date NOT NULL,
  `gender` int(11) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `contact_number` varchar(255) NOT NULL,
  `user_type` int(11) NOT NULL DEFAULT 1,
  `lock_timeout` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `no`, `email`, `password`, `displayName`, `firstname`, `middlename`, `lastname`, `birthdate`, `gender`, `photo`, `contact_number`, `user_type`, `lock_timeout`, `date_created`, `status`) VALUES
(1, '', 'dreiprojects2@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Drei Project', 'Drei', 'Reyez', 'Projects', '2002-03-21', 1, 'public/assets/media/uploads/Screenshot 2024-12-13 102753.jpg.jpg', '', 4, 0, '2024-09-22 18:45:18', 1),
(3, '', 'dycilibrary@dyci.edu.ph', '827ccb0eea8a706c4c34a16891f84e7b', 'DYCI Library', 'DYCI', '', 'Library', '2024-09-17', 0, '', '', 4, 0, '2024-09-22 21:59:25', 1),
(53, '', 'admin@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Admin Sample', 'Admin', '', 'Sample', '2005-12-12', 0, '', '', 3, 0, '2024-11-09 05:47:58', 1),
(58, '', 'jajahaurelio@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Ann Lim', 'Ann', '', 'Lim', '1996-02-12', 0, '', '', 2, 0, '2024-12-20 15:41:44', 1),
(59, '2021-01730', 'linuzjethrodelacruz@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Linuz Dela Cruz', 'Linuz', '', 'Dela Cruz', '2003-06-03', 0, '', '', 1, 0, '2024-12-20 15:44:01', 1),
(60, '2021-00964', 'andreireyescruz@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Andrei Cruz', 'Andrei', '', 'Cruz', '2002-09-30', 0, '', '', 1, 0, '2024-12-21 00:24:58', 1),
(62, '2021-0101', 'maptlim@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Mary Ann Lim', 'Mary Ann', '', 'Lim', '1999-12-12', 0, '', '', 1, 0, '2024-12-21 01:33:59', 1),
(63, '', 'dharrellandrei.montion@yahoo.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Herliza Estrada', 'Herliza', '', 'Estrada', '1999-02-19', 0, '', '', 2, 0, '2024-12-21 01:37:56', 1),
(64, '2021-1461', 'jainuselljahaurelio44@gmail.com', 'a6a7b6f734af907c2cc3746c44360efa', 'Jomar Roxas', 'Jomar', 'R.', 'Roxas', '0000-00-00', 0, '', '', 1, 0, '2024-12-21 01:51:09', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`activity_id`),
  ADD KEY `fk_section_subject_activities` (`section_subject_id`);

--
-- Indexes for table `activities_complied`
--
ALTER TABLE `activities_complied`
  ADD PRIMARY KEY (`comply_id`),
  ADD KEY `fk_activity_complied` (`activity_id`),
  ADD KEY `fk_student_complied` (`student_id`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`announcement_id`),
  ADD KEY `fk_user_announcements` (`user_id`);

--
-- Indexes for table `classrooms`
--
ALTER TABLE `classrooms`
  ADD PRIMARY KEY (`classroom_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `email_verifications`
--
ALTER TABLE `email_verifications`
  ADD PRIMARY KEY (`verification_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `fk_user_events` (`user_id`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`exam_id`),
  ADD KEY `fk_section_exams` (`section_id`),
  ADD KEY `fk_section_subject_exams` (`section_subject_id`);

--
-- Indexes for table `forms`
--
ALTER TABLE `forms`
  ADD PRIMARY KEY (`form_id`);

--
-- Indexes for table `form_completions`
--
ALTER TABLE `form_completions`
  ADD PRIMARY KEY (`form_completion_id`);

--
-- Indexes for table `form_completion_answers`
--
ALTER TABLE `form_completion_answers`
  ADD PRIMARY KEY (`form_completion_answer_id`);

--
-- Indexes for table `form_corrections`
--
ALTER TABLE `form_corrections`
  ADD PRIMARY KEY (`correction_id`);

--
-- Indexes for table `form_correction_check`
--
ALTER TABLE `form_correction_check`
  ADD PRIMARY KEY (`correction_check_id`);

--
-- Indexes for table `form_questions`
--
ALTER TABLE `form_questions`
  ADD PRIMARY KEY (`form_question_id`);

--
-- Indexes for table `form_question_choices`
--
ALTER TABLE `form_question_choices`
  ADD PRIMARY KEY (`form_question_choice_id`);

--
-- Indexes for table `form_question_options`
--
ALTER TABLE `form_question_options`
  ADD PRIMARY KEY (`form_question_option_id`);

--
-- Indexes for table `grade_scores`
--
ALTER TABLE `grade_scores`
  ADD PRIMARY KEY (`grade_score_id`),
  ADD KEY `fk_parent_grade_scores` (`parent_id`);

--
-- Indexes for table `grade_show_requests`
--
ALTER TABLE `grade_show_requests`
  ADD PRIMARY KEY (`grade_show_request_id`);

--
-- Indexes for table `grading_categories`
--
ALTER TABLE `grading_categories`
  ADD PRIMARY KEY (`grading_category_id`),
  ADD KEY `fk_platform_categories` (`grading_platform_id`);

--
-- Indexes for table `grading_platforms`
--
ALTER TABLE `grading_platforms`
  ADD PRIMARY KEY (`grading_platform_id`),
  ADD KEY `fk_section_subject_platforms` (`section_subject_id`);

--
-- Indexes for table `grading_scores`
--
ALTER TABLE `grading_scores`
  ADD PRIMARY KEY (`grading_score_id`),
  ADD KEY `fk_score_column` (`grading_score_column_id`),
  ADD KEY `fk_student_scores` (`student_id`);

--
-- Indexes for table `grading_score_columns`
--
ALTER TABLE `grading_score_columns`
  ADD PRIMARY KEY (`grading_score_column_id`),
  ADD KEY `fk_category_columns` (`grading_category_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `fk_user_posts` (`user_id`);

--
-- Indexes for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD PRIMARY KEY (`post_comment_id`),
  ADD KEY `fk_post_comments` (`post_id`),
  ADD KEY `fk_user_comments` (`user_id`);

--
-- Indexes for table `post_likes`
--
ALTER TABLE `post_likes`
  ADD PRIMARY KEY (`post_like_id`),
  ADD KEY `fk_post_likes` (`post_id`),
  ADD KEY `fk_user_likes` (`user_id`);

--
-- Indexes for table `post_medias`
--
ALTER TABLE `post_medias`
  ADD PRIMARY KEY (`post_medias`),
  ADD KEY `fk_post_medias` (`post_id`);

--
-- Indexes for table `professors`
--
ALTER TABLE `professors`
  ADD PRIMARY KEY (`professor_id`),
  ADD KEY `user` (`user_id`);

--
-- Indexes for table `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`resources_id`),
  ADD KEY `fk_resources_group` (`resources_group_id`),
  ADD KEY `fk_section_resources` (`section_id`),
  ADD KEY `fk_section_subject_resources` (`section_subject_id`);

--
-- Indexes for table `resources_groups`
--
ALTER TABLE `resources_groups`
  ADD PRIMARY KEY (`resources_group_id`),
  ADD KEY `fk_section_groups` (`section_id`),
  ADD KEY `fk_section_subject_groups` (`section_subject_id`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`schedule_id`);

--
-- Indexes for table `schedule_items`
--
ALTER TABLE `schedule_items`
  ADD PRIMARY KEY (`schedule_item_id`),
  ADD KEY `fk_schedule_items` (`schedule_id`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`section_id`),
  ADD KEY `fk_adviser_sections` (`adviser_id`),
  ADD KEY `fk_course_sections` (`course_id`);

--
-- Indexes for table `section_students`
--
ALTER TABLE `section_students`
  ADD PRIMARY KEY (`section_student_id`),
  ADD KEY `fk_section_students` (`section_id`),
  ADD KEY `fk_student_sections` (`student_id`);

--
-- Indexes for table `section_student_irregular_subjects`
--
ALTER TABLE `section_student_irregular_subjects`
  ADD PRIMARY KEY (`irregular_subject_id`);

--
-- Indexes for table `section_subjects`
--
ALTER TABLE `section_subjects`
  ADD PRIMARY KEY (`section_subject_id`);

--
-- Indexes for table `staffs`
--
ALTER TABLE `staffs`
  ADD PRIMARY KEY (`staff_id`),
  ADD KEY `fk_user_staffs` (`user_id`),
  ADD KEY `fk_department_staffs` (`department_id`);

--
-- Indexes for table `sticky_notes`
--
ALTER TABLE `sticky_notes`
  ADD PRIMARY KEY (`sticky_note_id`),
  ADD KEY `fk_section_notes` (`section_id`),
  ADD KEY `fk_professor_notes` (`professor_id`),
  ADD KEY `fk_user_notes` (`user_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`),
  ADD KEY `fk_course_subjects` (`course_id`);

--
-- Indexes for table `subject_attendances`
--
ALTER TABLE `subject_attendances`
  ADD PRIMARY KEY (`attendance_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `activities_complied`
--
ALTER TABLE `activities_complied`
  MODIFY `comply_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `announcement_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `classrooms`
--
ALTER TABLE `classrooms`
  MODIFY `classroom_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `email_verifications`
--
ALTER TABLE `email_verifications`
  MODIFY `verification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `exam_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `forms`
--
ALTER TABLE `forms`
  MODIFY `form_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `form_completions`
--
ALTER TABLE `form_completions`
  MODIFY `form_completion_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `form_completion_answers`
--
ALTER TABLE `form_completion_answers`
  MODIFY `form_completion_answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `form_corrections`
--
ALTER TABLE `form_corrections`
  MODIFY `correction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `form_correction_check`
--
ALTER TABLE `form_correction_check`
  MODIFY `correction_check_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `form_questions`
--
ALTER TABLE `form_questions`
  MODIFY `form_question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `form_question_choices`
--
ALTER TABLE `form_question_choices`
  MODIFY `form_question_choice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `form_question_options`
--
ALTER TABLE `form_question_options`
  MODIFY `form_question_option_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `grade_scores`
--
ALTER TABLE `grade_scores`
  MODIFY `grade_score_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `grade_show_requests`
--
ALTER TABLE `grade_show_requests`
  MODIFY `grade_show_request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `grading_categories`
--
ALTER TABLE `grading_categories`
  MODIFY `grading_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `grading_platforms`
--
ALTER TABLE `grading_platforms`
  MODIFY `grading_platform_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `grading_scores`
--
ALTER TABLE `grading_scores`
  MODIFY `grading_score_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `grading_score_columns`
--
ALTER TABLE `grading_score_columns`
  MODIFY `grading_score_column_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `post_comments`
--
ALTER TABLE `post_comments`
  MODIFY `post_comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `post_likes`
--
ALTER TABLE `post_likes`
  MODIFY `post_like_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `post_medias`
--
ALTER TABLE `post_medias`
  MODIFY `post_medias` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `professors`
--
ALTER TABLE `professors`
  MODIFY `professor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `resources_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `resources_groups`
--
ALTER TABLE `resources_groups`
  MODIFY `resources_group_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `schedule_items`
--
ALTER TABLE `schedule_items`
  MODIFY `schedule_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `section_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `section_students`
--
ALTER TABLE `section_students`
  MODIFY `section_student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `section_student_irregular_subjects`
--
ALTER TABLE `section_student_irregular_subjects`
  MODIFY `irregular_subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `section_subjects`
--
ALTER TABLE `section_subjects`
  MODIFY `section_subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `staffs`
--
ALTER TABLE `staffs`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sticky_notes`
--
ALTER TABLE `sticky_notes`
  MODIFY `sticky_note_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `subject_attendances`
--
ALTER TABLE `subject_attendances`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `fk_section_subject_activities` FOREIGN KEY (`section_subject_id`) REFERENCES `section_subjects` (`section_subject_id`) ON DELETE CASCADE;

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `fk_user_announcements` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
