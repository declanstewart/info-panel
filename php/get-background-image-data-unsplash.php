<?php

$includekeys =__DIR__ . '/../../../keys.php';
require_once ( $includekeys );

$url = UNSPLASH_API_URL.'/photos/random?orientation=portrait&query=nature&client_id='.UNSPLASH_API_KEY;
$response = file_get_contents($url);
$response = json_encode($response);


header('Content-Type: application/json');
echo json_decode($response, JSON_PRETTY_PRINT);
