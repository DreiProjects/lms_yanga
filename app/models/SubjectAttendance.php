<?php


namespace Application\models;

use Application\abstract\SubjectAttendanceAbstract;

class SubjectAttendance extends SubjectAttendanceAbstract
{
    public function __construct($data = [])
    {
        $this->applyData($data, SubjectAttendanceAbstract::class);
        $this->init();
    }

    private function init(): void
    {
    }
}