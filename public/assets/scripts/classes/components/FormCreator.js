import Popup from "./Popup.js";
import { ListenToForm, ManageComboBoxes } from "../../modules/component/Tool.js";
import {
    AddRecord,
} from "../../modules/app/SystemFunctions.js";
import { NewNotification } from "./NotificationPopup.js";
export class FormQuestion {
    constructor(containerId, isPreview = false, questionData = null) {
        this.questionData = questionData;
        this.containerId = containerId;
        this.choiceCount = 2;
        this.element = this.createQuestionElement();
        this.callback = null;
        this.isPreview = isPreview;
        this.initializeEventListeners();
        this.updateQuestionType();
        if (!isPreview) {
            this.initializeDragAndDrop();
            this.updateQuestionNumber();
        }
    }

    addCallback(callback) {
        this.callback = callback;
        console.log(this.callback);
    }

    createQuestionElement() {
        const div = document.createElement('div');
        div.className = 'question-container fade-in';
        div.draggable = true;
        div.innerHTML = `
            <div class="question-number">1</div>
            <div class="drag-handle">
                <i data-feather="menu" class="drag-icon"></i>
            </div>
            <div class="question-header">
                <div class="question-input">
                    <textarea placeholder="Enter your question" class="question-title" rows="1"></textarea>
                </div>
                <select class="question-type">
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="short-answer">Short Answer</option>
                    <option value="paragraph">Paragraph</option>
                </select>
                <button class="add-image-btn" title="Add Image">
                    <i data-feather="image"></i>
                </button>
                <input type="file" class="image-input" accept="image/*" style="display: none;">
            </div>

            <div class="question-image-container" style="display: none; position: relative;">
                <img class="question-image" style="max-width: 100%; margin: 1rem 0;">
                <button class="remove-image-btn" style="display: none;">
                    <i data-feather="x"></i>
                </button>
            </div>
            
            <div class="choices-container">
                <div class="choice-item">
                    <span class="choice-type-indicator"></span>
                    <input type="text" placeholder="Choice 1" class="choice-input">
                    <button class="remove-choice" title="Remove choice">
                        <i data-feather="trash-2"></i>
                    </button>
                </div>
                <div class="choice-item">
                    <span class="choice-type-indicator"></span>
                    <input type="text" placeholder="Choice 2" class="choice-input">
                    <button class="remove-choice" title="Remove choice">
                        <i data-feather="trash-2"></i>
                    </button>
                </div>
            </div>
            
            <button class="add-choice-btn">
                <i data-feather="plus" style="vertical-align: middle;"></i>
                Add Choice
            </button>

            <div class="text-answer-message" style="display: none;">
                <i data-feather="info" class="info-icon"></i>
                This is a short answer question type. Students will be able to enter a brief response.
            </div>

            <div class="text-answer-message" style="display: none;">
                <i data-feather="info" class="info-icon"></i>
                This is a paragraph question type. Students will be able to enter a longer response.
            </div>

            <div class="question-actions">
                <button class="action-btn delete-btn" title="Delete question">
                    <i data-feather="trash-2"></i>
                </button>
                <button class="action-btn duplicate-btn" title="Duplicate question">
                    <i data-feather="copy"></i>
                </button>
            </div>
        `;
        return div;
    }

    getQuestionDataFromPreview() {
        const questionData = this.questionData;

        return  {
            question_id: questionData.form_question_id,
            formID: questionData.form_id,
            questionNumber: questionData.question_number,
            title: questionData.question,
            type: questionData.question_type,
            choices: questionData.choices ? questionData.choices.map((choice) => choice.choice) : [],
            choices_id: questionData.choices ? questionData.choices.map((choice) => choice.form_question_choice_id) : [],
            imageUrl: questionData.image_url
        }
    }

