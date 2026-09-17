#!/usr/bin/env pwsh
# Helper wrapper: run Composer using XAMPP PHP
$env:PATH = "C:\xampp\php;$env:PATH"
& C:\xampp\php\php.exe C:\xampp\php\composer.phar @args
