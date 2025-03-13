<?php

namespace Application\abstract;

use Application\abstract\ModelDefaultFunctions;

abstract class FormAbstract extends ModelDefaultFunctions
{
    public $form_id;

    public $professor_id;

    public $title;

    public $form_title;

    public $form_description;

    public $description;

    public $form_type;

    public $duration;

    public $points;

    public $date_created;

    public $status;
}