import {
    PostRequest, UploadFileFromFile
} from "../../../modules/app/SystemFunctions.js";
import { NewNotification } from "../../../classes/components/NotificationPopup.js";

function toggleEdit() {
    const form = document.getElementById('profile-form');
    const info = document.getElementById('profile-info');
    
    if (form.style.display === 'none') {
        form.style.display = 'grid';
        info.style.display = 'none';
    } else {
        form.style.display = 'none';
        info.style.display = 'grid';
    }
}

function Init() {
    const editBtn = document.querySelector('.edit-btn');
    const inputFile = document.getElementById('avatar-upload');
    let avatarUpload = null;

    editBtn.addEventListener('click', toggleEdit);

    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const profileData = {
            displayName: formData.get('displayName'),
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'), 
            middlename: formData.get('middlename'),
            gender: formData.get('gender'),
            contact_number: formData.get('contact_number')
        };

        new Promise((resolve) => {
            if (avatarUpload) {
                UploadFileFromFile(avatarUpload, avatarUpload.name, "public/assets/media/uploads/").then((res) => {
                    if (res.code == 200) {
                        resolve({ code: 200, body: res.body });
                    } else {
                        resolve({ code: 300, body: { path: null } });
                    }
                });
            } else {
                resolve({ code: 300, body: { path: null } });
            }
        }).then((res) => {
            if (res.code == 200) {
                profileData.photo = res.body.path;
            }

            PostRequest("UpdateProfile", {data: JSON.stringify(profileData)}).then((res) => {
                NewNotification({
                    type: "Success",
                    message: "Profile updated successfully!",
                });

                toggleEdit();

                window.location.reload();
            });
        });
    });

    inputFile.addEventListener('change', function(e) {
        const file = e.target.files[0];

        if (file) {
            avatarUpload = file;

            // Preview the image
            const reader = new FileReader();

            reader.onload = function(e) {
                document.getElementById('avatar-preview').src = e.target.result;
            }

            reader.readAsDataURL(file);
        }
    });
}

Init();
