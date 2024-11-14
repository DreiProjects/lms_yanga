<?php

namespace Application\controllers\system;

use Application\abstract\ControlDefaultFunctions;
use Application\models\Form;
use Application\controllers\app\Response;

class FormControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = Form::class;
    protected $TABLE_NAME = "forms";
    protected $TABLE_PRIMARY_ID = "form_id";
    protected $SEARCH_LOOKUP = ["title", "description"];

    public function add($data)
    {
        global $APPLICATION, $SESSION, $CONNECTION;

        $CONNECTION->NewTransaction();

        $data['professor_id'] = $SESSION->getAsProfessor()->professor_id;

        $questions = $data['questions'];

        unset($data['questions']);

        $form = $APPLICATION->FUNCTIONS->FORM_CONTROL->addRecord($data);

        if ($form->code === 200) {
            foreach ($questions as $question) {
                $question['form_id'] = $form->body['id'];

                $questionData = [
                    "form_id" => $form->body['id'],
                    "question_number" => $question['questionNumber'],
                    "question" => $question['title'],
                    "question_type" => $question['type'],
                    "image_url" => $question['imageUrl']
                ];

                $q = $APPLICATION->FUNCTIONS->FORM_QUESTION_CONTROL->addRecord($questionData);

                if ($q->code !== 200) {
                    $CONNECTION->RollBack();
                    return $question;
                } else {
                    if ($question['type'] === "multiple-choice" || $question['type'] === "checkbox" || $question['type'] === "dropdown") {
                        $num = 1;
                        foreach ($question['choices'] as $choice) {
                            $choiceData = [
                                "form_question_id" => $q->body['id'],
                                "choice" => $choice,
                                "choice_number" => $num
                            ];

                            $c = $APPLICATION->FUNCTIONS->FORM_QUESTION_CHOICES_CONTROL->addRecord($choiceData);

                            if ($c->code !== 200) {
                                $CONNECTION->RollBack();
                                return $choice;
                            }

                            $num++;
                        }
                    }
                }

            }
        } else {
            $CONNECTION->RollBack();
            return $form;
        }

        $CONNECTION->Commit();

        return new Response(200, "Form created successfully", ['id' => $form->body['id']]);
    }
}