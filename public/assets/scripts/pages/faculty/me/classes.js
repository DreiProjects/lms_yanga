import {
  addHtml,
  Ajax,
  ListenToForm,
  ManageComboBoxes,
  ListenToCombo,
  AddNewComboItem,
  SetComboValue,
  GetComboValue,
  MakeID,
  SetNewComboItems,
  ApplyError,
} from "../../../modules/component/Tool.js";
import Popup from "../../../classes/components/Popup.js";
import {
  AddRecord,
  EditRecord,
  EditRecords,
  PostRequest,
  RemoveRecords,
  RemoveRecordsBatch,
  UploadFileFromFile,
} from "../../../modules/app/SystemFunctions.js";
import {
  SelectModels,
  SelectModel,
  SelectModelByFilter,
  SelectSomething,
} from "../../../modules/app/Administrator.js";
import GradingPlatformEditor from "../../../classes/components/GradingPlatformEditor.js";
import StickyNoteEditor from "../../../classes/components/StickyNoteEditor.js";
import { SESSION } from "../../../modules/app/Application.js";
import { NewNotification } from "../../../classes/components/NotificationPopup.js";
import { TableListener } from "../../../classes/components/TableListener.js";
import AlertPopup, {
  AlertTypes,
} from "../../../classes/components/AlertPopup.js";

// Handle creating new exam
function NewExam(section_id) {
  return new Promise((resolve) => {
    const popup = new Popup(
      `${"exams"}/add_new_exams`,
      { section_id },
      {
        backgroundDismiss: false,
      }
    );

    popup.Create().then(() => {
      popup.Show();

      const form = popup.ELEMENT.querySelector("form");
      const section_subject_id = form.querySelector(".section_subject_id");
      const form_id = form.querySelector(".form_id");
      const duration = form.querySelector("input[name='duration']");
      const count_items = form.querySelector("input[name='count_items']");

      ListenToForm(
        form,
        (data) => {
          new Promise((resolve) => {
            if (data.file && data.file.name) {
              UploadFileFromFile(
                data.file,
                data.file.name,
                "public/assets/media/uploads/exams/"
              ).then((res) => {
                resolve({ code: 200, body: res });
              });
            } else {
              resolve({ code: 300, body: { path: null } });
            }
          }).then((res) => {
            if (res.code === 200) {
              data.file = res.body.path;
            } else {
              delete data.file;
            }

            data.section_id = section_id;
            data.section_subject_id = GetComboValue(section_subject_id).value;
            data.form_id = GetComboValue(form_id).value;

            popup.Remove();

            AddRecord("exams", { data: JSON.stringify(data) }).then((res) => {
              console.log(res);
              popup.Remove();
              resolve(res);
            });
          });
        },
        ["description"]
      );

      ListenToCombo(form_id, (value) => {
        SelectModel(value, "FORM_CONTROL").then((res) => {
          duration.value = res.duration;
          count_items.value = res.questions.length;
        });
      });

      ManageComboBoxes();
    });
  });
}

// Handle viewing exam
function ViewExam(id) {
  const popup = new Popup(
    `${"exams"}/view_exam`,
    { id },
    {
      backgroundDismiss: false,
    }
  );

  popup.Create().then(() => {
    popup.Show();

    const form = popup.ELEMENT.querySelector("form");
    const section_subject_id = form.querySelector(".section_subject_id");
    const form_id = form.querySelector(".form_id");
    const duration = form.querySelector("input[name='duration']");
    const count_items = form.querySelector("input[name='count_items']");

    ListenToForm(
      form,
      (data) => {
        new Promise((resolve) => {
          if (data.file && data.file.name) {
            UploadFileFromFile(
              data.file,
              data.file.name,
              "public/assets/media/uploads/exams/"
            ).then((res) => {
              resolve({ code: 200, body: res });
            });
          } else {
            resolve({ code: 300, body: { path: null } });
          }
        }).then((res) => {
          if (res.code === 200) {
            data.file = res.body.path;
          } else {
            delete data.file;
          }

          data.section_id = section_id;
          data.section_subject_id = GetComboValue(section_subject_id).value;
          data.form_id = GetComboValue(form_id).value;

          popup.Remove();

          EditRecord("exams", { id, data: JSON.stringify(data) }).then(
            (res) => {
              popup.Remove();
              resolve(res);
            }
          );
        });
      },
      ["description"]
    );

    ListenToCombo(form_id, (value) => {
      SelectModel(value, "FORM_CONTROL").then((res) => {
        duration.value = res.duration;
        count_items.value = res.questions.length;
      });
    });

    ManageComboBoxes();
  });
}

function NewExamForm(section_id) {
  const popup = new Popup(
    `${"exams"}/add_new_exams`,
    { section_id },
    {
      backgroundDismiss: false,
    }
  );
}

