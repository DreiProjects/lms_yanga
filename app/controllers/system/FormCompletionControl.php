<?php

namespace Application\controllers\system;

use Application\abstract\ControlDefaultFunctions;
use Application\models\FormCompletion;
use Application\controllers\app\Response;

class FormCompletionControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = FormCompletion::class;
    protected $TABLE_NAME = "form_completions";
    protected $TABLE_PRIMARY_ID = "form_completion_id";
    protected $SEARCH_LOOKUP = ["form_id"];

    public function add($data)
    {
        global $APPLICATION, $SESSION, $CONNECTION;

        $CONNECTION->NewTransaction();

        $data['user_id'] = $SESSION->user_id;

        $answers = $data['answers'];

        unset($data['answers']);

        $formCompletion = $this->addRecord($data);  

        if ($formCompletion->code === 200) {

            foreach ($answers as $answer) {
                $answer['form_completion_id'] = $formCompletion->body['id'];

                $addAnswer = $APPLICATION->FUNCTIONS->FORM_COMPLETION_ANSWER_CONTROL->addRecord($answer);

                if ($addAnswer->code !== 200) {
                    $CONNECTION->RollBack();
                    return $addAnswer;
                }
            }
        } else {
            $CONNECTION->RollBack();
            return $formCompletion;
        }

        $CONNECTION->Commit();

        return new Response(200, "Form created successfully", ['id' => $formCompletion->body['id']]);
    }
}