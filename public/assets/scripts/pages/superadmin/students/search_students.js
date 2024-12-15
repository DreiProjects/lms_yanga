// import { SelectModels } from "../../../modules/app/Administrator.js";

import { PostContainerRequest } from "../../../modules/app/SystemFunctions.js";

function Init() {
    const searchOptions = {
        searchText: '',
        course: '',
        yearLevel: '',
        gender: ''
    };

    // Get all filter elements
    const searchInput = document.querySelector('.filters-panel input[type="text"]');
    const courseSelect = document.querySelector('#course-filter');
    const yearSelect = document.querySelector('#year-level-filter');
    // const genderSelect = document.querySelector('#gender-filter');

    // Add event listeners to all filter elements
    searchInput.addEventListener('input', (e) => {
        searchOptions.searchText = e.target.value;
        performSearch();
    });


    if (courseSelect) {
        courseSelect.addEventListener('change', (e) => {
            searchOptions.course = e.target.value;
            performSearch();
        });
    }

    if (yearSelect) {
        yearSelect.addEventListener('change', (e) => {
            searchOptions.yearLevel = e.target.value;
            performSearch();
        });
    }

    // if (genderSelect) {
    //     genderSelect.addEventListener('change', (e) => {
    //         searchOptions.gender = e.target.value;
    //         performSearch();
    //     });
    // }

    async function performSearch() {

        const filter = {
            search: searchOptions.searchText,
            course: searchOptions.course,
            year_level: searchOptions.yearLevel,
            gender: searchOptions.gender
        };

        PostContainerRequest('students', 'search', {filter: JSON.stringify(filter)}).then(res => {
            updateContent(res);
        });

    }

    function updateContent(students) {
        const mainContent = document.querySelector('.main-content');

        mainContent.innerHTML = students; // Clear existing students

        listenToCards();
    }

    function listenToCards() {
        const cards = document.querySelectorAll('.student-card');
        let selectedCards = [];

        cards.forEach(card => {
            card.addEventListener('click', function(e) {
                if (e.ctrlKey || e.metaKey) {
                    // Toggle selection on Ctrl/Cmd+Click
                    if (selectedCards.includes(card)) {
                        selectedCards = selectedCards.filter(c => c !== card);
                        card.classList.remove('selected');
                    } else {
                        selectedCards.push(card);
                        card.classList.add('selected');
                    }
                } else {
                    // Single selection
                    selectedCards.forEach(c => c.classList.remove('selected'));
                    selectedCards = [card];
                    card.classList.add('selected');
                    updateStudentProfile(card.dataset.studentId);
                }
            });
        });
    }

    function updateStudentProfile(student_id) {
        const profile = document.querySelector('.profile');


        PostContainerRequest('students', 'displayStudent', {student_id}).then(res => {

            if (profile) {
                profile.innerHTML = res;
            }
        })
    }

    // Initial search on page load
    performSearch();
}

Init();