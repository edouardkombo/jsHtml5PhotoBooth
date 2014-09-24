<?php

if (isset($_POST)) {
    
    /*************************************
     *** GET PICTURE INFOS ***
     ************************************/    
    //Variables
    $pictureName        = (string) filter_input(INPUT_GET, 'pictureName');
    $computerName       = (string) filter_input(INPUT_GET, 'computerName'); 
    $sharedPrinterName  = (string) filter_input(INPUT_GET, 'sharedPrinterName');
    $mediaPath          = (string) filter_input(INPUT_GET, 'mediaPath');
    $printBatch         = (string) filter_input(INPUT_GET, 'printBatch');    

    
    /*************************************
     *** PRINT PICTURE IF SPECIFIED ***
     ************************************/    
    // 1. First we assure that we are on windows system
    // 2. Second, we create a temporary file that targets printer
    // 3. Execute the system command
    // 4. Delete the batch file
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        $filename       = str_replace('/', '\\', $pictureName);
        $printerPath    = "\\\\" . "$computerName\\" . $sharedPrinterName; 
        $content        = "cd ..$mediaPath"."\n";
        $content        .= "print /d:$printerPath $filename"."\n";       

        $batFile = (string) $_SERVER['DOCUMENT_ROOT'] . $printBatch;
        
        $handle = fopen($batFile, 'w+');
        if (fwrite($handle, $content)) {
            fclose($handle);
        }        

        system("cmd /c $batFile");
        unlink($batFile);
    }      
}
