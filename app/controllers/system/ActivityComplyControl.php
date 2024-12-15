<?php

namespace Application\controllers\system;

use Application\abstract\ControlDefaultFunctions;
use Application\models\ActivityComply;

class ActivityComplyControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = ActivityComply::class;
    protected $TABLE_NAME = "activities_complied";
    protected $TABLE_PRIMARY_ID = "comply_id";
    protected $SEARCH_LOOKUP = ["link", "text"];

    public function add($data)
    {
        global $APPLICATION, $SESSION;

        $data["student_id"] = $SESSION->user_id;

        return $this->addRecord($data);
    }

    public function download($comply_id) {
        global $APPLICATION;

        $comply = $this->get($comply_id, false);

        $file_url = $comply['file']; 

        // Read file contents
        $file_content = file_get_contents($file_url);
        
        // Get file type
        $file_type = pathinfo($file_url, PATHINFO_EXTENSION);

        // Return base64 encoded file content and file type
        
        return [
            'code' => 200,
            'body' => base64_encode($file_content),
            'type' => $file_type
        ];
    }
}