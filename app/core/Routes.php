<?php

namespace Application\core;

use Application\abstracts\MessageAbstract;
use Application\controllers\app\Response;
use Application\controllers\system\MessageControl;
use Application\controllers\system\UserProfileControl;

class Routes
{
    protected $KLEIN;
    protected $CONNECT;
    protected $SESSION;
    protected $APPLICATION;

    public function __construct($APPLICATION)
    {
        global $CONNECTION;
        global $KLEIN;
        global $SESSION;

        $this->CONNECT = $CONNECTION;
        $this->KLEIN = $KLEIN;
        $this->SESSION = $SESSION;
        $this->APPLICATION = $APPLICATION;
    }

    public function loadRoutes(): void
    {
        $KLEIN = $this->KLEIN;
        $SESSION = $this->SESSION;

        // if no currently login in session
        if (!$SESSION->hasUser) {
            // routes for authentication
            $this->authenticationRoutes();
        } else if ($SESSION->isAdmin) {
            $this->applicationRoutes();
        }

        $this->apiRoutes();
        $this->toolRoutes();
        $this->componentsRoutes();
        $KLEIN->dispatch();
    }

    private function authenticationRoutes(): void
    {
        $KLEIN = $this->KLEIN;
        $SESSION = $this->SESSION;

        if (!$this->SESSION->hasUser){
            $KLEIN->with("", function () use ($KLEIN, $SESSION) {
                $KLEIN->respond("GET", "?", function ($req, $res) use ($SESSION) {
                    if (!$SESSION->hasUser) {
                        $res->redirect("/login");
                    }
                });

                $KLEIN->respond(
                    "GET",
                    "[/?|!@^/login]",
                    function ($req, $res) use ($SESSION) {
                        if ($SESSION->hasUser) {
                            $res->redirect("/");
                        } else {
                            return $res->redirect("/login");
                        }
                    }
                );


                $KLEIN->respond(
                    "GET",
                    "/[:page]",
                    function ($req, $res, $service) use ($SESSION) {
                        $view = $req->param("page");
                        $viewPath = "public/views/auth/" . $view . ".phtml";
                        $exist = file_exists($viewPath);

                        if ($exist) {
                            return $service->render($viewPath);
                        } else {
                            $res->redirect("/login");
                        }
                    }
                );

            });
        }
    }

    private function applicationRoutes(): void
    {
        $KLEIN = $this->KLEIN;

        $TYPE = $this->SESSION->typeName;

        if (!$this->APPLICATION->FUNCTIONS->USER_CONTROL->get($this->SESSION->user_id, false)) { 
            $this->SESSION->logout();
        }
        $this->KLEIN->with("", static function () use ($KLEIN, $TYPE) {
            $TYPE = strtolower($TYPE) == "admin" ? "super" : $TYPE;
            $defaultView = "public/views/pages/$TYPE/dashboard.phtml";
            $mustview = "public/views/pages/$TYPE/";

            $KLEIN->respond(
                "GET",
                "/?",
                static function ($req, $res, $service) use ($defaultView) {
                    return $service->render($defaultView, ["view_path" => "/"]);
                }
            );

            $KLEIN->respond(
                "GET",
                "/[:view]",
                static function ($req, $res, $service) use ($defaultView, $mustview) {
                    $view = $mustview . $req->param("view") . ".phtml";
                    $globalView = "public/views/pages/global/" . $req->param("view") . ".phtml";

                    if ($req->param("view") == "logout") {
                        $view = "public/views/pages/logout.phtml";
                    }

                    return $service->render(file_exists($view) ? $view : (file_exists($globalView) ? $globalView : $defaultView), ["view_path" => $req->param("view")]);
                }
            );

            $KLEIN->respond(
                "GET",
                "/[:view]/[:subview]",
                static function ($req, $res, $service) use ($defaultView, $mustview) {
                    $view = $mustview . $req->param("view") . "/" .$req->param("subview"). ".phtml";
                    $globalView = "public/views/pages/global/" . $req->param("view") . "/" . $req->param("subview") . ".phtml";

                    return $service->render(file_exists($view) ? $view : (file_exists($globalView) ? $globalView : $defaultView), ["view_path" => $req->param("view") . "/" .$req->param("subview")]);
                }
            );

            $KLEIN->respond(
                "GET",
                "/[:view]/[:subview]/[**:params]",
                static function ($req, $res, $service) use ($defaultView, $mustview) {
                    // First check if direct path exists
                    $fullPath = $req->param("params") ? 
                        $mustview . $req->param("view") . "/" . $req->param("subview") . "/" . $req->param("params") . ".phtml" :
                        $mustview . $req->param("view") . "/" . $req->param("subview") . ".phtml";
                    
                    // If direct path exists, render it
                    if (file_exists($fullPath)) {
                        return $service->render($fullPath, [
                            "view_path" => $req->param("view") . "/" . $req->param("subview") . "/" . $req->param("params")
                        ]);
                    }
                    
                    // Otherwise treat additional segments as parameters
                    $basePath = $mustview . $req->param("view") . "/" . $req->param("subview") . ".phtml";
                    
                    if (!file_exists($basePath)) {
                        return $service->render($defaultView, ["view_path" => $req->param("view")]);
                    }
                    
                    // Split the remaining path into parameters
                    $paramArray = $req->param("params") ? explode("/", $req->param("params")) : [];
                    
                    // Add numbered parameters to service data
                    $data = ["view_path" => $req->param("view") . "/" . $req->param("subview")];
                    foreach ($paramArray as $index => $param) {
                        $data["param" . ($index + 1)] = $param;
                    }
                    
                    return $service->render($basePath, $data);
                }
            );
        });
    }

