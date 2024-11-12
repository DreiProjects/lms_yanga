<?php


namespace Application\models;

use Application\abstract\FormAbstract;

class Form extends FormAbstract
{

    public $questions = [];
    public $form_completions = [];

        public function __construct($data = [])
    {
        $this->applyData($data, FormAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;

        $this->questions = $APPLICATION->FUNCTIONS->FORM_QUESTION_CONTROL->filterRecords(['form_id' => $this->form_id], true);
        $this->form_completions = $APPLICATION->FUNCTIONS->FORM_COMPLETION_CONTROL->filterRecords(['form_id' => $this->form_id], true);
    }

    public function isStudentTaken($user_id)
    {
        $taken = array_filter($this->form_completions, function ($formCompletion) use ($user_id) {
            return $formCompletion->user_id == $user_id;
        });

        return count($taken) > 0 ? $taken[0] : false;
    }

}