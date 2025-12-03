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

            $idEmpresa = $sesion->get('idEmpresa');
            $nombre = $informacion['nombreformato'];
            switch ($nombre) {

                case 'PagareyVinculacionGasNaturalDomiciliarioPersonaJuridica':
                    $nombre = $informacion['nombreformato'] . $idEmpresa;
                    break;
                case 'PagareyVinculacionGasNaturalDomiciliariaPersonaNatural':
                    $nombre = $informacion['nombreformato'] . $idEmpresa;
                    break;
                case 'PagarePersonaJuridicaFinal':
                    if($idEmpresa == 317){
                        $nombre = "BIO-" . $informacion['nombreformato'] . $idEmpresa;
                    }else{
                        $nombre = $informacion['nombreformato'] . $idEmpresa;
                    }
                    break;
                case 'PagarePersonaNaturalFinal':
                    if($idEmpresa == 317){
                        $nombre = "BIO-" . $informacion['nombreformato'] . $idEmpresa;
                    }else{
                        $nombre = $informacion['nombreformato'] . $idEmpresa;
                    }
                    break;
                case 'TratamientoDatos':
                    if($idEmpresa == 317){
                        $nombre = "BIO-" . $informacion['nombreformato'] . $idEmpresa;
                    }else{
                        $nombre = $informacion['nombreformato'] . $idEmpresa;
                    }
                    break;
                case 'FormatoFinanciacion':
                    if($idEmpresa == 317){
                        $nombre = "BIO-" . $informacion['nombreformato'] . $idEmpresa;
                    }else{
                        $nombre = $informacion['nombreformato'] . $idEmpresa;
                    }
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
                break;
            case 'BIO-PagarePersonaNaturalFinal'. $this->session->get('idEmpresa'):
                $this->informacionPagareNaturalFinalBIO($sheetActive, $informacion, null);
                break;
            case 'PagarePersonaJuridicaFinal'. $this->session->get('idEmpresa'):
                $this->informacionPagareJuridicoFinal($sheetActive, $informacion, null);
                break;
            case 'BIO-PagarePersonaJuridicaFinal'. $this->session->get('idEmpresa'):
                $this->informacionPagareJuridicoFinalBIO($sheetActive, $informacion, null);
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
            case 'BIO-TratamientoDatos'. $this->session->get('idEmpresa'):
                $this->informacionTratamientoDatosBIO($sheetActive, $informacion);
                break;
            case 'BIO-FormatoFinanciacion'. $this->session->get('idEmpresa'):
                $this->informacionFormatoFinanBIO($sheetActive, $informacion);
                break;
        }
        $nombreformato = explode('_', $nombre)[1];
        return $xlsObj;
    }

    /**
     * Llena el espacio de la persona natural
     * @param type $sheetActive hoja a la cual se va a diligenciar la informaciÃ³n
     * @param type $informacion informaciÃ³n de la persona natural
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
     * Llena la plantilla en el formato de excel el secciÃ³n de persona jurÃ­dica 
     * @param type $sheetActive hoja a la cual se va a diligenciar la informaciÃ³n
     * @param type $informacion informaciÃ³n de la persona natural
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
     * Diligencia toda la informaciÃ³n del pagerÃ© persona natural
     * @param type $sheetActive hoja que se estÃ¡ modificando
     * @param type $informacion array con la informaciÃ³n
     * @param string $celdas array con la informaciÃ³n de las celdas a afectar
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

    /**
     * Diligencia toda la información del pageré persona natural
     * @param type $sheetActive hoja que se está modificando
     * @param type $informacion array con la información
     * @param string $celdas array con la información de las celdas a afectar
     */
    private function informacionPagareNaturalFinalBIO(&$sheetActive, $informacion, $celdas) {
        if ($celdas == null || empty($celdas)) {
            $celdas = array('C5', 'C7', 'C34', 'D27', 'D28', 'D81', 'D82');
        }

        $C5 = (string) $sheetActive->getCell($celdas[0])->getValue(); //FILA NUMERO FINANCIACION
        $C7 = (string) $sheetActive->getCell($celdas[1])->getValue(); //FILA TEXTO COMPLETO 1
        $C34 = (string) $sheetActive->getCell($celdas[2])->getValue(); //FILA TEXTO COMPLETO 1

        $this->reemplazoTexto($C5, $informacion);
        $this->reemplazoTexto($C7, $informacion);
        $C7 = str_replace('((MUNICIPIO))', $informacion['municipio'], $C7);
        $this->reemplazoTexto($C34, $informacion);
        $sheetActive->setCellValue($celdas[0], $C5)
                ->setCellValue($celdas[1], $C7)
                ->setCellValue($celdas[2], $C34)
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

    private function informacionPagareJuridicoFinalBIO(&$sheetActive, $informacion, $celdas) {
        if ($celdas == NULL || empty($celdas)) {
            $celdas = array('C5', 'C7', 'C33', 'D26', 'D27', 'D38', 'D39');
        }

        $C5 = (string) $sheetActive->getCell($celdas[0])->getValue(); //FILA NUMERO FINANCIACION (A1)
        $C7 = (string) $sheetActive->getCell($celdas[1])->getValue(); //FILA TEXTO COMPLETO (A4)
        $C33 = (string) $sheetActive->getCell($celdas[2])->getValue(); //FILA TEXTO COMPLETO (A33)

        $this->reemplazoTexto($C5, $informacion);
        $this->reemplazoTexto($C7, $informacion);
        $this->reemplazoTexto($C33, $informacion);
        $C7 = str_replace('((MUNICIPIO))', $informacion['municipio'], $C7);
        $C7 = str_replace('((NOMBRE_SOLICITANTE))', $informacion['nombresolicitante'], $C7);
        $C7 = str_replace('((LUGAR_EXPEDICIONSOLICITANTE))', $informacion['lugarsolicitante'], $C7);
        $C7 = str_replace('((NUMERO_DOCUMENTOSOLICITANTE))', $informacion['documentosolicitante'], $C7);
        $C33 = str_replace('((MUNICIPIO))', $informacion['municipio'], $C33);
        $C33 = str_replace('((NOMBRE_SOLICITANTE))', $informacion['nombresolicitante'], $C33);
        $C33 = str_replace('((LUGAR_EXPEDICIONSOLICITANTE))', $informacion['lugarsolicitante'], $C33);
        $C33 = str_replace('((NUMERO_DOCUMENTOSOLICITANTE))', $informacion['documentosolicitante'], $C33);
//        $this->reemplazoTexto($A30, $informacion);
        $sheetActive->setCellValue($celdas[0], $C5)
                ->setCellValue($celdas[1], $C7)
                ->setCellValue($celdas[2], $C33)
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
            ///InformaciÃ³n personal y laboral
            $this->informacionPersonaNatural($sheetActive, $informacion, $informacion['personanatural']);
            $this->informacionFinanciera($sheetActive, $informacion['personanatural']);
        }
        //InformaciÃ³n JurÃ­dica
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

        //InformaciÃ³n general del formato

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
        //InformaciÃ³n financiera
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

    private function informacionTratamientoDatosBIO(&$sheetActive, $informacion) {
        $C8 = (string) $sheetActive->getCell('C8')->getValue();
        $C8 = str_replace('((VALOR_FINANCIAR))', $informacion['totalFinanciar'], $C8);
	$C8 = str_replace('((VALOR_FINANCIAR_LETRAS))', $informacion['totalFinanciarLetters'], $C8);

        $C8 = str_replace('((DIRECCION_SUS))', $informacion['direccion'], $C8);
        $C8 = str_replace('((BARRIO_SUS))', $informacion['barrio'], $C8);
        $C8 = str_replace('((MUNICIPIO_SUS))', $informacion['municipio'], $C8);
        $C8 = str_replace('((NUM_SUSCRIPCION))', $informacion['idsuscripcion'], $C8);
        $C8 = str_replace('((FACTURAS))', $informacion['numerosFacturas'], $C8);


        $C25 = (string) $sheetActive->getCell('C25')->getValue();
        $C25 = str_replace('((DIAS))', $informacion['dias'], $C25);
        $C25 = str_replace('((MESACTUAL))', $informacion['mesactual'], $C25);
        $C25 = str_replace('((ANIOACTUAL))', $informacion['anioactual'], $C25);
        $sheetActive->setCellValue('C25', $C25)
                ->setCellValue('C8', $C8)
                ->setCellValue('D29', $informacion['nombretercero'])
                ->setCellValue('D30', $informacion['documentotercero'])
                ->setCellValue('D41', $informacion['nombretercero'])
                ->setCellValue('D42', $informacion['documentotercero']);       
    }

    private function informacionFormatoFinanBIO(&$sheetActive, $informacion) {
        $celdas = array('C14','H14','M14','C17','H17','M17','C20','H20','M20','C23','F23','K23','O23','C26','C48','D51','D52');

        $C14 = str_replace('((NUM_SUSCRIPCION))', $informacion['idsuscripcion'],(string) $sheetActive->getCell($celdas[0])->getValue());
        $H14 = str_replace('((PERIODO))', $informacion['periodo'],(string) $sheetActive->getCell($celdas[1])->getValue());
        $M14 = str_replace('((NUMERO_FINANCIACION))', $informacion['idfinanciacion'],(string) $sheetActive->getCell($celdas[2])->getValue());
        $C17 = str_replace('((NUM_TERCERO))', $informacion['documentotercero'],(string) $sheetActive->getCell($celdas[3])->getValue());
        $H17 = str_replace('((PARENTESCO_TER))', $informacion['parentesco'],(string) $sheetActive->getCell($celdas[4])->getValue());
        $M17 = str_replace('((DIRECCION_SUS))', $informacion['direccion'],(string) $sheetActive->getCell($celdas[5])->getValue());
        $C20 = str_replace('((FECHA_FINANCIACION))', $informacion['fechaFinanciacion'],(string) $sheetActive->getCell($celdas[6])->getValue());
        $H20 = str_replace('((VALOR_TOTAL))', $informacion['totalFacturas'],(string) $sheetActive->getCell($celdas[7])->getValue());
        $M20 = str_replace('((VALOR_CUOTA_INICIAL))', $informacion['totalCuotaInicial'],(string) $sheetActive->getCell($celdas[8])->getValue());
        $C23 = str_replace('((VALOR_FINANCIAR))', $informacion['totalFinanciar'],(string) $sheetActive->getCell($celdas[9])->getValue());
        $F23 = str_replace('((NUM_CUOTAS))', $informacion['cuotas'],(string) $sheetActive->getCell($celdas[10])->getValue());
        $K23 = str_replace('((VALOR_CUOTA))', $informacion['valorCuota'],(string) $sheetActive->getCell($celdas[11])->getValue());
        $O23 = str_replace('((TASA_INTERES))', $informacion['tasaInteres'],(string) $sheetActive->getCell($celdas[12])->getValue());
        $C26 = str_replace('((FACTURAS))', $informacion['numerosFacturas'],(string) $sheetActive->getCell($celdas[13])->getValue());
        $C48 = str_replace('((PARENTESCO_TER))', $informacion['parentesco'],(string) $sheetActive->getCell($celdas[14])->getValue());

        $sheetActive->setCellValue($celdas[0], $C14)
                ->setCellValue($celdas[1], $H14)
                ->setCellValue($celdas[2], $M14)
                ->setCellValue($celdas[3], $C17)
                ->setCellValue($celdas[4], $H17)
                ->setCellValue($celdas[5], $M17)
                ->setCellValue($celdas[6], $C20)
                ->setCellValue($celdas[7], $H20)
                ->setCellValue($celdas[8], $M20)
                ->setCellValue($celdas[9], $C23)
                ->setCellValue($celdas[10], $F23)
                ->setCellValue($celdas[11], $K23)
                ->setCellValue($celdas[12], $O23)
                ->setCellValue($celdas[13], $C26)
                ->setCellValue($celdas[14], $C48)
                ->setCellValue($celdas[15], $informacion['nombretercero'])
                ->setCellValue($celdas[16], $informacion['documentotercero']);       
    }

 }
