import PINCodeEditor from "../classes/components/PINCodeEditor.js";
import {
    AUTHENTICATION_TYPE, ConfirmAuthenticationVerification, SendVerificationToEmail,
    TryAuthenticate, TryFinalAuthenticate
} from "../modules/app/Administrator.js";
import {ApplyError, ListenToForm, ListenToThisCombo, ManageComboBoxes} from "../modules/component/Tool.js";
import Popup from "../classes/components/Popup.js";
import {NewNotification, NotificationType} from "../classes/components/NotificationPopup.js";


function Init() {
    const form = document.querySelector("form.form-control");
    const inputs = form.querySelectorAll('input');
    const loginAs = form.querySelector(".user_type");

    ListenToForm(form, function (data) {
        TryAuthenticate(data).then((res) => {
            if (res.code === 200) {
                const user = res.body.user;
                ManageEmailVerification(user.user_id, data);
            } else {
                ApplyError(['email', 'password'], inputs);

                document.querySelector('input[name=password]').value = "";
            }


            NewNotification({
                title:  res.code === 200 ? 'Verification Sent!' : 'Authentication Failed!',
                message: res.message
            }, 3000,  res.code === 200 ? NotificationType.SUCCESS : NotificationType.ERROR)
        })
    })

    ManageComboBoxes();

}

function DoFinalAuthenticate( user_id, mainData, code) {
    return new Promise((resolve) => {
        TryFinalAuthenticate(user_id,mainData, code).then((res) => {
            resolve(res);
        });
    })
}

function ManageEmailVerification( user_id, mainData) {
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
                    DoFinalAuthenticate(user_id, mainData, data['pin-code']).then((res) => {
                        popup.Remove();

                        if (res.code === 200) {
                            location.replace('/');
                        } else {
                            NewNotification({
                                title:  'Authentication Failed!',
                                message: res.message
                            }, 3000,  NotificationType.ERROR)
                        }
                    })

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