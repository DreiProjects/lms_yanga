<?php

namespace Application\controllers\system;

use Application\abstract\ControlDefaultFunctions;
use Application\models\FormQuestionChoice;

class FormQuestionChoicesControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = FormQuestionChoice::class;
    protected $TABLE_NAME = "form_question_choices";
    protected $TABLE_PRIMARY_ID = "form_question_choice_id";
    protected $SEARCH_LOOKUP = [];

    public function edit($data)
    {
    }
}