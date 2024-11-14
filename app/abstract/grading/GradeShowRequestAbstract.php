<?php

namespace Application\abstract;

use Application\abstract\ModelDefaultFunctions;

abstract class GradeShowRequestAbstract extends ModelDefaultFunctions
{
    public $grade_show_request_id;

    public $grading_platform_id;

    public $data;

    public $date_created;

    public $status;
}