function TakeExam(exam_id) {
  // Get the exam item element to access due date
  const examItem = document.querySelector(`.exam-item[data-id="${exam_id}"]`);
  if (!examItem) return;

  // Extract due date from the exam item
  const examInfoText = examItem.querySelector(".exam-info small").textContent;
  const dueDateMatch = examInfoText.match(/Due: ([^|]+)/);

  // If no due date is found, proceed with taking the exam
  if (!dueDateMatch || !dueDateMatch[1] || dueDateMatch[1].trim() === "") {
    // Generate a random UUID for the exam session
    const uuid = crypto.randomUUID();

    // Open exam in new tab
    window.location.replace(`form/exam/${exam_id}/${uuid}`);
    return;
  }

  const dueDateStr = dueDateMatch[1].trim();

  // Check if due date is valid
  const dueDate = new Date(dueDateStr);
  if (isNaN(dueDate.getTime())) {
    // If due date is invalid, proceed with taking the exam
    const uuid = crypto.randomUUID();
    window.location.replace(`form/exam/${exam_id}/${uuid}`);
    return;
  }

  const now = new Date();

  // Check if due date has already passed
  if (now > dueDate) {
    alert("This exam's due date has passed. You can no longer take this exam.");
    return;
  }

  // Calculate time remaining until due date
  const timeRemaining = dueDate - now;

  // If less than 5 minutes remaining, show countdown timer
  if (timeRemaining < 300000) {
    // 5 minutes in milliseconds
    const timerModal = document.createElement("div");
    timerModal.className = "exam-timer-modal";

    const timerContent = document.createElement("div");
    timerContent.className = "exam-timer-content";

    const timerTitle = document.createElement("h3");
    timerTitle.textContent = "Exam Due Soon";

    const timerText = document.createElement("p");
    timerText.className = "timer-text";

    const timerButton = document.createElement("button");
    timerButton.className = "timer-button";
    timerButton.textContent = "Take Exam Now";

    timerContent.appendChild(timerTitle);
    timerContent.appendChild(timerText);
    timerContent.appendChild(timerButton);
    timerModal.appendChild(timerContent);

    document.body.appendChild(timerModal);

    // Start countdown timer
    let secondsRemaining = Math.floor(timeRemaining / 1000);

    const updateTimer = () => {
      const minutes = Math.floor(secondsRemaining / 60);
      const seconds = secondsRemaining % 60;
      timerText.textContent = `Time remaining: ${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;

      if (secondsRemaining <= 0) {
        clearInterval(timerInterval);
        timerText.textContent = "Exam due time has passed!";
        timerButton.disabled = true;
        timerButton.textContent = "No Longer Available";

        // Auto-close after 3 seconds
        setTimeout(() => {
          document.body.removeChild(timerModal);
        }, 3000);
      }

      secondsRemaining--;
    };

    updateTimer(); // Initial update
    const timerInterval = setInterval(updateTimer, 1000);

    // Handle take exam button click
    timerButton.addEventListener("click", () => {
      clearInterval(timerInterval);
      document.body.removeChild(timerModal);

      // Generate a random UUID for the exam session
      const uuid = crypto.randomUUID();

      // Open exam in new tab
      window.location.replace(`form/exam/${exam_id}/${uuid}`);
    });

    // Add styles for the timer modal
    const style = document.createElement("style");
    style.textContent = `
      .exam-timer-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }
      
      .exam-timer-content {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        max-width: 400px;
        width: 100%;
      }
      
      .timer-text {
        font-size: 24px;
        margin: 20px 0;
        color: #dc3545;
        font-weight: bold;
      }
      
      .timer-button {
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
      }
      
      .timer-button:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
      }
    `;

    document.head.appendChild(style);
  } else {
    // Generate a random UUID for the exam session
    const uuid = crypto.randomUUID();

    // Open exam in new tab
    window.location.replace(`form/exam/${exam_id}/${uuid}`);
  }
}

// Handle exam functionality
function Exams() {
  const addExamBtn = document.querySelector(".add-exam-btn");
  const examItems = document.querySelectorAll(".exam-item");
  const createExamBtn = document.querySelector(".create-exam-btn");
  const examsMenu = document.querySelector(".exams-menu");

  // Handle exams menu
  examsMenu.addEventListener("click", (e) => {
    if (e.target.classList.contains("subject-tab")) {
      const subject = e.target.dataset.subject;
      document
        .querySelectorAll(".subject-tab")
        .forEach((tab) => tab.classList.remove("active"));
      document
        .querySelectorAll(".subject-exams")
        .forEach((exam) => exam.classList.remove("active"));

      e.target.classList.add("active");
      document
        .querySelector(`.subject-exams[data-subject="${subject}"]`)
        .classList.add("active");
    }
  });

  if (addExamBtn) {
    addExamBtn.addEventListener("click", () => {
      NewExam(addExamBtn.dataset.section_id);
    });
  }

  // Add timer display for exams
  function updateExamTimers() {
    if (examItems) {
      examItems.forEach((item) => {
        const examInfoText = item.querySelector(".exam-info small").textContent;
        const dueDateMatch = examInfoText.match(/Due: ([^|]+)/);

        // Skip exams without a due date
        if (
          !dueDateMatch ||
          !dueDateMatch[1] ||
          dueDateMatch[1].trim() === ""
        ) {
          return;
        }

        const dueDateStr = dueDateMatch[1].trim();
        const dueDate = new Date(dueDateStr);

        // Skip if due date is invalid
        if (isNaN(dueDate.getTime())) {
          return;
        }

        const now = new Date();

        // Calculate time remaining until due date
        const timeRemaining = dueDate - now;

        // If due date has passed, disable the take exam button
        if (timeRemaining <= 0) {
          const takeExamBtn = item.querySelector(".take-exam-btn");
          if (takeExamBtn) {
            takeExamBtn.classList.add("disabled");
            takeExamBtn.title = "Exam due date has passed";
            takeExamBtn.querySelector(".text span").textContent = "Past Due";

            // Remove the click event listener
            takeExamBtn.replaceWith(takeExamBtn.cloneNode(true));
          }
        }
        // If less than 1 hour remaining, show countdown timer
        else if (timeRemaining < 3600000) {
          // 1 hour in milliseconds
          // Check if timer already exists
          let timerElement = item.querySelector(".exam-timer");

          if (!timerElement) {
            // Create timer element
            timerElement = document.createElement("div");
            timerElement.className = "exam-timer";
            item.querySelector(".exam-info").appendChild(timerElement);

            // Add timer styles if not already added
            if (!document.getElementById("exam-timer-styles")) {
              const timerStyles = document.createElement("style");
              timerStyles.id = "exam-timer-styles";
              timerStyles.textContent = `
                .exam-timer {
                  margin-top: 8px;
                  padding: 5px 10px;
                  background-color: #fff3cd;
                  border-radius: 4px;
                  font-weight: bold;
                  color: #856404;
                  display: inline-block;
                }
                
                .exam-timer.urgent {
                  background-color: #f8d7da;
                  color: #721c24;
                }
                
                .icon-button.disabled {
                  opacity: 0.5;
                  cursor: not-allowed;
                  pointer-events: none;
                }
              `;
              document.head.appendChild(timerStyles);
            }
          }

          // Update timer text
          const minutes = Math.floor(timeRemaining / 60000);
          const seconds = Math.floor((timeRemaining % 60000) / 1000);

          timerElement.textContent = `Due in: ${minutes}m ${seconds}s`;

          // Add urgent class if less than 5 minutes remaining
          if (timeRemaining < 300000) {
            timerElement.classList.add("urgent");
          }
        }
      });
    }
  }

  // Initial update
  updateExamTimers();

  // Update timers every second
  const timerInterval = setInterval(updateExamTimers, 1000);

  // Clean up interval when navigating away
  window.addEventListener("beforeunload", () => {
    clearInterval(timerInterval);
  });

  if (examItems) {
    examItems.forEach((item) => {
      const viewBtn = item.querySelector(".view-exam-btn");
      const viewStudentFormsBtn = item.querySelector(".view-student-forms-btn");

      viewBtn.addEventListener("click", () => {
        ViewExam(item.dataset.id);
      });

      const takeExamBtn = item.querySelector(".take-exam-btn");

      if (takeExamBtn) {
        takeExamBtn.addEventListener("click", () => {
          TakeExam(item.dataset.id);
        });
      }

      if (viewStudentFormsBtn) {
        viewStudentFormsBtn.addEventListener("click", () => {
          ViewStudentForms(item.dataset.id);
        });
      }
    });
  }

  if (createExamBtn) {
    createExamBtn.addEventListener("click", () => {
      NewExamForm(createExamBtn.dataset.section_id);
    });
  }
}

// Handle grades functionality
function Grades() {
  const menuItems = document.querySelectorAll(".grades-menu li");
  const gradeContainers = document.querySelectorAll(".subject-grades");

  // Handle menu item clicks
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      menuItems.forEach((i) => i.classList.remove("active"));
      gradeContainers.forEach((c) => c.classList.remove("active"));

      item.classList.add("active");
      const subject = item.dataset.subject;
      document
        .querySelector(`.subject-grades[data-subject="${subject}"]`)
        .classList.add("active");
    });
  });

  // Initialize grading platforms
  gradeContainers.forEach((container) => {
    const platformContainer = container.querySelector(
      ".grading-platform-container"
    );
    if (!platformContainer) return;

    const saveBtn = container.querySelector(".save-grades");
    const discardBtn = container.querySelector(".discard-grades");
    const exportBtn = container.querySelector(".export-grades");
    const showBtn = container.querySelector(".show-grades");
    const sectionSubjectId = platformContainer.dataset.sectionSubjectId;

    SelectModel(sectionSubjectId, "SECTION_SUBJECT_CONTROL").then((res) => {
      SelectModelByFilter(
        JSON.stringify({ section_id: res.section_id, irregular: "irregular" }),
        "SECTION_STUDENT_CONTROL"
      ).then((irregulars) => {
        SelectModelByFilter(
          JSON.stringify({ section_id: res.section_id }),
          "SECTION_STUDENT_CONTROL"
        ).then((students) => {
          const allStudents = students.filter((student) => {
            if (student.irregular == "irregular") {
              const irreg = irregulars.find(
                (ir) => ir.student_id == student.user_id
              );
              return (
                irreg &&
                irreg.subjects.some(
                  (subject) => subject.section_subject_id == sectionSubjectId
                )
              );
            }
            return true;
          });

          // console.log(students, irregulars, sectionSubjectId  )
          const gradingEditor = new GradingPlatformEditor({
            container: platformContainer,
            students: allStudents.map((student) => ({
              user_id: student.user_id,
              displayName: student.displayName,
            })),
            buttons: {
              save: saveBtn,
              discard: discardBtn,
              export: exportBtn,
              show: showBtn,
            },
          });

          gradingEditor.Load(sectionSubjectId);
        });
      });
    });
  });
}

// Handle creating new activity
function NewActivity(section_id, professor_id) {
  return new Promise((resolve) => {
    const popup = new Popup(
      `${"activities"}/add_new_activity`,
      { section_id, professor_id },
      {
        backgroundDismiss: false,
      }
    );

    popup.Create().then(() => {
      popup.Show();

      const form = popup.ELEMENT.querySelector("form");
      const section_subject_id = form.querySelector(".section_subject_id");

      ListenToForm(
        form,
        async (data) => {
          popup.Remove();

          const uploadResult = await new Promise((resolve) => {
            if (data.file.name) {
              UploadFileFromFile(
                data.file,
                data.file.name,
                "public/assets/media/uploads/activities/"
              ).then(resolve);
            } else {
              resolve({ code: 300, body: { path: null } });
            }
          });

          if (uploadResult.code === 200) {
            data.file = uploadResult.body.path;
          } else {
            delete data.file;
          }

          if (!data.due_date) {
            delete data.due_date;
          }

          data.section_subject_id = GetComboValue(section_subject_id).value;

          AddRecord("activities", { data: JSON.stringify(data) }).then(() => {
            popup.Remove();
          });
        },
        ["description", "due_date", "file"]
      );

      ManageComboBoxes();
    });
  });
}

// Handle viewing activity
function ViewActivity(id) {
  const popup = new Popup(
    `${"activities"}/view_activity`,
    { id },
    {
      backgroundDismiss: false,
    }
  );

  popup.Create().then(() => {
    popup.Show();

    const form = popup.ELEMENT.querySelector("form");
    const section_subject_id = form.querySelector(".section_subject_id");

    ListenToForm(
      form,
      (data) => {
        new Promise((resolve) => {
          if (data.file && data.file.name) {
            UploadFileFromFile(
              data.file,
              data.file.name,
              "public/assets/media/uploads/activities/"
            ).then(resolve);
          } else {
            resolve({ code: 300, body: { path: null } });
          }
        }).then((res) => {
          if (res.code === 200) {
            data.file = res.body.path;
          }

          data.section_subject_id = GetComboValue(section_subject_id).value;

          EditRecord("activities", { id, data: JSON.stringify(data) }).then(
            () => {
              popup.Remove();
            }
          );
        });
      },
      ["description", "due_date", "file"]
    );

    ManageComboBoxes();
  });
}

function NewGradeScore(activity_id, category, id) {
  return new Promise((resolve) => {
    const popup = new Popup(
      `${"grade_scores"}/add_new_grade_score`,
      { category, id },
      {
        backgroundDismiss: false,
      }
    );

    popup.Create().then(() => {
      popup.Show();

      const form = popup.ELEMENT.querySelector("form");

      ListenToForm(form, (data) => {
        data.category = category;
        data.id = id;
        data.parent_id = activity_id;

        AddRecord("grade_scores", { data: JSON.stringify(data) }).then(() => {
          popup.Remove();

          resolve();
        });
      });
    });
  });
}

function EditGradeScore(id) {
  const popup = new Popup(
    `${"grade_scores"}/view_grade_score`,
    { id },
    {
      backgroundDismiss: false,
    }
  );

  popup.Create().then(() => {
    popup.Show();

    const form = popup.ELEMENT.querySelector("form");
    ListenToForm(form, (data) => {
      EditRecord("grade_scores", { id, data: JSON.stringify(data) }).then(
        () => {
          popup.Remove();
        }
      );
    });
  });
}

function ViewCompletedForm(exam_id, id) {
  const popup = new Popup(
    `${"exams"}/view_completed_form`,
    { exam_id, id },
    {
      backgroundDismiss: false,
    }
  );

  popup.Create().then(() => {
    popup.Show();

    const gradeBtn = popup.ELEMENT.querySelector(".grade-btn");
    const editBtn = popup.ELEMENT.querySelector(".edit-btn");
    const viewBtn = popup.ELEMENT.querySelector(".view-btn");
    if (gradeBtn) {
      gradeBtn.addEventListener("click", () => {
        NewGradeScore(exam_id, "Form", id).then(() => {
          popup.Remove();
        });
      });
    }

    if (editBtn) {
      editBtn.addEventListener("click", () => {
        EditGradeScore(editBtn.dataset.id);
      });
    }

    if (viewBtn) {
      viewBtn.addEventListener("click", () => {
        window.open(`/me/view/${viewBtn.dataset.id}`, "_blank");
      });
    }
  });
}

function ViewStudentForms(exam_id) {
  const popup = new Popup(
    `${"exams"}/view_student_forms`,
    { exam_id },
    {
      backgroundDismiss: false,
    }
  );

  popup.Create().then(() => {
    popup.Show();

    const complyItems = popup.ELEMENT.querySelectorAll(".comply-item");
    const checkExamsBtn = popup.ELEMENT.querySelector(".check-exams-btn");

    if (checkExamsBtn) {
      checkExamsBtn.addEventListener("click", function () {
        // Show loading state
        checkExamsBtn.disabled = true;
        checkExamsBtn.innerHTML = "<span>Checking...</span>";

        PostRequest("CheckExam", { exam_id })
          .then((res) => {
            console.log(res);

            try {
              // Parse the response
              const result = JSON.parse(res);

              if (result.code === 200) {
                // Get the check results from the response body
                const checks = result.body;

                // Count already checked forms
                let alreadyCheckedCount = 0;
                let newlyCheckedCount = 0;

                if (Array.isArray(checks)) {
                  alreadyCheckedCount = checks.filter(
                    (item) => item.already_checked
                  ).length;
                  newlyCheckedCount = checks.length - alreadyCheckedCount;

                  // Show success message
                  const modal = document.getElementById("checkAllResultsModal");
                  if (modal) {
                    // Update the modal with check results
                    const totalCheckedEl =
                      document.getElementById("totalChecked");
                    const resultsDetailsEl =
                      document.getElementById("allResultsDetails");
                    const resultSummaryEl = document.querySelector(
                      "#checkAllResultsModal .result-summary"
                    );

                    // Update summary text
                    if (totalCheckedEl) {
                      totalCheckedEl.textContent = `Total checked: ${checks.length}`;
                    }

                    // Add information about already checked forms
                    if (resultSummaryEl) {
                      // Clear existing summary paragraphs except the first one
                      const paragraphs = resultSummaryEl.querySelectorAll("p");
                      for (let i = 1; i < paragraphs.length; i++) {
                        paragraphs[i].remove();
                      }

                      // Add message from the server
                      const messageEl = document.createElement("p");
                      messageEl.textContent = result.message;
                      resultSummaryEl.appendChild(messageEl);

                      // Add detailed counts
                      if (alreadyCheckedCount > 0) {
                        const alreadyCheckedInfo = document.createElement("p");
                        alreadyCheckedInfo.innerHTML = `<strong>${alreadyCheckedCount}</strong> forms were already checked previously.`;
                        alreadyCheckedInfo.style.color = "#3b82f6";
                        resultSummaryEl.appendChild(alreadyCheckedInfo);
                      }

                      if (newlyCheckedCount > 0) {
                        const newlyCheckedInfo = document.createElement("p");
                        newlyCheckedInfo.innerHTML = `<strong>${newlyCheckedCount}</strong> forms were newly checked.`;
                        newlyCheckedInfo.style.color = "#10b981";
                        resultSummaryEl.appendChild(newlyCheckedInfo);
                      }
                    }

                    // Show the modal
                    modal.style.display = "flex";

                    // Refresh the page after a delay to show updated grades
                    setTimeout(() => {
                      location.reload();
                    }, 3000);
                  } else {
                    // If modal doesn't exist, show a simple alert
                    alert(
                      `${result.message}\n\nAll exams have been processed.`
                    );

                    // Refresh the page after a delay
                    setTimeout(() => {
                      location.reload();
                    }, 1000);
                  }
                } else {
                  // Show success message
                  alert(`${result.message}\n\nAll exams have been processed.`);

                  // Refresh the page after a delay
                  setTimeout(() => {
                    location.reload();
                  }, 1000);
                }
              } else {
                // Show error message
                alert(
                  result.message || "Failed to check exams. Please try again."
                );
              }
            } catch (error) {
              console.error("Error parsing response:", error);
              alert(
                "An error occurred while checking exams. Please try again."
              );
            }

            // Reset button state
            checkExamsBtn.disabled = false;
            checkExamsBtn.innerHTML = "<span>Check All</span>";
          })
          .catch((error) => {
            console.error("Error checking exams:", error);
            alert("An error occurred while checking exams. Please try again.");

            // Reset button state
            checkExamsBtn.disabled = false;
            checkExamsBtn.innerHTML = "<span>Check All</span>";
          });
      });
    }

    complyItems.forEach((item) => {
      item.addEventListener("click", () => {
        ViewCompletedForm(exam_id, item.dataset.id);
      });
    });
  });
}

function DownloadCompliedFile(comply_id) {
  return PostRequest("DownloadCompliedFile", { comply_id })
    .then((res) => {
      res = JSON.parse(res);
      const binaryStr = atob(res.body);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: res.type });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `complied_file.${res.type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Ensure the blob URL is revoked after use
    })
    .catch((error) => {
      console.error("Failed to download complied file:", error);
    });
}