    getQuestionSummaryAnswer() {
        const questionData = this.isPreview ? this.getQuestionDataFromPreview() : this.getQuestionSummary();
        const questionElement = this.element;
        let answer = null;
        let choice_id = null;

        switch(questionData.type) {
            case 'multiple-choice':
                const selectedRadio = questionElement.querySelector('input[type="radio"]:checked');
                if (selectedRadio) {
                    answer = selectedRadio.value;
                    choice_id = selectedRadio.dataset.choiceId;
                }
                break;
            case 'checkbox':
                const selectedCheckboxes = questionElement.querySelectorAll('input[type="checkbox"]:checked');
                if (selectedCheckboxes.length > 0) {
                    answer = JSON.stringify(Array.from(selectedCheckboxes).map(cb => cb.value));
                    choice_id = JSON.stringify(Array.from(selectedCheckboxes).map(cb => cb.dataset.choiceId));
                }
                break;
            case 'dropdown':
                const selectedOption = questionElement.querySelector('select').selectedOptions[0];
                if (selectedOption) {
                    answer = selectedOption.value;
                    choice_id = selectedOption.dataset.choiceId;
                }
                break;
            case 'short-answer':
            case 'paragraph':
                const textInput = questionElement.querySelector('input[type="text"], textarea');
                if (textInput) {
                    answer = textInput.value;
                }
                break;
        }

        return {
            question_id: questionData.question_id,
            type: questionData.type,
            answer: answer,
            choice_id: choice_id
        };
    }

    renderForAnswer() {
        const questionData = this.isPreview ? this.getQuestionDataFromPreview() : this.getQuestionSummary();
        const div = document.createElement('div');
        div.className = 'question-container preview-mode';
        div.dataset.questionId = questionData.question_id;

        let answerHTML = '';
        console.log(questionData.type);
        switch(questionData.type) {
            case 'multiple-choice':
                answerHTML = questionData.choices.map((choice, idx) => `
                    <div class="choice-item">
                        <span class="choice-type-indicator" style="border-radius: 50%"></span>
                        <input type="radio" name="q${questionData.questionNumber}" value="${choice}" data-choice-id="${questionData.choices_id[idx]}" id="q${questionData.questionNumber}_${idx}" class="form-check-input" style="display: none;">
                        <label class="choice-input" for="q${questionData.questionNumber}_${idx}">${choice}</label>
                    </div>
                `).join('');

                break;
            case 'checkbox':
                answerHTML = questionData.choices.map((choice, idx) => `
                    <div class="choice-item">
                        <span class="choice-type-indicator" style="border-radius: 4px"></span>
                        <input type="checkbox" name="q${questionData.questionNumber}" value="${choice}" data-choice-id="${questionData.choices_id[idx]}" id="q${questionData.questionNumber}_${idx}" class="form-check-input" style="display: none;">
                        <label class="choice-input" for="q${questionData.questionNumber}_${idx}">${choice}</label>
                    </div>
                `).join('');
                break;
            case 'dropdown':
                answerHTML = `
                    <div class="choice-item">
                        <select class="choice-input" name="q${questionData.questionNumber}">
                            <option value="">Select an answer</option>
                            ${questionData.choices.map((choice, idx) => `
                                <option value="${choice}" data-choice-id="${questionData.choices_id[idx]}">${choice}</option>
                            `).join('')}
                        </select>
                    </div>
                `;
                break;
            case 'short-answer':
                answerHTML = `
                    <input type="text" class="choice-input" name="q${questionData.questionNumber}" placeholder="Your answer">
                    <div class="text-answer-message">
                        <i data-feather="info" class="info-icon"></i>
                        This is a short answer question type. Enter a brief response.
                    </div>
                `;
                break;
            case 'paragraph':
                answerHTML = `
                    <textarea class="choice-input" name="q${questionData.questionNumber}" rows="3" placeholder="Your answer"></textarea>
                    <div class="text-answer-message">
                        <i data-feather="info" class="info-icon"></i>
                        This is a paragraph question type. Enter a longer response.
                    </div>
                `;
                break;
        }

        div.innerHTML = `
            <div class="question-number">${questionData.questionNumber}</div>
            <div class="question-header">
                <div class="question-input">
                    <div class="question-title" style="border: none; background: none;">${questionData.title}</div>
                </div>
            </div>
            ${questionData.imageUrl ? `
                <div class="question-image-container" style="display: block; position: relative;">
                    <img src="${questionData.imageUrl}" class="question-image" style="max-width: 100%; margin: 1rem 0;">
                </div>
            ` : ''}
            <div class="choices-container">
                ${answerHTML}
            </div>
        `;

        // Add click handlers for choice items
        const choiceItems = div.querySelectorAll('.choice-item');
        choiceItems.forEach(item => {
            item.addEventListener('click', () => {
                const input = item.querySelector('input');
                if (input) {
                    if (input.type === 'radio') {
                        // Unselect all other choices
                        choiceItems.forEach(otherItem => {
                            otherItem.classList.remove('selected');
                            otherItem.querySelector('.choice-type-indicator').style.background = '';
                        });
                    }
                    input.checked = !input.checked;
                    if (input.checked) {
                        item.classList.add('selected');
                        item.querySelector('.choice-type-indicator').style.background = '#3b82f6';
                    } else {
                        item.classList.remove('selected');
                        item.querySelector('.choice-type-indicator').style.background = '';
                    }
                }
            });
        });

        return div;
    }

