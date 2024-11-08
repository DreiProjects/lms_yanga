<?php


namespace Application\models;

use Application\abstract\SubjectAbstract;

class Subject extends SubjectAbstract
{
    public $course;

    public function __construct($data = [])
    {
        $this->applyData($data, SubjectAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;
        $this->course = $APPLICATION->FUNCTIONS->COURSE_CONTROL->get($this->course_id, true);
    }
}