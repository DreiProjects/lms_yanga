<?php


namespace Application\models;

use Application\abstract\FormQuestionAbstract;

class FormQuestion extends FormQuestionAbstract
{

    public $choices = [];
    
    public function __construct($data = [])
    {
        $this->applyData($data, FormQuestionAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;

        $this->choices = $APPLICATION->FUNCTIONS->FORM_QUESTION_CHOICES_CONTROL->filterRecords([
            'form_question_id' => $this->form_question_id
        ], true);
    }

}