<?php


namespace Application\models;

use Application\abstract\CourseAbstract;
use Application\abstract\SectionAbstract;

class Section extends SectionAbstract
{

    public $subjects;
    public $students;
    public $course;
    public $adviser;
    public function __construct($data = [])
    {
        $this->applyData($data, SectionAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;

        $this->subjects = $APPLICATION->FUNCTIONS->SECTION_SUBJECT_CONTROL->filterRecords(['section_id' => $this->section_id], true);
        $this->students = $APPLICATION->FUNCTIONS->SECTION_STUDENT_CONTROL->filterRecords(['section_id' => $this->section_id], false);
        $this->course = $APPLICATION->FUNCTIONS->COURSE_CONTROL->get($this->course_id, true);
        $this->adviser = $APPLICATION->FUNCTIONS->PROFESSOR_CONTROL->get($this->adviser_id, true);
    }

    public function countAllStudents() {
        
    }

    public function getAllStudents()
    {
        global $APPLICATION;

        return $APPLICATION->FUNCTIONS->SECTION_STUDENT_CONTROL->filterRecords(['section_id' => $this->section_id], true);
    }

    public function getSubjectForProfessor($professor_id)
    {
        global $APPLICATION;

        return $APPLICATION->FUNCTIONS->SECTION_SUBJECT_CONTROL->filterRecords(['section_id' => $this->section_id, 'professor_id' => $professor_id], true);
    }
}