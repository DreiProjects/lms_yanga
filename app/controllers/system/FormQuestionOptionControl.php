<?php

namespace Application\controllers\system;

use Application\abstract\ControlDefaultFunctions;
use Application\models\FormQuestionOption;

class FormQuestionOptionControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = FormQuestionOption::class;
    protected $TABLE_NAME = "form_question_options";
    protected $TABLE_PRIMARY_ID = "form_question_option_id";
    protected $SEARCH_LOOKUP = [];

    public function edit($data)
    {
    }
}