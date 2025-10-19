<?php

$includekeys =__DIR__ . '/../../../keys.php';
require_once ( $includekeys );

error_reporting(E_ALL);
ini_set('display_errors', '1');
date_default_timezone_set('UTC');

$images = scandir("/var/www/html/images");
$images = array_diff($images, array('.', '..'));

foreach ($images as $key => $image) {

    $delete = false;
    $file_bits = explode(".",$image);

    if(count($file_bits) > 1){

        $file_type = strtolower($file_bits[1]);

        if(!in_array($file_type, ['jpg','png'])){//heic support sucks
            $delete = true;
        }

    }else{
        $delete = true;
    }

    if($delete == true){
        unset($images[$key]);
    }
}

$images = array_values( $images );

$selected_image = rand(0, count($images) - 1);

$url = 'http://192.168.68.109/images/'.$images[$selected_image];

$output = [];
$output['url'] = $url;

header('Content-Type: application/json');
echo json_encode($output, JSON_PRETTY_PRINT);