function ViewCompliedActivity(activity_id, id) {
  const popup = new Popup(
    `${"activities"}/view_complied_activity`,
    { id },
    {
      backgroundDismiss: false,
    }
  );
  popup.Create().then(() => {
    popup.Show();

    const gradeBtn = popup.ELEMENT.querySelector(".grade-btn");
    const editBtn = popup.ELEMENT.querySelector(".edit-btn");
    const dlBtn = popup.ELEMENT.querySelector(".download-btn");

    if (gradeBtn) {
      gradeBtn.addEventListener("click", () => {
        NewGradeScore(
          activity_id,
          gradeBtn.dataset.category,
          gradeBtn.dataset.id
        ).then(() => {
          popup.Remove();
        });
      });
    }

    if (editBtn) {
      editBtn.addEventListener("click", () => {
        EditGradeScore(editBtn.dataset.id);
      });
    }

    if (dlBtn) {
      dlBtn.addEventListener("click", () => {
        DownloadCompliedFile(id);
      });
    }
  });
}

// Handle complying activity
function ComplyActivity(id) {
  const popup = new Popup(
    `${"activities"}/comply_activity`,
    { id },
    {
      backgroundDismiss: false,
    }
  );

  popup.Create().then(() => {
    popup.Show();

    const form = popup.ELEMENT.querySelector("form");

    ListenToForm(
      form,
      (data) => {
        new Promise(async (resolve) => {
          if (data.file && data.file.name) {
            await UploadFileFromFile(
              data.file,
              data.file.name,
              "public/assets/media/uploads/activities_complied/"
            ).then(resolve);
          }

          resolve({ code: 300, body: { path: null } });
        }).then((res) => {
          if (res.code == 200) {
            data.file = res.body.path;
          } else {
            delete data.file;
          }

          if (data.link) {
            if (!data.link.match(/^(http|https):\/\/[^ "]+$/)) {
              alert(
                "Please enter a valid URL starting with http:// or https://"
              );
              return;
            }
          }

          data.activity_id = id;

          AddRecord("activities_complied", { data: JSON.stringify(data) }).then(
            () => {
              popup.Remove();
            }
          );
        });
      },
      ["link", "text", "file"]
    );

    ManageComboBoxes();
  });
}

function ViewCompliedActivities(id) {
  const popup = new Popup(
    `${"activities"}/view_complied_activities`,
    { id },
    {
      backgroundDismiss: false,
    }
  );

  popup.Create().then(() => {
    popup.Show();

    const complyItems = popup.ELEMENT.querySelectorAll(".comply-item");
    complyItems.forEach((item) => {
      item.addEventListener("click", () => {
        ViewCompliedActivity(id, item.dataset.id);
      });
    });
  });
}

// Handle activities functionality
function Activities() {
  const addActivityBtn = document.querySelector(".add-activity-btn");
  const activities = document.querySelectorAll(".activity-item");
  const activitiesMenu = document.querySelector(".activities-menu");

  // Handle activities menu
  activitiesMenu.addEventListener("click", (e) => {
    if (e.target.classList.contains("subject-tab")) {
      const subject = e.target.dataset.subject;
      document
        .querySelectorAll(".subject-tab")
        .forEach((tab) => tab.classList.remove("active"));
      document
        .querySelectorAll(".subject-activities")
        .forEach((activity) => activity.classList.remove("active"));

      e.target.classList.add("active");
      document
        .querySelector(`.subject-activities[data-subject="${subject}"]`)
        .classList.add("active");
    }
  });

  if (addActivityBtn) {
    addActivityBtn.addEventListener("click", () => {
      NewActivity(
        addActivityBtn.dataset.section_id,
        addActivityBtn.dataset.professor_id
      );
    });
  }

  if (activities) {
    activities.forEach((activity) => {
      const viewBtn = activity.querySelector(".view-activity-btn");
      const complyBtn = activity.querySelector(".comply-btn");
      const viewCompliedBtn = activity.querySelector(".view-complied-btn");
      const viewCompliedActivitiesBtn = activity.querySelector(
        ".view-complied-activities-btn"
      );

      if (viewBtn) {
        viewBtn.addEventListener("click", () => {
          ViewActivity(activity.dataset.id);
        });
      }

      if (complyBtn) {
        complyBtn.addEventListener("click", () => {
          ComplyActivity(activity.dataset.id);
        });
      }

      if (viewCompliedBtn) {
        viewCompliedBtn.addEventListener("click", () => {
          ViewCompliedActivity(activity.dataset.id, viewCompliedBtn.dataset.id);
        });
      }

      if (viewCompliedActivitiesBtn) {
        viewCompliedActivitiesBtn.addEventListener("click", () => {
          ViewCompliedActivities(activity.dataset.id);
        });
      }
    });
  }
}

// Handle creating new resource group
function NewResourceGroup() {
  return new Promise((resolve) => {
    const popup = new Popup(`${"resources"}/add_new_resource_group`, null, {
      backgroundDismiss: false,
    });

    popup.Create().then(() => {
      popup.Show();
      const form = popup.ELEMENT.querySelector("form");

      ListenToForm(
        form,
        (data) => {
          popup.Remove();
          resolve(data);
        },
        ["description"]
      );
    });
  });
}

// Handle creating new resource
function NewResource(section_id, professor_id) {
  return new Promise((resolve) => {
    const popup = new Popup(
      `${"resources"}/add_new_resource`,
      { section_id, professor_id },
      {
        backgroundDismiss: false,
      }
    );

    popup.Create().then(() => {
      popup.Show();

      const form = popup.ELEMENT.querySelector("form");
      const group_id = form.querySelector(".group_id");
      const section_subject_id = form.querySelector(".section_subject_id");
      const createdGroups = {};

      ListenToForm(
        form,
        (data) => {
          const group_id_value = GetComboValue(group_id);

          if (group_id_value.value) {
            data.group_id =
              createdGroups[group_id_value.value] || group_id_value.value;
          } else {
            delete data.group_id;
          }

          data.section_id = section_id;
          data.section_subject_id = GetComboValue(section_subject_id).value;

          AddRecord("resources", {
            data: JSON.stringify(data),
            file: data.file,
          }).then((res) => {
            if (res.code == 200) {
              NewNotification({
                type: "success",
                message: "Resource added successfully!",
              });
            } else {
              NewNotification({
                type: "error",
                message: "Failed to add resource. Please try again.",
              });
            }
            popup.Remove();
          });
        },
        ["description", "group_id"]
      );

      ListenToCombo(section_subject_id, () => {
        SelectModels("RESOURCES_GROUP_CONTROL", {
          section_id,
          section_subject_id: GetComboValue(section_subject_id).value,
        }).then((groups) => {
          SetNewComboItems(
            group_id,
            [
              { value: "0", text: "Create New Group" },
              ...groups.map((group) => ({
                value: group.resources_group_id,
                text: group.title,
              })),
            ],
            (value) => {
              if (value == 0) {
                NewResourceGroup().then((res) => {
                  const id = MakeID(10);
                  AddNewComboItem(group_id, res.resource_group_id, res.title);
                  SetComboValue(group_id, res.title, id);
                  ManageComboBoxes();
                  createdGroups[id] = res;
                });
              }
            }
          );
        });
      });

      ManageComboBoxes();
    });
  });
}

// Handle downloading resource
function DownloadResource(id) {
  return PostRequest("DownloadResource", { id });
}

// Handle downloading resource group
function DownloadResourceGroup(id) {
  return PostRequest("DownloadResourceGroup", { id });
}

// Handle resources functionality
export function Resources() {
  const resourcesMenu = document.querySelector(".resources-menu");
  const accordionItems = document.querySelectorAll(".accordion-item");
  const uploadResourceBtn = document.querySelector(".upload-resource-btn");

  if (uploadResourceBtn) {
    uploadResourceBtn.addEventListener("click", () => {
      NewResource(
        uploadResourceBtn.dataset.section_id,
        uploadResourceBtn.dataset.professor_id
      );
    });
  }

  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    const content = item.querySelector(".accordion-content");
    const resourceItems = item.querySelectorAll(".resource-item");
    const downloadResourceGroupBtn = item.querySelector(
      ".download-resource-group-btn"
    );

    // Handle downloading resource group
    downloadResourceGroupBtn.addEventListener("click", () => {
      DownloadResourceGroup(item.dataset.id).then((res) => {
        console.log(res);

        res = JSON.parse(res);
        const binaryStr = atob(res.body);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        JSZip.loadAsync(bytes)
          .then((zip) => zip.generateAsync({ type: "blob" }))
          .then((content) => saveAs(content, `${item.dataset.title}.zip`));
      });
    });

    // Handle downloading individual resources
    resourceItems.forEach((resourceItem) => {
      const downloadBtn = resourceItem.querySelector(".download-resource-btn");
      downloadBtn.addEventListener("click", () => {
        DownloadResource(resourceItem.dataset.id).then((res) => {
          console.log(res);
          res = JSON.parse(res);
          const binaryStr = atob(res.body);
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }

          JSZip.loadAsync(bytes)
            .then((zip) => zip.generateAsync({ type: "blob" }))
            .then((content) =>
              saveAs(content, `${resourceItem.dataset.title}.zip`)
            );
        });
      });
    });

    // Handle accordion functionality
    header.addEventListener("click", () => {
      accordionItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          otherItem.querySelector(".accordion-content").style.display = "none";
        }
      });

      item.classList.toggle("active");
      content.style.display = item.classList.contains("active")
        ? "block"
        : "none";
    });
  });

  // Handle resources menu
  resourcesMenu.addEventListener("click", (e) => {
    if (e.target.classList.contains("subject-tab")) {
      const subject = e.target.dataset.subject;
      document
        .querySelectorAll(".subject-tab")
        .forEach((tab) => tab.classList.remove("active"));
      document
        .querySelectorAll(".subject-resources")
        .forEach((resource) => resource.classList.remove("active"));

      e.target.classList.add("active");
      document
        .querySelector(`.subject-resources[data-subject="${subject}"]`)
        .classList.add("active");
    }
  });
}