    getQuestionSummary() {
        const questionNumber = this.element.querySelector('.question-number').textContent;
        const title = this.element.querySelector('.question-title').value;
        const type = this.element.querySelector('.question-type').value;
        const choices = Array.from(this.element.querySelectorAll('.choice-input'))
            .map(input => input.value)
            .filter(value => value.trim() !== '');
        const imageElement = this.element.querySelector('.question-image');
        const imageUrl = imageElement && imageElement.src !== '' ? imageElement.src : null;

        return {
            questionNumber: parseInt(questionNumber),
            title: title || 'Untitled Question',
            type: type,
            choices: type === 'short-answer' || type === 'paragraph' ? [] : choices,
            imageUrl: imageUrl
        };
    }

    updateQuestionNumber() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        const questions = container.querySelectorAll('.question-container');
        questions.forEach((question, index) => {
            const numberElement = question.querySelector('.question-number');
            if (numberElement) {
                numberElement.textContent = `${index + 1}`;
            }
        });
    }

    initializeEventListeners() {
        const questionType = this.element.querySelector('.question-type');
        const addChoiceBtn = this.element.querySelector('.add-choice-btn');
        const deleteBtn = this.element.querySelector('.delete-btn');
        const duplicateBtn = this.element.querySelector('.duplicate-btn');
        const questionTitle = this.element.querySelector('.question-title');
        const addImageBtn = this.element.querySelector('.add-image-btn');
        const imageInput = this.element.querySelector('.image-input');
        const removeImageBtn = this.element.querySelector('.remove-image-btn');

        questionType.addEventListener('change', () => this.updateQuestionType());
        addChoiceBtn.addEventListener('click', () => this.addChoice());
        deleteBtn.addEventListener('click', () => this.delete());
        duplicateBtn.addEventListener('click', () => this.duplicate());

        addImageBtn.addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        removeImageBtn.addEventListener('click', () => this.removeImage());

        this.element.addEventListener('click', (e) => {
            if (e.target.closest('.remove-choice')) {
                this.removeChoice(e.target.closest('.choice-item'));
            }
        });

        // Auto-resize textarea
        questionTitle.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageContainer = this.element.querySelector('.question-image-container');
                const image = this.element.querySelector('.question-image');
                const removeBtn = this.element.querySelector('.remove-image-btn');
                
                image.src = e.target.result;
                imageContainer.style.display = 'block';
                removeBtn.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        }
    }

    removeImage() {
        const imageContainer = this.element.querySelector('.question-image-container');
        const image = this.element.querySelector('.question-image');
        const removeBtn = this.element.querySelector('.remove-image-btn');
        const imageInput = this.element.querySelector('.image-input');
        
        image.src = '';
        imageContainer.style.display = 'none';
        removeBtn.style.display = 'none';
        imageInput.value = '';
    }

    initializeDragAndDrop() {
        this.element.addEventListener('dragstart', (e) => {
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        this.element.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
            this.updateQuestionNumber();
        });

        this.element.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingElement = document.querySelector('.dragging');
            const container = document.getElementById(this.containerId);
            const afterElement = this.getDragAfterElement(container, e.clientY);
            
            if (afterElement) {
                container.insertBefore(draggingElement, afterElement);
            } else {
                container.appendChild(draggingElement);
            }
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.question-container:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    updateQuestionType() {
        const type = this.element.querySelector('.question-type').value;
        const choicesContainer = this.element.querySelector('.choices-container');
        const choices = choicesContainer.querySelectorAll('.choice-item');
        const addChoiceBtn = this.element.querySelector('.add-choice-btn');
        const textMessages = this.element.querySelectorAll('.text-answer-message');
        
        choicesContainer.style.display = 'flex';
        addChoiceBtn.style.display = 'block';
        textMessages.forEach(msg => msg.style.display = 'none');

        if (type === 'short-answer') {
            choicesContainer.style.display = 'none';
            addChoiceBtn.style.display = 'none';
            textMessages[0].style.display = 'block';
        } else if (type === 'paragraph') {
            choicesContainer.style.display = 'none';
            addChoiceBtn.style.display = 'none';
            textMessages[1].style.display = 'block';
        } else {
            choices.forEach(choice => {
                const indicator = choice.querySelector('.choice-type-indicator');
                indicator.style.display = type === 'dropdown' ? 'none' : 'block';
                indicator.style.borderRadius = type === 'multiple-choice' ? '50%' : '4px';
            });
        }
    }

    addChoice() {
        this.choiceCount++;
        const choicesContainer = this.element.querySelector('.choices-container');
        const newChoice = document.createElement('div');
        newChoice.className = 'choice-item fade-in';
        newChoice.innerHTML = `
            <span class="choice-type-indicator"></span>
            <input type="text" placeholder="Choice ${this.choiceCount}" class="choice-input">
            <button class="remove-choice" title="Remove choice">
                <i data-feather="trash-2"></i>
            </button>
        `;
        choicesContainer.appendChild(newChoice);
        feather.replace();
        this.updateQuestionType();
    }

    removeChoice(choiceElement) {
        choiceElement.style.opacity = '0';
        choiceElement.style.transform = 'translateY(-10px)';
        setTimeout(() => choiceElement.remove(), 200);
    }

    delete() {
        this.element.style.opacity = '0';
        this.element.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (this.callback) {
                this.callback(null); // Notify parent that this question is deleted
            }
            this.element.remove();
            this.updateQuestionNumber();
        }, 200);
    }

    duplicate() {
        const newQuestion = new FormQuestion(this.containerId);
        
        // Copy question title
        const originalTitle = this.element.querySelector('.question-title').value;
        newQuestion.element.querySelector('.question-title').value = originalTitle;
        
        // Copy question type
        const originalType = this.element.querySelector('.question-type').value;
        newQuestion.element.querySelector('.question-type').value = originalType;
        
        // Copy choices
        const originalChoices = Array.from(this.element.querySelectorAll('.choice-input'));
        const newChoices = newQuestion.element.querySelectorAll('.choice-input');
        
        // Remove default choices first
        const choicesContainer = newQuestion.element.querySelector('.choices-container');
        choicesContainer.innerHTML = '';
        
        // Add copied choices
        originalChoices.forEach((choice, index) => {
            const newChoice = document.createElement('div');
            newChoice.className = 'choice-item fade-in';
            newChoice.innerHTML = `
                <span class="choice-type-indicator"></span>
                <input type="text" placeholder="Choice ${index + 1}" class="choice-input" value="${choice.value}">
                <button class="remove-choice" title="Remove choice">
                    <i data-feather="trash-2"></i>
                </button>
            `;
            choicesContainer.appendChild(newChoice);
        });
        
        // Copy image if exists
        const originalImage = this.element.querySelector('.question-image');
        if (originalImage && originalImage.src) {
            const newImage = newQuestion.element.querySelector('.question-image');
            const newImageContainer = newQuestion.element.querySelector('.question-image-container');
            const newRemoveBtn = newQuestion.element.querySelector('.remove-image-btn');
            
            newImage.src = originalImage.src;
            newImageContainer.style.display = 'block';
            newRemoveBtn.style.display = 'flex';
        }
        
        this.element.parentNode.insertBefore(newQuestion.element, this.element.nextSibling);
        feather.replace();
        newQuestion.element.scrollIntoView({ behavior: 'smooth' });
        newQuestion.updateQuestionType();
        this.updateQuestionNumber();

        if (this.callback) {
            newQuestion.addCallback(this.callback);
            this.callback(newQuestion);
        }
    }
}

