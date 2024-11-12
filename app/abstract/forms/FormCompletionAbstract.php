<?php

namespace Application\abstract;

use Application\abstract\ModelDefaultFunctions;

abstract class FormCompletionAbstract extends ModelDefaultFunctions
{
    public $form_completion_id;

    public $form_id;

    public $user_id;

    public $date_created;

    public $status;
}

