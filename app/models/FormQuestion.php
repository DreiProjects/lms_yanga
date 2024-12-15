<?php


namespace Application\models;

use Application\abstract\FormQuestionAbstract;

class FormQuestion extends FormQuestionAbstract
{

    public $choices = [];

    public $options = [];
    
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

        $this->options = $APPLICATION->FUNCTIONS->FORM_QUESTION_OPTION_CONTROL->filterRecords([
            'form_question_id' => $this->form_question_id
        ], true);

        $this->options = count($this->options) > 0 ? $this->options[0] : null;
    }

}