import Popup from "./Popup.js";
import { Ajax, ListenToForm, ManageComboBoxes } from "../../modules/component/Tool.js";
import {
    AddRecord,
    EditRecord,
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
                    <option value="true-false">True or False</option>
                    <option value="fill-blank">Fill in the Blank</option>
                    <option value="matching">Matching Type</option>
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
            imageUrl: questionData.image_url,
            options: questionData.options

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

            case 'true-false':
                const selectedTrueFalse = questionElement.querySelector('input[type="radio"]:checked');
                if (selectedTrueFalse) {
                    answer = selectedTrueFalse.value; // Will be "True" or "False"
                    choice_id = selectedTrueFalse.dataset.choiceId;
                }
                break;

            case 'fill-blank':
                const blankInputs = questionElement.querySelectorAll('.blank-input');
                if (blankInputs.length > 0) {
                    const blankAnswers = Array.from(blankInputs).map(input => ({
                        blankId: input.dataset.blankId,
                        answer: input.value.trim()
                    }));
                    answer = JSON.stringify(blankAnswers);
                }
                break;

            case 'matching':
                const matchingSelects = questionElement.querySelectorAll(`select`);
                const questionAnswers = Array.from(matchingSelects).map(select => select.value);

                answer = JSON.stringify(questionAnswers);
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
            case 'true-false':
                answerHTML = `
                    <div class="choice-item">
                        <span class="choice-type-indicator" style="border-radius: 50%"></span>
                        <input type="radio" name="q${questionData.questionNumber}" value="True" id="q${questionData.questionNumber}_true" class="form-check-input" style="display: none;">
                        <label class="choice-input" for="q${questionData.questionNumber}_true">True</label>
                    </div>
                    <div class="choice-item">
                        <span class="choice-type-indicator" style="border-radius: 50%"></span>
                        <input type="radio" name="q${questionData.questionNumber}" value="False" id="q${questionData.questionNumber}_false" class="form-check-input" style="display: none;">
                        <label class="choice-input" for="q${questionData.questionNumber}_false">False</label>
                    </div>
                `;
                break;
            case 'fill-blank':
                const text = questionData.title;
                answerHTML = `
                    <div class="fill-blank-answer">
                        ${text.replace(/<span class="blank-space"[^>]*data-blank-id="([^"]*)"[^>]*>[^<]*<\/span>/g, 
                            (match, blankId) => `
                                <div class="blank-input-wrapper">
                                    <input type="text" 
                                           class="blank-input" 
                                           data-blank-id="${blankId}"
                                           placeholder="Type answer">
                                </div>
                            `
                        )}
                    </div>
                `;
                break;
            case 'matching':
                const options = JSON.parse(questionData.options.options);
                // Check if questions and words exist in questionData
                const matchingQuestions = options.questions || [];
                const matchingWords = options.words || [];
                
                answerHTML = `
                    <div class="matching-answer-container">
                        <div class="matching-columns">
                            <div class="matching-questions">
                                ${matchingQuestions.map((question, index) => `
                                    <div class="matching-question" data-question-index="${index}">
                                        <span class="question-number">${index + 1}.</span>
                                        <div class="question-text">${question}</div>
                                        <div class="connection-point right"></div>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="matching-connections">
                                <canvas id="matching-canvas-${questionData.questionNumber}"></canvas>
                            </div>
                            <div class="matching-words">
                                ${matchingWords.map((word, index) => `
                                    <div class="matching-word" data-word-index="${index}">
                                        <div class="connection-point left"></div>
                                        <div class="word-text">${word}</div>
                                        <span class="word-letter">${String.fromCharCode(65 + index)}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="matching-answers">
                            ${matchingQuestions.map((_, qIndex) => `
                                <div class="matching-answer-row">
                                    <span class="answer-label">Question ${qIndex + 1} matches with:</span>
                                    <select name="match_${questionData.questionNumber}_${qIndex}" class="matching-select">
                                        <option value="">Select answer</option>
                                        ${matchingWords.map((_, wIndex) => `
                                            <option value="${String.fromCharCode(65 + wIndex)}">
                                                ${String.fromCharCode(65 + wIndex)}
                                            </option>
                                        `).join('')}
                                    </select>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;


                // Only initialize if we have questions and words
                if (matchingQuestions.length > 0 && matchingWords.length > 0) {
                    setTimeout(() => {
                        initializeMatchingConnections(questionData.questionNumber);
                    }, 100);
                }
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
        const type = this.element.querySelector('.question-type').value;
        const imageElement = this.element.querySelector('.question-image');
        const imageUrl = imageElement && imageElement.src !== '' ? imageElement.src : null;

        // Handle matching type
        if (type === 'matching') {
            const questions = Array.from(this.element.querySelectorAll('.matching-input.question-input'))
                .map(input => input.value.trim())
                .filter(value => value !== '');
            
            const words = Array.from(this.element.querySelectorAll('.matching-input.word-input'))
                .map(input => input.value.trim())
                .filter(value => value !== '');

            return {
                questionNumber: parseInt(questionNumber),
                type: type,
                questions: questions,
                words: words,
                imageUrl: imageUrl
            };
        }

        // Handle fill-blank type
        if (type === 'fill-blank') {
            const editor = this.element.querySelector('.editor-content');
            
            // Get all blank spaces from the editor content
            const blankSpaces = editor.querySelectorAll('.blank-space');
            const blanks = Array.from(blankSpaces).map(blankSpace => ({
                blankId: blankSpace.dataset.blankId,
                text: blankSpace.textContent,
            }));
            
            return {
                questionNumber: parseInt(questionNumber),
                title: editor.innerHTML,
                type: type,
                blanks: blanks,
                imageUrl: imageUrl
            };
        }

        // Handle true-false type
        if (type === 'true-false') {
            return {
                questionNumber: parseInt(questionNumber),
                title: this.element.querySelector('.question-title').value || 'Untitled Question',
                type: type,
                choices: ['True', 'False'],
                imageUrl: imageUrl
            };
        }

        // Handle short-answer and paragraph types
        if (type === 'short-answer' || type === 'paragraph') {
            return {
                questionNumber: parseInt(questionNumber),
                title: this.element.querySelector('.question-title').value || 'Untitled Question',
                type: type,
                choices: [],
                imageUrl: imageUrl
            };
        }

        // Handle multiple-choice, checkbox, and dropdown types
        const title = this.element.querySelector('.question-title').value;
        const choiceInputs = this.element.querySelectorAll('.choice-input');
        const choices = choiceInputs ? Array.from(choiceInputs)
            .map(input => input.value)
            .filter(value => value && value.trim() !== '')
            : [];

        return {
            questionNumber: parseInt(questionNumber),
            title: title || 'Untitled Question',
            type: type,
            choices: choices,
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

        if (type === 'true-false') {
            // Clear existing choices and add True/False options
            choicesContainer.innerHTML = `
                <div class="choice-item">
                    <span class="choice-type-indicator" style="border-radius: 50%"></span>
                    <input type="text" value="True" class="choice-input" readonly>
                </div>
                <div class="choice-item">
                    <span class="choice-type-indicator" style="border-radius: 50%"></span>
                    <input type="text" value="False" class="choice-input" readonly>
                </div>
            `;
            addChoiceBtn.style.display = 'none'; // Hide add choice button for true/false
        } else if (type === 'short-answer') {
            choicesContainer.style.display = 'none';
            addChoiceBtn.style.display = 'none';
            textMessages[0].style.display = 'block';
        } else if (type === 'paragraph') {
            choicesContainer.style.display = 'none';
            addChoiceBtn.style.display = 'none';
            textMessages[1].style.display = 'block';
        } else if (type === 'fill-blank') {
            // Hide the main question textarea since editor content is the question
            this.element.querySelector('.question-input').style.display = 'none';
            
            choicesContainer.innerHTML = `
                <div class="fill-blank-container">
                    <div class="fill-blank-section">
                        <div class="section-header">
                            <div class="header-title">
                                <i data-feather="edit-3"></i>
                                <span>Fill in the Blank Text</span>
                            </div>
                            <button class="add-blank-btn">
                                <i data-feather="plus-square"></i>
                                Add Blank Space
                            </button>
                            <div class="editor-tip">
                                <i data-feather="help-circle"></i>
                                Select text and click "Add Blank Space"
                            </div>
                        </div>
                        <div class="editor-content" contenteditable="true" 
                             placeholder="Type your text here. Example: The capital of the Philippines is ___."></div>
                    </div>
                </div>
            `;
            
            addChoiceBtn.style.display = 'none';
            
            // Add these styles
            const style = document.createElement('style');
            style.textContent = `
                .fill-blank-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    padding: 0;
                    margin-top: 1rem;
                }

                .fill-blank-section {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 1.25rem;
                    background: #f8fafc;
                    border-bottom: 1px solid #e2e8f0;
                    color: #0f172a;
                    font-weight: 600;
                }

                .section-header i {
                    width: 18px;
                    height: 18px;
                    color: #3b82f6;
                }

                .editor-toolbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 1.25rem;
                    background: white;
                    border-bottom: 1px solid #e2e8f0;
                }

                .add-blank-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }

                .add-blank-btn:hover {
                    background: #2563eb;
                    transform: translateY(-1px);
                }

                .add-blank-btn i {
                    width: 16px;
                    height: 16px;
                }

                .editor-tip {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 0.75rem;
                    background: #f1f5f9;
                    border-radius: 6px;
                    color: #64748b;
                    font-size: 0.875rem;
                }

                .editor-tip i {
                    width: 16px;
                    height: 16px;
                    color: #3b82f6;
                }

                .editor-content {
                    min-height: 120px;
                    padding: 1.25rem;
                    font-size: 1rem;
                    line-height: 1.6;
                    color: #1e293b;
                }

                .editor-content:focus {
                    outline: none;
                }

                .editor-content[placeholder]:empty:before {
                    content: attr(placeholder);
                    color: #94a3b8;
                    font-style: italic;
                }

                .blank-space {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.375rem 0.75rem;
                    margin: 0 0.25rem;
                    background: #dbeafe;
                    border: 1px solid #93c5fd;
                    border-radius: 4px;
                    color: #1d4ed8;
                    font-weight: 500;
                    user-select: none;
                }
            `;
            document.head.appendChild(style);

            // Initialize fill-blank functionality
            this.initializeFillBlankEditor();
        } else if (type === 'matching') {
            // Hide the main question textarea since questions are in the list
            this.element.querySelector('.question-input').style.display = 'none';
            
            choicesContainer.innerHTML = `
                <div class="matching-container">
                    <div class="matching-section">
                        <div class="section-header">
                            <div class="header-title">
                                <i data-feather="help-circle"></i>
                                <span>Questions</span>
                            </div>
                            <button class="add-item-btn" data-type="question">
                                <i data-feather="plus"></i>
                                Add Question
                            </button>
                        </div>
                        <div class="matching-items questions-list">
                            <div class="matching-item">
                                <div class="item-number">1</div>
                                <textarea class="matching-input question-input" 
                                  placeholder="Enter your question"
                                  rows="2"></textarea>
                                <button class="remove-item-btn" title="Remove question">
                                    <i data-feather="x"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="matching-section">
                        <div class="section-header">
                            <div class="header-title">
                                <i data-feather="list"></i>
                                <span>Words</span>
                            </div>
                            <button class="add-item-btn" data-type="word">
                                <i data-feather="plus"></i>
                                Add Word
                            </button>
                        </div>
                        <div class="matching-items words-list">
                            <div class="matching-item">
                                <div class="item-number">A</div>
                                <input type="text" class="matching-input word-input" 
                               placeholder="Enter word to match">
                                <button class="remove-item-btn" title="Remove word">
                                    <i data-feather="x"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            addChoiceBtn.style.display = 'none';
            
            // Replace feather icons immediately after adding HTML
            feather.replace();

            // Initialize matching type functionality
            this.initializeMatchingType();
        } else {
            choices.forEach(choice => {
                const indicator = choice.querySelector('.choice-type-indicator');
                indicator.style.display = type === 'dropdown' ? 'none' : 'block';
                indicator.style.borderRadius = type === 'multiple-choice' ? '50%' : '4px';
            });
            // Show the main question textarea for other question types
            this.element.querySelector('.question-input').style.display = 'block';
        }

        // Add these styles for matching type
        const style = document.createElement('style');
        style.textContent = `
            .matching-container {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                padding: 1.5rem;
                background: #f8fafc;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
            }

            .matching-section {
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                overflow: hidden;
            }

            .section-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1rem 1.25rem;
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
            }

            .header-title {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: #0f172a;
                font-weight: 600;
            }

            .header-title i {
                width: 18px;
                height: 18px;
                color: #3b82f6;
            }

            .add-item-btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            .add-item-btn:hover {
                background: #2563eb;
                transform: translateY(-1px);
            }

            .add-item-btn i {
                width: 16px;
                height: 16px;
            }

            .matching-items {
                padding: 1.25rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                min-height: 100px;
                max-height: 400px;
                overflow-y: auto;
            }

            .matching-item {
                display: grid;
                grid-template-columns: auto 1fr auto;
                gap: 0.75rem;
                align-items: start;
                padding: 0.75rem;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                transition: all 0.2s;
            }

            .matching-item:hover {
                background: #f1f5f9;
                border-color: #cbd5e1;
            }

            .item-number {
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 28px;
                height: 28px;
                background: #e0f2fe;
                color: #0369a1;
                border-radius: 6px;
                font-weight: 600;
                font-size: 0.875rem;
            }

            .matching-input {
                width: 100%;
                padding: 0.625rem 0.875rem;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                font-size: 0.95rem;
                resize: none;
                transition: all 0.2s;
                background: white;
            }

            .matching-input:focus {
                border-color: #3b82f6;
                outline: none;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .question-input {
                min-height: 60px;
            }

            .word-input {
                height: 38px;
            }

            .remove-item-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 28px;
                padding: 0;
                border: none;
                border-radius: 6px;
                background: #fee2e2;
                color: #ef4444;
                cursor: pointer;
                transition: all 0.2s;
            }

            .remove-item-btn:hover {
                background: #fecaca;
                transform: scale(1.05);
            }

            .remove-item-btn i {
                width: 16px;
                height: 16px;
            }
        `;
        document.head.appendChild(style);
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

    initializeFillBlankEditor() {
        const editor = this.element.querySelector('.editor-content');
        const addBlankBtn = this.element.querySelector('.add-blank-btn');
        let blankCount = 0;

        addBlankBtn.addEventListener('click', () => {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            
            // Get next available blank number
            const currentBlanks = editor.querySelectorAll('.blank-space');
            const nextNumber = currentBlanks.length + 1;
            const blankId = `blank_${Date.now()}_${nextNumber}`;
            
            // Create blank in text
            const blankSpan = document.createElement('span');
            blankSpan.className = 'blank-space';
            blankSpan.contentEditable = false;
            blankSpan.dataset.blankId = blankId;
            blankSpan.innerHTML = `[Blank ${nextNumber}]`;
            
            range.deleteContents();
            range.insertNode(blankSpan);
        });
    }

    initializeMatchingType() {
        const questionsList = this.element.querySelector('.questions-list');
        const wordsList = this.element.querySelector('.words-list');
        const addButtons = this.element.querySelectorAll('.add-item-btn');

        const updateNumbers = () => {
            // Update question numbers (1, 2, 3, ...)
            questionsList.querySelectorAll('.matching-item').forEach((item, index) => {
                item.querySelector('.item-number').textContent = index + 1;
            });

            // Update word letters (A, B, C, ...)
            wordsList.querySelectorAll('.matching-item').forEach((item, index) => {
                item.querySelector('.item-number').textContent = String.fromCharCode(65 + index);
            });
        };

        const createItem = (type) => {
            const item = document.createElement('div');
            item.className = 'matching-item';
            item.innerHTML = `
                <div class="item-number"></div>
                <input type="text" class="matching-input ${type}-input" 
                       placeholder="Enter ${type === 'question' ? 'question' : 'word to match'}">
                <button class="remove-item-btn" title="Remove ${type}">
                    <i data-feather="x"></i>
                </button>
            `;

            // Add remove handler
            item.querySelector('.remove-item-btn').addEventListener('click', () => {
                item.remove();
                updateNumbers();
            });

            return item;
        };

        // Add button handlers
        addButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                const list = type === 'question' ? questionsList : wordsList;
                const item = createItem(type);
                list.appendChild(item);
                feather.replace(); // Call feather.replace() after adding to DOM
                updateNumbers();
            });
        });

        // Initialize numbers
        updateNumbers();
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

export class FormCorrectionCreator {
    constructor(containerId, formData) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.formData = formData;
        this.saveCorrectionBtn = document.getElementById('saveCorrectionBtn');
        
        this.initialize();
        this.initializeEventListeners();
        this.applyCorrections();
    }

    initialize() {
        // Create form preview with questions
        this.formData.questions.forEach(questionData => {
            console.log("Processing question:", questionData); // Debug log
            const questionElement = this.createQuestionPreview(questionData);
            this.container.appendChild(questionElement);
        });
        
        feather.replace();
    }

    createQuestionPreview(questionData) {
        console.log("Creating preview for question:", questionData); // Debug log
        
        const div = document.createElement('div');
        div.className = 'question-container preview-mode fade-in';
        div.dataset.questionId = questionData.form_question_id;

        // Function to get letter choice based on index
        const getLetterChoice = (index) => {
            return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
        };

        let choicesHtml = '';
        if (questionData.question_type === 'true-false') {
            choicesHtml = `
                <div class="choice-item">
                    <span class="choice-type-indicator" style="border-radius: 50%"></span>
                    <input type="radio" 
                           name="question_${questionData.form_question_id}"
                           value="True"
                           data-choice-id="true"
                           class="correct-answer-input"
                           style="display: none;">
                    <label class="choice-input">
                        <span class="choice-letter">A.</span>
                        True
                    </label>
                </div>
                <div class="choice-item">
                    <span class="choice-type-indicator" style="border-radius: 50%"></span>
                    <input type="radio" 
                           name="question_${questionData.form_question_id}"
                           value="False"
                           data-choice-id="false"
                           class="correct-answer-input"
                           style="display: none;">
                    <label class="choice-input">
                        <span class="choice-letter">B.</span>
                        False
                    </label>
                </div>
            `;
        } else if (questionData.question_type === 'multiple-choice' || questionData.question_type === 'checkbox') {
            choicesHtml = questionData.choices.map((choice, index) => {
                console.log("Processing choice:", choice); // Debug log
                const letterChoice = getLetterChoice(index);
                return `
                    <div class="choice-item">
                        <span class="choice-type-indicator" style="border-radius: ${questionData.question_type === 'multiple-choice' ? '50%' : '4px'}"></span>
                        <input type="${questionData.question_type === 'multiple-choice' ? 'radio' : 'checkbox'}" 
                               name="question_${questionData.form_question_id}"
                               value="${choice.choice}"
                               data-choice-id="${choice.form_question_choice_id}"
                               class="correct-answer-input"
                               style="display: none;">
                        <label class="choice-input" for="q${questionData.form_question_id}_${choice.form_question_choice_id}">
                            <span class="choice-letter">${letterChoice}.</span>
                            ${choice.choice}
                        </label>
                    </div>
                `;
            }).join('');
        } else if (questionData.question_type === 'dropdown') {
            choicesHtml = `
                <div class="choice-item">
                    <select name="question_${questionData.form_question_id}" class="correct-answer-input choice-input">
                        <option value="">Select correct answer</option>
                        ${questionData.choices.map((choice, index) => {
                            const letterChoice = getLetterChoice(index);
                            return `
                                <option value="${choice.choice}" 
                                        data-choice-id="${choice.form_question_choice_id}">
                                    ${letterChoice}. ${choice.choice}
                                </option>
                            `;
                        }).join('')}
                    </select>
                </div>
            `;
        } else if (questionData.question_type === 'short-answer' || questionData.question_type === 'paragraph') {
            choicesHtml = `
                <div class="text-answer-correction">
                    <div class="correction-type-selector">
                        <div class="correction-type">
                            <div class="correction-option ${questionData.correction_type === 'specific' ? 'selected' : ''}"
                                 data-correction-type="specific">
                                <input type="radio" 
                                       name="correction_type_${questionData.form_question_id}" 
                                       value="specific"
                                       class="correction-type-input"
                                       ${questionData.correction_type === 'specific' ? 'checked' : ''}
                                       style="display: none;">
                                <span class="correction-type-indicator"></span>
                                <div class="correction-type-label">
                                    <span class="type-title">Specific Answer</span>
                                    <span class="type-description">Student's answer must match exactly</span>
                                </div>
                            </div>
                        </div>
                        <div class="correction-type">
                            <div class="correction-option ${questionData.correction_type === 'keyword' ? 'selected' : ''}"
                                 data-correction-type="keyword">
                                <input type="radio" 
                                       name="correction_type_${questionData.form_question_id}" 
                                       value="keyword"
                                       class="correction-type-input"
                                       ${questionData.correction_type === 'keyword' ? 'checked' : ''}
                                       style="display: none;">
                                <span class="correction-type-indicator"></span>
                                <div class="correction-type-label">
                                    <span class="type-title">Key Words</span>
                                    <span class="type-description">Answer must contain specific keywords</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="correction-input-container">
                        <!-- Specific Answer Section -->
                        <div class="specific-answer-container" style="display: ${questionData.correction_type === 'specific' ? 'block' : 'none'}">
                            <textarea class="correction-input specific-input" 
                                     placeholder="Enter the exact answer that will be considered correct..."
                                     rows="3">${questionData.correction_text || ''}</textarea>
                            <div class="correction-hint">
                                <i data-feather="info"></i>
                                <span>The student's answer must match this text exactly to be considered correct.</span>
                            </div>
                        </div>

                        <!-- Keywords Section -->
                        <div class="keyword-container" style="display: ${questionData.correction_type === 'keyword' ? 'block' : 'none'}">
                            <div class="keywords-input-wrapper">
                                <input type="text" 
                                       class="keyword-input" 
                                       placeholder="Type a required keyword and press Enter">
                                <button class="add-keyword-btn" title="Add keyword">
                                    <i data-feather="plus"></i>
                                </button>
                            </div>
                            <div class="keywords-list">
                                ${(questionData.keywords || []).map(keyword => `
                                    <div class="keyword-tag">
                                        <span>${keyword}</span>
                                        <button class="remove-keyword-btn">
                                            <i data-feather="x"></i>
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="correction-hint">
                                <i data-feather="info"></i>
                                <span>Student's answer must include all these keywords to be considered correct.</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (questionData.question_type === 'fill-blank') {
            choicesHtml = `
                <div class="fill-blank-correction">
                    <div class="fill-blank-text">
                        ${questionData.question.replace(/<span class="blank-space"[^>]*data-blank-id="([^"]*)"[^>]*>[^<]*<\/span>/g,
                            (match, blankId) => {
                                const answer = (questionData.blanks || []).find(b => b.blankId === blankId)?.answer || '';
                                return `
                                   <div class="blank-input-wrapper">
                                    <input type="text" 
                                           class="blank-input" 
                                           data-blank-id="${blankId}"
                                           placeholder="Type answer">
                                </div>
                                `;
                            }
                        )}
                    </div>
                </div>
            `;
        } else if (questionData.question_type === 'matching') {

            // Get matching data from options
            const matchingData = JSON.parse(questionData.options.options);
            const matchingQuestions = matchingData.questions || [];
            const matchingWords = matchingData.words || [];

            console.log(matchingData)

            choicesHtml = `
                <div class="matching-answer-container">
                    <div class="matching-columns">
                        <div class="matching-questions">
                            ${matchingQuestions.map((question, index) => `
                                <div class="matching-question" data-question-index="${index}">
                                    <span class="question-number">${index + 1}.</span>
                                    <div class="question-text">${question}</div>
                                    <div class="connection-point right"></div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="matching-connections">
                            <canvas id="matching-canvas-${questionData.form_question_id}"></canvas>
                        </div>
                        <div class="matching-words">
                            ${matchingWords.map((word, index) => `
                                <div class="matching-word" data-word-index="${index}">
                                    <div class="connection-point left"></div>
                                    <div class="word-text">${word}</div>
                                    <span class="word-letter">${String.fromCharCode(65 + index)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="matching-answers">
                        ${matchingQuestions.map((_, qIndex) => `
                            <div class="matching-answer-row">
                                <span class="answer-label">Question ${qIndex + 1} matches with:</span>
                                <select name="match_${questionData.form_question_id}_${qIndex}" class="matching-select">
                                    <option value="">Select answer</option>
                                    ${matchingWords.map((_, wIndex) => `
                                        <option value="${String.fromCharCode(65 + wIndex)}">
                                            ${String.fromCharCode(65 + wIndex)}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Initialize matching connections after rendering
            if (matchingQuestions.length > 0 && matchingWords.length > 0) {
                setTimeout(() => {
                    initializeMatchingConnections(questionData.form_question_id);
                }, 100);
            }
        }

        div.innerHTML = `
            <div class="question-header">
                <div class="question-number">${questionData.question_number}</div>
                <div class="question-input">
                    <div class="question-title" style="border: none; background: none;">${questionData.question || 'Untitled Question'}</div>
                </div>
                <div class="question-type-badge">${questionData.question_type}</div>
            </div>
            ${questionData.image_url ? `
                <div class="question-image-container" style="display: block; position: relative;">
                    <img src="${questionData.image_url}" class="question-image" style="max-width: 100%; margin: 1rem 0;">
                </div>
            ` : ''}
            <div class="choices-container">
                ${choicesHtml}
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

        // Add these styles
        const style = document.createElement('style');
        style.textContent = `
            .correction-type-selector {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                margin-bottom: 1.5rem;
            }

            .correction-option {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .correction-option:hover {
                border-color: #94a3b8;
                background: #f8fafc;
            }

            .correction-option.selected {
                border-color: #3b82f6;
                background: #f0f9ff;
            }

            .correction-type-indicator {
                width: 20px;
                height: 20px;
                border: 2px solid #94a3b8;
                border-radius: 50%;
                position: relative;
                flex-shrink: 0;
            }

            .correction-option.selected .correction-type-indicator {
                border-color: #3b82f6;
                background: #3b82f6;
            }

            .correction-option.selected .correction-type-indicator:after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 8px;
                height: 8px;
                background: white;
                border-radius: 50%;
            }

            .correction-type-label {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .type-title {
                font-weight: 500;
                color: #0f172a;
            }

            .type-description {
                font-size: 0.875rem;
                color: #64748b;
            }

            .correction-input-container {
                margin-top: 1.5rem;
                padding: 1rem;
                background: #f8fafc;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
            }

            /* Specific Answer Styles */
            .specific-answer-container {
                padding: 1rem;
                background: white;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
            }

            .specific-input {
                width: 100%;
                min-height: 120px;
                padding: 1rem;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                font-size: 1rem;
                line-height: 1.5;
                resize: vertical;
                transition: all 0.2s;
                background: #fff;
                color: #1e293b;
            }

            .specific-input:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                outline: none;
            }

            /* Keywords Styles */
            .keywords-input-wrapper {
                display: flex;
                gap: 0.75rem;
                margin-bottom: 1rem;
                padding: 1rem;
                background: white;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
            }

            .keyword-input {
                flex: 1;
                height: 42px;
                padding: 0 1rem;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                font-size: 0.95rem;
                transition: all 0.2s;
                background: #fff;
                color: #1e293b;
            }

            .keyword-input:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                outline: none;
            }

            .add-keyword-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 42px;
                height: 42px;
                padding: 0;
                border: none;
                border-radius: 8px;
                background: #3b82f6;
                color: white;
                cursor: pointer;
                transition: all 0.2s;
            }

            .add-keyword-btn:hover {
                background: #2563eb;
            }

            .add-keyword-btn i {
                width: 20px;
                height: 20px;
            }

            .keywords-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin: 1rem 0;
                padding: 1rem;
                min-height: 50px;
                background: white;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
            }

            .keyword-tag {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                background: #e0f2fe;
                border-radius: 6px;
                color: #0369a1;
                font-size: 0.95rem;
                transition: all 0.2s;
            }

            .keyword-tag:hover {
                background: #bae6fd;
            }

            .remove-keyword-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                width: 20px;
                height: 20px;
                border: none;
                background: none;
                color: currentColor;
                cursor: pointer;
                opacity: 0.7;
                transition: all 0.2s;
            }

            .remove-keyword-btn:hover {
                opacity: 1;
                transform: scale(1.1);
            }

            .remove-keyword-btn i {
                width: 16px;
                height: 16px;
            }

            .correction-hint {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                margin-top: 1rem;
                padding: 0.75rem 1rem;
                background: #f1f5f9;
                border-radius: 6px;
                color: #64748b;
                font-size: 0.875rem;
                line-height: 1.5;
            }

            .correction-hint i {
                width: 16px;
                height: 16px;
                color: #3b82f6;
                margin-top: 2px;
            }

            /* Placeholder styling */
            .specific-input::placeholder,
            .keyword-input::placeholder {
                color: #94a3b8;
            }

            /* Empty state for keywords list */
            .keywords-list:empty:before {
                content: 'No keywords added yet';
                color: #94a3b8;
                font-size: 0.95rem;
                font-style: italic;
            }

            /* True/False specific styles */
            .question-type-badge[data-type="true-false"] {
                background: #818cf8;
                color: white;
            }

            .true-false .choice-item {
                pointer-events: auto !important;
            }

            .true-false .choice-input {
                font-weight: 500;
                color: #1e293b;
            }

            .fill-blank-editor {
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                overflow: hidden;
            }

            .editor-toolbar {
                padding: 0.75rem;
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
            }

            .add-blank-btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 6px;
                background: #3b82f6;
                color: white;
                cursor: pointer;
                transition: all 0.2s;
            }

            .add-blank-btn:hover {
                background: #2563eb;
            }

            .editor-content {
                min-height: 100px;
                padding: 1rem;
                outline: none;
            }

            .editor-content[placeholder]:empty:before {
                content: attr(placeholder);
                color: #94a3b8;
            }

            .blank-space {
                display: inline-block;
                padding: 0.25rem 0.5rem;
                margin: 0 0.25rem;
                background: #e0f2fe;
                border-radius: 4px;
                color: #0369a1;
                font-weight: 500;
            }

            .blanks-answers {
                margin-top: 1.5rem;
                padding: 1rem;
                background: #f8fafc;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
            }

            .blanks-answers h4 {
                margin-bottom: 1rem;
                color: #0f172a;
                font-size: 0.95rem;
            }

            .blank-answer {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 0.75rem;
            }

            .blank-label {
                min-width: 80px;
                color: #64748b;
                font-size: 0.9rem;
            }

            .blank-answer-input {
                flex: 1;
                padding: 0.5rem 0.75rem;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                transition: all 0.2s;
            }

            .blank-answer-input:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                outline: none;
            }

            .remove-blank-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                padding: 0;
                border: none;
                border-radius: 4px;
                background: #fee2e2;
                color: #ef4444;
                cursor: pointer;
                transition: all 0.2s;
            }

            .remove-blank-btn:hover {
                background: #fecaca;
            }

            /* Styles for answer view */
            .fill-blank-answer {
                line-height: 2;
            }

            .blank-input {
                width: 150px;
                padding: 0.25rem 0.5rem;
                margin: 0 0.25rem;
                border: 1px solid #e2e8f0;
                border-radius: 4px;
                transition: all 0.2s;
            }

            .blank-input:focus {
                border-color: #3b82f6;
                outline: none;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .matching-answer-container {
                padding: 1.5rem;
                background: #f8fafc;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
            }

            .matching-columns {
                display: grid;
                grid-template-columns: 2fr 60px 2fr; /* Reduce the middle column width to 60px */
                gap: 1rem;
                margin-bottom: 2rem;
                position: relative;
                min-height: 200px;
                align-items: start; /* Ensure items align at the top */
            }

            .matching-questions, .matching-words {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .matching-question, .matching-word {
                display: flex;
                align-items: center;
                padding: 0.75rem;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                position: relative;
            }

            .question-number, .word-letter {
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #e0f2fe;
                color: #0369a1;
                border-radius: 6px;
                font-weight: 600;
                font-size: 0.875rem;
            }

            .question-text, .word-text {
                flex: 1;
                padding: 0 1rem;
            }

            .connection-point {
                width: 12px;
                height: 12px;
                background: #94a3b8;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
            }

            .connection-point.right {
                right: -6px;
            }

            .connection-point.left {
                left: -6px;
            }

            .matching-connections {
                position: relative;
                width: 60px; /* Match the middle column width */
                height: 100%;
                margin: 0 auto; /* Center the connections column */
            }

            #matching-canvas {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }

            .matching-answers {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                padding-top: 1rem;
                border-top: 1px solid #e2e8f0;
            }

            .matching-answer-row {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .answer-label {
                min-width: 150px;
                color: #475569;
                font-size: 0.95rem;
            }

            .matching-select {
                padding: 0.5rem;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                background: white;
                min-width: 120px;
            }

            .matching-select:focus {
                border-color: #3b82f6;
                outline: none;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
        `;

        document.head.appendChild(style);

        // Update the event listeners for correction options
        if (questionData.question_type === 'short-answer' || questionData.question_type === 'paragraph') {
            const correctionOptions = div.querySelectorAll('.correction-option');
            const specificContainer = div.querySelector('.specific-answer-container');
            const keywordContainer = div.querySelector('.keyword-container');
            const specificInput = div.querySelector('.specific-input');
            const keywordInput = div.querySelector('.keyword-input');
            const keywordsList = div.querySelector('.keywords-list');
            const addKeywordBtn = div.querySelector('.add-keyword-btn');

            // Ensure correctAnswers is defined
            if (!this.correctAnswers) {
                this.correctAnswers = new Map();
            }

            correctionOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const type = option.dataset.correctionType;
                    
                    // Update UI
                    correctionOptions.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    
                    // Show/hide containers
                    specificContainer.style.display = type === 'specific' ? 'block' : 'none';
                    keywordContainer.style.display = type === 'keyword' ? 'block' : 'none';
                    
                    // Update correctAnswers
                    if (type === 'specific') {
                        this.correctAnswers.set(questionData.form_question_id, {
                            type: 'specific',
                            text: specificInput.value.trim()
                        });
                    } else {
                        this.correctAnswers.set(questionData.form_question_id, {
                            type: 'keyword',
                            keywords: Array.from(keywordsList.querySelectorAll('.keyword-tag'))
                                .map(tag => tag.querySelector('span').textContent)
                        });
                    }
                });
            });

            // Handle keyword addition
            const addKeyword = () => {
                const keyword = keywordInput.value.trim();
                if (keyword) {
                    const keywordTag = document.createElement('div');
                    keywordTag.className = 'keyword-tag';
                    keywordTag.innerHTML = `
                        <span>${keyword}</span>
                        <button class="remove-keyword-btn">
                            <i data-feather="x"></i>
                        </button>
                    `;
                    
                    keywordsList.appendChild(keywordTag);
                    keywordInput.value = '';
                    feather.replace();

                    // Update correctAnswers
                    this.correctAnswers.set(questionData.form_question_id, {
                        type: 'keyword',
                        keywords: Array.from(keywordsList.querySelectorAll('.keyword-tag'))
                            .map(tag => tag.querySelector('span').textContent)
                    });

                    // Add remove handler
                    keywordTag.querySelector('.remove-keyword-btn').addEventListener('click', () => {
                        keywordTag.remove();
                        this.correctAnswers.set(questionData.form_question_id, {
                            type: 'keyword',
                            keywords: Array.from(keywordsList.querySelectorAll('.keyword-tag'))
                                .map(tag => tag.querySelector('span').textContent)
                        });
                    });
                }
            };

            addKeywordBtn.addEventListener('click', addKeyword);
            keywordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyword();
                }
            });
        }

        return div;
    }

    saveCorrection(data) {
        return new Promise((resolve) => {
            if (this.formData.form_correction) {
                EditRecord("form_corrections", {id: this.formData.form_correction.correction_id, data: JSON.stringify(data) }).then((res) => {
                    NewNotification({
                      type: "success",
                      message: res.message
                    });
    
                    resolve(res);
                  });
            } else {
                AddRecord("form_corrections", { data: JSON.stringify(data) }).then((res) => {
                    NewNotification({
                      type: "success",
                      message: res.message
                    });
    
                    resolve(res);
                  });
            }
        })
    } 

    initializeEventListeners() {
        if (this.saveCorrectionBtn) {
            this.saveCorrectionBtn.addEventListener("click", () => {
                const answers = this.getCorrectAnswers();
                const mainData = {
                    form_id: this.formData.form_id,
                    data: JSON.stringify(answers)
                };

                this.saveCorrection(mainData).then(() => {
                    window.location.replace("/me/resources")
                });
            });
        }
    }

    applyCorrections() {
        if (!this.formData.form_correction) {
            return;
        }   

        const correctAnswers = JSON.parse(this.formData.form_correction.data);
        const questions = this.formData.questions;

        // Apply the correct answers to each question
        for (const questionId in correctAnswers) {
            const answer = correctAnswers[questionId];
            const questionContainer = this.container.querySelector(`[data-question-id="${questionId}"]`);
            const question = questions.find(q => q.form_question_id == questionId);

            
            if (questionContainer) {
                if (question.question_type === "short-answer" || question.question_type === "paragraph") {

                    const options = questionContainer.querySelectorAll('.correction-type .correction-option');

                    if (answer.type == 'specific') {
                        setTimeout(function() {
                            options[0].click();
                        }, 1000);
                        const specificInput = questionContainer.querySelector(`textarea.specific-input`);
                        if (specificInput) {
                            specificInput.value = answer.type === 'specific' ? answer.text : '';
                        }
                    } else {
                        setTimeout(function() {
                            options[1].click();
                        }, 1000);

                        const keywordTagsContainer = questionContainer.querySelector('.keywords-list');

                        if (keywordTagsContainer) {
                            keywordTagsContainer.innerHTML = ''; // Clear existing tags
                            answer.keywords.forEach(keyword => {
                                const tag = document.createElement('span');
                                tag.className = 'keyword-tag';
                                tag.textContent = keyword;
                                keywordTagsContainer.appendChild(tag);
                            });
                        }
                    }
                } else if (question.question_type === "multiple-choice" ) {
                    if (answer.length) {
                        const radioInput = questionContainer.querySelector(`input[value="${answer[0]}"]`);

                        if (radioInput) {
                            radioInput.checked = true;

                            const choiceItem = radioInput.closest('.choice-item');

                            if (choiceItem) {
                                choiceItem.classList.add('selected');
                                const indicator = choiceItem.querySelector('.choice-type-indicator');
                                if (indicator) {
                                    indicator.style.background = '#3b82f6';
                                }
                            }
                        }
                    }

                } else if (question.question_type === "checkbox") {
                    // const choiceIds = JSON.parse(answer.choice_id);
                    answer.forEach(ans => {
                        const checkboxInput = questionContainer.querySelector(`input[value="${ans}"]`);
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
                } else if (question.question_type === "true-false") {
                    const trueInput = questionContainer.querySelector('input[value="True"]');
                    const falseInput = questionContainer.querySelector('input[value="False"]');

                    if (answer === 'True') {
                        if (trueInput) {
                            trueInput.checked = true;
                            const trueChoiceItem = trueInput.closest('.choice-item');
                            if (trueChoiceItem) {
                                trueChoiceItem.classList.add('selected');
                                const trueIndicator = trueChoiceItem.querySelector('.choice-type-indicator');
                                if (trueIndicator) {
                                    trueIndicator.style.background = '#3b82f6';
                                }
                            }
                        }
                    } else if (answer === 'False') {
                        if (falseInput) {
                            falseInput.checked = true;
                            const falseChoiceItem = falseInput.closest('.choice-item');
                            if (falseChoiceItem) {
                                falseChoiceItem.classList.add('selected');
                                const falseIndicator = falseChoiceItem.querySelector('.choice-type-indicator');
                                if (falseIndicator) {
                                    falseIndicator.style.background = '#3b82f6';
                                }
                            }
                        }
                    }
                } else if (question.question_type === "dropdown") {
                    const select = questionContainer.querySelector(`select[name="question_${questionId}"]`);
                    if (select) {
                        select.value = answer; // Set selected value
                        select.dispatchEvent(new Event('change')); // Trigger change event
                    }
                } else if (question.question_type === "fill-blank") {
                    const blankInputs = questionContainer.querySelectorAll(`input.blank-input`);
                    answer.forEach(blankAnswer => {
                        const input = Array.from(blankInputs).find(input => input.dataset.blankId === blankAnswer.blankId);
                        if (input) {
                            input.value = blankAnswer.answer; // Set the answer for each blank
                            input.dispatchEvent(new Event('input')); // Trigger input event
                        }
                    });
                } else if (question.question_type === "matching") {
                    const matchingSelects = questionContainer.querySelectorAll(`select[name^="match_${questionId}"]`);
                    for (const questionIndex in answer) {
                        const select = Array.from(matchingSelects).find(select => select.name.endsWith(questionIndex));
                        if (select) {
                            select.value = answer[questionIndex]; // Set the selected match
                        }
                    }
                }
            }
        }
    }

    getCorrectAnswers() {
        const correctAnswers = {};
    
        // Iterate through each question in the formData
        this.formData.questions.forEach(questionData => {
            const questionId = questionData.form_question_id;
            let answer;

            // Get the question container for the current question
            const questionContainer = this.container.querySelector(`[data-question-id="${questionId}"]`);

            // Handle different question types
            if (questionData.question_type === 'true-false') {
                const selectedOption = questionContainer.querySelector(`input[name="question_${questionId}"]:checked`);
                if (selectedOption) {
                    answer = selectedOption.value; // 'True' or 'False'
                }
            } else if (questionData.question_type === 'multiple-choice' || questionData.question_type === 'checkbox') {
                const selectedOptions = questionContainer.querySelectorAll(`input[name="question_${questionId}"]:checked`);
                answer = Array.from(selectedOptions).map(option => option.value); // Array of selected values
            } else if (questionData.question_type === 'dropdown') {
                const selectedOption = questionContainer.querySelector(`select[name="question_${questionId}"]`);
                if (selectedOption) {
                    answer = selectedOption.value; // Selected value
                }
            } else if (questionData.question_type === 'short-answer' || questionData.question_type === 'paragraph') {
                const specificInput = questionContainer.querySelector(`textarea.specific-input`);
                const keywordTags = questionContainer.querySelectorAll('.keyword-tag span');

                if (specificInput && specificInput.value.trim()) {
                    answer = {
                        type: 'specific',
                        text: specificInput.value.trim()
                    };
                } else {
                    answer = {
                        type: 'keyword',
                        keywords: Array.from(keywordTags).map(tag => tag.textContent)
                    };
                }
            } else if (questionData.question_type === 'fill-blank') {
                const blankInputs = questionContainer.querySelectorAll(`input.blank-input`);
                answer = Array.from(blankInputs).map(input => ({
                    blankId: input.dataset.blankId,
                    answer: input.value.trim()
                }));
            } else if (questionData.question_type === 'matching') {
                const matchingAnswers = {};
                const matchingSelects = questionContainer.querySelectorAll(`select[name^="match_${questionId}"]`);
                matchingSelects.forEach(select => {
                    const questionIndex = select.name.split('_')[2]; // Extract question index
                    matchingAnswers[questionIndex] = select.value; // Store the selected match
                });
                answer = matchingAnswers;
            }
    
            // Store the answer in the correctAnswers object
            if (answer !== undefined) {
                correctAnswers[questionId] = answer;
            }
        });
    
        return correctAnswers;
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

        console.log(this.userAnswers)
        // Process each answer
        this.userAnswers.forEach(answer => {
            const questionElement = this.container.querySelector(`[data-question-id="${answer.question_id}"]`);
            if (!questionElement) return;

            switch (answer.type) {
                case 'multiple-choice':
                    const radioInput = questionElement.querySelector(`input[value="${answer.answer}"]`);

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
                    const answers = JSON.parse(answer.answer);

                    const allCheckboxes = questionElement.querySelectorAll('input[type="checkbox"]');

                    allCheckboxes.forEach(checkbox => {
                        checkbox.disabled = true;
                        checkbox.style.pointerEvents = 'none';
                        const choiceItem = checkbox.closest('.choice-item');
                        if (choiceItem) {
                            choiceItem.style.pointerEvents = 'none';
                        }
                    });

                    answers.forEach(answer => {
                        const checkboxInput = questionElement.querySelector(`input[value="${answer}"]`);
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
                        console.log(select.options, answer)
                        const option = Array.from(select.options).find(opt => 
                            parseInt(opt.dataset.choiceId) === parseInt(answer.choice_id)
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

                case "true-false":
                    const trueInput = questionElement.querySelector('input[value="True"]');
                    const falseInput = questionElement.querySelector('input[value="False"]');

                    if (answer.answer === 'True') {
                        if (trueInput) {
                            trueInput.checked = true;
                            const trueChoiceItem = trueInput.closest('.choice-item');
                            if (trueChoiceItem) {
                                trueChoiceItem.classList.add('selected');
                                const trueIndicator = trueChoiceItem.querySelector('.choice-type-indicator');
                                if (trueIndicator) {
                                    trueIndicator.style.background = '#3b82f6';
                                }
                            }
                        }
                    } else if (answer.answer === 'False') {
                        if (falseInput) {
                            falseInput.checked = true;
                            const falseChoiceItem = falseInput.closest('.choice-item');
                            if (falseChoiceItem) {
                                falseChoiceItem.classList.add('selected');
                                const falseIndicator = falseChoiceItem.querySelector('.choice-type-indicator');
                                if (falseIndicator) {
                                    falseIndicator.style.background = '#3b82f6';
                                }
                            }
                        }
                    }
                    break;
                case "fill-blank":
                    const blankInputs = questionElement.querySelectorAll(`input.blank-input`);
                    const blank_answers = JSON.parse(answer.answer);

                    blank_answers.forEach(blankAnswer => {
                        const input = Array.from(blankInputs).find(input => input.dataset.blankId === blankAnswer.blankId);
                        if (input) {
                            input.value = blankAnswer.answer; // Set the answer for each blank
                            input.dispatchEvent(new Event('input')); // Trigger input event
                        }
                    });
                    break;  
                case "matching":
                    const matchingSelects = questionElement.querySelectorAll(`select`);
                    const matching_aswers = JSON.parse(answer.answer);

                    for (let question_index = 0; question_index < matching_aswers.length; question_index++) {
                        const select = Array.from(matchingSelects).find(select => select.name.endsWith(question_index));

                        if (select) {
                            select.value = matching_aswers[question_index]; // Set the selected match
                        }
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

// Add these styles
const style = document.createElement('style');
style.textContent = `
    .fill-blank-answer {
        line-height: 2;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
    }

    .blank-input-wrapper {
        display: inline-block;
        margin: 0 0.25rem;
    }

    .blank-input {
        width: 150px;
        padding: 0.375rem 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 6px;
        font-size: 0.95rem;
        transition: all 0.2s;
    }

    .blank-input:focus {
        border-color: #3b82f6;
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .matching-answer-container {
        padding: 1.5rem;
        background: #f8fafc;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
    }

    .matching-columns {
        display: grid;
        grid-template-columns: 2fr 60px 2fr;
        gap: 1rem;
        margin-bottom: 2rem;
        position: relative;
        min-height: 200px;
        align-items: start;
    }

    .matching-questions, .matching-words {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .matching-question, .matching-word {
        display: flex;
        align-items: center;
        padding: 0.75rem;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        position: relative;
    }

    .question-number, .word-letter {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #e0f2fe;
        color: #0369a1;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.875rem;
        z-index: 1;
    }

    .question-text, .word-text {
        flex: 1;
        padding: 0 1rem;
        z-index: 0;
    }

    .question-text {
        padding-left: 40px !important;
    }

    .connection-point {
        width: 12px;
        height: 12px;
        background: #94a3b8;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }

    .connection-point.right {
        right: -6px;
    }

    .connection-point.left {
        left: -6px;
    }

    .matching-connections {
        position: relative;
        width: 60px;
        height: 100%;
        margin: 0 auto;
    }

    #matching-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .matching-answers {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
    }

    .matching-answer-row {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .answer-label {
        min-width: 150px;
        color: #475569;
        font-size: 0.95rem;
    }

    .matching-select {
        padding: 0.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        background: white;
        min-width: 120px;
    }

    .matching-select:focus {
        border-color: #3b82f6;
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
`;
document.head.appendChild(style);

// Add this function to handle matching connections
function initializeMatchingConnections(questionNumber) {
    const container = document.querySelector(`#matching-canvas-${questionNumber}`).parentElement;
    const canvas = document.querySelector(`#matching-canvas-${questionNumber}`);
    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        drawConnections(questionNumber); // Redraw connections after resize
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw connections when select changes
    const selects = document.querySelectorAll(`.matching-select`);
    selects.forEach(select => {
        select.addEventListener('change', () => {
            drawConnections(questionNumber);
        });
    });
}

function drawConnections(questionNumber) {
    const canvas = document.querySelector(`#matching-canvas-${questionNumber}`);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const container = canvas.parentElement.parentElement; // Get the matching-columns container
    const questions = container.querySelectorAll('.matching-question');
    const words = container.querySelectorAll('.matching-word');
    const selects = document.querySelectorAll(`[name^="match_${questionNumber}_"]`);

    // Define an array of colors to cycle through
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

    selects.forEach((select, qIndex) => {
        if (select.value) {
            const wIndex = select.value.charCodeAt(0) - 65;
            const questionPoint = questions[qIndex].querySelector('.connection-point.right');
            const wordPoint = words[wIndex].querySelector('.connection-point.left');

            // Get positions relative to canvas
            const canvasRect = canvas.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const questionRect = questionPoint.getBoundingClientRect();
            const wordRect = wordPoint.getBoundingClientRect();

            // Calculate positions relative to container
            const startX = 0; // Start from left edge of canvas
            const startY = questionRect.top - containerRect.top + (questionRect.height / 2);
            const endX = canvas.width; // End at right edge of canvas
            const endY = wordRect.top - containerRect.top + (wordRect.height / 2);

            // Draw curved line with different color for each connection
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.bezierCurveTo(
                startX + canvas.width * 0.4, startY, // First control point
                startX + canvas.width * 0.6, endY,   // Second control point
                endX, endY                           // End point
            );
            ctx.strokeStyle = colors[qIndex % colors.length]; // Cycle through colors
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
}
