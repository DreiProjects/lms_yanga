<?php

namespace Application\abstract;

use Application\abstract\ModelDefaultFunctions;

abstract class FormCompletionAnswerAbstract extends ModelDefaultFunctions
{
    public $form_completion_answer_id;

    public $form_completion_id;

    public $question_id;

    public $type;

    public $answer; 

    public $choice_id;

    public $date_created;

    public $status;
}