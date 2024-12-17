-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 17, 2024 at 02:00 PM
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
-- Database: `lms_db`
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
(1, 1, 'Activity 11', 'This is sample activity description', '2024-11-07 00:00:00', NULL, 'File', 'On Going', 0, '2024-10-23 01:45:05'),
(2, 1, 'Activity 2', 'Nanaman?', NULL, NULL, 'Link', 'On Going', 0, '2024-10-31 06:46:03'),
(3, 1, 'Activity 3', 'Text lang naman to', '0000-00-00 00:00:00', NULL, 'Text', 'On Going', 0, '2024-10-31 06:49:44'),
(4, 1, 'A', 'aw', NULL, NULL, 'Link', 'On Going', 0, '2024-10-31 06:52:08'),
(5, 4, 'Activity 1', 'Please Describe what is Unity', '2024-11-15 00:00:00', NULL, 'Text', 'On Going', 0, '2024-11-13 07:38:31'),
(6, 4, 'Yahhh', 'hatdog', NULL, NULL, 'File', 'On Going', 0, '2024-12-15 12:57:02');

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
(2, 2, 5, '', 'https://www.chess.com/home', '', 0, '2024-11-01 13:14:04'),
(3, 1, 5, '', '', '', 0, '2024-11-05 14:37:45'),
(4, 5, 10, 'Unityyyyyyy wasssssssssss Unityyyyy pooooo', '', '', 0, '2024-11-13 07:40:29'),
(5, 6, 10, '', '', 'public/assets/media/uploads/activities_complied/INSTRUCTION.PNG.PNG', 0, '2024-12-15 12:58:11');

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
(7, 1, 0, 'Announcement 1', '<p>aBBABABA</p>', '2024-11-29 14:39:00', '2024-12-03 14:39:00', 0, '2024-11-29 06:39:56');

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
(2, 'EDTECH', 'Bldg. 1', 'Ground Floor', 1, '2024-11-09 05:52:07'),
(3, 'INSPIRE', 'bldg. 1', 'Ground Floor', 1, '2024-11-09 05:52:29'),
(4, 'DMDY - 201', 'bldg. 1', 'Ground Floor', 1, '2024-11-09 05:52:57'),
(5, 'DMDY - 202', 'Bldg. 1', 'Ground Floor', 1, '2024-11-09 05:53:13'),
(6, 'WAR ROOM', 'bldg. 1', 'Ground Floor', 1, '2024-11-09 05:53:22'),
(7, 'CCS LAB', 'bldg. 2', 'Second Floor', 1, '2024-11-09 05:53:39'),
(8, 'ELIDA HOTEL', 'bldg. 2', 'Second Floor', 1, '2024-11-09 05:53:53'),
(9, 'ROBOTICS', 'bldg. 2', 'Second Floor', 1, '2024-11-09 05:54:28'),
(10, 'DISCUSSION ROOM', 'bldg. 2', 'Second Floor', 1, '2024-11-09 05:55:04'),
(11, 'SPARKLAB', 'Bldg. 2', 'SHS Second Floor', 1, '2024-11-09 05:56:00');

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
(1, 'BSIT', 'Bachelors of Science In Information Technology', 1, '2024-09-29 17:09:23'),
(2, 'BSMT', 'Bachelor of Science in Maritime Education', 1, '2024-11-09 06:07:04'),
(3, 'BSCPE', 'Bachelor of Science in Computer Engineering', 1, '2024-11-09 06:07:48'),
(4, 'BSCS', 'Bachelor of Science in Computer Science', 1, '2024-11-09 06:08:04'),
(5, 'BSBA', 'Bachelor of Science in Business Ad', 1, '2024-11-09 06:08:32'),
(6, 'BSM', 'Bachelor of Science in Midwifery', 1, '2024-11-09 06:11:53'),
(7, 'ACT', 'Associate in Computer Technology', 1, '2024-11-09 06:12:29'),
(8, 'BSN', 'Bachelor of Science in Nursing', 1, '2024-11-09 06:13:14'),
(9, 'BSEd', 'Bachelor in Secondary Education', 1, '2024-11-09 06:13:44'),
(10, 'BEEd', 'Bachelor in Elementary Education', 1, '2024-11-09 06:13:59'),
(11, 'BSAIS/BSAcctTech', 'Bachelor of Science in Accounting Information System / Bachelor of Science in Accounting Technology', 1, '2024-11-09 06:14:11'),
(12, 'BSA', 'Bachelor of Science in Accountancy', 1, '2024-11-09 06:14:27');

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
(2, 'College of Computer Studies', 'Ann Lim', 1, '2024-11-09 05:49:32'),
(3, 'College of Arts & Sciences', 'Ann Lim', 1, '2024-11-09 05:49:50'),
(4, 'College of Maritime Education', 'Ann Lim', 1, '2024-11-09 05:50:06'),
(5, 'College of Accountancy', 'Ann Lim', 1, '2024-11-09 05:50:16'),
(6, 'College of Education', 'Ann Lim', 1, '2024-11-09 05:50:25'),
(7, 'College of Health & Sciences', 'Ann Lim', 1, '2024-11-09 05:50:36'),
(8, 'College of Business Administration', 'Ann Lim', 1, '2024-11-09 05:50:55'),
(9, 'College of Hospitality Management and Tourism', 'Ann Lim', 1, '2024-11-09 05:51:15'),
(10, 'School of Mecahincal Engineering', 'Ann Lim', 1, '2024-11-09 05:51:35');

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
(28, '5', '588162', '2024-11-05 13:44:24'),
(30, '4', '358643', '2024-11-08 05:26:44'),
(40, '3', '795574', '2024-11-09 05:10:35'),
(43, '11', '965434', '2024-11-09 05:21:32'),
(44, '53', '290250', '2024-11-09 05:48:06'),
(89, '1', '444549', '2024-12-16 06:46:27'),
(91, '32', '279849', '2024-12-16 14:27:11'),
(92, '10', '334131', '2024-12-17 04:11:49');

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
(20, 1, '2024-11-09 00:00:00', '2024-12-09 00:00:00', 'Regional Assembly of Information Technology Education (RAITE) ', 'public/assets/media/uploads/H.jpg', '<p>Located @ Angeles City Pampanga</p>', 0, '2024-11-09 05:05:46');

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
(2, 4, 4, 'Exam Nanaman', '', 2, '50', '2024-11-14 02:30:00', '2024-11-29', '', 1, 0, 0, '2024-11-11 18:30:32'),
(3, 4, 4, 'Web Development Exam ', '', 4, '30', '2024-11-13 15:36:00', '2024-11-21', '', 2, 0, 0, '2024-11-13 07:36:38'),
(4, 4, 4, 'Semi final exam', 'SEMIs', 5, '30', '2024-11-14 13:00:00', '2024-11-14', '', 3, 0, 0, '2024-11-14 05:03:58'),
(5, 4, 6, 'Exam', '', 8, '50', '2024-12-18 10:11:00', '2024-12-18', '', 6, 0, 0, '2024-12-15 02:11:47'),
(6, 4, 4, 'Examin nyo to guyz', '', 8, '50', '2024-12-15 10:12:00', '2024-12-24', '', 6, 0, 0, '2024-12-15 02:12:23'),
(7, 4, 4, 'Ahhm', '', 3, '22', '2024-12-15 10:25:00', '2024-12-31', '', 7, 0, 0, '2024-12-15 02:25:18'),
(8, 4, 4, 'Exam To Guyz', '', 8, '50', '2024-12-17 12:12:00', '2024-12-19', '', 8, 0, 0, '2024-12-17 04:13:02');

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
(1, 4, 'Untitled Form', 'Click to add description', 'Exam', '50', '80', 0, '2024-11-11 16:33:16'),
(2, 4, 'Web Development Exam', 'This is exam', 'Exam', '30', '100', 0, '2024-11-13 07:35:52'),
(3, 4, 'Semi final exam', 'Click to add description', 'Exam', '30', '30', 0, '2024-11-14 05:01:28'),
(4, 4, 'Semi final exam', 'Click to add description', 'Exam', '30', '50', 0, '2024-11-14 05:02:29'),
(5, 4, 'Cute Form', 'Make sure you answer this respectfully and honestly', 'Survey', '10', '20', 0, '2024-12-14 15:39:20'),
(6, 4, 'Untitled Form', 'Click to add description', 'Exam', '50', '50', 0, '2024-12-15 02:04:40'),
(7, 4, 'Luh Form', 'Luh sila', 'Exam', '22', '10', 0, '2024-12-15 02:24:45'),
(8, 4, 'Mass Form', 'Yahh', 'Exam', '50', '8', 0, '2024-12-15 15:23:34'),
(9, 4, 'Untitled Form', 'Click to add description', 'Survey', '2', '2', 0, '2024-12-17 05:23:16');

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
(9, 8, 10, 8, 0, '2024-12-17 04:53:23');

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
(9, 8, 33, 'multiple-choice', 'A', 48, 0, '2024-12-17 04:13:48'),
(10, 8, 34, 'checkbox', '[\"B\"]', 0, 0, '2024-12-17 04:13:48'),
(11, 8, 35, 'dropdown', 'B', 58, 0, '2024-12-17 04:13:48'),
(12, 8, 36, 'true-false', 'True', 0, 0, '2024-12-17 04:13:48'),
(13, 8, 37, 'fill-blank', '[{\"blankId\":\"blank_1734276145628_1\",\"answer\":\"hatdog\"},{\"blankId\":\"blank_1734276151316_2\",\"answer\":\"doghat\"}]', 0, 0, '2024-12-17 04:13:48'),
(14, 8, 39, 'short-answer', 'sam', 0, 0, '2024-12-17 04:13:48'),
(15, 8, 40, 'paragraph', 'cat', 0, 0, '2024-12-17 04:13:48'),
(16, 9, 33, 'multiple-choice', 'A', 48, 0, '2024-12-17 04:53:23'),
(17, 9, 34, 'checkbox', '[\"B\",\"C\"]', 0, 0, '2024-12-17 04:53:23'),
(18, 9, 35, 'dropdown', 'D', 60, 0, '2024-12-17 04:53:23'),
(19, 9, 36, 'true-false', 'True', 0, 0, '2024-12-17 04:53:23'),
(20, 9, 37, 'fill-blank', '[{\"blankId\":\"blank_1734276145628_1\",\"answer\":\"hatdog\"},{\"blankId\":\"blank_1734276151316_2\",\"answer\":\"doghat\"}]', 0, 0, '2024-12-17 04:53:23'),
(21, 9, 38, 'matching', '[\"A\",\"B\"]', 0, 0, '2024-12-17 04:53:23'),
(22, 9, 39, 'short-answer', 'sat', 0, 0, '2024-12-17 04:53:23'),
(23, 9, 40, 'paragraph', 'awdaw aw wa aw dog', 0, 0, '2024-12-17 04:53:23');

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
(2, 8, '{\"33\":[\"A\"],\"34\":[\"C\",\"D\"],\"35\":\"C\",\"36\":\"False\",\"37\":[{\"blankId\":\"blank_1734276145628_1\",\"answer\":\"hatdog\"},{\"blankId\":\"blank_1734276151316_2\",\"answer\":\"doghat\"}],\"38\":{\"0\":\"A\",\"1\":\"B\"},\"39\":{\"type\":\"specific\",\"text\":\"sana lahat\"},\"40\":{\"type\":\"keyword\",\"keywords\":[\"hatdog\",\"dog\"]}}', '2024-12-16 14:55:53');

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
(2, 10, 9, 2, 8, '25', '[{\"question_id\":33,\"user_answer\":\"A\",\"correct_answer\":[\"A\"]},{\"question_id\":34,\"user_answer\":\"[\"B\",\"C\"]\",\"correct_answer\":[\"C\",\"D\"]},{\"question_id\":35,\"user_answer\":\"D\",\"correct_answer\":\"C\"},{\"question_id\":36,\"user_answer\":\"True\",\"correct_answer\":\"False\"},{\"question_id\":37,\"user_answer\":\"[{\"blankId\":\"blank_1734276145628_1\",\"answer\":\"hatdog\"},{\"blankId\":\"blank_1734276151316_2\",\"answer\":\"doghat\"}]\",\"correct_answer\":[{\"blankId\":\"blank_1734276145628_1\",\"answer\":\"hatdog\"},{\"blankId\":\"blank_1734276151316_2\",\"answer\":\"doghat\"}]},{\"question_id\":38,\"user_answer\":\"[\"A\",\"B\"]\",\"correct_answer\":[\"A\",\"B\"]},{\"question_id\":39,\"user_answer\":\"sat\",\"correct_answer\":{\"type\":\"specific\",\"text\":\"sana lahat\"}},{\"question_id\":40,\"user_answer\":\"awdaw aw wa aw dog\",\"correct_answer\":{\"type\":\"keyword\",\"keywords\":[\"hatdog\",\"dog\"]}}]', '2024-12-17 12:26:34');

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
(1, 1, '1', 'Multiple Choice', 'multiple-choice', '', 1, 0, '2024-11-11 16:33:16'),
(2, 1, '3', 'Dropdown', 'dropdown', '', 1, 0, '2024-11-11 16:33:16'),
(3, 2, '1', 'awdaw', 'checkbox', '', 1, 0, '2024-11-13 07:35:52'),
(4, 2, '3', 'AWdwa', 'dropdown', '', 1, 0, '2024-11-13 07:35:52'),
(5, 2, '2', 'AWdwa44', 'paragraph', '', 1, 0, '2024-11-13 07:35:52'),
(6, 2, '4', 'Another question', 'dropdown', '', 1, 0, '2024-11-13 07:35:52'),
(7, 3, '1', 'Who found the earth', 'multiple-choice', '', 1, 0, '2024-11-14 05:01:28'),
(8, 3, '2', 'What was the name of the earth before?', 'multiple-choice', '', 1, 0, '2024-11-14 05:01:28'),
(9, 3, '3', 'Explain yourself in 3 words.', 'short-answer', '', 1, 0, '2024-11-14 05:01:28'),
(10, 3, '4', 'Who is me?', 'dropdown', '', 1, 0, '2024-11-14 05:01:28'),
(11, 3, '5', 'You sure?', 'checkbox', '', 1, 0, '2024-11-14 05:01:28'),
(12, 4, '1', 'Who found the earth', 'multiple-choice', '', 1, 0, '2024-11-14 05:02:29'),
(13, 4, '2', 'What was the name of the earth before?', 'multiple-choice', '', 1, 0, '2024-11-14 05:02:29'),
(14, 4, '3', 'Explain yourself in 3 words.', 'short-answer', '', 1, 0, '2024-11-14 05:02:29'),
(15, 4, '4', 'Who is me?', 'dropdown', '', 1, 0, '2024-11-14 05:02:29'),
(16, 4, '5', 'You sure?', 'checkbox', '', 1, 0, '2024-11-14 05:02:29'),
(17, 5, '1', 'Who is the Philippines national Hero?', 'multiple-choice', '', 1, 0, '2024-12-14 15:39:20'),
(18, 5, '2', 'Who is the cutest?', 'checkbox', '', 1, 0, '2024-12-14 15:39:20'),
(19, 5, '3', 'Ye Yo Yi', 'dropdown', '', 1, 0, '2024-12-14 15:39:20'),
(20, 5, '4', 'Cute ka ba?', 'short-answer', '', 1, 0, '2024-12-14 15:39:20'),
(21, 5, '5', 'Please write an essay about the programmer', 'paragraph', '', 1, 0, '2024-12-14 15:39:20'),
(22, 6, '1', 'Choice', 'multiple-choice', '', 1, 0, '2024-12-15 02:04:40'),
(23, 6, '2', 'Chk', 'checkbox', '', 1, 0, '2024-12-15 02:04:40'),
(24, 6, '3', 'Huhh', 'dropdown', '', 1, 0, '2024-12-15 02:04:40'),
(25, 6, '4', 'Wehh??', 'true-false', '', 1, 0, '2024-12-15 02:04:40'),
(26, 6, '5', 'The right&nbsp;<span class=\"blank-space\" contenteditable=\"false\" data-blank-id=\"blank_1734228211057_1\">[Blank 1]</span>&nbsp;are the&nbsp;<span class=\"blank-space\" contenteditable=\"false\" data-blank-id=\"blank_1734228216185_2\">[Blank 2]</span>&nbsp;part of the body', 'fill-blank', '', 1, 0, '2024-12-15 02:04:40'),
(27, 6, '6', '', 'matching', '', 1, 0, '2024-12-15 02:04:40'),
(28, 6, '7', 'Short', 'short-answer', '', 1, 0, '2024-12-15 02:04:40'),
(29, 6, '8', 'Paragraph', 'paragraph', '', 1, 0, '2024-12-15 02:04:40'),
(30, 7, '1', 'TF', 'true-false', '', 1, 0, '2024-12-15 02:24:45'),
(31, 7, '2', 'Hat&nbsp;<span class=\"blank-space\" contenteditable=\"false\" data-blank-id=\"blank_1734229434555_1\">[Blank 1]</span>&nbsp;ka&nbsp;<span class=\"blank-space\" contenteditable=\"false\" data-blank-id=\"blank_1734229438330_2\">[Blank 2]</span>&nbsp;?', 'fill-blank', '', 1, 0, '2024-12-15 02:24:45'),
(32, 7, '3', '', 'matching', '', 1, 0, '2024-12-15 02:24:45'),
(33, 8, '1', 'Multiple choce', 'multiple-choice', '', 1, 0, '2024-12-15 15:23:34'),
(34, 8, '2', 'Checkbox', 'checkbox', '', 1, 0, '2024-12-15 15:23:34'),
(35, 8, '3', 'Dropdown', 'dropdown', '', 1, 0, '2024-12-15 15:23:34'),
(36, 8, '4', 'True or False', 'true-false', '', 1, 0, '2024-12-15 15:23:34'),
(37, 8, '5', 'Fill me in on the&nbsp;<span class=\"blank-space\" contenteditable=\"false\" data-blank-id=\"blank_1734276145628_1\">[Blank 1]</span>&nbsp;then&nbsp;<span class=\"blank-space\" contenteditable=\"false\" data-blank-id=\"blank_1734276151316_2\">[Blank 2]</span>&nbsp;me in.', 'fill-blank', '', 1, 0, '2024-12-15 15:23:34'),
(38, 8, '6', '', 'matching', '', 1, 0, '2024-12-15 15:23:34'),
(39, 8, '7', 'Short', 'short-answer', '', 1, 0, '2024-12-15 15:23:34'),
(40, 8, '8', 'Paragraph', 'paragraph', '', 1, 0, '2024-12-15 15:23:34'),
(41, 9, '1', 'Hatdog', 'multiple-choice', '', 1, 0, '2024-12-17 05:23:16'),
(42, 9, '2', 'AAA', 'multiple-choice', '', 1, 0, '2024-12-17 05:23:16');

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
(1, 1, '1', '1', 0, '2024-11-11 16:33:16'),
(2, 1, '2', '2', 0, '2024-11-11 16:33:16'),
(3, 2, '3', '3', 0, '2024-11-11 16:33:16'),
(4, 2, '4', '4', 0, '2024-11-11 16:33:16'),
(5, 3, '1', 'awdwa', 0, '2024-11-13 07:35:52'),
(6, 3, '2', '33', 0, '2024-11-13 07:35:52'),
(7, 3, '3', '32', 0, '2024-11-13 07:35:52'),
(8, 4, '1', '11', 0, '2024-11-13 07:35:52'),
(9, 4, '2', '233', 0, '2024-11-13 07:35:52'),
(10, 6, '1', 'Choice 1', 0, '2024-11-13 07:35:52'),
(11, 6, '2', 'Choice 2', 0, '2024-11-13 07:35:52'),
(12, 10, '1', 'YOU', 0, '2024-11-14 05:01:28'),
(13, 10, '2', 'ME', 0, '2024-11-14 05:01:28'),
(14, 11, '1', 'yes', 0, '2024-11-14 05:01:28'),
(15, 11, '2', 'no', 0, '2024-11-14 05:01:28'),
(16, 15, '1', 'YOU', 0, '2024-11-14 05:02:29'),
(17, 15, '2', 'ME', 0, '2024-11-14 05:02:29'),
(18, 16, '1', 'yes', 0, '2024-11-14 05:02:29'),
(19, 16, '2', 'no', 0, '2024-11-14 05:02:29'),
(20, 17, '1', 'Aguinaldo', 0, '2024-12-14 15:39:20'),
(21, 17, '2', 'Ronaldo', 0, '2024-12-14 15:39:20'),
(22, 17, '3', 'Mr Beast', 0, '2024-12-14 15:39:20'),
(23, 17, '4', 'Jose Rizal', 0, '2024-12-14 15:39:20'),
(24, 18, '1', 'Orlan', 0, '2024-12-14 15:39:20'),
(25, 18, '2', 'Si Onie', 0, '2024-12-14 15:39:20'),
(26, 18, '3', 'Tero', 0, '2024-12-14 15:39:20'),
(27, 18, '4', 'Yung nag program', 0, '2024-12-14 15:39:20'),
(28, 19, '1', 'Ahhh', 0, '2024-12-14 15:39:20'),
(29, 19, '2', 'Ohhh', 0, '2024-12-14 15:39:20'),
(30, 19, '3', 'Ihhhh', 0, '2024-12-14 15:39:20'),
(31, 19, '4', 'Uuuuuu', 0, '2024-12-14 15:39:20'),
(32, 22, '1', 'A', 0, '2024-12-15 02:04:40'),
(33, 22, '2', 'B', 0, '2024-12-15 02:04:40'),
(34, 22, '3', 'C', 0, '2024-12-15 02:04:40'),
(35, 22, '4', 'D', 0, '2024-12-15 02:04:40'),
(36, 23, '1', '1', 0, '2024-12-15 02:04:40'),
(37, 23, '2', '2', 0, '2024-12-15 02:04:40'),
(38, 23, '3', '3', 0, '2024-12-15 02:04:40'),
(39, 23, '4', '4', 0, '2024-12-15 02:04:40'),
(40, 23, '5', '5', 0, '2024-12-15 02:04:40'),
(41, 24, '1', 'A', 0, '2024-12-15 02:04:40'),
(42, 24, '2', 'B', 0, '2024-12-15 02:04:40'),
(43, 24, '3', 'C', 0, '2024-12-15 02:04:40'),
(44, 25, '1', 'True', 0, '2024-12-15 02:04:40'),
(45, 25, '2', 'False', 0, '2024-12-15 02:04:40'),
(46, 30, '1', 'True', 0, '2024-12-15 02:24:45'),
(47, 30, '2', 'False', 0, '2024-12-15 02:24:45'),
(48, 33, '1', 'A', 0, '2024-12-15 15:23:34'),
(49, 33, '2', 'B', 0, '2024-12-15 15:23:34'),
(50, 33, '3', 'C', 0, '2024-12-15 15:23:34'),
(51, 33, '4', 'D', 0, '2024-12-15 15:23:34'),
(52, 34, '1', 'A', 0, '2024-12-15 15:23:34'),
(53, 34, '2', 'B', 0, '2024-12-15 15:23:34'),
(54, 34, '3', 'C', 0, '2024-12-15 15:23:34'),
(55, 34, '4', 'D', 0, '2024-12-15 15:23:34'),
(56, 34, '5', 'E', 0, '2024-12-15 15:23:34'),
(57, 35, '1', 'A', 0, '2024-12-15 15:23:34'),
(58, 35, '2', 'B', 0, '2024-12-15 15:23:34'),
(59, 35, '3', 'C', 0, '2024-12-15 15:23:34'),
(60, 35, '4', 'D', 0, '2024-12-15 15:23:34'),
(61, 36, '1', 'True', 0, '2024-12-15 15:23:34'),
(62, 36, '2', 'False', 0, '2024-12-15 15:23:34'),
(63, 41, '1', 'A', 0, '2024-12-17 05:23:16'),
(64, 41, '2', 'B', 0, '2024-12-17 05:23:16'),
(65, 41, '3', 'C', 0, '2024-12-17 05:23:16'),
(66, 41, '4', 'D', 0, '2024-12-17 05:23:16'),
(67, 42, '1', 'C', 0, '2024-12-17 05:23:16'),
(68, 42, '2', 'D', 0, '2024-12-17 05:23:16');

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
(6, 38, '{\"type\":\"matching\",\"questions\":[\"Male\",\"Female\"],\"words\":[\"Tama\",\"Mali\"]}', '2024-12-15 15:23:34');

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
(1, 3, 1, 'Activity', 100, 0, '2024-11-08 09:30:25'),
(2, 4, 5, 'Activity', 80, 0, '2024-11-13 07:41:03'),
(3, 9, 8, 'Form', 25, 0, '2024-12-17 12:34:25');

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
(1, 1, 'Written Works', 30, 0, '2024-10-29 01:16:42'),
(2, 1, 'Performance Tasks', 50, 0, '2024-10-29 01:16:42'),
(3, 1, 'Exams', 20, 0, '2024-10-29 01:16:42'),
(20, 5, 'Written Works', 30, 0, '2024-12-15 13:21:41'),
(21, 5, 'Performance Tasks', 50, 0, '2024-12-15 13:21:41'),
(22, 5, 'Exams', 20, 0, '2024-12-15 13:21:41'),
(26, 7, 'Written Works', 30, 0, '2024-12-15 13:26:59'),
(27, 7, 'Performance Tasks', 50, 0, '2024-12-15 13:26:59'),
(28, 7, 'Exams', 20, 0, '2024-12-15 13:26:59');

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
(7, 4, 0, '2024-12-15 13:26:59');

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
(13, 19, 10, 100, 0, '2024-12-15 13:44:28');

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
(19, 26, '1', 100, 0, '2024-12-15 13:26:59');

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
(7, 3, 2, '<p><strong>Introducing</strong> our latest book acquisitions for General Education. These books are ready for borrowing at the Sofia Library – Elida Campus.</p><p>Check out these books now, <strong>DYCIans</strong>!<br>&nbsp;</p>', 0, 0, '2024-11-09 04:38:19'),
(8, 3, 2, '<p>Good day, <strong>Dycians</strong>!</p><p>Discover our collection of online resources, tailored to meet your learning and research needs. Explore a world of information from eBooks to academic journals and educational databases.&nbsp;</p><p>Below are the online resources of the DYCI Library Services with their respective access information:</p>', 0, 0, '2024-11-09 05:12:08'),
(13, 32, 2, '<p>HAHAHA</p>', 4, 0, '2024-11-12 19:37:03'),
(14, 32, 2, '<p>Nice</p>', 4, 0, '2024-11-12 19:37:37');

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
(2, 2, 4, 'This is my comment', 0, '2024-10-31 17:25:25'),
(3, 14, 10, 'yahh', 0, '2024-12-15 11:58:45');

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
(14, 4, 4, '2024-10-23 06:03:02'),
(16, 2, 3, '2024-10-23 06:04:26'),
(22, 2, 4, '2024-10-31 09:17:28'),
(24, 7, 3, '2024-11-09 04:51:31'),
(25, 7, 1, '2024-11-09 04:53:07'),
(26, 8, 3, '2024-11-09 05:12:31'),
(27, 8, 11, '2024-11-09 05:21:59'),
(28, 7, 11, '2024-11-09 05:22:00');

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

