<?php

namespace Application\controllers\system;

use Application\abstract\ControlDefaultFunctions;
use Application\models\FormCorrection;
use Application\controllers\app\Response;

class FormCorrectionControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = FormCorrection::class;
    protected $TABLE_NAME = "form_corrections";
    protected $TABLE_PRIMARY_ID = "correction_id";
    protected $SEARCH_LOOKUP = ["form_id"];

}