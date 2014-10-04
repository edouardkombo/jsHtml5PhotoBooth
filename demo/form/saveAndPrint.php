<?php

// Muaz Khan         - www.MuazKhan.com
// MIT License       - www.WebRTC-Experiment.com/licence
// Documentation     - github.com/muaz-khan/WebRTC-Experiment/tree/master/RecordRTC

// Modified by Edouard Kombo - edouard.kombo@gmail.com
// make sure that you're using newest ffmpeg version!

ini_set('memory_limit', '44096M');
ini_set('max_input_time', '100800');
ini_set('max_execution_time', '100800');
ini_set('upload_max_filesize', '55000M');
ini_set('post_max_size', '55000M');

require 'WatImage.php';

$wm                     = new WatImage();

$path                   = (string) filter_input(INPUT_POST, 'path');
$picture                = (string) filter_input(INPUT_POST, 'picture-blob'); 
$extension              = (string) filter_input(INPUT_POST, 'extension');
$type                   = (string) filter_input(INPUT_POST, 'type'); 
$watermark              = (string) filter_input(INPUT_POST, 'watermark');
$rotation               = (string) filter_input(INPUT_POST, 'rotation');
$filename               = (string) filter_input(INPUT_POST, 'filename');
$computerName           = (string) gethostname();
$sharedPrinterName      = (string) filter_input(INPUT_POST, 'sharedPrinterName');
$rootPath               = (string) filter_input(INPUT_SERVER, 'DOCUMENT_ROOT');

$_fullPath              = $rootPath . $path . $filename . '/';

$firstArray             = array("\\", "/");
$secondArray            = array(DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR);
$fullPath               = str_replace($firstArray, $secondArray , $_fullPath);

$fullWatermarkPath      = $rootPath . $watermark;
$fullBatchFilePath      = $fullPath . 'print.bat';
$picturePath            = $fullPath . $filename . '.' . $extension;


mkdir($fullPath, 0777, true);


$file = base64_decode(str_replace('data:image/' . $extension . ';base64,', '', $picture));

//Create file and return status
if (file_put_contents($picturePath, $file)) {
    
    /***************************************************
     *** APPLY WATERMARKS AND ROTATE IT IF SPECIFIED ***
     **************************************************/
    $wm->setImage(array('file' => $picturePath, 'quality' => 100)); // file to use and export quality

    if ($watermark !== 'false') {
        $wm->setWatermark(array('file' => $fullWatermarkPath, 'position' => 'bottom right')); // watermark to use and it's position
        $wm->applyWatermark(); // apply watermark to the canvas
    }

    if (($rotation !== 'false') && ($rotation !== '0')) {
        $wm->rotate($rotation);
    }    

    if (!$wm->generate($picturePath) ) {
        // handle errors...
        print_r($wm->errors);
    }         

    /*************************************
    *** PRINT PICTURE IF SPECIFIED ***
    ************************************/    
    // 1. First we assure that we are on windows system
    // 2. Second, we create a temporary file that targets printer
    // 3. Execute the system command
    // 4. Delete the batch file
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        if (!empty($sharedPrinterName)) {
            $printerPath    = "\\\\" . "$computerName\\" . $sharedPrinterName; 
            $content        = "print /d:$printerPath $picturePath"."\n";       

            $handle = fopen($fullBatchFilePath, 'w+');
            if (fwrite($handle, $content)) {
                fclose($handle);
            }        

            system("cmd /c $fullBatchFilePath");
            unlink($fullBatchFilePath);
        }
    }    
}
