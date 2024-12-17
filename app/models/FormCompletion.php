<?php


namespace Application\models;

use Application\abstract\FormCompletionAbstract;

class FormCompletion extends FormCompletionAbstract
{

    public $grade_score;

    public $check_score;

    public $user;

    public $answers = [];

    public function __construct($data = [])
    {
        global $APPLICATION;
        $this->applyData($data, FormCompletionAbstract::class);
        $this->grade_score = $this->getGradeScore();
        $this->check_score = $this->getCheckScore();

        $this->user = $APPLICATION->FUNCTIONS->USER_CONTROL->get($this->user_id, false);

        $this->answers = $APPLICATION->FUNCTIONS->FORM_COMPLETION_ANSWER_CONTROL->filterRecords([
            'form_completion_id' => $this->form_completion_id
        ], true);
    }

    public function getGradeScore()
    {
        global $APPLICATION;

        return $APPLICATION->FUNCTIONS->GRADE_SCORE_CONTROL->getByWhere([
            'category' => "Form",
            'id' => $this->form_completion_id
        ], false);
    }

    public function getCheckScore() {
        global $APPLICATION;

        return $APPLICATION->FUNCTIONS->FORM_CHECK_CONTROL->getByWhere([
            'comply_id' => $this->form_completion_id,
            'user_id' => $this->user_id
        ], false);
    }
}