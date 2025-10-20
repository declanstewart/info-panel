<?php

// 1. Define input and output paths
$input_dir = "/var/www/html/images/";
$output_dir = "/var/www/html/images/";

$images = scandir($input_dir);
$images = array_diff($images, array('.', '..'));

foreach ($images as $key => $image) {

    $file_bits = explode(".",$image);

    if(count($file_bits) > 1){

        $file_type = strtolower($file_bits[1]);

        if(in_array($file_type, ['heic'])){

            if(!in_array($file_bits[0].'.jpg',$images)){

                // Get filename without extension (e.g., "myphoto")
                $file_bits = pathinfo($image);
                $filename_only = $file_bits['filename'];

                // Define absolute path for the output file
                $output_file_path = $output_dir . $filename_only . '.jpg';

                // --- Imagick Conversion Block ---

                // Open the input file stream
                $uploadedImage = fopen($input_dir . $image, 'rb');

                if ($uploadedImage) {
                    $image_to_convert = new Imagick();

                    // Read the image data from the stream
                    $image_to_convert->readImageFile($uploadedImage);

                    // Set format for the conversion operation
                    $image_to_convert->setFormat("jpeg");

                    // Write the converted image to the absolute output path
                    $image_to_convert->writeImage($output_file_path);

                    // Clean up
                    fclose($uploadedImage);
                    $image_to_convert->clear();

                    echo "Successfully converted and saved to: " . $output_file_path;

                    //Delete the original HEIC file
                    unlink($input_dir.$image);

                } else {
                    // Handle error if the input file couldn't be opened
                    echo "Error: Could not open the source HEIC file.";
                }
            }
        }
    }
}
