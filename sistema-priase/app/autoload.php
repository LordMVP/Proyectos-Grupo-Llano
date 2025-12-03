<?php

use Doctrine\Common\Annotations\AnnotationRegistry;
use Composer\Autoload\ClassLoader;

/**
 * @var ClassLoader $loader
 */
$loader = require __DIR__.'/../vendor/autoload.php';
require_once __DIR__.'/../config.php';
require_once __DIR__.'/../clasesPHPNativo.php';
require __DIR__.'/../vendor/phpexcel/Classes/PHPExcel.php';

AnnotationRegistry::registerLoader(array($loader, 'loadClass'));

return $loader;
