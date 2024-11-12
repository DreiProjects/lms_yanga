<?php

namespace Application\abstract;

use Application\abstract\ModelDefaultFunctions;

abstract class FormQuestionAbstract extends ModelDefaultFunctions
{
    public $form_question_id;

    public $form_id;

    public $question_number;

    public $question;

    public $question_type;

    public $image_url;

    public $date_created;

    public $status;
}