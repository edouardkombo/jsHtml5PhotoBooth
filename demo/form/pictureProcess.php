<?php
if (empty($_SESSION['id'])) {
    session_start();    
}

ini_set('memory_limit', '1024M');

require 'Session.php';
require 'DirectoryManager.php';
require 'WatImage.php';

$session    = new Session();
$directory  = new DirectoryManager();
$wm         = new WatImage();

$session->init();

if (isset($_POST)) {
    
    /*************************************
     *** GET PICTURE ***
     ************************************/    
    //Variables
    $path               = (string) filter_input(INPUT_GET, 'path');                 
    $extension          = (string) filter_input(INPUT_GET, 'extension');
    $type               = (string) filter_input(INPUT_GET, 'type'); 
    $watermark          = (string) filter_input(INPUT_GET, 'watermark');
    $rotation           = (string) filter_input(INPUT_GET, 'rotation');     

    //Set session and directory
    $id             = $session->getId();    
    
    //"/media/Temp/1234/1234.yyy"
    $simplePath             = $path . $id . DIRECTORY_SEPARATOR . $id . '.' . $extension;
    
    //"C:/xxxx/media/Temp/1234"
    $basePath                = (string) $_SERVER['DOCUMENT_ROOT'] . $path . $id;
    $baseWatermarkPath       = (string) $_SERVER['DOCUMENT_ROOT'] . $watermark;    
    
    //"C:/xxxx/media/Temp/1234/1234.yyy"
    $baseFilename            = (string) $basePath . DIRECTORY_SEPARATOR . $id . '.' . $extension;    
    
    //Search inside "C:/xxxx/media/Temp/1234" directory
    $directory->setDirectoryIterator($basePath);

    //Get media
    $media = file_get_contents('php://input');

    if ($type === 'picture') {
        $encoded = base64_decode(str_replace('data:image/' . $extension . ';base64,', '', $media));
        $media   = $encoded;
    }

    $firstArray     = array('\\', '/', '%5C');
    $secondArray    = array('/', '/', '/');

    //Format strings
    $baseFilename   = str_replace($firstArray, $secondArray, $baseFilename);
    $simplePath     = str_replace($firstArray, $secondArray, $simplePath);

    //If a content exists, we delete and replace it
    $directory->delete($id . '.' . $extension);

    //Create file and return status
    file_put_contents($baseFilename, $media);
    
    
    
    /***************************************************
     *** APPLY WATERMARKS AND ROTATE IT IF SPECIFIED ***
     **************************************************/
    $wm->setImage(array('file' => $baseFilename, 'quality' => 100)); // file to use and export quality
    
    if ($watermark !== 'false') {
        $wm->setWatermark(array('file' => $baseWatermarkPath, 'position' => 'bottom right')); // watermark to use and it's position
        $wm->applyWatermark(); // apply watermark to the canvas
    }
    
    if (($rotation !== 'false') && ($rotation !== '0')) {
        $wm->rotate($rotation);
    }    
    
    if ( !$wm->generate($baseFilename) ) {
            // handle errors...
            print_r($wm->errors);
    }       
    
    
    //Return media url inside media directory
    echo $simplePath;    
}
