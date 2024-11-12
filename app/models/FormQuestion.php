<?php


namespace Application\models;

use Application\abstract\FormQuestionAbstract;

class FormQuestion extends FormQuestionAbstract
{


    public function __construct($data = [])
    {
        $this->applyData($data, FormQuestionAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;

    }

}