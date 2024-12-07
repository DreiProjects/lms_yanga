<?php


namespace Application\models;

use Application\abstract\SectionSubjectAbstract;

class SectionSubject extends SectionSubjectAbstract
{

    public $subject;

    public $professor;

    public $schedule;

    public $schedule_label;

    public $classroom;

    public $student_count;

    public function __construct($data = [])
    {
        $this->applyData($data, SectionSubjectAbstract::class);
        $this->init();
    }
    
    private function init(): void
    {
        global $APPLICATION;

        $this->subject = $APPLICATION->FUNCTIONS->SUBJECT_CONTROL->get($this->subject_id, true);

        $this->professor = $APPLICATION->FUNCTIONS->PROFESSOR_CONTROL->get($this->professor_id, true);

        $this->classroom = $APPLICATION->FUNCTIONS->CLASSROOM_CONTROL->get($this->classroom_id, true);

        $this->student_count = $this->countStudents();

        if ($this->schedule_id != 0) {
            $this->schedule = $APPLICATION->FUNCTIONS->SCHEDULE_CONTROL->get($this->schedule_id, true);

            if($this->schedule) {
                $this->schedule_label = $this->schedule->schedule_label;
            }
        }
    }

    public function countStudents() {
        global $APPLICATION;

        return count($APPLICATION->FUNCTIONS->SECTION_STUDENT_CONTROL->filterRecords(['section_id' => $this->section_id], false));
    }

    public function getSection()
    {
        global $APPLICATION;

        return $APPLICATION->FUNCTIONS->SECTION_CONTROL->get($this->section_id, true);
    }

    public function getAllResources() {
        global $APPLICATION;

        return $APPLICATION->FUNCTIONS->RESOURCES_GROUP_CONTROL->filterRecords(['section_subject_id' => $this->section_subject_id], true);
    }
}