--
-- Dumping data for table `post_medias`
--

INSERT INTO `post_medias` (`post_medias`, `post_id`, `filepath`, `status`, `date_created`) VALUES
(1, 2, 'public/assets/media/uploads/pngtree-rainbow-curves-abstract-colorful-background-image_2164067.jpg', 0, '2024-10-10 05:34:18'),
(2, 3, 'public/assets/media/uploads/g.jpg', 0, '2024-10-10 05:46:11'),
(3, 6, 'public/assets/media/uploads/P.png', 0, '2024-11-09 04:33:56'),
(4, 7, 'public/assets/media/uploads/1.png', 0, '2024-11-09 04:38:19'),
(5, 8, 'public/assets/media/uploads/1(1).png', 0, '2024-11-09 05:12:08'),
(6, 10, 'public/assets/media/uploads/e.mp4', 0, '2024-11-09 05:15:02');

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
(4, 32, 1, 'Specializes in Software Development and Programming', 1, '2024-11-09 06:16:54'),
(5, 34, 1, 'Proficient in Web and Mobile Application Development', 1, '2024-11-09 06:17:25'),
(6, 35, 1, 'Experienced in IT Project Management and Business Solutions', 1, '2024-11-09 06:18:10'),
(7, 38, 1, 'Focused on Data Management and Cybersecurity', 1, '2024-11-09 06:19:30'),
(8, 36, 1, 'Expert in Network and Systems Administration', 1, '2024-11-09 06:19:57'),
(9, 42, 1, 'Skilled in Human-Computer Interaction and User Experience Design', 1, '2024-11-09 06:20:39'),
(10, 40, 1, 'Advocate for IT Ethics and Professionalism', 1, '2024-11-09 06:21:04'),
(11, 50, 1, 'Mentor in Research and Development in IT', 1, '2024-11-09 06:21:32'),
(12, 51, 1, 'Specialized in Mobile Computing and Internet of Things (IoT)', 1, '2024-11-09 06:21:52'),
(13, 49, 1, 'Proficient in IT Hardware and Electronics', 1, '2024-11-09 06:22:09'),
(14, 52, 1, 'Mentor in Research and Development in IT', 1, '2024-11-09 06:22:40'),
(15, 40, 9, 'AA', 1, '2024-12-15 12:22:43');

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
(5, 'GRP-1729645498-7DJESWB4', 9, 1, 1, 'Resources 1', '...', 22479, 'sql', 'cmdc.sql', 'public/assets/media/resources/GRP-1729645498-7DJESWB4/cmdc.sql', 0, '2024-10-23 01:04:58'),
(6, 'GRP-1729645498-7DJESWB4', 9, 1, 1, 'a', 'awa', 1147, 'png', 'Screenshot 2024-09-09 064320.png', 'public/assets/media/resources/GRP-1729645498-7DJESWB4/Screenshot 2024-09-09 064320.png', 0, '2024-11-05 15:15:57'),
(7, 'GRP-1731327173-2Q65N4OF', 10, 4, 4, 'Resource', 'awdaw', 63288, 'png', 'Screenshot 2024-09-03 171854.png', 'public/assets/media/resources/GRP-1731327173-2Q65N4OF/Screenshot 2024-09-03 171854.png', 0, '2024-11-11 12:12:53');

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
(9, 1, 1, 'GRP-1729645498-7DJESWB4', 'Resources Group', '...', 0, '2024-10-23 01:04:58'),
(10, 4, 4, 'GRP-1731327173-2Q65N4OF', 'Resource', 'AAAA', 0, '2024-11-11 12:12:53');

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
(4, 4, 'Subject Capstone Project and Research 2 Schedule', 1, '2024-12-15 12:50:45');

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
(7, 4, 'Monday', '20:50:00', '21:50:00', 1, '2024-12-15 12:50:45'),
(8, 4, 'Tuesday', '22:50:00', '12:50:00', 1, '2024-12-15 12:50:45');

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
(4, 'BSIT 1 A', 4, 1, 1, 1, 0, '2024-11-10 21:02:23');

