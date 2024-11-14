import {FormRenderer} from "../../../classes/components/FormCreator.js";
import {SelectModel} from "../../../modules/app/Administrator.js";

function GetFormData(formID) {
    return SelectModel(formID, 'FORM_CONTROL');
}

function Init() {
    document.addEventListener('DOMContentLoaded', function() {
        const formID = document.querySelector('[data-form_id]').getAttribute('data-form_id');
        const examID = document.querySelector('[data-exam_id]').getAttribute('data-exam_id');

        GetFormData(formID).then(formData => {
            const formRenderer = new FormRenderer('questionsContainer', formData, examID);
        });

    });
}


Init();