<?php

namespace Application\abstract;

use Application\abstract\ModelDefaultFunctions;

abstract class FormQuestionChoicesAbstract extends ModelDefaultFunctions
{
    public $form_question_choice_id;

    public $form_question_id;

    public $choice_number;

    public $choice;

    public $status;

    public $date_created;
}