export default class FormCreator {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.addQuestionBtn = document.getElementById('addQuestionBtn');
        this.resetBtn = document.getElementById('resetFormBtn');
        this.saveBtn = document.getElementById('saveFormBtn');
        this.title = '';
        this.description = '';
        this.formType = 'quiz'; // Default form type
        this.questions = [];
        this.initialize();
    }

    initialize() {
        // Add initial question
        this.addNewQuestion();

        if (this.addQuestionBtn) {  
            // Add new question button handler
            this.addQuestionBtn.addEventListener('click', () => this.addNewQuestion());
        }

        if (this.resetBtn) {
            // Reset button handler
            this.resetBtn.addEventListener('click', () => this.resetForm());
        }

        if (this.saveBtn) {
            // Save button handler
            this.saveBtn.addEventListener('click', () => this.saveForm());
        }

        // Initialize form title and description inputs
        this.initializeFormMetadata();

        feather.replace();
    }

    initializeFormMetadata() {
        const titleInput = document.getElementById('formTitle');
        const descriptionInput = document.getElementById('formDescription');
        const obj = this;
        
        if (titleInput) {
            titleInput.addEventListener('input', (e) => {
                obj.title = e.target.textContent;
            });

            obj.title = titleInput.textContent;
        }

        if (descriptionInput) {
            descriptionInput.addEventListener('input', (e) => {
                obj.description = e.target.textContent;
            });

            obj.description = descriptionInput.textContent;
        }
    }

    addNewQuestion() {
        const newQuestion = new FormQuestion(this.containerId);

        newQuestion.addCallback((question) => {
            if (question === null) {
                // Question was deleted
                const index = this.questions.findIndex(q => q === newQuestion);
                if (index !== -1) {
                    this.questions.splice(index, 1);
                }
            } else {
                // Question was added or duplicated
                this.questions.push(question);
            }
        });

        this.container.appendChild(newQuestion.element);
        this.questions.push(newQuestion);
        feather.replace();
        newQuestion.element.scrollIntoView({ behavior: 'smooth' });
        newQuestion.updateQuestionNumber();
    }

    publishForm(data) {
        return new Promise((resolve) => {
            console.log(data);
            AddRecord("forms", {data: JSON.stringify(data)}).then((res) => {
                resolve(res);
            });
        });
    }

    saveForm() {
        const obj = this;
        const mainData = {  
            title: obj.title,
            description: obj.description,
            form_type: obj.formType,
            questions: obj.questions.map((question) => question.getQuestionSummary())
        };

        // Validate required fields
        if (!mainData.title.trim()) {
            NewNotification({
                type: "error",
                message: "Please enter a form title"
            });
            return;
        }

        const popup = new Popup(`forms/add_new_form`, {title: obj.title, description: obj.description}, {
            backgroundDismiss: false,
        });

        popup.Create().then(((pop) => {
            popup.Show();

            ListenToForm(popup.ELEMENT.querySelector("form.form-control"), function (data) {
                console.log(mainData,data);
                obj.publishForm({...mainData, ...data}).then((res) => {
                    NewNotification({
                        type: "success",
                        message: "Form saved successfully"
                    });

                    popup.Remove();

                    window.location.replace(`/me/resources`);
                }).catch(error => {
                    NewNotification({
                        type: "error",
                        message: "Failed to save form. Please try again."
                    });
                });
            });

            ManageComboBoxes(popup.ELEMENT);
        }));
    }

    resetForm() {
        // Remove all questions except one
        while (this.questions.length > 0) {
            const question = this.questions.pop();
            question.element.remove();
        }
        
        // Add back one default question
        const defaultQuestion = new FormQuestion(this.containerId);
        this.container.appendChild(defaultQuestion.element);
        this.questions.push(defaultQuestion);
        
        // Reset form metadata
        this.title = '';
        this.description = '';
        this.formType = 'quiz';
        
        feather.replace();

        NewNotification({
            type: "info",
            message: "Form has been reset"
        });
    }
}