// Handle sticky notes functionality
function StickyNotes() {
  const container = document.querySelector(".sticky-note-editor-container");
  const user_id = container.dataset.user_id;
  const section_id = container.dataset.section_id;
  const professor_id = container.dataset.professor_id;

  SelectModel(user_id, "USER_CONTROL").then((user) => {
    const stickyNoteEditor = new StickyNoteEditor({ container, user });
    stickyNoteEditor.Load(section_id, professor_id);
  });
}

function GetSectionStudents(sectionSubjectId) {
  return new Promise((resolve) => {
    SelectModel(sectionSubjectId, "SECTION_SUBJECT_CONTROL").then((res) => {
      SelectModelByFilter(
        JSON.stringify({ section_id: res.section_id, irregular: "irregular" }),
        "SECTION_STUDENT_CONTROL"
      ).then((irregulars) => {
        SelectModelByFilter(
          JSON.stringify({ section_id: res.section_id }),
          "SECTION_STUDENT_CONTROL"
        ).then((students) => {
          const allStudents = students.filter((student) => {
            if (student.irregular == "irregular") {
              const irreg = irregulars.find(
                (ir) => ir.student_id == student.user_id
              );
              return (
                irreg &&
                irreg.subjects.some(
                  (subject) => subject.section_subject_id == sectionSubjectId
                )
              );
            }
            return true;
          });

          resolve(allStudents);
        });
      });
    });
  });
}