-- --------------------------------------------------------

--
-- Table structure for table `section_students`
--

CREATE TABLE `section_students` (
  `section_student_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section_students`
--

INSERT INTO `section_students` (`section_student_id`, `section_id`, `student_id`, `status`, `date_created`) VALUES
(2, 1, 5, 1, '2024-09-30 00:17:18'),
(3, 1, 9, 1, '2024-10-23 09:19:03'),
(4, 4, 10, 1, '2024-11-10 21:02:32'),
(5, 4, 11, 1, '2024-11-10 21:02:32'),
(6, 4, 12, 1, '2024-11-10 21:02:32'),
(7, 4, 13, 1, '2024-11-10 21:02:32'),
(8, 4, 14, 1, '2024-11-10 21:02:32');

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
(1, 1, 1, 1, 0, 0, 0, '2024-10-07 00:22:41'),
(2, 1, 2, 2, 0, 0, 0, '2024-10-23 09:15:42'),
(3, 1, 3, 3, 0, 0, 0, '2024-10-23 09:19:03'),
(4, 4, 4, 4, 4, 0, 0, '2024-11-10 21:02:49');

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
(2, 1, 1, 4, 0.193506, 0.12, 0.267064, 0.284, 0, 'This is first sticky ', 'rgb(255, 229, 180)', 0, 0, '0000-00-00 00:00:00'),
(3, 1, 1, 4, 0.62699256110521, 0.061666666666667, 0.2125398512221, 0.33333333333333, 0, 'Yeeyy', 'rgb(242, 115, 115)', 0, 0, '0000-00-00 00:00:00'),
(4, 1, 1, 4, 0.45377258235919, 0.51166666666667, 0.2125398512221, 0.33333333333333, 0, 'Lastt', 'rgb(174, 198, 207)', 0, 0, '0000-00-00 00:00:00'),
(5, 1, 1, 5, 0.0896624, 0.528, 0.315599, 0.286, 0, 'Hello', 'rgb(230, 230, 250)', 0, 0, '0000-00-00 00:00:00'),
(6, 4, 4, 32, 0.143231, 0.1, 0.367052, 0.301625, 0, 'For Example Note', 'rgb(230, 230, 250)', 0, 0, '2024-11-13 07:37:39');

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
(4, 'Capstone Project and Research 2', 'CPR2413', 1, 1, '2024-11-09 05:57:12'),
(5, 'Free Elective 4 (Data Analytics)', 'FRE413', 1, 1, '2024-11-09 05:57:33'),
(6, 'Asian Language (Conversational)', 'FL2413', 1, 1, '2024-11-09 05:57:50'),
(7, 'Quantitative Methods (Modeling and Simulation)', 'QME413', 1, 1, '2024-11-09 05:58:07'),
(8, 'IT Current Trends, Seminars and Fieldtrips', 'ICT413', 1, 1, '2024-11-09 05:58:34'),
(9, 'Professional Elective 3', 'PRO413', 1, 1, '2024-11-09 05:58:56'),
(10, 'Networking and Communications 3', 'NAC303', 1, 1, '2024-11-09 06:00:37'),
(11, 'Fundamentals of System Integration and Architecture', 'SIA303', 1, 1, '2024-11-09 06:00:56'),
(12, 'Software Engineering 2', 'SOE323', 1, 1, '2024-11-09 06:01:27'),
(13, 'Professional Elective 2 / Web Systems and Technologies', 'PRO323', 1, 1, '2024-11-09 06:01:42'),
(14, 'Capstone Project and Research 1', 'CPR1323', 1, 1, '2024-11-09 06:01:57'),
(15, '	Advance Information Assurance and Security', 'AIA323', 1, 1, '2024-11-09 06:02:15'),
(16, 'Software Engineering 1', 'SOE313', 1, 1, '2024-11-09 06:02:58'),
(17, 'System Administration and Maintenance', 'SAM313', 1, 1, '2024-11-09 06:03:13'),
(18, 'Professional Elective 1 / Integrative Programming 2', 'PRO313', 1, 1, '2024-11-09 06:03:41'),
(19, 'Networking and Communications 2', 'NAC313', 1, 1, '2024-11-09 06:04:05'),
(20, 'Information Assurance and Security 1', 'IAS313', 1, 1, '2024-11-09 06:04:17'),
(21, 'Free Elective 2 / Project Management', 'FRE313', 1, 1, '2024-11-09 06:04:33'),
(22, 'Fundamentals of Operating Systems', 'FOS313', 1, 1, '2024-11-09 06:04:43'),
(23, '	Applications Development and Emerging Technologies', 'ADT313', 1, 1, '2024-11-09 06:04:52');

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
(1, 4, '{\"2024-11-08\":{\"10\":\"absent\",\"11\":\"present\",\"12\":\"present\",\"13\":\"present\"},\"2024-11-11\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\",\"13\":\"present\"},\"2024-11-12\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\",\"13\":\"present\"},\"2024-11-13\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\",\"13\":\"present\"},\"2024-11-14\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\",\"13\":\"present\"},\"2024-11-15\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\"},\"2024-11-16\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\"},\"2024-11-17\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\"},\"2024-11-18\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\"},\"2024-11-19\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\"},\"2024-11-20\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\"},\"2024-11-21\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\"},\"2024-11-22\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\"},\"2024-11-23\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\"},\"2024-11-24\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\"},\"2024-11-25\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\"},\"2024-11-26\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\"},\"2024-11-27\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\"},\"2024-11-28\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\"},\"2024-11-29\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\"},\"2024-11-30\":{\"10\":\"present\",\"11\":\"present\",\"12\":\"present\"},\"2024-11-01\":{\"11\":\"present\",\"12\":\"present\",\"13\":\"present\"},\"2024-11-02\":{\"11\":\"present\",\"12\":\"present\",\"13\":\"present\"},\"2024-11-03\":{\"11\":\"present\",\"12\":\"present\",\"13\":\"present\"},\"2024-11-04\":{\"11\":\"present\",\"12\":\"present\",\"13\":\"present\"},\"2024-11-05\":{\"11\":\"present\",\"12\":\"present\",\"13\":\"present\"},\"2024-11-06\":{\"11\":\"present\",\"12\":\"present\",\"13\":\"present\"},\"2024-11-07\":{\"11\":\"present\",\"12\":\"present\",\"13\":\"present\"},\"2024-11-09\":{\"10\":\"absent\",\"11\":\"present\",\"12\":\"present\",\"13\":\"present\"},\"2024-11-10\":{\"11\":\"present\",\"12\":\"present\",\"13\":\"present\"}}', 0, '2024-11-12 15:40:19', '2024-11-14 04:57:23');

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
(1, '', 'dreiprojects2@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Drei Project', 'Drei', 'Reyez', 'Projects', '2002-03-21', 1, 'public/assets/media/uploads/aa.png.png', '', 4, 0, '2024-09-22 18:45:18', 1),
(3, '', 'dycilibrary@dyci.edu.ph', '827ccb0eea8a706c4c34a16891f84e7b', 'DYCI Library', 'DYCI', '', 'Library', '2024-09-17', 0, '', '', 4, 0, '2024-09-22 21:59:25', 1),
(10, '2021-00964', 'andreicruz@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Andrei Cruz', 'Andrei', '', 'Cruz', '2002-09-30', 0, '', '', 1, 0, '2024-11-09 05:18:28', 1),
(11, '2021-00549', 'stephenivan@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Stephen Santiago', 'Stephen', '', 'Santiago', '2003-09-12', 0, '', '', 1, 0, '2024-11-09 05:19:06', 1),
(12, '2021-00579', 'jainusaurelio@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Jainus Aurelio', 'Jainus', '', 'Aurelio', '2002-08-03', 0, '', '', 1, 0, '2024-11-09 05:19:33', 1),
(13, '2021-01713', 'linuzdelacruz@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Linuz Delacruz', 'Linuz', '', 'Delacruz', '2003-03-06', 0, '', '', 1, 0, '2024-11-09 05:20:21', 1),
(14, '2021-00700', 'markkevin@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Kevin Villanueva', 'Kevin', '', 'Villanueva', '2002-10-02', 0, '', '', 1, 0, '2024-11-09 05:21:19', 1),
(15, '2021-01189', 'dharrelmontion@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Dharrell Montion', 'Dharrell', '', 'Montion', '2003-06-20', 0, '', '', 1, 0, '2024-11-09 05:23:00', 1),
(16, '2021-01529', 'andreidavevillanueva@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Andrei Dave', 'Andrei', '', 'Dave', '2002-10-21', 0, '', '', 1, 0, '2024-11-09 05:27:47', 1),
(17, '2021-01766', 'malacajohnkerwin@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Kerwin Malaca', 'Kerwin', '', 'Malaca', '2003-02-21', 0, '', '', 1, 0, '2024-11-09 05:28:16', 1),
(18, '2021-02086', 'hadjidimarucot@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Hadji Dimarucot', 'Hadji', '', 'Dimarucot', '2002-02-12', 0, '', '', 1, 0, '2024-11-09 05:28:40', 1),
(19, '2021-01989', 'jacobmanalad@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Jacob Manalad', 'Jacob', '', 'Manalad', '2002-12-12', 0, '', '', 1, 0, '2024-11-09 05:29:05', 1),
(20, '2021-01671', 'davidsantiago@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'David Santiago', 'David', '', 'Santiago', '2002-12-12', 0, '', '', 1, 0, '2024-11-09 05:29:28', 1),
(21, '2021-01696', 'alvarezreiniel@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Reiniel Alvarez', 'Reiniel', '', 'Alvarez', '2002-02-12', 0, '', '', 1, 0, '2024-11-09 05:30:03', 1),
(22, '2021-01914', 'patriciacastillo@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Patricia Castillo', 'Patricia', '', 'Castillo', '2003-02-21', 0, '', '', 1, 0, '2024-11-09 05:30:40', 1),
(23, '2021 - 01853', 'delmarkjohn@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Jan Delmarc  Galicia', 'Jan Delmarc ', '', 'Galicia', '2002-02-12', 0, '', '', 1, 0, '2024-11-09 05:31:19', 1),
(24, '2021-01754', 'leighbucad@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Leigh Bucad', 'Leigh', '', 'Bucad', '2002-02-12', 0, '', '', 1, 0, '2024-11-09 05:31:45', 1),
(25, '2021-01598', 'labradormyrvin@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Myrvin Labrador', 'Myrvin', '', 'Labrador', '2002-02-12', 0, '', '', 1, 0, '2024-11-09 05:33:16', 1),
(26, '2021-01593', 'victolerogarvin@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Garvin Victolero', 'Garvin', '', 'Victolero', '2001-02-12', 0, '', '', 1, 0, '2024-11-09 05:33:47', 1),
(27, '2021-01226', 'libunaobianca@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Bianca Libunao', 'Bianca', '', 'Libunao', '2002-12-12', 0, '', '', 1, 0, '2024-11-09 05:34:10', 1),
(28, '2021-00880', 'boonegabriel@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Gabriel Boone', 'Gabriel', '', 'Boone', '2002-12-12', 0, '', '', 1, 0, '2024-11-09 05:34:30', 1),
(29, '2021-01699', 'marinojose@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Jose Marino', 'Jose', '', 'Marino', '2002-02-12', 0, '', '', 1, 0, '2024-11-09 05:34:52', 1),
(30, '2021-00102', 'markemmanuel@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Mark Emmanuel', 'Mark', '', 'Emmanuel', '2002-12-12', 0, '', '', 1, 0, '2024-11-09 05:35:16', 1),
(31, '2021-01959', 'caycoangelanne@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Angel Cayco', 'Angel', '', 'Cayco', '2002-12-12', 0, '', '', 1, 0, '2024-11-09 05:35:41', 1),
(32, '', 'herliza@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Herliza Estrada', 'Herliza', '', 'Estrada', '1980-12-12', 0, '', '', 2, 0, '2024-11-09 05:39:02', 1),
(33, '', 'abbiecasala@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Abbie Casala', 'Abbie', '', 'Casala', '1989-12-12', 0, '', '', 2, 0, '2024-11-09 05:39:20', 1),
(34, '', 'jeremyagapito@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Jeremy Agapito', 'Jeremy', '', 'Agapito', '1999-12-12', 0, '', '', 2, 0, '2024-11-09 05:39:35', 1),
(35, '', 'jocelyntejada@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Jocelyn Tejada', 'Jocelyn', '', 'Tejada', '1970-12-12', 0, '', '', 2, 0, '2024-11-09 05:39:50', 1),
(36, '', 'henrydeguzman@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Henry De Guzman', 'Henry', '', 'De Guzman', '1999-12-12', 0, '', '', 2, 0, '2024-11-09 05:40:06', 1),
(37, '', 'kingolgado@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'King Olgado', 'King', '', 'Olgado', '2002-12-12', 0, '', '', 2, 0, '2024-11-09 05:41:13', 1),
(38, '', 'rowellsantos@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Rowell Santos', 'Rowell', '', 'Santos', '1997-12-12', 0, '', '', 2, 0, '2024-11-09 05:41:27', 1),
(39, '', 'ivymera@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Ivy Mera', 'Ivy', '', 'Mera', '1998-12-12', 0, '', '', 2, 0, '2024-11-09 05:41:45', 1),
(40, '', 'alougonzales@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Alou Bitangcol', 'Alou', '', 'Bitangcol', '1995-12-12', 0, '', '', 2, 0, '2024-11-09 05:41:59', 1),
(41, '', 'lizelledelposo@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Lizelle Del Poso', 'Lizelle', '', 'Del Poso', '1998-12-12', 0, '', '', 2, 0, '2024-11-09 05:42:20', 1),
(42, '', 'albertocruz@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Alberto Cruz', 'Alberto', '', 'Cruz', '1997-12-12', 0, '', '', 2, 0, '2024-11-09 05:42:53', 1),
(43, '', 'jasperalberto@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Jasper  Alberto', 'Jasper ', '', 'Alberto', '1649-12-12', 0, '', '', 2, 0, '2024-11-09 05:43:12', 1),
(44, '', 'carlapineda@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Carla Pineda', 'Carla', '', 'Pineda', '1992-12-12', 0, '', '', 2, 0, '2024-11-09 05:43:32', 1),
(45, '', 'jessmaedelacruz@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Jessa Dela Cruz', 'Jessa', '', 'Dela Cruz', '1992-12-12', 0, '', '', 2, 0, '2024-11-09 05:43:48', 1),
(46, '', 'carinavillanueva@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Carisa Villanueva', 'Carisa', '', 'Villanueva', '1996-12-12', 0, '', '', 2, 0, '2024-11-09 05:44:05', 1),
(47, '', 'leaearl@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Earl  Lea', 'Earl ', '', 'Lea', '1998-12-12', 0, '', '', 2, 0, '2024-11-09 05:44:38', 1),
(48, '', 'jonreebalmeo@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Jonree Balmeo', 'Jonree', '', 'Balmeo', '1888-12-12', 0, '', '', 2, 0, '2024-11-09 05:45:01', 1),
(49, '', 'renenbantillo@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Renen Bantillo', 'Renen', '', 'Bantillo', '2001-12-12', 0, '', '', 2, 0, '2024-11-09 05:45:29', 1),
(50, '', 'annlim@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Ann Lim', 'Ann', '', 'Lim', '2024-12-12', 0, '', '', 2, 0, '2024-11-09 05:45:43', 1),
(51, '', 'litosanjose@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Lito San Jose', 'Lito', '', 'San Jose', '1986-12-12', 0, '', '', 2, 0, '2024-11-09 05:46:38', 1),
(52, '', 'gemmagibaga@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Gemma Gibaga', 'Gemma', '', 'Gibaga', '1875-12-12', 0, '', '', 2, 0, '2024-11-09 05:46:59', 1),
(53, '', 'admin@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Admin Sample', 'Admin', '', 'Sample', '2005-12-12', 0, '', '', 3, 0, '2024-11-09 05:47:58', 1);

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
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `activities_complied`
--
ALTER TABLE `activities_complied`
  MODIFY `comply_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `announcement_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `classrooms`
--
ALTER TABLE `classrooms`
  MODIFY `classroom_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `email_verifications`
--
ALTER TABLE `email_verifications`
  MODIFY `verification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `exam_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `forms`
--
ALTER TABLE `forms`
  MODIFY `form_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `form_completions`
--
ALTER TABLE `form_completions`
  MODIFY `form_completion_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `form_completion_answers`
--
ALTER TABLE `form_completion_answers`
  MODIFY `form_completion_answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `form_corrections`
--
ALTER TABLE `form_corrections`
  MODIFY `correction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `form_correction_check`
--
ALTER TABLE `form_correction_check`
  MODIFY `correction_check_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `form_questions`
--
ALTER TABLE `form_questions`
  MODIFY `form_question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `form_question_choices`
--
ALTER TABLE `form_question_choices`
  MODIFY `form_question_choice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `form_question_options`
--
ALTER TABLE `form_question_options`
  MODIFY `form_question_option_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `grade_scores`
--
ALTER TABLE `grade_scores`
  MODIFY `grade_score_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `grade_show_requests`
--
ALTER TABLE `grade_show_requests`
  MODIFY `grade_show_request_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grading_categories`
--
ALTER TABLE `grading_categories`
  MODIFY `grading_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `grading_platforms`
--
ALTER TABLE `grading_platforms`
  MODIFY `grading_platform_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `grading_scores`
--
ALTER TABLE `grading_scores`
  MODIFY `grading_score_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `grading_score_columns`
--
ALTER TABLE `grading_score_columns`
  MODIFY `grading_score_column_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `post_comments`
--
ALTER TABLE `post_comments`
  MODIFY `post_comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `post_likes`
--
ALTER TABLE `post_likes`
  MODIFY `post_like_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `post_medias`
--
ALTER TABLE `post_medias`
  MODIFY `post_medias` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `professors`
--
ALTER TABLE `professors`
  MODIFY `professor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `resources_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `resources_groups`
--
ALTER TABLE `resources_groups`
  MODIFY `resources_group_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `schedule_items`
--
ALTER TABLE `schedule_items`
  MODIFY `schedule_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `section_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `section_students`
--
ALTER TABLE `section_students`
  MODIFY `section_student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `section_subjects`
--
ALTER TABLE `section_subjects`
  MODIFY `section_subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `staffs`
--
ALTER TABLE `staffs`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sticky_notes`
--
ALTER TABLE `sticky_notes`
  MODIFY `sticky_note_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `subject_attendances`
--
ALTER TABLE `subject_attendances`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

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