    private function apiRoutes(): void
    {
        $KLEIN = $this->KLEIN;
        $APPLICATION = $this->APPLICATION;
        $SESSION = $this->SESSION;

        $this->KLEIN->with("/api", function () use ($KLEIN, $APPLICATION, $SESSION) {

            $this->KLEIN->with("/admin", function () use ($KLEIN, $APPLICATION) {
                $KLEIN->respond("/[:view]/updateRecords", function ($req, $res, $service) {
                    return $service->render("public/views/components/popup/" . $req->param("view") . '/updateRecords.phtml');
                }
                );

                $KLEIN->respond("/[:view]/searchRecords", function ($req, $res, $service) {
                    return $service->render("public/views/components/popup/" . $req->param("view") . '/searchRecords.phtml');
                }
                );

                $KLEIN->respond("/[:view]/filterRecords", function ($req, $res, $service) {
                    return $service->render("public/views/components/popup/" . $req->param("view") . '/filterRecords.phtml');
                }
                );

                $routes = [
                    "/users" => ["USER_CONTROL", "add", "editRecord", "removeRecords"],
                    "/sections" => ["SECTION_CONTROL", "addRecord", "edit", "removeRecords"],
                    "/posts" => ["POSTS_CONTROL", "add", "editRecord", "removeRecords"],
                    "/announcements" => ["ANNOUNCEMENT_CONTROL", "add", "editRecord", "removeRecords"],
                    "/courses" => ["COURSE_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/professors" => ["PROFESSOR_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/classrooms" => ["CLASSROOM_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/subjects" => ["SUBJECT_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/departments" => ["DEPARTMENT_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/section_subjects" => ["SECTION_SUBJECT_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/section_students" => ["SECTION_STUDENT_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/section_student_irregular_subjects" => ["SECTION_STUDENT_IRREGULAR_SUBJECT_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/staffs" => ["STAFF_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/schedules" => ["SCHEDULE_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/schedule_items" => ["SCHEDULE_ITEM_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/resource_groups" => ["RESOURCES_GROUP_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/resources" => ["RESOURCES_CONTROL", "add", "editRecord", "removeRecords"],
                    "/activities" => ["ACTIVITY_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/exams" => ["EXAM_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/sticky_notes" => ["STICKY_NOTE_CONTROL", "add", "editRecord", "removeRecords"],
                    "/post_likes" => ["POST_LIKE_CONTROL", "add", "editRecord", "removeRecords"],
                    "/post_comments" => ["POST_COMMENT_CONTROL", "add", "editRecord", "removeRecords"],
                    "/activities_complied" => ["ACTIVITY_COMPLY_CONTROL", "add", "editRecord", "removeRecords"],
                    "/events" => ["EVENT_CONTROL", "add", "editRecord", "removeRecords"],
                    "/grade_scores" => ["GRADE_SCORE_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/forms" => ["FORM_CONTROL", "add", "editRecord", "removeRecords"],
                    "/form_questions" => ["FORM_QUESTION_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/form_question_choices" => ["FORM_QUESTION_CHOICES_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/form_completions" => ["FORM_COMPLETION_CONTROL", "add", "editRecord", "removeRecords"],
                    "/form_corrections" => ["FORM_CORRECTION_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/form_completion_answers" => ["FORM_COMPLETION_ANSWER_CONTROL", "addRecord", "editRecord", "removeRecords"],
                    "/subject_attendances" => ["SUBJECT_ATTENDANCE_CONTROL", "add", "editRecord", "removeRecords"],
                    "/grade_show_requests" => ["GRADING_SHOW_REQUEST_CONTROL", "add", "editRecord", "removeRecords"],
                ];

                foreach ($routes as $path => [$control, $addMethod, $editMethod, $removeMethod]) {
                    $KLEIN->with($path, function () use ($KLEIN, $APPLICATION, $control, $addMethod, $editMethod, $removeMethod) {
                        $KLEIN->respond("POST", "/addRecord", function () use ($APPLICATION, $control, $addMethod) {
                            return json_encode($APPLICATION->FUNCTIONS->$control->$addMethod(json_decode($_POST["data"], true)));
                        });

                        $KLEIN->respond("POST", "/editRecord", function () use ($APPLICATION, $control, $editMethod) {
                            $args = ($control === "USER_CONTROL") ? [$_POST['id'], json_decode($_POST["data"], true)] : [$_POST['id'], json_decode($_POST["data"], true)];
                            return json_encode($APPLICATION->FUNCTIONS->$control->$editMethod(...$args));
                        });

                        $KLEIN->respond("POST", "/removeRecords", function () use ($APPLICATION, $control, $removeMethod) {
                            return json_encode($APPLICATION->FUNCTIONS->$control->$removeMethod(json_decode($_POST["data"], true)));
                        });
                    });
                }
            });

            $this->KLEIN->with("/post", function () use ($KLEIN, $APPLICATION) {
                $KLEIN->respond("POST", "/[:request]", function ($req, $res) use ($APPLICATION) {
                    $APPLICATION->FUNCTIONS->POST_CONTROL->RESPONSE = $res;
                    return json_encode($APPLICATION->FUNCTIONS->POST_CONTROL->run($req->param("request")));
                });
            });
        });
    }

    private function componentsRoutes(): void
    {
        $KLEIN = $this->KLEIN;

        $KLEIN->respond("POST", "/components/popup/[:folder]?/[:view]?", static function ($req, $res, $service) use ($KLEIN) {
            $mainPath = "public/views/components/popup/" . $req->param("folder") . '/';
            $view = $mainPath . $req->param("view") . '.phtml';
            return file_exists($view) ? $service->render($view) : null;
        });

        $KLEIN->respond("POST", "/components/containers/[:folder]?/[:view]?", static function ($req, $res, $service) use ($KLEIN) {
            $mainPath = "public/views/components/containers/" . $req->param("folder") . '/';
            $view = $mainPath . $req->param("view") . '.phtml';
            return file_exists($view) ? $service->render($view) : null;
        });
    }

    private function toolRoutes()
    {
        $KLEIN = $this->KLEIN;

        $KLEIN->with("/tool", function () use ($KLEIN) {
            $KLEIN->respond(
                "POST",
                "/uploadImageFromFile",
                function () {
                    return json_encode(UploadImageFromFile($_FILES['file'], $_POST["filename"], $_POST['destination']), JSON_THROW_ON_ERROR);
                }
            );

            $KLEIN->respond(
                "POST",
                "/uploadImageFromPath",
                function () {
                    return json_encode(UploadImageFromPath($_POST['path'], $_POST["filename"], $_POST['destination']), JSON_THROW_ON_ERROR);
                }
            );

            $KLEIN->respond(
                "POST",
                "/uploadImageFromBase64",
                function () {
                    return json_encode(UploadImageFromBase64($_POST['base64'], $_POST['destination'], $_POST["filename"], $_POST['extension'] ?? 'jpg'), JSON_THROW_ON_ERROR);
                }
            );

            $KLEIN->respond(
                "POST",
                "/UploadFileFromFile",
                function () {
                    return json_encode(UploadFileFromFile($_FILES['file'], $_POST['destination'], $_POST['filename']), JSON_THROW_ON_ERROR);
                }
            );
        });
    }
}