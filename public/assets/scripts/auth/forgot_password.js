import PINCodeEditor from "../classes/components/PINCodeEditor.js";
import {
    ConfirmAuthenticationVerification, SendVerificationToEmail,
    TryChangePassword, TryResetPassword
} from "../modules/app/Administrator.js";
import {ListenToForm} from "../modules/component/Tool.js";
import Popup from "../classes/components/Popup.js";
import {NewNotification, NotificationType} from "../classes/components/NotificationPopup.js";


function Init() {
    const form = document.querySelector("form.form-control");

    ListenToForm(form, function (data) {
        TryResetPassword(data).then((res) => {
            if (res.code === 200) {
                ManageEmailVerification(res.body.user_id, data);
            } else {
                NewNotification({
                    title: res.message,
                    message: res.message
                }, 3000, NotificationType.ERROR)
            }
        })
    })
}

function ManageChangePassword(user_id) {
    const popup = new Popup(`auth/change_password`, {user_id}, {
        backgroundDismiss: false,
    });

    popup.Create().then(() => {
        popup.Show();

        const form = popup.ELEMENT.querySelector("form.form-control");

        ListenToForm(form, function (data) {
            TryChangePassword({password: data.password, user_id}).then((res) => {
                NewNotification({
                    title: res.code == 200 ? "Password Changed" : "Failed",
                    message: res.message
                }, 3000, res.code == 200 ? NotificationType.SUCCESS : NotificationType.ERROR);

                popup.Remove();
            });
        }, [], [
            {input: "password", min: 8},
            {input: "confirm-password", min: 8,
                compare: "password"
            }
        ]);
    })
}

function ManageEmailVerification(user_id, mainData) {
    const popup = new Popup(`auth/confirm_verification`, {email_address: mainData.email}, {
        backgroundDismiss: false,
    });

    popup.Create().then(() => {
        popup.Show();

        const form = popup.ELEMENT.querySelector("form.form-control");
        const PINEDITOR = new PINCodeEditor(popup.ELEMENT.querySelector(".pin-code-editor"));

        const check = ListenToForm(form, function (data) {
            ConfirmAuthenticationVerification(user_id, data['pin-code']).then((res => {
                NewNotification({
                    title: res ? 'Verification Confirmed' : 'Failed',
                    message: res.message
                }, 3000, res  ? NotificationType.SUCCESS : NotificationType.ERROR)

                if (res) {
                    ManageChangePassword(user_id);
                    popup.Remove();
                } else {
                    PINEDITOR.shake();
                    PINEDITOR.reset();
                }
            }));
        },[],[{input: "pin-code", min: 6}]);

        PINEDITOR.listens();

        PINEDITOR.addListeners({
            onChange: (pin) => {
                check(true);
            }
        });
    })
}

Init();