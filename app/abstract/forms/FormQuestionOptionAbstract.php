<?php

namespace Application\abstract;

use Application\abstract\ModelDefaultFunctions;

abstract class FormQuestionOptionAbstract extends ModelDefaultFunctions
{
    public $form_question_option_id;

    public $form_question_id;

    public $options;

    public $date_created;

}