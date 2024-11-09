import Popup from "../../../classes/components/Popup.js";
import ImportWizard from "../../../classes/components/ImportWizard.js";
import FileUploader from "../../../classes/components/FileUploader.js";
import TableBulkEntryGenerator from "../../../classes/components/TableBulkEntryGenerator.js";
import {
  ListenToForm,
  ManageComboBoxes,
  GetComboValue,
  MakeID,
  CreateComboBox,
  SetNewComboItems,
  ListenToThisCombo,
  ListenToCombo,
  SetComboValue,
} from "../../../modules/component/Tool.js";
import {
  SelectSomething,
  SelectModel,
  SelectModels,
} from "../../../modules/app/Administrator.js";
import { PostRequest } from "../../../modules/app/SystemFunctions.js";

// Global variables to store data
let tableBulkEntryGenerator;
let subjectsArray = [];
let sectionsArray = [];
let professorsArray = [];
let sectionSelected = null;
let wizzard;

document.addEventListener("DOMContentLoaded", () => {
  wizzard = new ImportWizard();

  tableBulkEntryGenerator = new TableBulkEntryGenerator();

  new FileUploader({
    targetElement: document.querySelector(".file-upload"),
    supportedFormats: [".csv"],
    multiple: false,
    callback: (result) => {
      tableBulkEntryGenerator.processCSV(result.csvData);
    },
  });

  setupImportOptions();
  setupSectionManagement();
  setupSubjectsAndProfessors();
  setupImportSummary();

  if (typeof feather !== "undefined") {
    feather.replace();
  }
});

function setupImportOptions() {
  const importOptionsToggle = document.getElementById("importOptionsToggle");
  const importOptions = document.querySelector(".import-options");
  const optionButtons = document.querySelectorAll(".option-btn");
  const importContents = document.querySelectorAll(".import-content > div");

  importOptionsToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    importOptions.classList.toggle("show");
  });

  document.addEventListener("click", (event) => {
    if (
      !importOptions.contains(event.target) &&
      !importOptionsToggle.contains(event.target)
    ) {
      importOptions.classList.remove("show");
    }
  });

  optionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      optionButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      const option = this.getAttribute("data-option");
      importContents.forEach((content) => {
        content.classList.toggle(
          "active",
          content.classList.contains(
            option === "manual" ? "manual-entry" : "file-upload"
          )
        );
      });
      importOptions.classList.remove("show");

      updateImportSummary();
    });
  });
}

function setupSectionManagement() {
  const addSectionBtn = document.getElementById("addSectionBtn");
  const sectionCardsContainer = document.getElementById(
    "sectionCardsContainer"
  );

  addSectionBtn.addEventListener("click", addNewSection);

  function addNewSection() {
    const popup = new Popup("sections/add_new_section", null, {
      backgroundDismiss: false,
    });

    popup.Create().then((pop) => {
      popup.Show();

      const form = pop.ELEMENT.querySelector("form.form-control");
      const select = pop.ELEMENT.querySelector(".select-professor");
      const selectInput = pop.ELEMENT.querySelector("input[name=adviser_id]");
      const semester = pop.ELEMENT.querySelector(".semester");
      const course_id = pop.ELEMENT.querySelector(".course_id");

      ListenToForm(form, function (data) {
        SelectModel(GetComboValue(course_id).value, "COURSE_CONTROL").then(
          (course) => {
            const section = {
              section_id: MakeID(10),
              course_name: course.course_name,
              section_name: data.section_name,
              course_id: course.course_id,
              professor_id: selectInput.value,
              semester: GetComboValue(semester).value,
              flag: "created",
              students: [],
            };

            sectionsArray.push(section);

            const card = createSectionCard(section);

            sectionCardsContainer.appendChild(card);

            popup.Remove();
          }
        );
      });

      select.addEventListener("click", function () {
        SelectSomething(
          "professors/select_professors",
          "professors",
          "PROFESSOR_CONTROL",
          null,
          true
        ).then((user) => {
          selectInput.value = user.professor_id;
        });
      });

      ManageComboBoxes();

      updateImportSummary();
    });
  }

  function createSectionCard(sectionData) {
    const sectionCard = document.createElement("div");
    sectionCard.className = "section-card";
    sectionCard.innerHTML = `
            <input type="radio" name="section" id="section-${sectionData.section_id}" value="${sectionData.section_id}">
            <label for="section-${sectionData.section_id}">
                <h4>${sectionData.section_name}</h4>
                <p>Course: ${sectionData.course_name}</p>
                <p>Students: <span class="student-count">${sectionData.students.length}</span></p>
            </label>
        `;
    return sectionCard;
  }
}

