import Popup from "../../../classes/components/Popup.js";
import {
  append,
  CreateElement,
  GetComboValue,
  ListenToForm,
  MakeID,
  ManageComboBoxes,
  Ajax,
  ToData,
} from "../../../modules/component/Tool.js";
import {
  AddRecord,
  PostContainerRequest,
  PostRequest,
  UploadFileFromFile,
} from "../../../modules/app/SystemFunctions.js";
import { SelectModel } from "../../../modules/app/Administrator.js";
import {
  NewNotification,
  NotificationType,
} from "../../../classes/components/NotificationPopup.js";
import AlertPopup, {
  AlertTypes,
} from "../../../classes/components/AlertPopup.js";
const TARGET = "posts";
const MINI_TARGET = "post";
const MAIN_TITLE = "Post";

function ListenToDropZone(drop_zone, callback) {
  drop_zone.addEventListener("drop", dropHandler);
  drop_zone.addEventListener("dragover", dragOverHandler);

  function dragOverHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  function dropHandler(ev) {
    ev.preventDefault();

    if (!ev.dataTransfer.items.length) return;

    const items = [...ev.dataTransfer.items].map((file) => file.getAsFile());

    callback(items);
  }
}

function PublishPost(data) {
  return new Promise((resolve) => {
    if (data.section_subject_id == "") {
      delete data.section_subject_id;
    }

    AddRecord(TARGET, { data: JSON.stringify(data) }).then((res) => {
      NewNotification(
        {
          title: res.code === 200 ? "Success" : "Failed",
          message:
            res.code === 200 ? "Successfully Added" : "Task Failed to perform!",
        },
        3000,
        res.code === 200 ? NotificationType.SUCCESS : NotificationType.ERROR
      );

      resolve();
    });
  });
}

function PublishAnnouncement(data) {
  return new Promise((resolve) => {
    AddRecord("announcements", { data: JSON.stringify(data) }).then((res) => {
      NewNotification(
        {
          title: res.code === 200 ? "Success" : "Failed",
          message:
            res.code === 200 ? "Successfully Added" : "Task Failed to perform!",
        },
        3000,
        res.code === 200 ? NotificationType.SUCCESS : NotificationType.ERROR
      );

      resolve();
    });
  });
}

function PublishEvent(data) {
  return new Promise((resolve) => {
    AddRecord("events", { data: JSON.stringify(data) }).then((res) => {
      NewNotification(
        {
          title: res.code === 200 ? "Success" : "Failed",
          message:
            res.code === 200 ? "Successfully Added" : "Task Failed to perform!",
        },
        3000,
        res.code === 200 ? NotificationType.SUCCESS : NotificationType.ERROR
      );

      resolve();
    });
  });
}

function CreateNewPost(section_subject_id) {
  const popup = new Popup(`${TARGET}/create_new_${MINI_TARGET}`, null, {
    backgroundDismiss: false,
  });

  popup.Create().then((pop) => {
    popup.Show();

    const editor = popup.ELEMENT.querySelector("#editor");
    const drop_zone = popup.ELEMENT.querySelector("#drop_zone");
    const post_gallery = popup.ELEMENT.querySelector(".post-gallery");
    const form = popup.ELEMENT.querySelector("form.form-control");
    const post_type = popup.ELEMENT.querySelector(".post_type");

    const sp = new Splide(post_gallery);

    const uploadedFiles = [];

    sp.mount();

    ClassicEditor.create(editor).catch((error) => {
      console.error(error);
    });

    ListenToDropZone(drop_zone, function (files) {
      if (!post_gallery.classList.contains("show")) {
        post_gallery.classList.add("show");
      }

      files.forEach((file) => {
        sp.add(
          CreateElement({
            el: "IMG",
            className: "splide__slide",
            attr: {
              src: URL.createObjectURL(file),
            },
          })
        );

        uploadedFiles.push(file);
      });
    });

    ListenToForm(form, function (data) {
      return new Promise((resolve, reject) => {
        if (uploadedFiles.length > 0) {
          Promise.all(
            [...uploadedFiles].map(async (file) => {
              return await UploadFileFromFile(
                file,
                MakeID(),
                "public/assets/media/uploads/"
              ).then((res) => res.body.path);
            })
          ).then((fff) => {
            return PublishPost({
              content: data.content,
              post_type: post_type ? GetComboValue(post_type).value : 2,
              files: fff,
              section_subject_id,
            })
              .then(resolve)
              .finally(() => popup.Remove());
          });
        } else {
          PublishPost({
            content: data.content,
            post_type: post_type ? GetComboValue(post_type).value : 2,
            section_subject_id,
          })
            .then(resolve)
            .finally(() => popup.Remove());
        }
      });
    });

    ManageComboBoxes();
  });
}

