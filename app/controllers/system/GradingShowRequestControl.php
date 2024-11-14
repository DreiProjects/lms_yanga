<?php

namespace Application\controllers\system;

use Application\abstract\ControlDefaultFunctions;
use Application\models\GradeShowRequest;
use Application\controllers\app\Response;


class GradingShowRequestControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = GradeShowRequest::class;
    protected $TABLE_NAME = "grade_show_requests";
    protected $TABLE_PRIMARY_ID = "grade_show_request_id";
    protected $SEARCH_LOOKUP = ["grading_platform_id"];

    public function add($data)
    {
        global $APPLICATION;

        $platform_id = $data['grading_platform_id'];

        if ($platform_id == null) {
            return new Response(400, "Save Grading platform first!");
        }

        $platform = $this->alreadyExists(["grading_platform_id" => $platform_id]);

        if ($platform->code === 200) {
            return $this->editRecord($platform->body['id'], $data);
        }

        return $this->addRecord($data);
    }
}