function setupSubjectsAndProfessors() {
  const subjectsContainer = document.getElementById("subjectsContainer");
  const addEmptySubjectCard = document.getElementById("addEmptySubjectCard");
  const addSubjectPopupBtn = document.getElementById("addSubjectPopupBtn");
  const professorsContainer = document.getElementById("professorsContainer");
  const addEmptyProfessorCard = document.getElementById(
    "addEmptyProfessorCard"
  );
  const addProfessorPopupBtn = document.getElementById("addProfessorPopupBtn");
  const subjectsDisplayContainer = document.getElementById(
    "subjectsDisplayContainer"
  );

  function createSubjectCard(subject = null) {
    const newSubjectCard = document.createElement("div");
    newSubjectCard.className = "subject-card";
    newSubjectCard.draggable = false;

    console.log(subject);
    // Create the course combo box
    const courseComboBox = CreateComboBox(
      "subject-course_name[]",
      "Select course",
      [],
      false,
      subject ? { value: subject.course_id, text: subject.course_name } : null,
      false
    );

    if (subject) {
      newSubjectCard.innerHTML = `
                <input type="text" name="subject[]" class="primary-text" value="${subject.name}" readonly>
                <input type="text" name="subject-code[]" class="secondary-text" value="${subject.code}" readonly>
                <div class="assigned-professor"></div>
                <button type="button" class="btn-remove-subject"><i data-feather="x"></i></button>
            `;
      newSubjectCard.insertBefore(
        courseComboBox,
        newSubjectCard.querySelector(".assigned-professor")
      );
      subjectsArray.push(subject);
    } else {
      newSubjectCard.innerHTML = `
                <input type="text" name="subject[]" class="primary-text" placeholder="Subject name" required>
                <input type="text" name="subject-code[]" class="secondary-text" placeholder="Subject code">
                <div class="assigned-professor"></div>
                <button type="button" class="btn-remove-subject"><i data-feather="x"></i></button>
            `;
      newSubjectCard.insertBefore(
        courseComboBox,
        newSubjectCard.querySelector(".assigned-professor")
      );
      const newSubject = {
        name: "",
        code: "",
        course_name: "",
        course_id: "",
        professor: null,
        flag: "created",
      };
      subjectsArray.push(newSubject);
    }

    newSubjectCard.dataset.index = subjectsArray.length - 1;
    subjectsContainer.appendChild(newSubjectCard);
    feather.replace();
    setupDragAndDrop(newSubjectCard);
    displaySubjects();

    // Populate the course combo box
    populateCourseComboBox(courseComboBox, newSubjectCard);

    if (subject) {
      SetComboValue(courseComboBox, subject.course_name, subject.course_id);
    }
  }

  function populateCourseComboBox(comboBox, newSubjectCard) {
    // Fetch courses from your API or use a predefined list
    SelectModels("COURSE_CONTROL", []).then((courses) => {
      const courseItems = courses.map((course) => ({
        value: course.course_id,
        text: course.course_name,
      }));

      SetNewComboItems(comboBox, courseItems);

      ListenToThisCombo(comboBox, (value, text) => {
        const index = parseInt(newSubjectCard.dataset.index);
        subjectsArray[index].course_id = value;
        subjectsArray[index].course_name = text;
        displaySubjects();
      });
    });
  }

  function createProfessorCard(professor = null) {
    const newProfessorCard = document.createElement("div");
    newProfessorCard.className = "professor-card";
    newProfessorCard.draggable = true;

    // Create the main course combo box
    const mainCourseComboBox = CreateComboBox(
      "professor-main-course[]",
      "Select main course",
      [],
      false,
      professor
        ? { value: professor.main_course_id, text: professor.main_course }
        : null,
      false
    );

    if (professor) {
      newProfessorCard.innerHTML = `
                <input type="text" name="professor[]" class="primary-text" value="${professor.displayName}" readonly>
                <button type="button" class="btn-remove-professor"><i data-feather="x"></i></button>
            `;
      newProfessorCard.insertBefore(
        mainCourseComboBox,
        newProfessorCard.querySelector(".btn-remove-professor")
      );
      professorsArray.push({ ...professor, flag: "uploaded" });
    } else {
      newProfessorCard.innerHTML = `
                <input type="text" name="professor[]" class="primary-text" placeholder="Professor name" required>
                <button type="button" class="btn-remove-professor"><i data-feather="x"></i></button>
            `;
      newProfessorCard.insertBefore(
        mainCourseComboBox,
        newProfessorCard.querySelector(".btn-remove-professor")
      );
      const newProfessor = {
        displayName: "",
        main_course: "",
        main_course_id: "",
        flag: "created",
      };
      professorsArray.push(newProfessor);
    }
    newProfessorCard.dataset.index = professorsArray.length - 1;
    professorsContainer.appendChild(newProfessorCard);
    feather.replace();
    setupDragAndDrop(newProfessorCard);

    // Populate the main course combo box
    populateMainCourseComboBox(mainCourseComboBox, newProfessorCard);

    SetComboValue(
      mainCourseComboBox,
      professor.main_course,
      professor.main_course_id
    );

    updateImportSummary();
  }

  function populateMainCourseComboBox(comboBox, newProfessorCard) {
    SelectModels("COURSE_CONTROL", []).then((courses) => {
      const courseItems = courses.map((course) => ({
        value: course.course_id,
        text: course.course_name,
      }));

      SetNewComboItems(comboBox, courseItems);

      ListenToThisCombo(comboBox, (value, text) => {
        const index = parseInt(newProfessorCard.dataset.index);
        professorsArray[index].main_course_id = value;
        professorsArray[index].main_course = text;
      });
    });
  }

  function displaySubjects() {
    subjectsDisplayContainer.innerHTML = "";
    subjectsArray.forEach((subject, index) => {
      const subjectCard = document.createElement("div");
      subjectCard.className = "subject-card";
      subjectCard.dataset.index = index;
      subjectCard.innerHTML = `
                <input type="text" class="primary-text" value="${
                  subject.name
                }" readonly>
                <input type="text" class="secondary-text" value="${
                  subject.code
                }" readonly>
                <input type="text" class="tertiary-text" value="${
                  subject.course_name || "No course selected"
                }" readonly>
                <div class="assigned-professor">${
                  subject.professor ? subject.professor.displayName : ""
                }</div>
                ${
                  subject.professor
                    ? '<button type="button" class="btn-remove-assigned-professor"><i data-feather="x"></i></button>'
                    : ""
                }
            `;
      subjectsDisplayContainer.appendChild(subjectCard);
      setupDragAndDrop(subjectCard);
    });
    feather.replace();

    updateImportSummary();
  }

  function setupDragAndDrop(element) {
    if (element.classList.contains("professor-card")) {
      element.addEventListener("dragstart", dragStart);
      element.addEventListener("dragend", dragEnd);
    } else if (element.classList.contains("subject-card")) {
      element.addEventListener("dragover", dragOver);
      element.addEventListener("dragleave", dragLeave);
      element.addEventListener("drop", drop);
    }
  }

  function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.index);
    e.target.classList.add("dragging");
  }

  function dragEnd(e) {
    e.target.classList.remove("dragging");
  }

  function dragOver(e) {
    e.preventDefault();
    if (
      !e.target.closest(".subject-card").querySelector(".assigned-professor")
        .textContent
    ) {
      e.target.closest(".subject-card").classList.add("drag-over");
    }
  }

  function dragLeave(e) {
    e.target.closest(".subject-card").classList.remove("drag-over");
  }

  function drop(e) {
    e.preventDefault();
    const subjectCard = e.target.closest(".subject-card");
    subjectCard.classList.remove("drag-over");
    const professorIndex = e.dataTransfer.getData("text");
    const subjectIndex = subjectCard.dataset.index;
    const professor = professorsArray[professorIndex];
    const subject = subjectsArray[subjectIndex];

    if (!subject.professor) {
      subject.professor = professor;
      displaySubjects();
    }
  }

  addEmptySubjectCard.addEventListener("click", () => createSubjectCard());
  addEmptyProfessorCard.addEventListener("click", () => createProfessorCard());

  addSubjectPopupBtn.addEventListener("click", () => {
    const subject_id_already_added = subjectsArray
      .map((subject) => subject.subject_id)
      .filter((id) => id);

    SelectSomething(
      "subjects/select_subject",
      "subjects",
      "SUBJECT_CONTROL",
      null,
      true
    ).then(async (res) => {
      if (!subject_id_already_added.includes(res.subject_id)) {
        const course = await SelectModel(res.course_id, "COURSE_CONTROL");
        const main = {
          name: res.subject_name,
          code: res.subject_code,
          course_name: course.course_name,
          course_id: res.course_id,
          subject_id: res.subject_id,
          professor: null,
        };

        createSubjectCard(main);
      } else {
        alert("Subject already added");
      }
    });
  });

  addProfessorPopupBtn.addEventListener("click", () => {
    SelectSomething(
      "professors/select_professors",
      "professors",
      "PROFESSOR_CONTROL",
      null,
      true
    ).then(async (res) => {
      const course = await SelectModel(res.main_course_id, "COURSE_CONTROL");

      const professor = {
        displayName: res.displayName,
        main_course: course.course_name,
        main_course_id: res.main_course_id,
        professor_id: res.professor_id,
      };

      createProfessorCard(professor);
    });
  });

  subjectsContainer.addEventListener("click", function (e) {
    if (e.target.closest(".btn-remove-subject")) {
      const card = e.target.closest(".subject-card");
      const index = parseInt(card.dataset.index);
      subjectsArray.splice(index, 1);
      card.remove();
      displaySubjects();
    }
  });

  professorsContainer.addEventListener("click", function (e) {
    if (e.target.closest(".btn-remove-professor")) {
      const card = e.target.closest(".professor-card");
      const index = parseInt(card.dataset.index);
      professorsArray.splice(index, 1);
      card.remove();
    }
  });

  subjectsDisplayContainer.addEventListener("click", function (e) {
    if (e.target.closest(".btn-remove-assigned-professor")) {
      const card = e.target.closest(".subject-card");
      const index = parseInt(card.dataset.index);
      subjectsArray[index].professor = null;
      displaySubjects();
    }
  });

  subjectsContainer.addEventListener("input", function (e) {
    const card = e.target.closest(".subject-card");
    const index = parseInt(card.dataset.index);
    const subject = subjectsArray[index];
    const inputName = e.target.name;

    if (inputName === "subject[]") {
      subject.name = e.target.value;
    } else if (inputName === "subject-code[]") {
      subject.code = e.target.value;
    }

    displaySubjects();
  });

  professorsContainer.addEventListener("input", function (e) {
    const card = e.target.closest(".professor-card");
    const index = parseInt(card.dataset.index);
    const professor = professorsArray[index];
    const inputName = e.target.name;

    if (inputName === "professor[]") {
      professor.displayName = e.target.value;
    }
  });
}