export function CreateNewEvent() {
  const popup = new Popup(`events/add_new_event`, null, {
    backgroundDismiss: false,
  });

  popup.Create().then((pop) => {
    popup.Show();

    const editor = popup.ELEMENT.querySelector("#editor");
    const form = popup.ELEMENT.querySelector("form.form-control");

    ClassicEditor.create(editor).catch((error) => {
      console.error(error);
    });

    ListenToForm(
      form,
      function (data) {
        new Promise((resolve) => {
          if (data.poster.name) {
            UploadFileFromFile(
              data.poster,
              MakeID(),
              "public/assets/media/uploads/"
            ).then((res) => {
              data.poster = res.body.path;

              resolve();
            });
          } else {
            delete data.poster;

            resolve();
          }
        }).then(() => {
          PublishEvent(data).then(() => {
            popup.Remove();

            location.reload();
          });
        });
      },
      ["poster"]
    );
  });
}

function CreateNewAnnouncement() {
  const popup = new Popup(`announcement/add_new_announcement`, null, {
    backgroundDismiss: false,
  });

  popup.Create().then((pop) => {
    popup.Show();

    const editor = popup.ELEMENT.querySelector("#editor");
    const form = popup.ELEMENT.querySelector("form.form-control");

    ClassicEditor.create(editor).catch((error) => {
      console.error(error);
    });

    ListenToForm(form, function (data) {
      PublishAnnouncement(data).then(() => {
        popup.Remove();

        location.reload();
      });
    });
  });
}

function LikeAPost(post_id) {
  return new Promise((resolve) => {
    AddRecord("post_likes", { data: JSON.stringify({ post_id }) }).then(
      resolve
    );
  });
}

function CreateNewComment(post_id, comment) {
  return new Promise((resolve) => {
    AddRecord("post_comments", {
      data: JSON.stringify({ post_id, comment }),
    }).then(resolve);
  });
}

function RenderPostSubjects(subject_id) {
  const renderedPosts = document.querySelector(".rendered-posts");
  const subjectName = document.querySelector("#subject-name");
  const subjectProfessor = document.querySelector("#subject-professor");
  const subjectStudent = document.querySelector("#subject-student");

  return new Promise((resolve) => {
    Ajax({
      url: `/components/containers/global/getSubjectPosts`,
      type: "POST",
      data: ToData({ subject_id }),
      success: (html) => {
        SelectModel(subject_id, "SECTION_SUBJECT_CONTROL").then((res) => {
          subjectName.innerText = res.subject.subject_name;
          subjectProfessor.innerText = res.professor.displayName;
          subjectStudent.innerText = res.student_count;
        });

        renderedPosts.innerHTML = html;

        const posts = renderedPosts.querySelectorAll(".post-container");

        for (const post of posts) {
          ListenToPost(post);
        }

        resolve(html);
      },
    });
  });
}

function GetCurrentSubjectID() {
  return document.querySelector(".subject-item.active").dataset.subjectId;
}

function ManagePostSubjects() {
  const subjectItems = document.querySelectorAll(".subject-item");

  if (subjectItems.length) {
    for (const subjectItem of subjectItems) {
      const subjectID = subjectItem.dataset.subjectId;

      subjectItem.addEventListener("click", function () {
        subjectItems.forEach((item) => {
          item.classList.remove("active");
        });

        subjectItem.classList.add("active");

        RenderPostSubjects(subjectID).then((html) => {
          // console.log(html);
        });
      });
    }

    ManageScrollInfiniteSubjectPosts();
  }
}

function HandleDeletePost(post_id) {
  return new Promise((resolve) => {
    PostRequest("RequestDeletePost", {post_id}).then(resolve);
  })
}

