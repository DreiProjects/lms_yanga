<?php

namespace Application\abstract;

use Application\abstract\ModelDefaultFunctions;

abstract class ActivityAbstract extends ModelDefaultFunctions
{
    public $class_meeting_id;

    public $section_subject_id;

    public $title;

    public $description;

    public $link;

    public $code;

    public $schedule;

    public $activity_status;

    public $date_created;

    public $status;
}