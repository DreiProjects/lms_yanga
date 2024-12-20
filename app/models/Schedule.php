<?php


namespace Application\models;

use Application\abstract\ScheduleAbstract;

class Schedule extends ScheduleAbstract
{

    public $items;
    public $schedule_label;
    public function __construct($data = [])
    {
        $this->applyData($data, ScheduleAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;

        $this->items = $APPLICATION->FUNCTIONS->SCHEDULE_ITEM_CONTROL->filterRecords(['schedule_id' => $this->schedule_id], true);
        if (count($this->items)) {
            $this->schedule_label = join(",", array_map(function ($record) {
                return $record->day;
            }, $this->items));
        }
    }

    public function get($day) {
        $all = [];
        $records =  array_filter($this->items, function($record) use ($day) {
            return $record->day == $day;
        });

        foreach ($records as $record) {
            $all[] = $record;
        }

        return $all;
    }
}