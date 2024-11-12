<?php

namespace Application\controllers\system;

use Application\abstract\ControlDefaultFunctions;
use Application\models\SubjectAttendance;
use Application\controllers\app\Response;

class SubjectAttendanceControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = SubjectAttendance::class;
    protected $TABLE_NAME = "subject_attendances";
    protected $TABLE_PRIMARY_ID = "attendance_id";
    protected $SEARCH_LOOKUP = ["section_subject_id"];

    public function add($data)
    {
       global $APPLICATION;

       $sectionSubjectId = $data['section_subject_id'];

       $exists = $this->alreadyExists(['section_subject_id' => $sectionSubjectId]);
       
       if ($exists->code === 200) {
            $this->editRecord($exists->body['id'], $data);
       } else {
            $this->addRecord($data);
       }

       return new Response(200, "Attendance added successfully", ['id' => $exists->body['id']]);
    }
}