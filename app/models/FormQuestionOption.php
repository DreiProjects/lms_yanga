<?php


namespace Application\models;

use Application\abstract\FormQuestionOptionAbstract;

class FormQuestionOption extends FormQuestionOptionAbstract
{

    public function __construct($data = [])
    {
        $this->applyData($data, FormQuestionOptionAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;


    }

}