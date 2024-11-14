<?php


namespace Application\models;

use Application\abstract\FormCompletionAbstract;

class FormCompletion extends FormCompletionAbstract
{

    public $grade_score;

    public $user;

    public function __construct($data = [])
    {
        global $APPLICATION;
        $this->applyData($data, FormCompletionAbstract::class);
        $this->grade_score = $this->getGradeScore();

        $this->user = $APPLICATION->FUNCTIONS->USER_CONTROL->get($this->user_id, false);
    }

    public function getGradeScore()
    {
        global $APPLICATION;

        return $APPLICATION->FUNCTIONS->GRADE_SCORE_CONTROL->getByWhere([
            'category' => "Form",
            'id' => $this->form_completion_id
        ], false);
    }
}