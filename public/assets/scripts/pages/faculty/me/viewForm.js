import { FormRenderer } from "../../../classes/components/FormCreator.js";
import { SelectModel } from "../../../modules/app/Administrator.js";
import { PostRequest } from "../../../modules/app/SystemFunctions.js";

export function GetFormData(formID) {
  return SelectModel(formID, "FORM_CONTROL");
}

export function GetAnswers(completionID) {
  return SelectModel(completionID, "FORM_COMPLETION_CONTROL");
}

function Init() {
  document.addEventListener("DOMContentLoaded", function () {
    try {
      const formID = document
        .querySelector("[data-form_id]")
        .getAttribute("data-form_id");
      const examID = document
        .querySelector("[data-exam_id]")
        .getAttribute("data-exam_id");
      const completionID = document
        .querySelector("[data-completion_id]")
        .getAttribute("data-completion_id");

      let formRenderer;

      GetFormData(formID).then((formData) => {
        GetAnswers(completionID).then((answers) => {
          formRenderer = new FormRenderer(
            "questionsContainer",
            formData,
            examID,
            answers.answers
          );

          // Initialize the check form functionality
          initCheckForm(examID, completionID);
        });
      });

      // Initialize the check result modal
      initCheckResultModal();
    } catch (error) {
      console.error("Error initializing form:", error);
    }
  });
}

function initCheckForm(examID, completionID) {
  const checkFormBtn = document.getElementById("checkFormBtn");

  if (checkFormBtn) {
    checkFormBtn.addEventListener("click", function () {
      // Show loading state
      checkFormBtn.disabled = true;
      checkFormBtn.innerHTML = '<i data-feather="loader"></i> Checking...';
      feather.replace();

      // Call the backend to check the form
      checkExam(examID, completionID)
        .then(displayCheckResults)
        .catch((error) => {
          console.error("Error checking form:", error);
          alert("An error occurred while checking the form. Please try again.");
        })
        .finally(() => {
          // Reset button state
          checkFormBtn.disabled = false;
          checkFormBtn.innerHTML =
            '<i data-feather="check-circle"></i> Check Form';
          feather.replace();
        });
    });
  }
}

