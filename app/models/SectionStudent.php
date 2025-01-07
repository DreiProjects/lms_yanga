<?php


namespace Application\models;

use Application\abstract\CourseAbstract;
use Application\abstract\SectionAbstract;
use Application\abstract\SectionStudentAbstract;

class SectionStudent extends SectionStudentAbstract
{
    public $student;

    public $user_id;

    public $student_no;

    public $displayName;

    public $section;

    public $subjects;

    public function __construct($data = [])
    {
        $this->applyData($data, SectionStudentAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;

        $this->student = $APPLICATION->FUNCTIONS->USER_CONTROL->get($this->student_id, true);
        $this->section = $APPLICATION->FUNCTIONS->SECTION_CONTROL->get($this->section_id, true);

        if ($this->student) {
            $this->user_id = $this->student->user_id;
            $this->student_no = $this->student->no;
            $this->displayName = $this->student->displayName;

            if ($this->irregular == "irregular") {
                $this->subjects = $APPLICATION->FUNCTIONS->SECTION_STUDENT_IRREGULAR_SUBJECT_CONTROL->filterRecords(['section_student_id' => $this->section_student_id], true);
            } else {
                $this->subjects = $this->section->subjects;
            }
        }
    }

    public function getSubjects() {
        return $this->irregular == 'irregular' ? $this->getIrregularSubjects() : $this->section->subjects;
    }

    public function getIrregularSubjects() {
        global $APPLICATION;

        $control = $APPLICATION->FUNCTIONS->SECTION_SUBJECT_CONTROL;

        return array_map(function($record) use ($control) {
            return $control->get($record->section_subject_id, true);
        }, $this->subjects);
    }
}