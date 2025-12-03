<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Description of ExportarFormatoExcelController
 *
 * @author desarrollo1
 */
class ExportarFormatoExcelController extends Controller {

    private $session;

    public function exportarFormatoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $this->session = $sesion;
            $informacion = $sesion->get('informacionformato');
            if (empty($informacion)) {
                throw new MyException('No se encontró información de la financiación para descargar el formato solicitado, intente ');
            }

            
            $nombre = $informacion['nombreformato'];
            switch ($nombre) {

                case 'PagareyVinculacionGasNaturalDomiciliarioPersonaJuridica':
                    $nombre = $informacion['nombreformato'] . $sesion->get('idEmpresa');
                    break;
                case 'PagareyVinculacionGasNaturalDomiciliariaPersonaNatural':
                    $nombre = $informacion['nombreformato'] . $sesion->get('idEmpresa');
                    break;
                  case 'PagarePersonaJuridicaFinal':
                    $nombre = $informacion['nombreformato'] . $sesion->get('idEmpresa');
                    break;
                case 'PagarePersonaNaturalFinal':
                    $nombre = $informacion['nombreformato'] . $sesion->get('idEmpresa');
                    break;
                case 'TratamientoDatos':
                    $nombre = $informacion['nombreformato'] . $sesion->get('idEmpresa');
                    break;
            }


            if ($nombre == 'VinculacionGasNatural' && !isset($informacion['personajuridica']) && !isset($informacion['personanatural'])) {
                throw new MyException('No se encontró información laboral y/o financiera', -1);
            }
            $informacion['usuario'] = $sesion->get('usuario');
            $informacion['idusuario'] = $sesion->get('idusuario');
            $objPHPExcel = $this->cargarInformacion($informacion, $nombre);
            $formato = strpos($nombre, 'xlsx') ? 'Excel2007' : 'Excel5';

