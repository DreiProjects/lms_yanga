<?php

namespace Application\abstract;

use Application\abstract\ModelDefaultFunctions;

abstract class FormCorrectionAbstract extends ModelDefaultFunctions
{
    public $correction_id;

    public $form_id;

    public $data;

    public $date_created;
}