function GetSubjectAttendance(sectionSubjectId) {
  return new Promise((resolve) => {
    SelectModelByFilter(
      JSON.stringify({ section_subject_id: sectionSubjectId }),
      "SUBJECT_ATTENDANCE_CONTROL"
    ).then((attendances) => {
      if (attendances.length > 0) {
        resolve(attendances[0]);
      } else {
        resolve(null);
      }
    });
  });
}

// Handle attendance functionality
class AttendanceManager {
  constructor({ container, sectionSubjectId, students }) {
    this.container = container;
    this.wrapper = this.container.querySelector(".main-content");
    this.sectionSubjectId = sectionSubjectId;
    this.students = students;
    this.sessionID = parseInt(SESSION.sessionId);
    this.sessionType = parseInt(SESSION.sessionType);
    this.selectedCells = new Set();
    this.lastSelectedCell = null;
    this.isMouseDown = false;
    this.attendanceData = {};
    this.originalAttendanceData = {};
    this.hasChanges = false;

    // Filter students if user is a student
    this.displayStudents =
      this.sessionType === 1
        ? this.students.filter((student) => student.user_id === this.sessionID)
        : this.students;

    this.init();
  }

  async init() {
    // Hide action buttons if user is a student
    if (this.sessionType === 1) {
      const saveBtn = this.container.querySelector(".save-attendance");
      const discardBtn = this.container.querySelector(".discard-attendance");
      if (saveBtn) saveBtn.style.display = "none";
      if (discardBtn) discardBtn.style.display = "none";
    }

    // Get existing attendance data
    const attendance = await GetSubjectAttendance(this.sectionSubjectId);
    this.attendanceData = attendance
      ? JSON.parse(attendance.attendance_data)
      : {};
    this.originalAttendanceData = JSON.parse(
      JSON.stringify(this.attendanceData)
    );

    this.monthSelect = this.container.querySelector("#monthSelect");
    this.yearSelect = this.container.querySelector("#yearSelect");

    this.generateTable();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.monthSelect.addEventListener("change", () => this.generateTable());
    this.yearSelect.addEventListener("change", () => this.generateTable());

    this.container
      .querySelector(".prev-month")
      .addEventListener("click", () => {
        let month = parseInt(this.monthSelect.value);
        let year = parseInt(this.yearSelect.value);

        month--;
        if (month < 1) {
          month = 12;
          year--;
          this.yearSelect.value = year;
        }
        this.monthSelect.value = month;
        this.generateTable();
      });

    this.container
      .querySelector(".next-month")
      .addEventListener("click", () => {
        let month = parseInt(this.monthSelect.value);
        let year = parseInt(this.yearSelect.value);

        month++;
        if (month > 12) {
          month = 1;
          year++;
          this.yearSelect.value = year;
        }
        this.monthSelect.value = month;
        this.generateTable();
      });

    this.container.querySelector(".prev-year").addEventListener("click", () => {
      let year = parseInt(this.yearSelect.value);
      this.yearSelect.value = year - 1;
      this.generateTable();
    });

    this.container.querySelector(".next-year").addEventListener("click", () => {
      let year = parseInt(this.yearSelect.value);
      this.yearSelect.value = year + 1;
      this.generateTable();
    });

    document.addEventListener("mouseup", () => {
      this.isMouseDown = false;
    });
  }

  getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  saveAttendanceState(studentId, date, state) {
    if (!this.attendanceData[date]) {
      this.attendanceData[date] = {};
    }

    const originalState = this.originalAttendanceData[date]?.[studentId];
    if (state !== originalState) {
      this.hasChanges = true;
    }

    this.attendanceData[date][studentId] = state;
    this.updateButtonStates();
    this.updateSummary();
  }

  getAttendanceState(studentId, date) {
    return this.attendanceData[date]?.[studentId] || null;
  }

  updateButtonStates() {
    const saveBtn = this.container.querySelector(".save-attendance");
    const discardBtn = this.container.querySelector(".discard-attendance");

    if (saveBtn && discardBtn) {
      saveBtn.disabled = !this.hasChanges;
      discardBtn.disabled = !this.hasChanges;
    }
  }

  updateSummary() {
    const month = parseInt(this.monthSelect.value);
    const year = parseInt(this.yearSelect.value);
    const daysInMonth = this.getDaysInMonth(month, year);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month - 1, daysInMonth);

    this.displayStudents.forEach((student) => {
      let presentCount = 0;
      let absentCount = 0;
      let lateCount = 0;

      for (let date in this.attendanceData) {
        const currentDate = new Date(date);
        if (currentDate >= startDate && currentDate <= endDate) {
          const state = this.attendanceData[date][student.user_id];
          if (state === "present") presentCount++;
          if (state === "absent") absentCount++;
          if (state === "late") lateCount++;
        }
      }

      const summaryCell = this.container.querySelector(
        `.summary-cell[data-student="${student.user_id}"]`
      );
      if (summaryCell) {
        summaryCell.innerHTML = `
                    <span class="present-count">${presentCount}</span> /
                    <span class="absent-count">${absentCount}</span> /
                    <span class="late-count">${lateCount}</span>
                `;
      }
    });
  }

  getIconForState(state) {
    const icons = {
      present: "check-circle",
      absent: "x-circle",
      late: "clock",
    };
    return icons[state];
  }

  getColorForState(state) {
    const colors = {
      present: "#22c55e",
      absent: "#ef4444",
      late: "#eab308",
    };
    return colors[state];
  }

  async saveChanges() {
    if (!this.hasChanges) return;

    try {
      const res = await AddRecord("subject_attendances", {
        data: JSON.stringify({
          section_subject_id: this.sectionSubjectId,
          attendance_data: JSON.stringify(this.attendanceData),
        }),
      });

      NewNotification({
        type: "success",
        message: "Attendance saved successfully!",
      });
      this.originalAttendanceData = JSON.parse(
        JSON.stringify(this.attendanceData)
      );
      this.hasChanges = false;
      this.updateButtonStates();
    } catch (error) {
      console.error("Error saving attendance:", error);
      NewNotification({
        type: "error",
        message: "Failed to save attendance. Please try again.",
      });
    }
  }

  discardChanges() {
    if (!this.hasChanges) return;

    this.attendanceData = JSON.parse(
      JSON.stringify(this.originalAttendanceData)
    );
    this.hasChanges = false;
    this.generateTable();
  }

  toggleCellSelection(cell, event) {
    if (!cell || this.sessionType !== 2) return;

    if (event.altKey) {
      if (this.selectedCells.has(cell)) {
        this.selectedCells.delete(cell);
        cell.classList.remove("selected");
        if (this.selectedCells.size === 0) {
          document
            .querySelectorAll(".attendance-floating-container")
            .forEach((container) => {
              container.remove();
            });
        }
      }
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      if (this.selectedCells.has(cell)) {
        this.selectedCells.delete(cell);
        cell.classList.remove("selected");
      } else {
        this.selectedCells.add(cell);
        cell.classList.add("selected");
      }
    } else if (event.shiftKey && this.lastSelectedCell) {
      const cells = Array.from(document.querySelectorAll(".attendance-cell"));
      const start = cells.indexOf(this.lastSelectedCell);
      const end = cells.indexOf(cell);
      const range = cells.slice(Math.min(start, end), Math.max(start, end) + 1);

      this.selectedCells.clear();
      document
        .querySelectorAll(".attendance-cell")
        .forEach((c) => c.classList.remove("selected"));

      range.forEach((c) => {
        this.selectedCells.add(c);
        c.classList.add("selected");
      });
    } else {
      if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
        this.selectedCells.clear();
        document
          .querySelectorAll(".attendance-cell")
          .forEach((c) => c.classList.remove("selected"));
      }
      this.selectedCells.add(cell);
      cell.classList.add("selected");
    }

    this.lastSelectedCell = cell;

    if (this.selectedCells.size > 0) {
      this.showAttendanceOptions(event);
    }
  }

  showAttendanceOptions(event) {
    if (this.sessionType === 1) return;

    document
      .querySelectorAll(".attendance-floating-container")
      .forEach((container) => {
        container.remove();
      });

    const floatingContainer = document.createElement("div");
    floatingContainer.className = "attendance-floating-container";

    const states = [
      { name: "present", icon: "check-circle", color: "#22c55e" },
      { name: "absent", icon: "x-circle", color: "#ef4444" },
      { name: "late", icon: "clock", color: "#eab308" },
      { name: "clear", icon: "trash-2", color: "#6b7280" },
    ];

    states.forEach((state) => {
      const button = document.createElement("button");
      button.className = "attendance-state-btn";
      button.innerHTML = `<i data-feather="${state.icon}"></i>`;
      button.style.color = state.color;

      button.addEventListener("click", () => {
        this.selectedCells.forEach((cell) => {
          states.forEach((s) => cell.classList.remove(s.name));
          cell.innerHTML = "";

          if (state.name !== "clear") {
            cell.classList.add(state.name);
            const icon = document.createElement("i");
            icon.setAttribute("data-feather", state.icon);
            icon.style.color = state.color;
            cell.appendChild(icon);

            this.saveAttendanceState(
              cell.dataset.student,
              cell.dataset.date,
              state.name
            );
          } else {
            this.saveAttendanceState(
              cell.dataset.student,
              cell.dataset.date,
              null
            );
          }
        });

        feather.replace();
        floatingContainer.remove();
        this.selectedCells.clear();
        document
          .querySelectorAll(".attendance-cell")
          .forEach((c) => c.classList.remove("selected"));
      });

      floatingContainer.appendChild(button);
    });

    const rect = this.lastSelectedCell.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    floatingContainer.style.top = `${rect.top + scrollTop - 50}px`;
    floatingContainer.style.left = `${rect.left + scrollLeft - 50}px`;

    document.body.appendChild(floatingContainer);

    feather.replace();

    document.addEventListener(
      "click",
      function closeFloating(event) {
        const isClickInsideCell = Array.from(this.selectedCells).some((cell) =>
          cell.contains(event.target)
        );
        if (!floatingContainer.contains(event.target) && !isClickInsideCell) {
          floatingContainer.remove();
          this.selectedCells.clear();
          document
            .querySelectorAll(".attendance-cell")
            .forEach((c) => c.classList.remove("selected"));
        }
      }.bind(this)
    );
  }

  generateTable() {
    const month = parseInt(this.monthSelect.value);
    const year = parseInt(this.yearSelect.value);
    const daysInMonth = this.getDaysInMonth(month, year);
    const isProfessor = this.sessionType === 2;

    let tableHTML = ``;

    if (isProfessor) {
      tableHTML += `
                <div class="attendance-controls" style="display: flex;justify-content:flex-start;">
                    <button class="save-attendance btn btn-primary" disabled>Save Changes</button>
                    <button class="discard-attendance btn btn-secondary" disabled>Discard Changes</button>
                </div>
            `;
    }

    tableHTML += `
            <table class="attendance-table">
                <thead>
                    <tr>
                        <th class="student-name-header">Student Name</th>
        `;

    for (let day = 1; day <= daysInMonth; day++) {
      tableHTML += `<th class="date-header">${day}</th>`;
    }

    tableHTML += `<th class="summary-header">Summary (P/A/L)</th></tr></thead><tbody>`;

    this.displayStudents.forEach((student) => {
      tableHTML += `
                <tr>
                    <td class="student-name">${student.displayName}</td>
            `;

      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;
        const state = this.getAttendanceState(student.user_id, date);
        const stateClass = state ? ` ${state}` : "";
        const stateIcon = state
          ? `<i data-feather="${this.getIconForState(
              state
            )}" style="color: ${this.getColorForState(state)}"></i>`
          : "";

        const interactiveAttrs = isProfessor
          ? `tabindex="0" class="attendance-cell${stateClass}"`
          : `class="attendance-cell-readonly${stateClass}"`;

        tableHTML += `
                    <td ${interactiveAttrs}
                        data-student="${student.user_id}" 
                        data-date="${date}">
                        ${stateIcon}
                    </td>
                `;
      }

      tableHTML += `<td class="summary-cell" data-student="${student.user_id}"></td></tr>`;
    });

    tableHTML += `</tbody></table>`;

    this.wrapper.innerHTML = tableHTML;
    feather.replace();

    this.originalAttendanceData = JSON.parse(
      JSON.stringify(this.attendanceData)
    );
    this.hasChanges = false;

    if (this.sessionType === 2) {
      document
        .querySelector(".save-attendance")
        ?.addEventListener("click", () => this.saveChanges());
      document
        .querySelector(".discard-attendance")
        ?.addEventListener("click", () => this.discardChanges());

      const cells = document.querySelectorAll(".attendance-cell");

      cells.forEach((cell) => {
        cell.addEventListener("mousedown", (e) => {
          this.isMouseDown = true;
          this.toggleCellSelection(cell, e);
        });

        cell.addEventListener("mouseover", (e) => {
          if (this.isMouseDown) {
            this.toggleCellSelection(cell, e);
          }
        });

        cell.addEventListener("keydown", (e) => {
          const currentIndex = Array.from(cells).indexOf(cell);
          let nextIndex;

          switch (e.key) {
            case "ArrowLeft":
              nextIndex = currentIndex - 1;
              break;
            case "ArrowRight":
              nextIndex = currentIndex + 1;
              break;
            case "ArrowUp":
              nextIndex = currentIndex - daysInMonth;
              break;
            case "ArrowDown":
              nextIndex = currentIndex + daysInMonth;
              break;
            case " ":
              this.toggleCellSelection(cell, e);
              break;
            case "Alt":
              if (this.selectedCells.has(cell)) {
                this.selectedCells.delete(cell);
                cell.classList.remove("selected");
                if (this.selectedCells.size === 0) {
                  document
                    .querySelectorAll(".attendance-floating-container")
                    .forEach((container) => {
                      container.remove();
                    });
                }
              }
              break;
          }

          if (nextIndex >= 0 && nextIndex < cells.length) {
            cells[nextIndex].focus();
            if (e.shiftKey) {
              this.toggleCellSelection(cells[nextIndex], e);
            }
          }
        });
      });
    }

    this.updateSummary();
  }
}

