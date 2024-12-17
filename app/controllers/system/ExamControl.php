<?php

namespace Application\controllers\system;

use Application\abstract\ControlDefaultFunctions;
use Application\controllers\app\Response;
use Application\models\Exam;

class ExamControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = Exam::class;
    protected $TABLE_NAME = "exams";
    protected $TABLE_PRIMARY_ID = "exam_id";
    protected $SEARCH_LOOKUP = ["title", "description"];

    public function edit($data)
    {
    }

    public function check($exam_id) {
        global $APPLICATION;

        $exam = $this->get($exam_id, false);

        $form = $APPLICATION->FUNCTIONS->FORM_CONTROL->get($exam['form_id'], true);

        if (isset($form->form_correction)) {
            $correction = $form->form_correction;
            $complies = $APPLICATION->FUNCTIONS->FORM_COMPLETION_CONTROL->filterRecords(['parent_id' => $exam['exam_id']], true);
            $checks = [];
            if (count($complies) > 0 ) {
                foreach($complies as $comply) {
                    $checks[] = $this->checkExam($exam_id, $form, $comply, $correction);
                }

                return $checks;
            } else {
                return new Response(203, "There's no Exams Taken by Student!");
            }
        } else {
            return new Response(204, "There's no Correction in this Exam!");
        }
    }


    public function checkExam($exam_id, $form, $comply, $correction) {
        global $APPLICATION;

        $total_points = $form->points;
        $grade = 0; // out of 100
        $answers = $comply->answers;

        $record = [];

        foreach ($form->questions as $question) {
            $correctAnswer = $this->findCorrectAnswer($question->form_question_id, $correction);

            foreach ($answers as $answer) {
                if ($answer->question_id == $question->form_question_id) {
                    // Store the user's answer and the correct answer in the record
                    $record[] = [
                        'question_id' => $question->form_question_id,
                        'user_answer' => $answer->answer,
                        'correct_answer' => $correctAnswer
                    ];

                    if ($question->question_type == "multiple-choice" || $question->question_type == "true-false" || $question->question_type == "dropdown") {
                        // Check if the answer is correct
                        $ans = is_array($correctAnswer) ? $correctAnswer[0] : $correctAnswer;

                        if ($answer->answer == $ans) {
                            $score += $question->points; // Add points for correct answer
                        }
                    } elseif ($question->question_type == "checkbox") {
                        // Check if the answer is correct
                        $ans = json_encode($correctAnswer);

                        if ($answer->answer === $correctAnswer) {
                            $score += $question->points; // Add points for correct answer
                        }
                    } elseif ($question->question_type == "matching") {
                        $ans = $answer->answer; // No need to encode, we can use it directly
                        
                        $correct = 0;
                        $tp = $question->points; // Total points for the question

                        for($i = 0; $i < count($correctAnswer); $i++) {
                            if ($correctAnswer[$i] == $ans[$i]) {
                                $correct++;
                            } 
                        }

                        // Calculate average score based on correct answers only
                        $score += ($correct / count($correctAnswer)) * $tp; // Average point calculation
                    } elseif ($question->question_type == "paragraph" || $question->question_type == "short-answer") {
                        if ($correctAnswer['type'] === 'specific') {
                            if ( $answer->answer == $correctAnswer['text']) {
                                $score += $question->points; // Add points for correct answer
                            }
                        } elseif ($correctAnswer['type'] == 'keyword') {
                            foreach($correctAnswer['keywords'] as $keyword) {
                                if (stripos($answer->answer, $keyword) !== false) {
                                    $score += $question->points; // Add points for correct keyword
                                    break; // Exit loop after finding the first matching keyword
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // Calculate the grade based on the score
        $grade = ($score / $total_points) * 100; // Convert to percentage
        // You can store or return the grade as needed

        $data = [
            "user_id" => $comply->user_id,
            "comply_id" => $comply->form_completion_id,
            "score" => $score,
            "total_points" => $total_points,
            "grade" => $grade,
            "datas" => json_encode($record)
        ];

        $gradeData = [
            "category" => "Form",
            "parent_id" => $exam_id,
            "id" => $comply->form_completion_id,
            "grade" => $data['grade']
        ];

        $control = $APPLICATION->FUNCTIONS->FORM_CHECK_CONTROL;
        $gradeControl = $APPLICATION->FUNCTIONS->GRADE_SCORE_CONTROL;

        $exists = $control->alreadyExists(['user_id' => $comply->user_id, 'comply_id' => $comply->form_completion_id]);
        $gradeExists = $gradeControl->alreadyExists(['id' => $comply->form_completion_id, 'category' => 'Form', 'parent_id' => $exam_id]);

        if ($exists->code == 200) {
            $control->editRecord($exists->body['id'], $data);
        } else {
            $control->addRecord($data);
        }

        if ($gradeExists->code == 200) {
            gradeControl->editRecord($gradeExists->body['id'], ['grade' => $grade]);
        } else {
            $gradeControl->addRecord($gradeData);
        }

        return $data;
    }

    public function findCorrectAnswer($question_id, $correction) {
        $data = json_decode($correction->data, true); // Decode JSON to associative array

        // Check if the question_id exists in the data
        if (array_key_exists($question_id, $data)) {
            return $data[$question_id]; // Return the correct answer(s) for the given question_id
        }

        return null; // Return null if question_id is not found
    }
}