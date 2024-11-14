<?php


namespace Application\models;

use Application\abstract\GradeShowRequestAbstract;

class GradeShowRequest extends GradeShowRequestAbstract
{

    public function __construct($data = [])
    {
        $this->applyData($data, GradeShowRequestAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;
    }
}