function HandleDeleteComment(post_id, comment_id) {
  return new Promise((resolve) => {
    console.log(post_id, comment_id)
    PostRequest("RequestDeleteComment", {
      post_id: post_id,
      comment_id: comment_id
    }).then(resolve);
  });
}


function ListenToPost(post) {
  const splide = post.querySelector(".splide.user-post-gallery");
  const postMedia = post.querySelector(".post-media");
  const likeButton = post.querySelector(".like-button");
  const likeCount = post.querySelector(".reaction-content-result span");
  const commentButton = post.querySelector(".comment-button");
  const commentInput = post.querySelector(".comment-input input");
  const ellipsisButton = post.querySelector(".ellipsis-button");
  const floatingContainer = post.querySelector(".floating-actions-container");
  const deleteButton = post.querySelector(".delete-post");
  const deleteCommentButtons = post.querySelectorAll(".delete-comment");

  if (splide && postMedia) {
    const ss = new Splide(splide);
    ss.mount();
  }

  function UpdateLikeButton(code) {
    if (code == 200) {
      likeButton.classList.add("active");
    } else {
      likeButton.classList.remove("active");
    }
  }

  if (commentButton) {
    commentButton.addEventListener("click", function () {
      commentInput.focus();
    });
  }

  if (commentInput) {
    commentInput.addEventListener("keypress", function (ev) {
      if (ev.key == "Enter") {
        CreateNewComment(post.dataset.id, commentInput.value);
        commentInput.value = "";
      }
    });
  }

  if (likeButton) {
    likeButton.addEventListener("click", function () {
      LikeAPost(post.dataset.id).then((res) => {
        UpdateLikeButton(res.code);

        likeCount.textContent = `${res.body.likes} People like this`;

        if (res.body.likes == 0) {
          likeCount.parentElement.classList.add("hide-component");
        } else {
          likeCount.parentElement.classList.remove("hide-component");
        }
      });
    });
  }

  if (ellipsisButton && floatingContainer) {
    ellipsisButton.addEventListener("click", function(e) {
      e.stopPropagation();
      floatingContainer.classList.toggle("show");
    });

    // Close floating container when clicking outside
    document.addEventListener("click", function(e) {
      if (!floatingContainer.contains(e.target) && !ellipsisButton.contains(e.target)) {
        floatingContainer.classList.remove("show");
      }
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener("click", function() {
      const popup = new AlertPopup(
        {
          primary: "Delete Post?",
          secondary: "Are you sure you want to delete this post?",
          message: "This action cannot be undone.",
        },
        {
          alert_type: AlertTypes.YES_NO,
        }
      );

      popup.AddListeners({
        onYes: () => {
          HandleDeletePost(post.dataset.id).then((r) => {
            console.log(r)
            post.remove();
            NewNotification(
              {
                title: "Success",
                message: "Post deleted successfully",
              },
              3000,
              NotificationType.SUCCESS
            );
          });
        },
      });

      popup.Create().then((popup) => {
        popup.Show();
      });
    });
  }

  if (deleteCommentButtons) {
    deleteCommentButtons.forEach(button => {
      button.addEventListener("click", function() {
        const commentItem = button.closest(".comment-item");
        const commentId = commentItem.dataset.id;

        const popup = new AlertPopup(
          {
            primary: "Delete Comment?",
            secondary: "Are you sure you want to delete this comment?",
            message: "This action cannot be undone.",
          },
          {
            alert_type: AlertTypes.YES_NO,
          }
        );

        popup.AddListeners({
          onYes: () => {
            HandleDeleteComment(post.dataset.id, commentId).then(() => {
              commentItem.remove();
              NewNotification(
                {
                  title: "Success", 
                  message: "Comment deleted successfully"
                },
                3000,
                NotificationType.SUCCESS
              );
            });
          },
        });

        popup.Create().then((popup) => {
          popup.Show();
        });
      });
    });
  }
}

function LoadMorePosts(page, isSubject) {
  return new Promise((resolve) => {
    if (!isSubject) {
      PostContainerRequest("getInfinitePosts", { page }).then((html) => {
        resolve(html);
      });
    } else {
      PostContainerRequest("getInfiniteSubjectPosts", {
        page,
        subjectID: GetCurrentSubjectID(),
      }).then((html) => {
        resolve(html);
      });
    }
  });
}

function ManageScrollInfiniteSubjectPosts() {
  const container = document.querySelector(".newsfeed-main-container");

  let page = 1;
  let loading = false;

  // Create a sentinel element to detect when we're near the bottom
  const sentinel = document.createElement("div");
  sentinel.className = "scroll-sentinel";
  sentinel.style.height = "1px";
  container.appendChild(sentinel);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !loading) {
        loading = true;
        page++;

        LoadMorePosts(page, true).then((html) => {
          container.insertAdjacentHTML("beforeend", html);

          const newPosts = container.querySelectorAll(
            ".post-container:not([data-initialized])"
          );

          newPosts.forEach((post) => {
            ListenToPost(post);
            post.setAttribute("data-initialized", "true");
          });

          loading = false;
        });
      }
    });
  });

  observer.observe(sentinel);
}

