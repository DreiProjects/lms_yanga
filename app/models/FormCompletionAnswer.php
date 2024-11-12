<?php


namespace Application\models;

use Application\abstract\FormCompletionAnswerAbstract;

class FormCompletionAnswer extends FormCompletionAnswerAbstract
{
    public function __construct($data = [])
    {
        $this->applyData($data, FormCompletionAnswerAbstract::class);
        $this->init();
    }

    private function init(): void
    {

    }
}