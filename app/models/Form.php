<?php


namespace Application\models;

use Application\abstract\FormAbstract;

class Form extends FormAbstract
{

    public $questions = [];
    public $form_completions = [];
    public $form_correction = null;

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
        $this->form_correction = $APPLICATION->FUNCTIONS->FORM_CORRECTION_CONTROL->getOnlyRecord(['form_id' => $this->form_id], true);
    }

    public function isStudentTaken($user_id)
    {
        global $APPLICATION;
        $taken = $APPLICATION->FUNCTIONS->FORM_COMPLETION_CONTROL->filterRecords(['form_id' => $this->form_id, 'user_id' => $user_id], true);

        return count($taken) > 0 ? $taken[0] : false;
    }

    public function isStudentTakenExam($user_id, $exam_id)
    {
        global $APPLICATION;

        $taken = $APPLICATION->FUNCTIONS->FORM_COMPLETION_CONTROL->filterRecords(['form_id' => $this->form_id, 'user_id' => $user_id, 'parent_id' => $exam_id], true);
        
        return count($taken) > 0 ? $taken[0] : false;
    }

}