function ListenToScrollInfinitePosts() {
  const container = document.querySelector(".newsfeed-main-container");

  let page = 1;
  let loading = false;

  // Create a sentinel element to detect when we're near the bottom
  const sentinel = document.createElement("div");
  sentinel.className = "scroll-sentinel";
  sentinel.style.height = "1px";
  container.appendChild(sentinel);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !loading) {
        loading = true;
        page++;

        // TODO: Add API call to load more posts
        // After loading posts:
        // loading = false;

        LoadMorePosts(page).then((html) => {
          container.insertAdjacentHTML("beforeend", html);

          // Get all new post containers that were just added
          const newPosts = container.querySelectorAll(
            ".post-container:not([data-initialized])"
          );

          // Initialize each new post
          newPosts.forEach((post) => {
            ListenToPost(post);
            post.setAttribute("data-initialized", "true");
          });

          loading = false;
        });
      }
    });
  });

  observer.observe(sentinel);
}

function ManageAllPosts() {
  const posts = document.querySelectorAll(".post-container");
  const creator = document.querySelector(".announcement-creator");
  const eventCreator = document.querySelector(".event-creator");
  // const announcement

  for (const post of posts) {
    ListenToPost(post);
    post.setAttribute("data-initialized", "true");
  }

  if (creator) {
    creator.addEventListener("click", function () {
      CreateNewAnnouncement();
    });
  }

  if (eventCreator) {
    eventCreator.addEventListener("click", function () {
      CreateNewEvent();
    });
  }

  ListenToScrollInfinitePosts();
}

function ManageScrollNewsfeedContent() {
  const mainBodyContentParent = document.querySelector(
    ".main-body-content-parent"
  );
  const newsfeedMainContainer = document.querySelector(
    ".newsfeed-announcement"
  );

  // Set overflow-y to allow vertical scrolling only but hide scrollbar
  newsfeedMainContainer.style.overflowY = "scroll";
  newsfeedMainContainer.style.overflowX = "hidden";
  newsfeedMainContainer.style.scrollbarWidth = "none"; // Firefox
  newsfeedMainContainer.style.msOverflowStyle = "none"; // IE/Edge

  // Hide webkit scrollbar
  newsfeedMainContainer.style.cssText += `
        &::-webkit-scrollbar {
            display: none;
        }
    `;

  // Set a max height to enable scrolling
  newsfeedMainContainer.style.maxHeight = "calc(100vh - 100px)"; // Adjust value as needed

  mainBodyContentParent.addEventListener("scroll", function () {
    newsfeedMainContainer.scrollTop = mainBodyContentParent.scrollTop;
  });
}

function Init() {
  const creator = document.querySelector(".post-creator-container");

  if (creator) {
    const creatorTextArea = creator.querySelector(".textarea-container");
    // const subject_id = document.querySelector(".newsfeed-main-container").dataset.subjectId;

    const subjectMenu = document.querySelector(".subject-menu");

    if (creatorTextArea) {
      creatorTextArea.addEventListener("click", function () {
        const itemsActive = subjectMenu
          ? subjectMenu.querySelector(".subject-item.active")
          : null;
        const subject_id = itemsActive ? itemsActive.dataset.subjectId : null;
        CreateNewPost(subject_id);
      });
    }
  }

  ManageAllPosts();
  ManagePostSubjects();
  ManageScrollNewsfeedContent();
}

document.addEventListener("DOMContentLoaded", Init);
