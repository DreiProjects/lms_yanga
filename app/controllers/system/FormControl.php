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
                }

                // Handle different question types
                switch ($question['type']) {
                    case 'multiple-choice':
                    case 'checkbox':
                    case 'dropdown':
                        // Handle choices
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
                        break;

                    case 'true-false':
                        // Add True/False choices
                        $choices = ['True', 'False'];
                        foreach ($choices as $index => $choice) {
                            $choiceData = [
                                "form_question_id" => $q->body['id'],
                                "choice" => $choice,
                                "choice_number" => $index + 1
                            ];

                            $c = $APPLICATION->FUNCTIONS->FORM_QUESTION_CHOICES_CONTROL->addRecord($choiceData);

                            if ($c->code !== 200) {
                                $CONNECTION->RollBack();
                                return $choice;
                            }
                        }
                        break;

                    case 'fill-blank':
                        // Store blanks information in options
                        if (isset($question['blanks'])) {
                            $optionData = [
                                "form_question_id" => $q->body['id'],
                                "options" => json_encode([
                                    'type' => 'fill-blank',
                                    'blanks' => $question['blanks']
                                ])
                            ];

                            $o = $APPLICATION->FUNCTIONS->FORM_QUESTION_OPTION_CONTROL->addRecord($optionData);

                            if ($o->code !== 200) {
                                $CONNECTION->RollBack();
                                return $o;
                            }
                        }
                        break;

                    case 'matching':
                        // Store questions and words in options
                        if (isset($question['questions']) && isset($question['words'])) {
                            $optionData = [
                                "form_question_id" => $q->body['id'],
                                "options" => json_encode([
                                    'type' => 'matching',
                                    'questions' => $question['questions'],
                                    'words' => $question['words']
                                ])
                            ];

                            $o = $APPLICATION->FUNCTIONS->FORM_QUESTION_OPTION_CONTROL->addRecord($optionData);

                            if ($o->code !== 200) {
                                $CONNECTION->RollBack();
                                return $o;
                            }
                        }
                        break;

                    case 'short-answer':
                    case 'paragraph':
                        // These types don't need additional data
                        break;
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