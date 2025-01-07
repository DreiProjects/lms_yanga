<?php

namespace Application\controllers\system;

use Application\abstract\ControlDefaultFunctions;
use Application\models\SectionStudentIrregularSubject;

class SectionStudentIrregularSubjectControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = SectionStudentIrregularSubject::class;
    protected $TABLE_NAME = "section_student_irregular_subjects";
    protected $TABLE_PRIMARY_ID = "irregular_subject_id";
    protected $SEARCH_LOOKUP = [];

    
}