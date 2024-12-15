import FormCreator, {FormRenderer, FormCorrectionCreator} from "../../../classes/components/FormCreator.js";
import  {GetFormData} from "./viewForm.js";


function Init() {
    document.addEventListener('DOMContentLoaded', function() {
        const questionsContainer = document.getElementById('questionsContainer');
        // const action = questionsContainer.getAttribute('data-action');
        const formID = questionsContainer.dataset.formId;


        GetFormData(formID).then((formData) => {
            console.log(formData)
            const formQuestionCr = new FormCorrectionCreator('questionsContainer', formData);


        });


    });
}


Init();