<?php


namespace Application\models;

use Application\abstract\FormCorrectionAbstract;

class FormCorrection extends FormCorrectionAbstract
{

    public function __construct($data = [])
    {
        global $APPLICATION;

        $this->applyData($data, FormCorrectionAbstract::class);
    }
}