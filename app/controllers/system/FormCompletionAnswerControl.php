<?php

namespace Application\controllers\system;

use Application\abstract\ControlDefaultFunctions;
use Application\models\FormCompletionAnswer;
use Application\controllers\app\Response;

class FormCompletionAnswerControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = FormCompletionAnswer::class;
    protected $TABLE_NAME = "form_completion_answers";
    protected $TABLE_PRIMARY_ID = "form_completion_answer_id";
    protected $SEARCH_LOOKUP = ["form_completion_id"];

    public function add($data)
    {
      
    }
}