function getSummary() {
  const selectedSectionRadio = document.querySelector(
    'input[name="section"]:checked'
  );

  sectionSelected = null;

  if (selectedSectionRadio) {
    const sectionCard = selectedSectionRadio.closest(".section-card");
    const sectionName = sectionCard.querySelector("h4").textContent;
    const courseName = sectionCard
      .querySelector("p")
      .textContent.replace("Course: ", "");
    const section_id = sectionCard.querySelector('input[name="section"]').value;

    const section = sectionsArray.find(
      (section) => section.section_id == section_id
    );

    sectionSelected = {
      section_name: sectionName,
      course_name: courseName,
      section_id: section_id,
    };

    if (section) {
      sectionSelected = section;
    }
  } else {
    sectionSelected = null;
  }

  return {
    students: tableBulkEntryGenerator.getData(),
    subjects: subjectsArray,
    section: sectionSelected,
  };
}

function ImportNowStudents(summary) {
  return new Promise((resolve, reject) => {
    PostRequest("ImportStudents", { summary: JSON.stringify(summary) }).then(
      (res) => {
        resolve(res);
      }
    );
  });
}

function setupImportSummary() {
  const importBtn = document.getElementById("importBtn");

  wizzard.nextBtn.addEventListener("click", () => {
    updateImportSummary();
  });

  importBtn.addEventListener("click", () => {
    const summary = getSummary();

    if (summary.students.length) {
      ImportNowStudents(summary).then(() => {
        window.location.reload();
      });
    } else {
      alert("Please add students first");
    }
  });

  tableBulkEntryGenerator.onStep(4, () => {
    updateImportSummary();
  });
}

