<?php

//use Symfony\Component\ClassLoader\ApcClassLoader;
use Symfony\Component\HttpFoundation\Request;
use Llanogas\LlanogasBundle\Utiles\Util;

$loader = require_once __DIR__ . '/../app/bootstrap.php.cache';

// Use APC for autoloading to improve performance.
// Change 'sf2' to a unique prefix in order to prevent cache key conflicts
// with other applications also using APC.
/*
  $loader = new ApcClassLoader('sf2', $loader);
  $loader->register(true);
 */

require_once __DIR__ . '/../app/AppKernel.php';
//require_once __DIR__ . '/../app/AppCache.php';

// Ambiente de Desarrollo Ojo Solo un ambiente habilitado 
//$kernel = new AppKernel('dev', true);
//Ambiente de Producción
$kernel = new AppKernel('prod', true);
//$kernel->loadClassCache();
//$kernel = new AppCache($kernel);
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
