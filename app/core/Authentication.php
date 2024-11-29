<?php

namespace Application\core;

use Application\controllers\app\EmailControl;
use Application\controllers\app\Response;


class Authentication
{
    protected $CONNECTION;
    /**
     * @type Connection
     */
    protected $APPLICATION;
    /**
     * @type Session
     */
    protected $SESSION;

    public function __construct()
    {
        global $CONNECTION;
        global $APPLICATION;
        global $SESSION;


        $this->CONNECTION = $CONNECTION;
        $this->APPLICATION = $APPLICATION;
        $this->SESSION = $SESSION;
    }

    public function TryAuth($data)
    {

        $control = $this->APPLICATION->FUNCTIONS->USER_CONTROL;

        $data["password"] = md5($data['password']);

        $exists = $control->alreadyExists($data);

        if ($exists->code === 200) {
            $user = $exists->body['id'];
            $user = $control->get($user, true);

            if ($user->status == 5) {
                return new Response(205, "Your Account is locked due to many login atttempts, Please contact the Super Admin or Admin to regain access to your Account.");
            } else {
                $send = $this->SendVerification($user->user_id, $user->email);

                if ($send) {
                    return new Response(200, "Successfully Login!", ["user" => $user]);
                } else {
                    return new Response(203, "Success but Unable to sent Email!");
                }
            }
        } else {

            $user = $control->getByWhere(["email" => $data['email']], false);

            if ($user) {
                $timeout = $user['lock_timeout'];
                $total_attempts = $user['user_type'] == 4 ? 14 : 4;

                if ($timeout == 5) {
                    $control->editRecord($user['user_id'], [
                        "status" => 5
                    ]);
                    return new Response(205, "Your Account is locked due to many login atttempts, Please contact the Super Admin or Admin to regain access to your Account.");
                }

                $attempts = $user['lock_timeout'] == 0 ? $total_attempts : $total_attempts - ((int) $user['lock_timeout']);

                $control->editRecord($user['user_id'], [
                    "lock_timeout" => $user['lock_timeout'] + 1
                ]);

                return new Response(204, "Failed to Login, Account will lock after $attempts attempts!", ["errors" => ["email"]]); 
            } else {
                return new Response(205, "Account does not exist!");
            }

        }

        return new Response(204, "Auth Failed!");
    }

    public function TryChangePassword($data)
    {
        $control = $this->APPLICATION->FUNCTIONS->USER_CONTROL;

        $password = md5($data['password']);

        return $control->editRecord($data['user_id'], [
            "password" => $password
        ]);
    }

    public function TryResetPassword($data)
    {
        $control = $this->APPLICATION->FUNCTIONS->USER_CONTROL;

        $exists = $control->alreadyExists($data);

        if ($exists->code === 200) {
            $user = $exists->body['id'];

            $send = $this->SendVerification($user, $data['email']);

            if ($send) {
                return new Response(200, "Successfully Sent Verification Code!", ["user_id" => $user]);
            } else {
                return new Response(203, "Success but Unable to sent Email!");
            }
        }

        return new Response(204, "Failed to Send Verification Code!");
    }

    public function SendVerification($user_id, $email_address)
    {
        $controller = new EmailControl();

        return $controller->sendVerificationInto($user_id, $email_address);
    }

    public function ConfirmVerification($user_id, $code)
    {
        $controller = new EmailControl();

        return $controller->confirmVerificationToUser($user_id, $code);
    }

    public function LoginWithAuth($data)
    {
        global $APPLICATION;

        $control = $this->APPLICATION->FUNCTIONS->USER_CONTROL;

        $data["password"] = md5($data['password']);
        
        $exists = $control->alreadyExists($data);

        if ($exists->code === 200) {
          

            $user = $exists->body['id'];
            $user = $control->get($user, true);

            $this->SESSION->apply($user);
            $this->SESSION->start();

            $control->editRecord($user->user_id, [
                "lock_timeout" => 0 
            ]);

            return  new Response(200, "Successfully Login!", ["user" => $user]);
        }

        return new Response(204, "Login Failed!", ["errors" => ["password"]]);
    }

    public function IsUsernameExists($username)
    {
        return count($this->APPLICATION->FUNCTIONS->USER_CONTROL->filterRecords(["username" => $username], false)) > 0;
    }

    public function IsEmailExists($email)
    {
        return count($this->APPLICATION->FUNCTIONS->USER_CONTROL->filterRecords(["email_address" => $email], false)) > 0;
    }

    public function RegisterPatient(mixed $data)
    {
        $control = $this->APPLICATION->FUNCTIONS->USER_CONTROL;

        $usernameExists = $this->IsUsernameExists($data['username']);

        if ($usernameExists) {
            return new Response(403, "Username Already Exists!");
        }

        if ($this->IsEmailExists($data['email_address'])) {
            return new Response(403, "Email Address Already Exists!");
        }

        $data['user_type'] = 1;

        return $control->AddRecord($data);
    }

    public function DoAuth(mixed $data, mixed $user_id, mixed $code)
    {
        $confirm = $this->ConfirmVerification($user_id, $code);

        if ($confirm) {
            return $this->LoginWithAuth($data);
        }

        return  new Response(400, "Failed to Authenticate!");
    }
}