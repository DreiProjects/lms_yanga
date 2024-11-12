<?php

namespace Application\controllers\system;

use Application\abstract\ControlDefaultFunctions;
use Application\models\FormQuestion;

class FormQuestionControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = FormQuestion::class;
    protected $TABLE_NAME = "form_questions";
    protected $TABLE_PRIMARY_ID = "form_question_id";
    protected $SEARCH_LOOKUP = [];

    public function edit($data)
    {
    }
}