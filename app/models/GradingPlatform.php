<?php


namespace Application\models;

use Application\abstract\GradingPlatformAbstract;

class GradingPlatform extends GradingPlatformAbstract
{

    public $categories = [];

    public $selected_students = null;

    public function __construct($data = [])
    {
        $this->applyData($data, GradingPlatformAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;

        $this->categories = $APPLICATION->FUNCTIONS->GRADING_CATEGORY_CONTROL->filterRecords([
            "grading_platform_id" => $this->grading_platform_id
        ], true);

        $this->selected_students = $APPLICATION->FUNCTIONS->GRADING_SHOW_REQUEST_CONTROL->getBy("grading_platform_id", $this->grading_platform_id, false);
    }

    public function isStudentSelected($user_id) {
        if (!$this->selected_students) return false;

        return in_array($user_id, json_decode($this->selected_students['data']));
    }
}