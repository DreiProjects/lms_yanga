<?php


namespace Application\models;

use Application\abstract\FormAbstract;

class Form extends FormAbstract
{

    public $questions = [];

    public function __construct($data = [])
    {
        $this->applyData($data, FormAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;

        $this->questions = $APPLICATION->FUNCTIONS->FORM_QUESTION_CONTROL->filterRecords(['form_id' => $this->form_id], true);

    }

}