function updateImportSummary() {
  const studentCount = document.getElementById("studentCount");
  const subjectsList = document.getElementById("subjectsList");
  const selectedSection = document.getElementById("selectedSection");

  // Update student count
  const studentData = tableBulkEntryGenerator.getData();
  studentCount.textContent = studentData.length;

  // Update subjects list
  subjectsList.innerHTML = "";
  subjectsArray.forEach((subject) => {
    const li = document.createElement("li");
    li.textContent = `${subject.name} (${subject.code})`;
    subjectsList.appendChild(li);
  });

  // Update selected section
  const selectedSectionRadio = document.querySelector(
    'input[name="section"]:checked'
  );
  if (selectedSectionRadio) {
    const sectionCard = selectedSectionRadio.closest(".section-card");
    const sectionName = sectionCard.querySelector("h4").textContent;
    const courseName = sectionCard
      .querySelector("p")
      .textContent.replace("Course: ", "");
    selectedSection.textContent = `${sectionName} (${courseName})`;
  } else {
    selectedSection.textContent = "None selected";
  }
}

// Global functions to access data
window.getTableBulkEntryGenerator = () => tableBulkEntryGenerator;
window.getSubjectsArray = () => subjectsArray;
window.getSectionsArray = () => sectionsArray;
window.getProfessorsArray = () => professorsArray;