function checkExam(examID, completionID) {
  return new Promise((resolve, reject) => {
    // Use the PostRequest function to call the CheckExam endpoint
    PostRequest("CheckExam", { exam_id: examID })
      .then((response) => {
        try {
          console.log("Raw response:", response);

          // Parse the response if it's a string
          let result;
          if (typeof response === "string") {
            result = JSON.parse(response);
          } else if (typeof response === "object") {
            result = response;
          } else {
            throw new Error("Invalid response format");
          }

          console.log("Parsed response:", result);

          if (result.code === 200) {
            // Find the result for the current completion in the response body
            const checks = result.body;

            if (Array.isArray(checks)) {
              const completionResult = checks.find(
                (item) => item.comply_id == completionID
              );

              console.log("Completion result:", completionResult);

              if (completionResult) {
                // Fix the specific issue with matching type answers in the datas field
                if (typeof completionResult.datas === "string") {
                  // Direct fix for the specific issue with matching type answers
                  if (completionResult.datas.includes('"["B","A"]"')) {
                    completionResult.datas = completionResult.datas.replace(
                      '"["B","A"]"',
                      '["B","A"]'
                    );
                  }

                  try {
                    // Try to parse it to validate it's proper JSON
                    JSON.parse(completionResult.datas);
                  } catch (parseError) {
                    console.error("Error parsing datas:", parseError);

                    // If there's an error, try to fix common JSON issues
                    try {
                      // Fix nested JSON strings issue
                      const fixedJson = completionResult.datas
                        .replace(/"(\[.*?\])"/g, "$1")
                        .replace(/\\"/g, '"');

                      // Validate the fixed JSON
                      JSON.parse(fixedJson);

                      // If successful, update the datas field
                      completionResult.datas = fixedJson;
                    } catch (e) {
                      console.error("Failed to fix JSON:", e);
                      // If all fixes fail, provide an empty array
                      completionResult.datas = JSON.stringify([]);
                    }
                  }
                }

                resolve(completionResult);
              } else {
                reject(new Error("No results found for this completion"));
              }
            } else {
              reject(
                new Error("Invalid response format: body is not an array")
              );
            }
          } else {
            reject(new Error(result.message || "Failed to check exam"));
          }
        } catch (error) {
          console.error("Error processing response:", error);
          reject(error);
        }
      })
      .catch(reject);
  });
}

function displayCheckResults(result) {
  const modal = document.getElementById("checkResultModal");
  const resultScore = document.getElementById("resultScore");
  const resultTotalPoints = document.getElementById("resultTotalPoints");
  const resultGrade = document.getElementById("resultGrade");
  const resultDetails = document.getElementById("resultDetails");

  // Clear previous results
  resultDetails.innerHTML = "";

  // Set summary information
  resultScore.textContent = Math.round(result.score * 100) / 100; // Round to 2 decimal places
  resultTotalPoints.textContent = result.total_points;
  resultGrade.textContent = Math.round(result.grade) + "%";

  // Add a note if the form was already checked
  if (result.already_checked) {
    const alreadyCheckedNote = document.createElement("p");
    alreadyCheckedNote.innerHTML =
      "<strong>Note:</strong> This form was already checked previously.";
    alreadyCheckedNote.style.color = "#3b82f6";
    alreadyCheckedNote.style.marginTop = "0.5rem";
    document.querySelector(".result-summary").appendChild(alreadyCheckedNote);
  }

  // Set grade color based on score
  if (result.grade >= 90) {
    resultGrade.style.color = "#10b981"; // Green for A
  } else if (result.grade >= 80) {
    resultGrade.style.color = "#3b82f6"; // Blue for B
  } else if (result.grade >= 70) {
    resultGrade.style.color = "#f59e0b"; // Yellow for C
  } else if (result.grade >= 60) {
    resultGrade.style.color = "#f97316"; // Orange for D
  } else {
    resultGrade.style.color = "#ef4444"; // Red for F
  }

  // Parse the detailed results
  try {
    // Check if datas is already an object or needs to be parsed
    let datas = [];

    if (typeof result.datas === "string") {
      try {
        datas = JSON.parse(result.datas);
      } catch (parseError) {
        console.error("Error parsing datas:", parseError);

        // Try to fix common JSON parsing issues
        if (result.datas.includes('"["') || result.datas.includes('"]"')) {
          // Fix nested JSON strings issue
          const fixedJson = result.datas
            .replace(/"\[\\"/g, "[")
            .replace(/\\"\]"/g, "]")
            .replace(/\\\\/g, "\\")
            .replace(/\\"/g, '"');

          // Additional fix for the specific matching type issue
          const matchingFix = fixedJson.replace(
            /"(\[.*?\])"/g,
            function (match, p1) {
              try {
                // Try to parse the inner content as JSON
                JSON.parse(p1);
                // If successful, return just the inner content
                return p1;
              } catch (e) {
                // If parsing fails, return the original match
                return match;
              }
            }
          );

          try {
            datas = JSON.parse(matchingFix);
          } catch (e) {
            console.error("Failed to fix JSON:", e);
          }
        }
      }
    } else if (Array.isArray(result.datas)) {
      datas = result.datas;
    }

    console.log("Parsed datas:", datas);

    if (!Array.isArray(datas) || datas.length === 0) {
      resultDetails.innerHTML = "<p>No detailed results available.</p>";
      modal.style.display = "flex";
      return;
    }

    // Create result items for each question
    datas.forEach((item, index) => {
      const questionResult = document.createElement("div");
      questionResult.className = "question-result";

      // Determine if the answer is correct
      let isCorrect = false;

      try {
        // Handle potential string JSON in user_answer
        let userAnswer = item.user_answer;
        if (typeof userAnswer === "string") {
          // Special handling for matching type answers
          if (userAnswer.startsWith("[") && userAnswer.endsWith("]")) {
            try {
              userAnswer = JSON.parse(userAnswer);
            } catch (e) {
              // If parsing fails, try to clean up the string
              try {
                const cleaned = userAnswer
                  .replace(/\\"/g, '"')
                  .replace(/^"/, "")
                  .replace(/"$/, "");
                userAnswer = JSON.parse(cleaned);
              } catch (e2) {
                console.warn("Could not parse user answer as JSON:", e2);
              }
            }
          }
        }

        if (Array.isArray(userAnswer) && Array.isArray(item.correct_answer)) {
          // For array answers (like matching or checkbox)
          isCorrect =
            JSON.stringify(userAnswer) === JSON.stringify(item.correct_answer);
        } else if (
          typeof item.correct_answer === "object" &&
          item.correct_answer !== null
        ) {
          // For text answers with keywords
          if (item.correct_answer.type === "keyword") {
            isCorrect = item.correct_answer.keywords.some((keyword) =>
              String(userAnswer).toLowerCase().includes(keyword.toLowerCase())
            );
          } else if (item.correct_answer.type === "specific") {
            isCorrect =
              String(userAnswer).toLowerCase() ===
              String(item.correct_answer.text).toLowerCase();
          }
        } else {
          // For simple answers
          isCorrect = String(userAnswer) === String(item.correct_answer);
        }

        questionResult.classList.add(isCorrect ? "correct" : "incorrect");
      } catch (error) {
        console.error("Error processing question result:", error, item);
        questionResult.classList.add("error");
      }

      // Create the question header
      const questionHeader = document.createElement("h4");
      questionHeader.textContent = `Question ${index + 1}`;
      questionResult.appendChild(questionHeader);

      // Create the answer comparison section
      const answerComparison = document.createElement("div");
      answerComparison.className = "answer-comparison";

      // User answer section
      const userAnswerSection = document.createElement("div");
      userAnswerSection.className = "user-answer";

      const userAnswerLabel = document.createElement("div");
      userAnswerLabel.className = "answer-label";
      userAnswerLabel.textContent = "Student's Answer:";
      userAnswerSection.appendChild(userAnswerLabel);

      const userAnswerValue = document.createElement("div");
      userAnswerValue.className = "answer-value";
      userAnswerValue.textContent = formatAnswer(item.user_answer);
      userAnswerSection.appendChild(userAnswerValue);

      // Correct answer section
      const correctAnswerSection = document.createElement("div");
      correctAnswerSection.className = "correct-answer";

      const correctAnswerLabel = document.createElement("div");
      correctAnswerLabel.className = "answer-label";
      correctAnswerLabel.textContent = "Correct Answer:";
      correctAnswerSection.appendChild(correctAnswerLabel);

      const correctAnswerValue = document.createElement("div");
      correctAnswerValue.className = "answer-value";
      correctAnswerValue.textContent = formatAnswer(item.correct_answer);
      correctAnswerSection.appendChild(correctAnswerValue);

      // Add sections to comparison
      answerComparison.appendChild(userAnswerSection);
      answerComparison.appendChild(correctAnswerSection);

      // Add comparison to result
      questionResult.appendChild(answerComparison);

      // Add to results container
      resultDetails.appendChild(questionResult);
    });
  } catch (error) {
    console.error("Error parsing result data:", error);
    resultDetails.innerHTML =
      "<p>Error displaying detailed results. Please try again or contact support.</p>";
  }

  // Show the modal
  modal.style.display = "flex";
}

function formatAnswer(answer) {
  if (answer === null || answer === undefined) {
    return "No answer provided";
  }

  // Try to parse JSON strings
  if (typeof answer === "string") {
    // Special handling for matching type answers with escaped quotes
    if (
      answer.includes('\\"') &&
      (answer.startsWith("[") || answer.includes('"['))
    ) {
      try {
        // Try to clean up the string
        const cleaned = answer
          .replace(/\\"/g, '"')
          .replace(/^"/, "")
          .replace(/"$/, "")
          .replace(/"\[/g, "[")
          .replace(/\]"/g, "]");

        const parsed = JSON.parse(cleaned);
        answer = parsed;
      } catch (e) {
        console.warn("Could not parse complex answer as JSON:", e);
        // If all else fails, just clean up the display
        answer = answer.replace(/\\"/g, '"');
      }
    }
    // Standard JSON parsing for normal cases
    else if (answer.startsWith("[") || answer.startsWith("{")) {
      try {
        const parsed = JSON.parse(answer);
        answer = parsed;
      } catch (e) {
        console.warn("Could not parse answer as JSON:", e);
      }
    }
  }

  if (Array.isArray(answer)) {
    return answer.join(", ");
  }

  if (typeof answer === "object") {
    if (answer.type === "keyword") {
      return `Keywords: ${answer.keywords.join(", ")}`;
    } else if (answer.type === "specific") {
      return answer.text;
    }
    return JSON.stringify(answer, null, 2);
  }

  return String(answer);
}

function initCheckResultModal() {
  const modal = document.getElementById("checkResultModal");
  const closeBtn = modal.querySelector(".close-result-btn");

  // Close modal when clicking the close button
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Close modal when clicking outside the content
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Close modal when pressing Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.style.display === "flex") {
      modal.style.display = "none";
    }
  });
}

Init();
