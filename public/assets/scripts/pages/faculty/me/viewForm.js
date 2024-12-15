import {FormRenderer} from "../../../classes/components/FormCreator.js";
import {SelectModel} from "../../../modules/app/Administrator.js";

export function GetFormData(formID) {
    return SelectModel(formID, 'FORM_CONTROL');
}

export function GetAnswers(completionID) {
    return SelectModel(completionID, 'FORM_COMPLETION_CONTROL');
}

function Init() {
    document.addEventListener('DOMContentLoaded', function() {
       try {
            const formID = document.querySelector('[data-form_id]').getAttribute('data-form_id');
            const examID = document.querySelector('[data-exam_id]').getAttribute('data-exam_id');
            const completionID = document.querySelector('[data-completion_id]').getAttribute('data-completion_id');

            GetFormData(formID).then(formData => {
                GetAnswers(completionID).then(answers => {
                    const formRenderer = new FormRenderer('questionsContainer', formData, examID, answers.answers);
                });
            });
       } catch (error) {
        
       }

    });
}


Init();