function Attendance() {
  const attendanceContainers = document.querySelectorAll(
    ".attendance-table-container"
  );
  const attendanceMenu = document.querySelector(".attendance-menu");

  // Handle attendance menu
  attendanceMenu.addEventListener("click", (e) => {
    console.log(e.target);
    if (e.target.classList.contains("subject-tab")) {
      const subject = e.target.dataset.subject;

      console.log(subject);
      document
        .querySelectorAll(".subject-tab")
        .forEach((tab) => tab.classList.remove("active"));
      document
        .querySelectorAll(".subject-attendance")
        .forEach((attendance) => attendance.classList.remove("active"));

      e.target.classList.add("active");
      document
        .querySelector(`.subject-attendance[data-subject="${subject}"]`)
        .classList.add("active");

      // console.log(subject);
    }
  });

  attendanceContainers.forEach((container) => {
    const sectionSubjectId = container.dataset.subjectId;
    GetSectionStudents(sectionSubjectId).then(
      (students) =>
        new AttendanceManager({ container, sectionSubjectId, students })
    );
  });
}

// Handle cards functionality
function Cards() {
  const cards = document.querySelectorAll(
    ".cards-flex-container .card-flex-container.main"
  );

  const content = document.querySelector(".main-content");
  const content2 = document.querySelector(".main-content.two");

  const advisor_cards = document.querySelectorAll(
    ".cards-flex-container .card-flex-container.advisor"
  );

  function GetClassContent(id, professor_id, is_adviser) {
    return new Promise((resolve) => {
      Ajax({
        url: "/components/popup/classes/getClassContent",
        type: "POST",
        data: { id, professor_id, is_adviser },
        success: resolve,
      });
    });
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      GetClassContent(card.dataset.id, card.dataset.professor_id, false).then(
        (res) => {
          if (content2) {
            content2.remove();
          }
          addHtml(content, res);
          Tabs();
          Resources();
          Activities();
          Exams();
          Grades();
          StickyNotes();
          Attendance();
        }
      );
    });
  });

  advisor_cards.forEach((card) => {
    card.addEventListener("click", function () {
      GetClassContent(card.dataset.id, card.dataset.professor_id, true).then(
        (res) => {
          content2.remove();
          addHtml(content, res);
          Tabs();
          ManageStudentTabs();
          StickyNotes();
        }
      );
    });
  });
}

