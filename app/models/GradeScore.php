<?php


namespace Application\models;

use Application\abstract\GradeScoreAbstract;

class GradeScore extends GradeScoreAbstract
{

    public $student_id;

    public $item;

    public $total_points;

    public function __construct($data = [])
    {
        $this->applyData($data, GradeScoreAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;

        if ($this->category == "Activity") {
            $this->item = $APPLICATION->FUNCTIONS->ACTIVITY_COMPLY_CONTROL->get($this->id, false);
            $this->student_id = $this->item['student_id'];
        } else {
            $this->item = $APPLICATION->FUNCTIONS->FORM_COMPLETION_CONTROL->get($this->id, false);
            $this->student_id = $this->item['user_id'];

            $this->total_points = $this->getPoints();
        }
    }

    public function getPoints() {
        global $APPLICATION;

        $form = $APPLICATION->FUNCTIONS->FORM_CONTROL->get($this->item['parent_id'], false);

        return $form['points'];
    }
}