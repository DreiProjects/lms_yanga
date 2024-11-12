<?php


namespace Application\models;

use Application\abstract\ExamAbstract;

class Exam extends ExamAbstract
{

    public $section_subject;

    public $form;
    public function __construct($data = [])
    {
        $this->applyData($data, ExamAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;

        $this->section_subject = $APPLICATION->FUNCTIONS->SECTION_SUBJECT_CONTROL->get($this->section_subject_id, true);
        $this->form = $APPLICATION->FUNCTIONS->FORM_CONTROL->get($this->form_id, true);
    }
}