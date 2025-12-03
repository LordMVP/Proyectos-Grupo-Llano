<?php

namespace Llanogas\LlanogasBundle\Utiles;

use Symfony\Component\HttpFoundation\Response;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Symfony\Component\HttpFoundation\Session\Session;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\MyException;


class DateUtil {

    public static function dateToTimeStamp($dateString, $formato = 'Y-m-d H:i:s') {
        $editaString = str_replace('/', '-', $dateString);
        $time = strtotime($editaString); 
        if ($time) {
            $dateTimeStamp = date($formato, $time);
        } else {
            throw new MyException('Error en Conversión Formato de Fecha :'.$editaString);
        }

        return($dateTimeStamp);
    }

    public static function timeStamptoDate($dateDBase, $formato = 'd/m/Y') {
        $editadateDBase = date_create($dateDBase);
        $dateFormato = date_format($editadateDBase,$formato);  
        return($dateFormato);
    }
    public static function timeStamptoDateYMD($dateDBase, $formato = 'Y/m/d') {
        $editadateDBase = date_create($dateDBase);
        $dateFormato = date_format($editadateDBase,$formato);  
        return($dateFormato);
    }

}
