<?php

namespace Application\abstract;

use Application\abstract\ModelDefaultFunctions;

abstract class UserAbstract extends ModelDefaultFunctions
{
    public $user_id;

    public $no;

    public $firstname;
    public $middlename;
    public $lastname;

    public $contact_number;

    public $photo;

    public $email;
    public $phone;

    public $gender;

    public $birthdate;
    public $image;

    public $user_type;
    public $date_created;

    public $displayName;

    public $status;


}