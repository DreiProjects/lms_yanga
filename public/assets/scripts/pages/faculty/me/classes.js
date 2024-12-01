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
  PostRequest,
  UploadFileFromFile,
} from "../../../modules/app/SystemFunctions.js";
import {
  SelectModels,
  SelectModel,
  SelectModelByFilter,
} from "../../../modules/app/Administrator.js";
import GradingPlatformEditor from "../../../classes/components/GradingPlatformEditor.js";
import StickyNoteEditor from "../../../classes/components/StickyNoteEditor.js";
import { SESSION } from "../../../modules/app/Application.js";
import { NewNotification } from "../../../classes/components/NotificationPopup.js";

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
  // Generate a random UUID for the exam session
  const uuid = crypto.randomUUID();

  // Open exam in new tab
  window.location.replace(`form/exam/${exam_id}/${uuid}`);
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
        JSON.stringify({ section_id: res.section_id }),
        "SECTION_STUDENT_CONTROL"
      ).then((students) => {
        const gradingEditor = new GradingPlatformEditor({
          container: platformContainer,
          students: students.map((student) => ({
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
    complyItems.forEach((item) => {
      item.addEventListener("click", () => {
        ViewCompletedForm(exam_id, item.dataset.id);
      });
    });
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
            if (res === 200) {
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
        JSON.stringify({ section_id: res.section_id }),
        "SECTION_STUDENT_CONTROL"
      ).then(resolve);
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
      const saveBtn = document.querySelector(".save-attendance");
      const discardBtn = document.querySelector(".discard-attendance");
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

    this.monthSelect = document.getElementById("monthSelect");
    this.yearSelect = document.getElementById("yearSelect");

    this.generateTable();
    this.setupEventListeners();
  }

  setupEventListeners() {
      this.monthSelect.addEventListener("change", () => this.generateTable());
      this.yearSelect.addEventListener("change", () => this.generateTable());

      document.querySelector(".prev-month").addEventListener("click", () => {
        let month = parseInt(this.monthSelect.value);
        let year = parseInt(this.yearSelect.value);
        console.log(month, year);

        month--;
        if (month < 1) {
          month = 12;
          year--;
          this.yearSelect.value = year;
        }
        this.monthSelect.value = month;
        this.generateTable();
      });

      document.querySelector(".next-month").addEventListener("click", () => {
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

      document.querySelector(".prev-year").addEventListener("click", () => {
        let year = parseInt(this.yearSelect.value);
        this.yearSelect.value = year - 1;
        this.generateTable();
      });

      document.querySelector(".next-year").addEventListener("click", () => {
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
    const saveBtn = document.querySelector(".save-attendance");
    const discardBtn = document.querySelector(".discard-attendance");

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

      const summaryCell = document.querySelector(
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
    ".cards-flex-container .card-flex-container"
  );
  const content = document.querySelector(".main-content");

  function GetClassContent(id, professor_id) {
    return new Promise((resolve) => {
      Ajax({
        url: "/components/popup/classes/getClassContent",
        type: "POST",
        data: { id, professor_id },
        success: resolve,
      });
    });
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      GetClassContent(card.dataset.id, card.dataset.professor_id).then(
        (res) => {
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
