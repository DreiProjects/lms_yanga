<?php


namespace Application\models;

use Application\abstract\FormCompletionAbstract;

class FormCompletion extends FormCompletionAbstract
{
    public function __construct($data = [])
    {
        $this->applyData($data, FormCompletionAbstract::class);
        $this->init();
    }

    private function init(): void
    {
    }
}