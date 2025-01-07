<?php

namespace Application\controllers\system;

use Application\abstract\ControlDefaultFunctions;
use Application\abstract\CourseAbstract;
use Application\abstract\UserAbstract;
use Application\models\Course;
use Application\models\Post;
use Application\models\Professor;
use Application\models\Staff;
use Application\models\User;

class PostsControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = Post::class;
    protected $TABLE_NAME = "posts";
    protected $TABLE_PRIMARY_ID = "post_id";
    protected $SEARCH_LOOKUP = [];

    public function add($data)
    {
        global $SESSION, $APPLICATION;

        $control = $APPLICATION->FUNCTIONS->POST_MEDIA_CONTROL;

        $data['user_id'] = $SESSION->user_id;

        if (isset($data['files'])) {
            $files = $data['files'];
            unset($data['files']);
        }

        $data['post_type'] = 2;

        $add = $this->addRecord($data);

        if (isset($files)) {
            if (is_array($files) && !empty($files)) {
                foreach ($files as $file) {
                    $control->addRecord([
                        "post_id" => $add->body['id'],
                        "filepath" => $file
                    ]);
                }
            }
        }

        return  $add;
    }

    public function update($id, $data)
    {
        return null;
    }

    public function remove($id) {
        global $SESSION;

        $post = $this->get($id, false);

        if ($post['user_id'] == $SESSION->user_id) {
           return $this->removeRecord($id);
        }

        return false;
    }

    public function removeComment($post_id, $comment_id) {
        global $SESSION, $APPLICATION;

        $comment_control = $APPLICATION->FUNCTIONS->POST_COMMENTS_CONTROL;
        $comment = $comment_control->get($comment_id, false);

        // Only allow deletion if user is the comment author
        if ($comment['user_id'] == $SESSION->user_id) {
          
        }

        return false;
    }
}