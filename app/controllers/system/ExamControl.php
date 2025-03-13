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

    public function check($exam_id)
    {
        global $APPLICATION;

        $exam = $this->get($exam_id, false);

        $form = $APPLICATION->FUNCTIONS->FORM_CONTROL->get($exam['form_id'], true);

        if (isset($form->form_correction)) {
            $correction = $form->form_correction;
            $complies = $APPLICATION->FUNCTIONS->FORM_COMPLETION_CONTROL->filterRecords(['parent_id' => $exam['exam_id']], true);
            $checks = [];

            if (count($complies) > 0) {
                $formCheckControl = $APPLICATION->FUNCTIONS->FORM_CHECK_CONTROL;

                foreach ($complies as $comply) {
                    // Check if this form has already been checked
                    $exists = $formCheckControl->alreadyExists([
                        'user_id' => $comply->user_id,
                        'comply_id' => $comply->form_completion_id
                    ]);

                    // Only check forms that haven't been checked before
                    if ($exists->code != 200) {
                        $checks[] = $this->checkExam($exam_id, $form, $comply, $correction);
                    } else {
                        // For already checked forms, just return the existing data
                        $existingCheck = $formCheckControl->get($exists->body['id'], true);

                        // Fix the datas field if it contains the problematic JSON format
                        $datas = $existingCheck->datas;
                        if (is_string($datas) && strpos($datas, '"["') !== false) {
                            // Fix the specific issue with matching type answers
                            $datas = preg_replace('/"(\["[^"]*",[^"]*"\])"/m', '$1', $datas);
                        }

                        $checks[] = [
                            "user_id" => $existingCheck->user_id,
                            "comply_id" => $existingCheck->comply_id,
                            "score" => $existingCheck->score,
                            "total_points" => $existingCheck->total_points,
                            "grade" => $existingCheck->grade,
                            "datas" => $datas,
                            "already_checked" => true
                        ];
                    }
                }

                // Count how many were newly checked vs already checked
                $alreadyChecked = array_filter($checks, function ($check) {
                    return isset($check['already_checked']) && $check['already_checked'] === true;
                });

                $newlyChecked = array_filter($checks, function ($check) {
                    return !isset($check['already_checked']) || $check['already_checked'] !== true;
                });

                $message = count($newlyChecked) > 0
                    ? count($newlyChecked) . " forms newly checked, " . count($alreadyChecked) . " already checked."
                    : "All forms were already checked.";

                return new Response(200, $message, $checks);
            } else {
                return new Response(203, "There's no Exams Taken by Student!");
            }
        } else {
            return new Response(204, "There's no Correction in this Exam!");
        }
    }


    public function checkExam($exam_id, $form, $comply, $correction)
    {
        global $APPLICATION;

        $total_points = $form->points;
        $grade = 0; // out of 100
        $score = 0; // Initialize score variable
        $answers = $comply->answers;

        $record = [];

        foreach ($form->questions as $question) {
            $correctAnswer = $this->findCorrectAnswer($question->form_question_id, $correction);

            foreach ($answers as $answer) {
                if ($answer->question_id == $question->form_question_id) {
                    // Process user answer to handle potential JSON strings
                    $userAnswer = $answer->answer;

                    // Special handling for matching type questions
                    if ($question->question_type == "matching") {
                        // For matching questions, ensure we're working with arrays
                        if (is_string($userAnswer) && $this->isJson($userAnswer)) {
                            $userAnswer = json_decode($userAnswer, true);
                        } elseif (is_string($userAnswer) && strpos($userAnswer, '[') === 0) {
                            // Try to clean up malformed JSON strings
                            $cleaned = str_replace('\"', '"', $userAnswer);
                            $cleaned = preg_replace('/"\[/', '[', $cleaned);
                            $cleaned = preg_replace('/\]"/', ']', $cleaned);

                            try {
                                $decoded = json_decode($cleaned, true);
                                if (json_last_error() == JSON_ERROR_NONE && is_array($decoded)) {
                                    $userAnswer = $decoded;
                                }
                            } catch (\Exception $e) {
                                // If cleaning fails, keep original
                            }
                        }
                    }
                    // General handling for other JSON strings
                    elseif (is_string($userAnswer) && $this->isJson($userAnswer)) {
                        $userAnswer = json_decode($userAnswer, true);
                    }

                    // Store the user's answer and the correct answer in the record
                    $record[] = [
                        'question_id' => $question->form_question_id,
                        'user_answer' => $userAnswer,
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
                        $ans = $userAnswer; // Use the processed answer

                        $correct = 0;
                        $tp = $question->points; // Total points for the question

                        for ($i = 0; $i < count($correctAnswer); $i++) {
                            if (isset($ans[$i]) && $correctAnswer[$i] == $ans[$i]) {
                                $correct++;
                            }
                        }

                        // Calculate average score based on correct answers only
                        $score += ($correct / count($correctAnswer)) * $tp; // Average point calculation
                    } elseif ($question->question_type == "paragraph" || $question->question_type == "short-answer") {
                        if ($correctAnswer['type'] === 'specific') {
                            if ($answer->answer == $correctAnswer['text']) {
                                $score += $question->points; // Add points for correct answer
                            }
                        } elseif ($correctAnswer['type'] == 'keyword') {
                            foreach ($correctAnswer['keywords'] as $keyword) {
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

        // Ensure record is properly sanitized for JSON encoding
        foreach ($record as &$item) {
            // Handle potential circular references or complex objects
            if (is_object($item['user_answer'])) {
                $item['user_answer'] = json_decode(json_encode($item['user_answer']), true);
            }
            if (is_object($item['correct_answer'])) {
                $item['correct_answer'] = json_decode(json_encode($item['correct_answer']), true);
            }
        }

        // Encode with JSON_UNESCAPED_UNICODE to handle special characters properly
        $jsonData = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        // If JSON encoding failed, provide an empty array
        if ($jsonData === false) {
            $jsonData = json_encode([]);
        }

        $data = [
            "user_id" => $comply->user_id,
            "comply_id" => $comply->form_completion_id,
            "score" => $score,
            "total_points" => $total_points,
            "grade" => $grade,
            "datas" => $jsonData
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
            $gradeControl->editRecord($gradeExists->body['id'], ['grade' => $grade]);
        } else {
            $gradeControl->addRecord($gradeData);
        }

        return $data;
    }

    public function findCorrectAnswer($question_id, $correction)
    {
        $data = json_decode($correction->data, true); // Decode JSON to associative array

        // Check if the question_id exists in the data
        if (array_key_exists($question_id, $data)) {
            return $data[$question_id]; // Return the correct answer(s) for the given question_id
        }

        return null; // Return null if question_id is not found
    }

    // Helper function to check if a string is valid JSON
    private function isJson($string)
    {
        if (!is_string($string)) {
            return false;
        }

        json_decode($string);
        return (json_last_error() == JSON_ERROR_NONE);
    }
}