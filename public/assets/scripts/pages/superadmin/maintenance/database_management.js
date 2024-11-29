import AlertPopup, {AlertTypes} from "../../../classes/components/AlertPopup.js";
import { PostRequest } from "../../../modules/app/SystemFunctions.js";
import { NewNotification, NotificationType } from "../../../classes/components/NotificationPopup.js";

function ResetDatabase() {
    const popup = new AlertPopup({
        primary: "Reset Database?",
        secondary: "This will reset the database to its initial state.",
        message: "This action cannot be undone."
    }, {
        alert_type: AlertTypes.YES_NO
    });

    popup.AddListeners({
        onYes: () => {
            PostRequest("ResetDatabase", {}).then((res) => {
                console.log(res);
                NewNotification({
                    title: res.code == 200 ? 'Success' : 'Failed',
                    message: res.code == 200 ? 'Successfully Reset Database' : 'Task Failed to perform!'
                }, 3000, res.code == 200 ? NotificationType.SUCCESS : NotificationType.ERROR);
            });
        }
    });

    popup.Create().then((popup) => {
        popup.Show();
    });
}

document.querySelector(".reset-database-button").addEventListener("click", ResetDatabase);