function ManageStudentTabs() {
  const showBtn = document.querySelector(".show-irregular-students");
  const section_id = showBtn.dataset.section_id;

  showBtn.addEventListener("click", function () {
    const popup = new Popup(
      `${"sections"}/view_irregulars`,
      { section_id },
      {
        backgroundDismiss: false,
      }
    );

    popup.Create().then(() => {
      popup.Show();

      ManageStudentsTable(popup.ELEMENT, section_id);
    });
  });
}

function ManageStudentsSubjectsTable(element, section_id, student_id) {
  const TABLE = element.querySelector(".main-table-container.table-component");

  if (!TABLE) return;

  const TABLE_LISTENER = new TableListener(TABLE);

  function _Add() {
    SelectSomething(
      "sections/select_subject",
      "section_subjects",
      "SECTION_SUBJECT_CONTROL",
      { section_id },
      false
    ).then((subjects) => {
      const popup = new AlertPopup(
        {
          primary: `Select Subjects`,
          secondary: `${subjects.length} selected`,
          message: `These subjects will appear on student subjects!`,
        },
        {
          alert_type: AlertTypes.YES_NO,
        }
      );

      popup.AddListeners({
        onYes: () => {
          console.log(subjects);

          Promise.all(
            subjects.map(async (subject) =>
              AddRecord("section_student_irregular_subjects", {
                data: JSON.stringify({
                  section_student_id: student_id,
                  section_subject_id: subject.section_subject_id,
                }),
              })
            )
          ).then(() => location.reload());
        },
      });

      popup.Create().then(() => {
        popup.Show();
      });
    });
  }

  function _Remove(ids) {
    const popup = new AlertPopup(
      {
        primary: `Remove Subject?`,
        secondary: `${ids.length} selected`,
        message: `These subjects will remove on student subject list!`,
      },
      {
        alert_type: AlertTypes.YES_NO,
      }
    );

    popup.AddListeners({
      onYes: () => {
        RemoveRecordsBatch("section_student_irregular_subjects", {
          data: JSON.stringify(ids),
        }).then(() => location.reload());
      },
    });

    popup.Create().then(() => {
      popup.Show();
    });
  }

  TABLE_LISTENER.addListeners({
    none: {
      remove: ["delete-request", "view-request"],
      view: ["add-request"],
    },
    select: {
      view: ["delete-request", "view-request"],
    },
    selects: {
      view: ["delete-request"],
      remove: ["view-request"],
    },
  });

  TABLE_LISTENER.init();

  TABLE_LISTENER.listen(() => {
    TABLE_LISTENER.addButtonListener([
      {
        name: "add-request",
        action: _Add,
        single: true,
      },
      {
        name: "delete-request",
        action: _Remove,
        single: false,
      },
    ]);
  });
}

function ManageStudentsTable(element, section_id) {
  const TABLE = element.querySelector(".main-table-container.table-component");

  if (!TABLE) return;

  const TABLE_LISTENER = new TableListener(TABLE);

  function _Add() {
    SelectSomething(
      "sections/select_student",
      "section_students",
      "SECTION_STUDENT_CONTROL",
      { section_id },
      false
    ).then((students) => {
      const popup = new AlertPopup(
        {
          primary: `Set as Irregular?`,
          secondary: `${students.length} selected`,
          message: `These students will became irregular!`,
        },
        {
          alert_type: AlertTypes.YES_NO,
        }
      );

      popup.AddListeners({
        onYes: () => {
          EditRecords(
            "section_students",
            students.map((st) => {
              return {
                id: st.section_student_id,
                data: JSON.stringify({
                  irregular: "irregular",
                }),
              };
            })
          ).then(() => location.reload());
        },
      });

      popup.Create().then(() => {
        popup.Show();
      });
    });
  }

  function _Remove(ids) {
    const popup = new AlertPopup(
      {
        primary: `Set as Regular?`,
        secondary: `Back to regular students`,
        message: `These students will became irregular!`,
      },
      {
        alert_type: AlertTypes.YES_NO,
      }
    );

    popup.AddListeners({
      onYes: () => {
        EditRecords(
          "section_students",
          ids.map((st) => {
            return {
              id: st,
              data: JSON.stringify({
                irregular: "regular",
              }),
            };
          })
        ).then(() => location.reload());
      },
    });

    popup.Create().then(() => {
      popup.Show();
    });
  }

  function _View(section_student_id) {
    const popup = new Popup(
      `${"sections"}/view_irregular_student_subjects`,
      { section_student_id },
      {
        backgroundDismiss: false,
      }
    );

    popup.Create().then(() => {
      popup.Show();

      ManageStudentsSubjectsTable(
        popup.ELEMENT,
        section_id,
        section_student_id
      );
    });
  }

  TABLE_LISTENER.addListeners({
    none: {
      remove: ["delete-request", "view-request"],
      view: ["add-request"],
    },
    select: {
      view: ["delete-request", "view-request"],
    },
    selects: {
      view: ["delete-request"],
      remove: ["view-request"],
    },
  });

  TABLE_LISTENER.init();

  TABLE_LISTENER.listen(() => {
    TABLE_LISTENER.addButtonListener([
      {
        name: "add-request",
        action: _Add,
        single: true,
      },
      {
        name: "view-request",
        action: _View,
        single: true,
      },
      {
        name: "delete-request",
        action: _Remove,
        single: false,
      },
    ]);
  });
}

// Handle tabs functionality
function Tabs() {
  const tabItems = document.querySelectorAll(".tab-item");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const topicHeaders = document.querySelectorAll(".topic-header");

  topicHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const resources = header.nextElementSibling;
      resources.style.display =
        resources.style.display === "none" ? "block" : "none";
    });
  });

  tabItems.forEach((item) => {
    item.addEventListener("click", function () {
      const tabId = this.dataset.tab;
      tabItems.forEach((tab) => tab.classList.remove("active"));
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      this.classList.add("active");
      const targetTab = document.getElementById(tabId);
      if (targetTab) {
        targetTab.classList.add("active");
      }
    });
  });
}

// Initialize application
function Init() {
  Cards();
}

document.addEventListener("DOMContentLoaded", Init);
