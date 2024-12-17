<?php


namespace Application\models;

use Application\abstract\FormCheckAbstract;

class FormCheck extends FormCheckAbstract
{
        public function __construct($data = [])
    {
        $this->applyData($data, FormCheckAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;

    }


}