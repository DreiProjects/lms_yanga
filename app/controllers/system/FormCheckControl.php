<?php

namespace Application\controllers\system;

use Application\abstract\ControlDefaultFunctions;
use Application\models\FormCheck;
use Application\controllers\app\Response;

class FormCheckControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = FormCheck::class;
    protected $TABLE_NAME = "form_correction_check";
    protected $TABLE_PRIMARY_ID = "correction_check_id";
    protected $SEARCH_LOOKUP = [""];
}