export class FormRenderer {
    constructor(containerId, formData, parentID = null, userAnswers = []) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.saveBtn = document.getElementById('saveFormBtn');
        this.resetBtn = document.getElementById('resetFormBtn');
        this.formData = formData;
        this.answers = new Map();
        this.formId = formData.id;
        this.parentID = parentID;
        this.userAnswers = userAnswers;
        this.isPreviewMode = userAnswers.length > 0;

        this.initialize();
        this.initializeEventListeners();
        this.applyAnswers();
    }

    applyAnswers() {
        if (!this.userAnswers || this.userAnswers.length === 0) return;

        // Process each answer
        this.userAnswers.forEach(answer => {
            const questionElement = this.container.querySelector(`[data-question-id="${answer.question_id}"]`);
            if (!questionElement) return;

            switch (answer.type) {
                case 'multiple-choice':
                    const radioInput = questionElement.querySelector(`input[data-choice-id="${answer.choice_id}"]`);
                    if (radioInput) {
                        radioInput.checked = true;
                        const allRadios = questionElement.querySelectorAll('input[type="radio"]');
                        allRadios.forEach(radio => {
                            radio.disabled = true;
                            radio.style.pointerEvents = 'none';
                            const choiceItem = radio.closest('.choice-item');
                            if (choiceItem) {
                                choiceItem.style.pointerEvents = 'none';
                            }
                        });
                        const choiceItem = radioInput.closest('.choice-item');
                        if (choiceItem) {
                            choiceItem.classList.add('selected');
                            const indicator = choiceItem.querySelector('.choice-type-indicator');
                            if (indicator) {
                                indicator.style.background = '#3b82f6';
                            }
                        }
                    }
                    break;

                case 'checkbox':
                    const choiceIds = JSON.parse(answer.choice_id);
                    const allCheckboxes = questionElement.querySelectorAll('input[type="checkbox"]');
                    allCheckboxes.forEach(checkbox => {
                        checkbox.disabled = true;
                        checkbox.style.pointerEvents = 'none';
                        const choiceItem = checkbox.closest('.choice-item');
                        if (choiceItem) {
                            choiceItem.style.pointerEvents = 'none';
                        }
                    });
                    choiceIds.forEach(choiceId => {
                        const checkboxInput = questionElement.querySelector(`input[data-choice-id="${choiceId}"]`);
                        if (checkboxInput) {
                            checkboxInput.checked = true;
                            const choiceItem = checkboxInput.closest('.choice-item');
                            if (choiceItem) {
                                choiceItem.classList.add('selected');
                                const indicator = choiceItem.querySelector('.choice-type-indicator');
                                if (indicator) {
                                    indicator.style.background = '#3b82f6';
                                }
                            }
                        }
                    });
                    break;

                case 'dropdown':
                    const select = questionElement.querySelector('select');
                    if (select) {
                        const option = Array.from(select.options).find(opt => 
                            opt.dataset.choiceId === answer.choice_id
                        );
                        if (option) {
                            option.selected = true;
                            select.disabled = true;
                        }
                    }
                    break;

                case 'short-answer':
                case 'paragraph':
                    const textInput = questionElement.querySelector('input, textarea');
                    if (textInput) {
                        textInput.value = answer.answer;
                        textInput.readOnly = true;
                    }
                    break;
            }
        });
    }

    initialize() {
        this.container.innerHTML = '';
        
        const header = document.createElement('div');
        header.className = 'form-header';
        header.innerHTML = `
            <h2>${this.formData.title}</h2>
            <p>${this.formData.description}</p>
        `;
        this.container.appendChild(header);

        this.formData.questions.forEach((questionData, index) => {
            const question = new FormQuestion(this.containerId, true, questionData);
            const renderedQuestion = question.renderForAnswer();
            renderedQuestion.dataset.questionData = JSON.stringify(questionData);
            this.container.appendChild(renderedQuestion);
            
            // Handle all inputs
            const inputs = renderedQuestion.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (this.isPreviewMode) {
                    input.disabled = true;
                    input.style.pointerEvents = 'none';
                    const choiceItem = input.closest('.choice-item');
                    if (choiceItem) {
                        choiceItem.style.pointerEvents = 'none';
                    }
                    return;
                }

                // Add event listeners only if not in preview mode
                if (input.type === 'radio') {
                    const choiceItem = input.closest('.choice-item');
                    if (choiceItem) {
                        choiceItem.addEventListener('click', () => {
                            const choiceId = input.dataset.choiceId;
                            this.answers.set(questionData.question_id, {
                                answer_type: 'choices',
                                answer: [choiceId]
                            });
                        });
                    }
                } else if (input.type === 'checkbox') {
                    input.addEventListener('change', () => {
                        const checkedBoxes = renderedQuestion.querySelectorAll('input:checked');
                        const choiceIds = Array.from(checkedBoxes).map(cb => cb.dataset.choiceId);
                        this.answers.set(questionData.question_id, {
                            answer_type: 'choices',
                            answer: choiceIds
                        });
                    });
                } else if (input.tagName === 'SELECT') {
                    input.addEventListener('change', (e) => {
                        const selectedOption = e.target.options[e.target.selectedIndex];
                        const choiceId = selectedOption.dataset.choiceId;
                        this.answers.set(questionData.question_id, {
                            answer_type: 'choices',
                            answer: [choiceId]
                        });
                    });
                } else {
                    input.addEventListener('change', (e) => {
                        this.answers.set(questionData.question_id, {
                            answer_type: 'text',
                            answer: e.target.value
                        });
                    });
                }
            });
        });

        feather.replace();
    }

    initializeEventListeners() {
        if (this.saveBtn && !this.isPreviewMode) {
            this.saveBtn.addEventListener('click', () => this.saveForm());
        }

        if (this.resetBtn && !this.isPreviewMode) {
            this.resetBtn.addEventListener('click', () => this.resetAnswers());
        }
    }

    saveForm() {
        const formAnswers = {
            form_id: this.formData.form_id,
            parent_id: this.parentID,
            answers: Array.from(this.container.querySelectorAll('.question-container'))
                .map(questionElement => {
                    const questionData = JSON.parse(questionElement.dataset.questionData);
                    const question = new FormQuestion(this.containerId, true, questionData);
                    question.element = questionElement;
                    return question.getQuestionSummaryAnswer();
                })
                .filter(answer => answer.answer !== null)
        };

        // Validate that at least one question is answered
        if (formAnswers.answers.length === 0) {
            NewNotification({
                type: "warning",
                message: "Please answer at least one question before submitting"
            });
            return Promise.reject();
        }
        
        return new Promise((resolve, reject) => {
            AddRecord("form_completions", {data: JSON.stringify(formAnswers)})
                .then((res) => {
                    NewNotification({
                        type: "success",
                        message: "Form submitted successfully"
                    });
                    resolve(res);
                })
                .catch(error => {
                    NewNotification({
                        type: "error",
                        message: "Failed to submit form. Please try again."
                    });
                    reject(error);
                });
        }).then(() => location.replace(`/me/classes`));
    }

    resetAnswers() {
        if (this.isPreviewMode) return;
        
        this.answers.clear();
        const inputs = this.container.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
                const choiceItem = input.closest('.choice-item');
                if (choiceItem) {
                    choiceItem.classList.remove('selected');
                    const indicator = choiceItem.querySelector('.choice-type-indicator');
                    if (indicator) {
                        indicator.style.background = '';
                    }
                }
            } else if (input.type === 'select-one') {
                input.selectedIndex = 0;
            } else {
                input.value = '';
            }
        });

        NewNotification({
            type: "info",
            message: "Form has been reset"
        });
    }
}

