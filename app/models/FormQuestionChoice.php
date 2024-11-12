<?php


namespace Application\models;

use Application\abstract\FormQuestionChoicesAbstract;

class FormQuestionChoice extends FormQuestionChoicesAbstract
{

    public function __construct($data = [])
    {
        $this->applyData($data, FormQuestionChoicesAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;


    }

}