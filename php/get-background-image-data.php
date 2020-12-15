<?php

$includekeys =__DIR__ . '/../../../keys.php';
require_once ( $includekeys );

$url = PIXABAY_API_URL.'?key='.PIXABAY_API_KEY.'&category=nature&colors=green%2Cblack%2Cbrown&per_page=200';
$response = file_get_contents($url);
$response = json_encode($response);


header('Content-Type: application/json');
echo json_decode($response, JSON_PRETTY_PRINT);
