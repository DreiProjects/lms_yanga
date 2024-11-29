<?php


namespace Application\models;

use Application\abstract\StudentAbstract;
use Application\abstract\UserAbstract;

class Student extends StudentAbstract
{
    protected $CONNECTION;

    public $photoURL;
    public $typeName;


    // section


    public function __construct($userData = [])
    {
        global $CONNECTION;

        $this->CONNECTION = $CONNECTION;
        $this->applyData($userData, UserAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $ALL_USER_TYPES;

        $EXTENSION = 'jpg';
        $CHARACTER_AVATAR_PATH = '/public/assets/media/avatar/' . '/';

        if (!$this->displayName) {
            $this->displayName = $this->firstname . ' ' . $this->lastname;
            $this->CONNECTION->Update("users", ["displayName" => $this->displayName], ["user_id" => $this->user_id]);
        }

        $this->photoURL = strlen($this->photo) > 0 ? '/' . $this->photo : $CHARACTER_AVATAR_PATH . strtoupper($this->displayName[0]) . '.' . $EXTENSION;
        $this->typeName = $ALL_USER_TYPES[0];


        $this->initOther();
    }

    private function initOther()
    {
        global $APPLICATION;
    }

    public function getSectionStudent() {
        global $APPLICATION;

        $records = $APPLICATION->FUNCTIONS->SECTION_STUDENT_CONTROL->filterRecords([
            "student_id" => $this->user_id
        ], true);

        if (empty($records)) {
            return null;
        }

        return $records[0];
    }

    public function getCourse() {
        global $APPLICATION;

        $sectionStudent = $this->getSectionStudent();
        $section = $sectionStudent ? $sectionStudent->section : null;

        return $section ? $section->course : null;
    }
}