<?php


namespace Application\models;

use Application\abstract\SectionStudentIrregularSubjectAbstract;

class SectionStudentIrregularSubject extends SectionStudentIrregularSubjectAbstract
{
    public $section_subject;

    public function __construct($data = [])
    {
        $this->applyData($data, SectionStudentIrregularSubjectAbstract::class);
        $this->init();
    }

    private function init()
    {
        global $APPLICATION;

        $this->section_subject = $APPLICATION->FUNCTIONS->SECTION_SUBJECT_CONTROL->get($this->section_subject_id, true);
    }
}