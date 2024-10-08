import Popup from "../../../classes/components/Popup.js";
import {
    append,
    CreateElement,
    GetComboValue,
    ListenToForm,
    MakeID,
    ManageComboBoxes
} from "../../../modules/component/Tool.js";
import {AddRecord, UploadFileFromFile} from "../../../modules/app/SystemFunctions.js";
import {NewNotification, NotificationType} from "../../../classes/components/NotificationPopup.js";

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
        AddRecord(TARGET, {data: JSON.stringify(data)}).then((res) => {
            NewNotification({
                title: res.code === 200 ? 'Success' : 'Failed',
                message: res.code === 200 ? 'Successfully Added' : 'Task Failed to perform!'
            }, 3000, res.code === 200 ? NotificationType.SUCCESS : NotificationType.ERROR)
        })
    })
}

function PublishAnnouncement(data) {
    return new Promise((resolve) => {
        AddRecord("announcements", {data: JSON.stringify(data)}).then((res) => {
            console.log(data)
            // NewNotification({
            //     title: res.code === 200 ? 'Success' : 'Failed',
            //     message: res.code === 200 ? 'Successfully Added' : 'Task Failed to perform!'
            // }, 3000, res.code === 200 ? NotificationType.SUCCESS : NotificationType.ERROR)
        })
    })
}

function CreateNewPost() {

    // console.log(Macy)
    const popup = new Popup(`${TARGET}/create_new_${MINI_TARGET}`, null, {
        backgroundDismiss: false,
    });

    popup.Create().then(((pop) => {
        popup.Show();

        const editor = popup.ELEMENT.querySelector("#editor");
        const drop_zone = popup.ELEMENT.querySelector("#drop_zone");
        const post_gallery = popup.ELEMENT.querySelector(".post-gallery");
        const form = popup.ELEMENT.querySelector("form.form-control");
        const post_type = popup.ELEMENT.querySelector(".post_type");

        const sp = new Splide(post_gallery);

        const uploadedFiles = [];

        sp.mount();

        ClassicEditor
            .create( editor )
            .catch( error => {
                console.error( error );
            } );

        ListenToDropZone(drop_zone, function (files) {

            if (!post_gallery.classList.contains("show")) {
                post_gallery.classList.add("show");
            }

            files.forEach((file) => {
                sp.add(CreateElement({
                    el:"IMG",
                    className:"splide__slide",
                    attr: {
                        src: URL.createObjectURL(file)
                    }
                }))

                uploadedFiles.push(file);
            });
        })
        
        ListenToForm(form, function (data) {
            return new Promise((resolve, reject) => {
                Promise.all([...uploadedFiles].map(async (file) => {
                    return await UploadFileFromFile(file, MakeID(), "public/assets/media/uploads/").then((res) => res.body.path);
                })).then((fff) => {
                    return PublishPost({
                        content: data.content,
                        post_type: GetComboValue(post_type).value,
                        files: fff
                    }).then(resolve).finally(() => popup.Remove());
                })


            })
        })

        ManageComboBoxes();
    }));
}

function CreateNewAnnouncement() {
    const popup = new Popup(`announcement/add_new_announcement`, null, {
        backgroundDismiss: false,
    });

    popup.Create().then(((pop) => {
        popup.Show();

        const editor = popup.ELEMENT.querySelector("#editor");
        const form = popup.ELEMENT.querySelector("form.form-control");

        ClassicEditor
            .create( editor )
            .catch( error => {
                console.error( error );
            } );

        ListenToForm(form, function (data) {
            PublishAnnouncement(data);
        })
    }));
}

function ManageAllPosts() {
    const posts = document.querySelectorAll(".post-container");
    const creator = document.querySelector(".announcement-creator");
    // const announcement 

    for (const post of posts) {
        const splide = post.querySelector(".splide.user-post-gallery");

        const ss = new Splide(splide);

        ss.mount();
    }

    creator.addEventListener("click", function () {
        CreateNewAnnouncement();
    })
}


function Init() {
    const creator = document.querySelector(".post-creator-container");
    const creatorTextArea = creator.querySelector(".textarea-container");
    
    creatorTextArea.addEventListener("click", function () {
        CreateNewPost();
    })


    ManageAllPosts();
}

document.addEventListener("DOMContentLoaded", Init);