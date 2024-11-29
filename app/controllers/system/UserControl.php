<?php

namespace Application\controllers\system;

use Application\abstract\ControlDefaultFunctions;
use Application\abstract\UserAbstract;
use Application\models\User;

class UserControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = User::class;
    protected $TABLE_NAME = "users";
    protected $TABLE_PRIMARY_ID = "user_id";
    protected $SEARCH_LOOKUP = ["displayName", "firstname", "lastname", "email"];

    public function add($data)
    {
        $data['password'] = md5($data['password']);

        return $this->addRecord($data);
    }

    public function isEmailExists($email) {
        return $this->alreadyExists(['email' => $email])->code == 200;
    }

    public function getExistingEmails() {
        return array_column($this->getAllRecords(false), 'email');
    }

    public function UpdateProfile($data) {
        global $APPLICATION, $SESSION;

        $edit = $this->editRecord($SESSION->user_id, $data);

        if ($edit->code == 200) {
            $SESSION->updateProfile();
        }

        return $edit;
    }
}