            $this->response = new StreamedResponse();
            $this->response->setCallback(function()use($formato, $objPHPExcel) {
                $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, $formato);
                $objWriter->save('php://output');
            });
            unset($_SESSION['informacionformato']);
            $this->response->headers->set('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
            $this->response->headers->set('Content-Disposition', 'attachment; filename=' . $nombre);
            return $this->response;
        } catch (\Exception $ex) {
            print_r($ex->getMessage());
            print_r($ex->getLine());
        }
    }

    /**
     * Método encargado de llenar la información en la plantilla
     * @param type $informacion array con la información financiera y de la suscripción
     * @param type $nombreformato nombre del formato
     */
    private function cargarInformacion($informacion, &$nombreformato) {
        if (strtoupper(substr(PHP_OS, 0, 3)) == 'WIN') {
            $nombre = RUTA_PRINCIPAL . '\app\Resources\formatos\financiacion\_' . $nombreformato . '.xlsx';
        } else {
            $nombre = RUTA_PRINCIPAL . '/app/Resources/formatos/financiacion/_' . $nombreformato . '.xlsx';
        }

        if (!file_exists($nombre)) {
            $nombre = str_replace('xlsx', 'xls', $nombre);
        }

        $objReader = \PHPExcel_IOFactory::createReaderForFile($nombre);
        $hoja = array('Autorizaciones', 'Solicitud');
        $objReader->setLoadSheetsOnly($hoja);
        $xlsObj = $objReader->load($nombre);
        $sheetActive = $xlsObj->getActiveSheet();

        //print_r($sheetActive);
        switch ($nombreformato) {
            case 'PagarePersonaNatural':
                $this->informacionPagareNatural($sheetActive, $informacion);
                break;
            case 'PagarePersonaJuridica':
                $this->informacionPagareJuridico($sheetActive, $informacion);
                break;
            case 'PagarePersonaNaturalFinal'. $this->session->get('idEmpresa'):
                $this->informacionPagareNaturalFinal($sheetActive, $informacion, null);
                $celdas = array('A82', 'A114', 'B95', 'B96', 'B110', 'B111', 'E114', 'G114');
                //$this->informacionAutorizacionContrato($sheetActive, $informacion, $celdas);
                break;
            case 'PagarePersonaJuridicaFinal'. $this->session->get('idEmpresa'):
                $this->informacionPagareJuridicoFinal($sheetActive, $informacion, null);
                $celdas = array('A92', 'A124', 'B105', 'B106', 'B120', 'B121', 'E124', 'G124');
                //$this->informacionAutorizacionContrato($sheetActive, $informacion, $celdas);
                break;
            case 'PagareyVinculacionGasNaturalDomiciliarioPersonaJuridica' . $this->session->get('idEmpresa'):
                $this->informacionVinculacionGas($sheetActive, $informacion);
                $celdas = array('A117', 'A120', 'A148', 'C143', 'C144', 'C196', 'C197');
                $this->informacionPagareJuridicoFinal($sheetActive, $informacion, $celdas);
                break;
            case 'PagareyVinculacionGasNaturalDomiciliariaPersonaNatural' . $this->session->get('idEmpresa'):
                $this->informacionVinculacionGas($sheetActive, $informacion);
                $celdas = array('A117', 'A118', 'A146', 'C141', 'C142', 'C191', 'C192');
                $this->informacionPagareNaturalFinal($sheetActive, $informacion, $celdas);
                break;
            case 'VinculacionGasNatural':
                $this->informacionVinculacionGas($sheetActive, $informacion);
                break;
            case 'Autorizacion':
                $this->informacionAutorizaciones($sheetActive, $informacion);
                break;
            case 'AutorizacionyContrato':
                $this->informacionAutorizacionContrato($sheetActive, $informacion, NULL);
                break;
            case 'TratamientoDatos'. $this->session->get('idEmpresa'):
                $this->informacionTratamientoDatos($sheetActive, $informacion);
                break;
        }
        $nombreformato = explode('_', $nombre)[1];
        return $xlsObj;
    }

    /**
     * Llena el espacio de la persona natural
     * @param type $sheetActive hoja a la cual se va a diligenciar la información
     * @param type $informacion información de la persona natural
     */
    private function informacionPagareNatural(&$sheetActive, $informacion) {
        $A3 = (string) $sheetActive->getCell('A3')->getValue();
        $A28 = (string) $sheetActive->getCell('A28')->getValue();

        $this->reemplazoTexto($A3, $informacion);
        $this->reemplazoTexto($A28, $informacion);
        $sheetActive->setCellValue('A3', $A3)
                ->setCellValue('A28', $A28)
                ->setCellValue('B24', $informacion['nombretercero'])
                ->setCellValue('B25', $informacion['documentotercero'])
                ->setCellValue('B76', $informacion['nombretercero'])
                ->setCellValue('B77', $informacion['documentotercero']);
    }

    /**
     * Llena la plantilla en el formato de excel el sección de persona jurídica 
     * @param type $sheetActive hoja a la cual se va a diligenciar la información
     * @param type $informacion información de la persona natural
     */
    private function informacionPagareJuridico(&$sheetActive, $informacion) {
        $A3 = (string) $sheetActive->getCell('A3')->getValue();
        $A30 = (string) $sheetActive->getCell('A30')->getValue();

        $this->reemplazoTexto($A3, $informacion);
        $this->reemplazoTexto($A30, $informacion);
        $sheetActive->setCellValue('A3', $A3)
                ->setCellValue('A30', $A30)
                ->setCellValue('B26', $informacion['nombretercero'])
                ->setCellValue('B27', $informacion['documentotercero'])
                ->setCellValue('B77', $informacion['nombretercero'])
                ->setCellValue('B78', $informacion['documentotercero']);
    }

    /**
     * Diligencia toda la información del pageré persona natural
     * @param type $sheetActive hoja que se está modificando
     * @param type $informacion array con la información
     * @param string $celdas array con la información de las celdas a afectar
     */
    private function informacionPagareNaturalFinal(&$sheetActive, $informacion, $celdas) {
        if ($celdas == null || empty($celdas)) {
            $celdas = array('A1', 'A3', 'A28', 'B24', 'B25', 'B76', 'B77');
        }

        $A1 = (string) $sheetActive->getCell($celdas[0])->getValue();
        $A3 = (string) $sheetActive->getCell($celdas[1])->getValue();
        $A28 = (string) $sheetActive->getCell($celdas[2])->getValue();

        $this->reemplazoTexto($A1, $informacion);
        $this->reemplazoTexto($A3, $informacion);
        $A3 = str_replace('((MUNICIPIO))', $informacion['municipio'], $A3);
        $this->reemplazoTexto($A28, $informacion);
        $sheetActive->setCellValue($celdas[0], $A1)
                ->setCellValue($celdas[1], $A3)
                ->setCellValue($celdas[2], $A28)
                ->setCellValue($celdas[3], $informacion['nombretercero'])
                ->setCellValue($celdas[4], $informacion['documentotercero'])
                ->setCellValue($celdas[5], $informacion['nombretercero'])
                ->setCellValue($celdas[6], $informacion['documentotercero']);
    }

    private function informacionPagareJuridicoFinal(&$sheetActive, $informacion, $celdas) {
        if ($celdas == NULL || empty($celdas)) {
            $celdas = array('A1', 'A4', 'A33', 'B29', 'B30', 'B80', 'B81');
        }

        $A1 = (string) $sheetActive->getCell($celdas[0])->getValue();
        $A4 = (string) $sheetActive->getCell($celdas[1])->getValue();
        $A33 = (string) $sheetActive->getCell($celdas[2])->getValue();

        $this->reemplazoTexto($A1, $informacion);
        $this->reemplazoTexto($A4, $informacion);
        $this->reemplazoTexto($A33, $informacion);
        $A4 = str_replace('((MUNICIPIO))', $informacion['municipio'], $A4);
        $A4 = str_replace('((NOMBRE_SOLICITANTE))', $informacion['nombresolicitante'], $A4);
        $A4 = str_replace('((LUGAR_EXPEDICIONSOLICITANTE))', $informacion['lugarsolicitante'], $A4);
        $A4 = str_replace('((NUMERO_DOCUMENTOSOLICITANTE))', $informacion['documentosolicitante'], $A4);
        $A33 = str_replace('((MUNICIPIO))', $informacion['municipio'], $A33);
        $A33 = str_replace('((NOMBRE_SOLICITANTE))', $informacion['nombresolicitante'], $A33);
        $A33 = str_replace('((LUGAR_EXPEDICIONSOLICITANTE))', $informacion['lugarsolicitante'], $A33);
        $A33 = str_replace('((NUMERO_DOCUMENTOSOLICITANTE))', $informacion['documentosolicitante'], $A33);
//        $this->reemplazoTexto($A30, $informacion);
        $sheetActive->setCellValue($celdas[0], $A1)
                ->setCellValue($celdas[1], $A4)
                ->setCellValue($celdas[2], $A33)
                ->setCellValue($celdas[3], $informacion['firmante'])
                ->setCellValue($celdas[4], $informacion['documentofirmante'])
                ->setCellValue($celdas[5], $informacion['firmante'])
                ->setCellValue($celdas[6], $informacion['documentofirmante']);
    }

    private function informacionAutorizaciones(&$sheetActive, $informacion) {
        $A5 = (string) $sheetActive->getCell('A5')->getValue();
        $A5 = str_replace('((DIAS))', $informacion['dias'], $A5);
        $A5 = str_replace('((MESACTUAL))', $informacion['mesactual'], $A5);
        $A5 = str_replace('((ANIOACTUAL))', $informacion['anioactual'], $A5);

        $sheetActive->setCellValue('A5', $A5)
                ->setCellValue('A35', $informacion['usuario'])
                ->setCellValue('C35', $informacion['idventa'])
                ->setCellValue('E35', $informacion['fechaactual'])
                ->setCellValue('B18', $informacion['nombretercero'])
                ->setCellValue('B30', $informacion['nombretercero'])
                ->setCellValue('B19', $informacion['documentotercero'])
                ->setCellValue('B31', $informacion['documentotercero'])
                ->setCellValue('G35', $informacion['idsuscripcion']);
    }

    private function informacionAutorizacionContrato(&$sheetActive, $informacion, $celdas) {
        if ($celdas == NULL || empty($celdas)) {
            $celdas = array('A5', 'A37', 'B18', 'B19', 'B33', 'B34', 'E37', 'G37');
        }

        $A5 = (string) $sheetActive->getCell($celdas[0])->getValue();
        $A5 = str_replace('(DIAS)', $informacion['dias'], $A5);
        $A5 = str_replace('(MESACTUAL)', $informacion['mesactual'], $A5);
        $A5 = str_replace('(ANIOACTUAL)', $informacion['anioactual'], $A5);
        $sheetActive->setCellValue($celdas[0], $A5)
                ->setCellValue($celdas[1], $informacion['usuario'])
                ->setCellValue($celdas[6], $informacion['fechaactual'])
                ->setCellValue($celdas[2], $informacion['nombretercero'])
                ->setCellValue($celdas[4], $informacion['nombretercero'])
                ->setCellValue($celdas[3], $informacion['documentotercero'])
                ->setCellValue($celdas[5], $informacion['documentotercero'])
                ->setCellValue($celdas[7], $informacion['idsuscripcion']);
    }

    private function informacionVinculacionGas(&$sheetActive, $informacion) {
        if (isset($informacion['personanatural'])) {
            ///Información personal y laboral
            $this->informacionPersonaNatural($sheetActive, $informacion, $informacion['personanatural']);
            $this->informacionFinanciera($sheetActive, $informacion['personanatural']);
        }
        //Información Jurídica
        if (isset($informacion['personajuridica'])) {
            $infoPersonaJuridica = $informacion['personajuridica'];
            $this->informacionFinanciera($sheetActive, $infoPersonaJuridica);
            $sheetActive->setCellValue('A31', $informacion['tipodocumento'])
                    ->setCellValue('E31', $informacion['documentotercero'])
                    ->setCellValue('T31', $informacion['nombrestercero'])
                    ->setCellValue('A40', $informacion['direccion'])
                    ->setCellValue('F40', $informacion['barrio'])
                    ->setCellValue('O40', $informacion['municipio'])
                    ->setCellValue('X40', $informacion['estrato'])
                    ->setCellValue('U40', $informacion['departamento'])
                    /* ->setCellValue('W31', $informacion['nombrestercero']) */
                    ->setCellValue('A43', $informacion['correoelectronico'])
                    ->setCellValue('R43', $infoPersonaJuridica['telefono1'])
                    ->setCellValue('W43', $infoPersonaJuridica['telefono2'])
                    ->setCellValue('I29', $infoPersonaJuridica['idtiposociedad'])
                    ->setCellValue('E33', $infoPersonaJuridica['idactividadeconomica'])
                    ->setCellValue('X36', $infoPersonaJuridica['anioexperiencia'])
                    ->setCellValue('Z36', $infoPersonaJuridica['mesesexperiencia']);
        }

        //Información general del formato

        $A88 = (string) $sheetActive->getCell('A88')->getValue();
        $A88 = str_replace('((INTERES))', $informacion['interes'], $A88);
        $sheetActive->setCellValue('A9', $informacion['tipodeuso'])
                ->setCellValue('A88', $A88)
                ->setCellValue('S9', $informacion['metododepago'])
                ->setCellValue('D72', $informacion['valorventa'])
                ->setCellValue('I72', $informacion['cuotainicial'])
                ->setCellValue('U72', $informacion['valorfinanciar'])
                ->setCellValue('X72', $informacion['numerocuota'])
                ->setCellValue('B82', $informacion['nombretercero'])
                ->setCellValue('B83', $informacion['documentotercero'])
                ->setCellValue('U81', $informacion['usuario'])
                ->setCellValue('V82', $informacion['idusuario'])
                ->setCellValue('A113', $informacion['usuario'])
                ->setCellValue('F113', $informacion['numeroventa'])
                ->setCellValue('P113', $informacion['fechaactual'])
                ->setCellValue('W113', $informacion['idsuscripcion']);
    }

    private function informacionPersonaNatural(&$sheetActive, $informacion, $infoPersonaNatural) {
        $sheetActive->setCellValue('N15', $informacion['sexo'])
                ->setCellValue('A17', $informacion['tipodocumento'])
                ->setCellValue('U21', $informacion['departamento'])
                ->setCellValue('A24', $informacion['correoelectronico'])
                ->setCellValue('D17', $informacion['documentotercero'])
                ->setCellValue('F17', $informacion['lugarexpedicion'])
                ->setCellValue('R17', $informacion['nombrestercero'])
                ->setCellValue('W17', $informacion['apellidostercero'])
                ->setCellValue('A21', $informacion['direccion'])
                ->setCellValue('F21', $informacion['barrio'])
                ->setCellValue('O21', $informacion['municipio'])
                ->setCellValue('X21', $informacion['estrato'])
                ->setCellValue('W24', (empty($informacion['celulartercero']) ? '' : $informacion['celulartercero']))
                ->setCellValue('R24', (empty($informacion['telefonotercero']) ? '' : $informacion['telefonotercero']))
                ->setCellValue('W55', (empty($infoPersonaNatural['telefono1']) ? '' : $infoPersonaNatural['telefono1']))
                ->setCellValue('X55', (empty($infoPersonaNatural['telefono2']) ? '' : $infoPersonaNatural['telefono2']))
                ->setCellValue('F55', (empty($infoPersonaNatural['diaingreso']) ? '' : $infoPersonaNatural['diaingreso']))
                ->setCellValue('G55', (empty($infoPersonaNatural['mesingreso']) ? '' : $infoPersonaNatural['mesingreso']))
                ->setCellValue('H55', (empty($infoPersonaNatural['anioingreso']) ? '' : $infoPersonaNatural['anioingreso']))
                ->setCellValue('M55', (empty($infoPersonaNatural['meslaborado']) ? '' : $infoPersonaNatural['meslaborado']))
                ->setCellValue('P55', (empty($infoPersonaNatural['cargolaboral']) ? '' : $infoPersonaNatural['cargolaboral']))
                ->setCellValue('J55', (empty($infoPersonaNatural['aniolaborado']) ? '' : $infoPersonaNatural['aniolaborado']))
                ->setCellValue('D48', (empty($infoPersonaNatural['idactividadeconomica']) ? '' : $infoPersonaNatural['idactividadeconomica']))
                ->setCellValue('A55', (empty($infoPersonaNatural['nombreempresalaboral']) ? '' : $infoPersonaNatural['nombreempresalaboral']));
    }

    private function informacionFinanciera(&$sheetActive, $informacion) {
        //Información financiera
        $sheetActive->setCellValue('E61', empty($informacion['salariofijo']) ? '' : $informacion['salariofijo'])
                ->setCellValue('X60', empty($informacion['efectivo']) ? '' : $informacion['efectivo'])
                ->setCellValue('X64', empty($informacion['vehiculo']) ? '' : $informacion['vehiculo'])
                ->setCellValue('X65', empty($informacion['propiedad']) ? '' : $informacion['propiedad'])
                ->setCellValue('K65', empty($informacion['otrogasto']) ? '' : $informacion['otrogasto'])
                ->setCellValue('Q66', empty($informacion['totalgasto']) ? '' : $informacion['totalgasto'])
                ->setCellValue('X66', empty($informacion['totalactivo']) ? '' : $informacion['totalactivo'])
                ->setCellValue('B65', empty($informacion['otroingreso']) ? '' : $informacion['otroingreso'])
                ->setCellValue('T64', empty($informacion['gastocompra']) ? '' : $informacion['gastocompra'])
                ->setCellValue('E64', empty($informacion['ingresoventa']) ? '' : $informacion['ingresoventa'])
                ->setCellValue('E66', empty($informacion['totalingreso']) ? '' : $informacion['totalingreso'])
                ->setCellValue('T61', empty($informacion['gastofamiliar']) ? '' : $informacion['gastofamiliar'])
                ->setCellValue('T62', empty($informacion['gastoarriendo']) ? '' : $informacion['gastoarriendo'])
                ->setCellValue('T65', empty($informacion['valorotrogasto']) ? '' : $informacion['valorotrogasto'])
                ->setCellValue('E62', empty($informacion['salariovariable']) ? '' : $informacion['salariovariable'])
                ->setCellValue('E63', empty($informacion['ingresoarriendo']) ? '' : $informacion['ingresoarriendo'])
                ->setCellValue('E65', empty($informacion['valorotroingreso']) ? '' : $informacion['valorotroingreso'])
                ->setCellValue('T63', empty($informacion['gastofinanciero']) ? '' : $informacion['gastofinanciero'])
                ->setCellValue('X63', empty($informacion['activocorriente']) ? '' : $informacion['activocorriente']);
    }

    private function reemplazoTexto(&$celda, $informacion) {
        $celda = str_replace('((NUMERO_VENTA))', $informacion['idventa'], $celda);
        $celda = str_replace('((NOMBRE_TERCERO))', $informacion['nombretercero'], $celda);
        $celda = str_replace('((LUGAR_EXPEDICION))', $informacion['lugarexpedicion'], $celda);
        $celda = str_replace('((NUMERO_DOCUMENTO))', $informacion['documentotercero'], $celda);
        $celda = str_replace('((NUMERO_FINANCIACION))', $informacion['idfinanciacion'], $celda);
    }
    
    private function informacionTratamientoDatos(&$sheetActive, $informacion) {
        $A5 = (string) $sheetActive->getCell('A5')->getValue();
        $A5 = str_replace('(DIAS)', $informacion['dias'], $A5);
        $A5 = str_replace('(MESACTUAL)', $informacion['mesactual'], $A5);
        $A5 = str_replace('(ANIOACTUAL)', $informacion['anioactual'], $A5);
        $sheetActive->setCellValue('A5', $A5)
                ->setCellValue('B18', $informacion['nombretercero'])
                ->setCellValue('B19', $informacion['documentotercero'])
                ->setCellValue('B34', $informacion['nombretercero'])
                ->setCellValue('B35', $informacion['documentotercero'])
                ->setCellValue('A39', $informacion['usuario'])
                ->setCellValue('E39', $informacion['fechaactual'])
                ->setCellValue('G39', $informacion['idsuscripcion']);
        
    }

}
