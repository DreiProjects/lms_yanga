<?php

namespace Application\abstract;

use Application\abstract\ModelDefaultFunctions;

abstract class FormCheckAbstract extends ModelDefaultFunctions
{
    public $correction_check_id;

    public $user_id;

    public $comply_id;

    public $score;

    public $total_points;

    public $grade;

    public $datas;

    public $date_created;
}