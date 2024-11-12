import Popup from "./Popup.js";
import { ListenToForm, ManageComboBoxes } from "../../modules/component/Tool.js";
import {
    AddRecord,
} from "../../modules/app/SystemFunctions.js";

export class FormQuestion {
    constructor(containerId) {
        this.containerId = containerId;
        this.choiceCount = 2;
        this.element = this.createQuestionElement();
        this.callback = null;
        this.initializeEventListeners();
        this.updateQuestionType();
        this.initializeDragAndDrop();
        this.updateQuestionNumber();
    }

    addCallback(callback) {
        this.callback = callback;
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
        const questions = container.querySelectorAll('.question-container');
        questions.forEach((question, index) => {
            const numberElement = question.querySelector('.question-number');
            numberElement.textContent = `${index + 1}`;
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
        const initialQuestion = new FormQuestion(this.containerId);
        this.container.appendChild(initialQuestion.element);
        this.questions.push(initialQuestion);

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
            obj.description = e.target.textContent  ;
            });

            obj.description = descriptionInput.textContent;
        }

    }

    addNewQuestion() {
        const newQuestion = new FormQuestion(this.containerId);

        newQuestion.addCallback((question) => {
            this.questions.push(question);
        });

        this.container.appendChild(newQuestion.element);
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

        const popup = new Popup(`forms/add_new_form`, {title: obj.title, description: obj.description}, {
            backgroundDismiss: false,
        });

        popup.Create().then(((pop) => {
            popup.Show();

            ListenToForm(popup.ELEMENT.querySelector("form.form-control"), function (data) {
                obj.publishForm({...mainData, ...data}).then(() => {
                    popup.Remove();
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
        
        // Reset input fields
        // document.getElementById('formTitle').value = '';
        // document.getElementById('formDescription').value = '';
        // document.getElementById('formType').value = 'quiz';
        
        feather.replace();
    }
}