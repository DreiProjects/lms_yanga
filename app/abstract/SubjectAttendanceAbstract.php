<?php

namespace Application\abstract;

use Application\abstract\ModelDefaultFunctions;

abstract class SubjectAttendanceAbstract extends ModelDefaultFunctions
{
    public $attendance_id;

    public $section_subject_id;

    public $attendance_data;

    public $date_created;

    public $status;
}