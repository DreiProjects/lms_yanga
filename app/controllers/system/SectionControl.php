<?php

namespace Application\controllers\system;

use Application\abstract\ControlDefaultFunctions;
use Application\abstract\CourseAbstract;
use Application\abstract\UserAbstract;
use Application\models\Course;
use Application\models\Section;
use Application\models\User;
use Application\controllers\app\Response;


class SectionControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = Section::class;
    protected $TABLE_NAME = "sections";
    protected $TABLE_PRIMARY_ID = "section_id";
    protected $SEARCH_LOOKUP = ["section_name"];

    public function add($data)
    {
        return null;
    }

    public function edit($id, $data)
    {
        global $APPLICATION, $CONNECTION;

        $mainData = $data['data'];
        $students = $data['students'];
        $subjects = $data['subjects'];
        $control = $APPLICATION->FUNCTIONS->SECTION_STUDENT_CONTROL;
        $subjectControl = $APPLICATION->FUNCTIONS->SECTION_SUBJECT_CONTROL;

        $rollbackResponse = new Response(400, "Task Failed to perform!");
        $CONNECTION->NewTransaction();

        $edit = $this->editRecord($id, $mainData);

        if ($edit->code == 200) {
            foreach ($students as $student) {
                $student['section_id'] = $id;

                if ($student['status'] === 'created') {
                    unset($student['status']);

                    if ($control->addRecord($student)->code != 200) {
                        $CONNECTION->Rollback();
                        return $rollbackResponse;
                    }
                } else if ($student['status'] === 'edited') {
                    $id = $student['id'];

                    unset($student['status'], $student['id']);

                    if ($control->editRecord($id, $student)->code != 200) {
                        $CONNECTION->Rollback();
                        return $rollbackResponse;
                    }
                } else if ($student['status'] === 'deleted') {
                    $id = $student['id'];

                    if ($control->removeRecord($id)->code != 200) {
                        $CONNECTION->Rollback();
                        return $rollbackResponse;
                    }
                }
            }

            foreach ($subjects as $subject) {
                $subject['section_id'] = $id;

                $schedules = [];

                if (isset($subject['schedules'])) {
                    $schedules = $subject['schedules'];

                    unset($subject['schedules']);
                }

                $_ID = null;

                if ($subject['status'] === 'created') {
                    unset($subject['status']);

                    $add = $subjectControl->addRecord($subject);

                    if ($add->code != 200) {
                        $CONNECTION->Rollback();
                        return $rollbackResponse;
                    }

                    $_ID = $add->body['id'];
                } else if ($subject['status'] === 'edited') {
                    $id = $subject['id'];

                    unset($subject['status'], $subject['id']);

                    $edit = $subjectControl->editRecord($id, $subject);

                    if ($edit->code != 200) {
                        $CONNECTION->Rollback();
                        return $rollbackResponse;
                    }

                    $_ID = $id;
                } else if ($subject['status'] === 'deleted') {
                    $id = $subject['id'];

                    if ($subjectControl->removeRecord($id)->code != 200) {
                        $CONNECTION->Rollback();
                        return $rollbackResponse;
                    }
                }

                if (isset($schedules) && !empty($schedules)) {
                    $subject = $subjectControl->get($_ID, true);

                    $schedule = $APPLICATION->FUNCTIONS->SCHEDULE_CONTROL->addRecord([
                        "id" => $_ID,
                        "description" => "Subject " . $subject->subject->subject_name . ' Schedule'
                    ]);

                    if ($schedule->code == 200) {
                        foreach ($schedules as $sched) {
                            $sched['schedule_id'] = $schedule->body['id'];

                            $APPLICATION->FUNCTIONS->SCHEDULE_ITEM_CONTROL->addRecord($sched);
                        }

                        $edit = $subjectControl->editRecord($_ID, ['schedule_id' => $schedule->body['id']]);

                        if ($edit->code != 200) {
                            $CONNECTION->Rollback();
                            return $rollbackResponse;
                        }
                    } else {
                        $CONNECTION->Rollback();
                        return $rollbackResponse;
                    }
                }
            }
        }

        $CONNECTION->Commit();

        return $edit;
    }
}