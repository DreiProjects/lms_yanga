<?php



// ALL FINANCIAL

use Application\controllers\system\ClassroomControl;
use Application\controllers\system\CourseControl;
use Application\controllers\system\DepartmentControl;
use Application\controllers\system\ProfessorControl;
use Application\controllers\system\SubjectControl;
use Application\controllers\system\UserControl;

$GENDERS = array_column(GenderType::cases(), "value");

$ADMIN_USER_TYPES = array_column(AdminUserTypes::cases(), "value");

$ALL_USER_TYPES = array_column(UserTypes::cases(), "value");

$ALL_USER_TYPES_MINI = array_column(UserTypesMini::cases(), "value");

$USER_STATUS = [1 => "Active", 5 => "Locked"];


$USER_HEADER_BODY = [
    "header" => ["No","Name","First Name","Last Name","Email","Status", "Date Created"],
    "body" => ["no","displayName","firstname", "lastname","email",["enum" => $USER_STATUS, "value" => "status"], "date_created"]
];

$STUDENT_IN_SECTION_HEADER_BODY = [
    "header" => ["No","Student No","Name"],
    "body" => ["no","student_no", "displayName"]
];

$COURSE_HEADER_BODY = [
    "header" => ["No","Name","Description", "Date Created"],
    "body" => ["no","course_name","description", "date_created"]
];

$PROFESSORS_HEADER_BODY = [
    "header" => ["No","Name","Description","Main Course", "Date Created"],
    "body" => ["no",[
        "primary" => "user_id",
        "controller" => UserControl::class,
        "value" =>  "displayName"
    ],"description",[
        "primary" => "main_course_id",
        "controller" => CourseControl::class,
        "value" =>  "course_name"
    ], "date_created"]
];


$STAFFS_HEADER_BODY = [
    "header" => ["No","Name","Description","Department", "Date Created"],
    "body" => ["no",[
        "primary" => "user_id",
        "controller" => UserControl::class,
        "value" =>  "displayName"
    ],"description",[
        "primary" => "department_id",
        "controller" => DepartmentControl::class,
        "value" =>  "department_name"
    ], "date_created"]
];

$CLASSROOMS_HEADER_BODY = [
    "header" => ["No","Name","Building","Floor", "Date Created"],
    "body" => ["no","classroom_name","building","floor", "date_created"]
];

$SECTIONS_HEADER_BODY = [
    "header" => ["No","Name","Adviser","Course","Semester","Year Level", "Date Created"],
    "body" => ["no","section_name",[
        "primary" => "adviser_id",
        "controller" => ProfessorControl::class,
        "value" =>  "displayName"
    ],[
        "primary" => "course_id",
        "controller" => CourseControl::class,
        "value" =>  "course_name"
    ],[
        "enum" => array_merge([[]], array_column(Semesters::cases(), 'name')),
        "value" => "semester"
    ],[
        "enum" => array_merge([[]], array_column(YearLevels::cases(), 'name')),
        "value" => "year_level"
    ], "date_created"]
];

$SUBJECTS_HEADER_BODY = [
    "header" => ["No","Name","Code","Course", "Date Created"],
    "body" => ["no","subject_name","subject_code",[
        "primary" => "course_id",
        "controller" => CourseControl::class,
        "value" =>  "course_name"
    ], "date_created"]
];

$DEPARTMENTS_HEADER_BODY = [
    "header" => ["No","Department Name","Head", "Date Created"],
    "body" => ["no","department_name","head", "date_created"]
];

$SECTION_SUBJECT_HEADER_BODY = [
    "header" => ["No","Subject","Professor", "Classroom", "Schedule"],
    "body" => ["no",[
        "primary" => "subject_id",
        "controller" => SubjectControl::class,
        "value" =>  "subject_name"
    ],[
        "primary" => "professor_id",
        "controller" => ProfessorControl::class,
        "value" =>  "displayName"
    ],[
        "primary" => "classroom_id",
        "controller" => ClassroomControl::class,
        "value" =>  "classroom_name"
    ], "schedule_label"]
];

$STUDENTS_IN_CLASSES_HEADER_BODY = [
    "header" => ["No","Student Name", "Student No", "Gender", "Reggular/Irregular"],
    "body" => ["no","displayName", "student_no","gender", "irregular"]
];

$SUBJECTS_IN_CLASSES_HEADER_BODY = [
    "header" => ["No","Subject","Classroom", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"],
    "body" => ["no","subject_name","classroom_id", "mon", "tue", "wed", "thu", "fri", "sat"]
];

$EVENTS_HEADER_BODY = [
    "header" => ["No","Event Name","Date Start","Date End", "Date Created"],
    "body" => ["no","title", "date_start", "date_end", "date_created"]
];
