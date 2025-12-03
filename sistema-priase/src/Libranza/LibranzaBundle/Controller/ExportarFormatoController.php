<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Libranza\LibranzaBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Exportar informacion de un formato existente, excel
 *
 * @author progredi1
 */
class ExportarFormatoController extends Controller {

    /**
     *  Carga la informacion del credito a una varible de sesion 
     * @return type
     */
    public function cargarSesionDatosAction() {
        $request = $this->getRequest();
        $datosCredito = $request->get('solicitudCredito');
        $sesion = Util::iniciarSesion($this);
        $_SESSION['datosCredito'] = $datosCredito;
        $respuesta['codigoRespuesta'] = 1;
        $respuesta['mensaje'] = 'Datos almacenados en una variable';
        return Util::construyeRespuesta($respuesta);
    }

    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $info = $sesion->get('datosCredito'); //
        //  print_r($sesion->get('datosCredito')['informacion']);
        //$info = '{"estado":"R","nombre":"Probar Probar Probar Probar Probar","informacion":{"fechasolicitud":"2016-03-23","numeroradicado":"","primernombre":"Probar","segundonombre":"Probar","primerapellido":"Probar","segundoapellido":"Probar","tipodocumento":"C.E.","documento":"454654","fechanacimiento":"1993/03/03","paisnacimiento":"COLOMBIA","departamentonacimiento":"ANTIOQUIA","lugarnacimiento":"Bogota","estadocivil":"Soltero","sexo":"\n                                M\n                            ","menoresedad":"0","mayoresedad":"0","niveleducacion":"Secundaria","profesion":"Contador","nombreconyugue":"","apellidoconyugue":"","tipodocumentoconyugue":"C.C.","documentoconyugue":"","conyuguetrabaja":"\n                                Sí\n                            ","empresaconyugue":"","telefonoconyugue":"","direccionconyugue":"","ciudadconyugue":"","pais":"COLOMBIA","departamento":"META","idmunicipio":"Acacias","barrio":"ARAYANES","direccion":"sasf","zonaresidencial":"\n                                Urbana\n                            ","telefonofijo":"5454564","celular":"4565464","anosresidencia":"54654","mesesresidencia":"65464","tipovivienda":"Propia sin Hipoteca","enviocorrespondencia":"Correo Electronico","correo":"nena_pc@hotmail.com","valorarriendo":"152400","estrato":"3","actividadeconomica":[{"actividadeconomica":"872","empresaempleado":"BANCO POPULAR","nitempresaempleado":"110501","fechaingresoempleado":"1988/03/23","telefonoempleado":"564654","tipocargoempleado":"Operario","tipocontratoempleado":"Contrato Indefinido","salariobasicoempleado":"54600","deduccionesnominaempleado":"45000","salarionetoempleado":"9600"}],"referenciafamiliar":[{"nombrereferenciafamiliar":"Prueba","apellidoreferenciafamiliar":"Prueba","parentescoreferenciafamiliar":"Madre","celularreferenciafamiliar":"4646","telefonoreferenciafamiliar":"14654654","direccionreferenciafamiliar":"Calle","ocupacionreferenciafamiliar":"Contador","departamentoreferenciafamiliar":"CUNDINAMARCA","ciudadreferenciafamiliar":""}],"referenciapersonal":[{"nombrereferenciapersonal":"Probar","apellidoreferenciapersonal":"Probar","parentescoreferenciapersonal":"Madre","celularreferenciapersonal":"5464","telefonoreferenciapersonal":"564654","direccionreferenciapersonal":"calle","ocupacionreferenciapersonal":"Ingeniero Civil","departamentoreferenciapersonal":"CUNDINAMARCA","ciudadreferenciapersonal":""}],"salariobasico":"0","otrosingresos":"4500","otrosingresosarriendo":"456000","descripcionotrosingresos":"45000","gastoshogar":"450000","arriendocuotavivienda":"45000","cuotabanco":"456000","otrosgastos":"65400","declararenta":"\n                                 No\n                            ","totalingresosmes":"460500","totalgastos":"1016400","totalactivos":"$1,450,000.00","totalpasivos":"465000","experienciafinanciera":"","productofinanciero":"Credito Libranza","montosolicitado":"154000","destinocredito":"LIBRE INVESIÓN","plazo":"18","activos":[{"idciudad":null,"detalle":"Casa","tipoactivo":"878","valorcomercial":"1450000","placadireccion":"145000","iddepartamento":"11"}],"entidadfinanciera":"BANCO DAVIVIENDA","tipocuentadesembolso":"Cuenta Corriente","numerocuenta":"465748920","nombrebeneficiario":"POTENZA INVERSIONES SAS","tipoidentificacion":"NIT","numerodocumentobeneficiario":"900618586","archivos":[],"accion":"imprimir"},"fecha":"2016-03-23","documento":"454654"}';
        $solicitudCredito = $info;
        $listaCreditos = $solicitudCredito['informacion'];
        $objPHPExcel = $this->cargarInformacion($listaCreditos);
        $this->response = new StreamedResponse();
        $formato = 'Excel2007';
        $this->response->setCallback(function()use($formato, $objPHPExcel) {
            $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, $formato);
            $objWriter->save('php://output');
        });
//        $this->response->headers->set('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
//        $this->response->headers->set('Content-Disposition', 'attachment; filename=solicitudcredito.xlsx');
        return $this->response;
        //     return new \Symfony\Component\HttpFoundation\Response('Te voy a coger la pernita');
    }

    private function cargarInformacion($credito) {
        $objReader = \PHPExcel_IOFactory::createReader('Excel2007');

        //$nombre = '/var/www/html/achagua/sistema/app/Resources/formatos/SolicitudCredito.xlsx';
        $nombre = RUTA_PRINCIPAL . '/app/Resources/formatos/SolicitudCredito.xlsx';
        $this->hojaCargada = $objReader->load($nombre);
        $this->hojaCargada->setActiveSheetIndex(0);
        $this->informacionBasica($this->hojaCargada, $credito);
        $this->ubicacion($this->hojaCargada, $credito);
        $this->infomacionLaboral($this->hojaCargada, $credito);
        $this->referenciaFamiliar($this->hojaCargada, $credito);
        $this->referenciaPersonal($this->hojaCargada, $credito);
        $this->informacionFinanciera($this->hojaCargada, $credito);
        $this->productoSolicitado($this->hojaCargada, $credito);
        $this->activos($this->hojaCargada, $credito);
        $this->autorizacionDesembolso($this->hojaCargada, $credito);
        // $this->polizaSeguro($this->hojaCargada, $credito);
        $this->experienciaFinanciera($this->hojaCargada, $credito);
//        $objWriter = \PHPExcel_IOFactory::createWriter($this->hojaCargada, 'Excel2007');
//        $objWriter->save('/var/www/html/achagua/sistema/app/formatoNuevo.xlsx');
        return $this->hojaCargada;
    }

    private function informacionBasica(&$hojaCargada, $credito) {
        $hojaCargada->getActiveSheet()->setCellValue('AL4', $credito['numeroradicado'])
                ->setCellValue('I4', $credito['fechasolicitud'])
                ->setCellValue('D11', $credito['tipodocumento'])
                ->setCellValue('C8', $credito['primernombre'])
                ->setCellValue('V8', $credito['primerapellido'])
                ->setCellValue('AG8', $credito['segundoapellido'])
                ->setCellValue('C13', $credito['documento'])
                ->setCellValue('C16', $credito['estadocivil'])
                ->setCellValue('L13', $credito['fechanacimiento'])
                ->setCellValue('V13', $credito['lugarnacimiento'])
                ->setCellValue('AN13', $credito['personasacargo'])
                ->setCellValue('L16', $credito['niveleducacion'])
                ->setCellValue('V16', $credito['profesion'])
                ->setCellValue('AG16', $credito['correo'])
                ->setCellValue('E19', $credito['nombreconyugue'] . ' ' . $credito['apellidoconyugue'])
                ->setCellValue('AB19', $credito['documentoconyugue'])
                ->setCellValue('F21', $credito['empresaconyugue'])
                ->setCellValue('Q21', $credito['telefonoconyugue'])
                ->setCellValue('AA21', $credito['direccionconyugue'])
                ->setCellValue('AK21', $credito['ciudadconyugue']);

        $this->validaConyugueTrabaja($credito['conyuguetrabaja'], $hojaCargada);
        $this->validarSexo($credito['sexo'], $hojaCargada);
        $this->validarCeldaTipoDocumentoConyugue($credito['tipodocumentoconyugue'], $hojaCargada);

        $nombre = $credito['primernombre'] . ' ' . $credito['primerapellido'] . ' ' . $credito['segundoapellido'];
        $hojaCargada->getActiveSheet()->setCellValue('E115', $nombre)
                ->setCellValue('D116', $credito['documento']);
    }

    private function ubicacion(&$hojaCargada, $credito) {
        $hojaCargada->getActiveSheet()->setCellValue('C25', $credito['direccion'])
                ->setCellValue('M25', $credito['barrio'])
                ->setCellValue('T25', $credito['idmunicipio'])
                ->setCellValue('AB25', $credito['departamento'])
                ->setCellValue('AK25', $credito['pais'])
                ->setCellValue('AQ25', $credito['estrato'])
                ->setCellValue('C29', $credito['telefonofijo'])
                ->setCellValue('I29', $credito['celular'])
                ->setCellValue('O29', $credito['tipovivienda'])
                ->setCellValue('V29', $credito['valorarriendo'])
                ->setCellValue('AP28', $credito['mesesresidencia'])
                ->setCellValue('AO29', $credito['enviocorrespondencia']);
    }

    private function infomacionLaboral(&$hojaCargada, $credito) {
        $_actividadEconomica = $credito['actividadeconomica'][0];
        $hojaCargada->getActiveSheet()->setCellValue('Q33', $_actividadEconomica['empresaempleado'])
                ->setCellValue('AB33', $_actividadEconomica['nitempresaempleado'])
                ->setCellValue('O35', $_actividadEconomica['fechaingresoempleado'])
                ->setCellValue('X35', $_actividadEconomica['telefonoempleado'])
                ->setCellValue('O38', $_actividadEconomica['tipocargoempleado'])
                ->setCellValue('H42', $_actividadEconomica['salariobasicoempleado'])
                ->setCellValue('U42', $_actividadEconomica['deduccionesnominaempleado'])
                ->setCellValue('AM42', $_actividadEconomica['salarionetoempleado']);
        $this->validarActividadEconomica($_actividadEconomica['actividadeconomica'], $hojaCargada);
        $this->validarTipoContrato($_actividadEconomica['tipocontratoempleado'], $hojaCargada);
    }

    private function referenciaFamiliar(&$hojaCargada, $credito) {
        $_referencia = $credito['referenciafamiliar'][0];
        $hojaCargada->getActiveSheet()->setCellValue('L45', $_referencia['nombrereferenciafamiliar'] . ' ' . $_referencia['apellidoreferenciafamiliar'])
                ->setCellValue('AD45', $_referencia['telefonoreferenciafamiliar'])
                ->setCellValue('AO45', $_referencia['celularreferenciafamiliar']);
        //->setCellValue('I53', $_referencia['direccionreferenciafamiliar'])
        //->setCellValue('T53', $_referencia['ocupacionreferenciafamiliar'])
        //->setCellValue('AD53', $_referencia['ciudadreferenciafamiliar'])
        //->setCellValue('AO53', $_referencia['departamentoreferenciafamiliar']);
    }

    private function referenciaPersonal(&$hojaCargada, $credito) {
        $_referencia = $credito['referenciapersonal'][0];
        $hojaCargada->getActiveSheet()->setCellValue('L48', $_referencia['nombrereferenciapersonal'] . ' ' . $_referencia['apellidoreferenciapersonal'])
                ->setCellValue('AD48', $_referencia['telefonoreferenciapersonal'])
                ->setCellValue('AO48', $_referencia['celularreferenciapersonal']);
//                ->setCellValue('I57', $_referencia['direccionreferenciapersonal'])
//                ->setCellValue('T57', $_referencia['ocupacionreferenciapersonal'])
//                ->setCellValue('AD57', $_referencia['ciudadreferenciapersonal'])
//                ->setCellValue('AO57', $_referencia['departamentoreferenciapersonal']);
    }

    private function activos(&$hojaCargada, $credito) {
        if(!empty($credito['activos'])){
            $_activos = $credito['activos'][0];
            $hojaCargada->getActiveSheet()
                    //->setCellValue('E87', $_activos['detalle'])
                    ->setCellValue('O54', $_activos['placadireccion'])
                    ->setCellValue('AA54', $_activos['idciudad'])
                    ->setCellValue('AK54', $_activos['valorcomercial']);
            $this->validarTipoActivo($_activos['tipoactivo'], $hojaCargada);
        }
    }

    private function informacionFinanciera(&$hojaCargada, $credito) {
        $hojaCargada->getActiveSheet()->setCellValue('N59', $credito['salariobasico'])
                ->setCellValue('N60', $credito['otrosingresos'])
                ->setCellValue('N61', $credito['otrosingresosarriendo'])
                ->setCellValue('C65', $credito['descripcionotrosingresos'])
                ->setCellValue('AL59', $credito['gastoshogar'])
                ->setCellValue('AL60', $credito['arriendocuotavivienda'])
                ->setCellValue('AL61', $credito['cuotabanco'])
                ->setCellValue('AL62', $credito['otrosgastos']);
        $this->validarDeclaraRenta($credito['declararenta'], $hojaCargada);
    }

    private function experienciaFinanciera(&$hojaCargada, $credito) {
        foreach ($credito['experienciafinanciera'] as $experiencia) {
            switch (strtolower(trim($experiencia['idproducto']))) {
                case 'tarjetas de credito':
                    $hojaCargada->getActiveSheet()->setCellValue('P72', $experiencia['cantidad']);
                    break;
                case 'creditos':
                    $hojaCargada->getActiveSheet()->setCellValue('V72', $experiencia['cantidad']);
                    break;
            }
        }
    }

    private function productoSolicitado(&$hojaCargada, $credito) {
        $hojaCargada->getActiveSheet()->setCellValue('I76', $credito['montosolicitado'])
                ->setCellValue('AF75', $credito['plazo'])
                ->setCellValue('S76', 'x'); //$credito['destinocredito']
        //->setCellValue('C76', $credito['productofinanciero']);
    }

    private function autorizacionDesembolso(&$hojaCargada, $credito) {
        $hojaCargada->getActiveSheet()->setCellValue('C85', $credito['entidadfinanciera'])
                ->setCellValue('AC85', $credito['numerocuenta']);
        $this->validarTipoCuenta($credito['tipocuentadesembolso'], $hojaCargada);
    }

//    private function polizaSeguro(&$hojaCargada, $credito) {
//        $hojaCargada->getActiveSheet()->setCellValue('O110', $credito['numerodocumentobeneficiario'])
//                ->setCellValue('I109', $credito['nombrebeneficiario'])
//                ->setCellValue('H110', $credito['tipoidentificacion']) //$credito['tipoidentificacion']
//                ->setCellValue('AA110', $credito['parentescobeneficiario']); //$credito['tipoidentificacion']
//    }
    // <editor-fold defaultstate="collapsed" desc="Validacion de Celdas ">

    private function validarSexo($sexo, &$hojaCargada) {
        switch (strtolower(trim($sexo))) {
            case 'f':
                $hojaCargada->getActiveSheet()->setCellValue('AI11', 'x');
                break;
            case 'm':
                $hojaCargada->getActiveSheet()->setCellValue('AN11', 'x');
                break;
        }
    }

    private function validarCeldaTipoDocumentoConyugue($tipoDocumento, &$hojaCargada) {
        switch (strtolower(trim($tipoDocumento))) {
            case 'c.c.':
                $hojaCargada->getActiveSheet()->setCellValue('U19', 'x');
                break;
            case 'c.e.':
                $hojaCargada->getActiveSheet()->setCellValue('W19', 'x');
                break;
        }
    }

    private function validaConyugueTrabaja($conyugueTrabaja, &$hojaCargada) {
        switch (strtolower(trim($conyugueTrabaja))) {
            case 'sí':
                $hojaCargada->getActiveSheet()->setCellValue('AP19', 'x');
                break;
            case 'no':
                $hojaCargada->getActiveSheet()->setCellValue('AR19', 'x');
                break;
        }
    }

    private function validarActividadEconomica($actividadEconomica, &$hojaCargada) {
        switch (strtolower(trim($actividadEconomica))) {
            case 'empleado':
                $hojaCargada->getActiveSheet()->setCellValue('C35', 'x');
                break;
            case 'pensionado':
                $hojaCargada->getActiveSheet()->setCellValue('C38', 'x');
                break;
        }
    }

    private function validarTipoContrato($tipoContrato, &$hojaCargada) {
        switch (strtolower(trim($tipoContrato))) {
            case'contrato fijo':
                $hojaCargada->getActiveSheet()->setCellValue('AL35', 'x');
                break;
            case'meses':
                $hojaCargada->getActiveSheet()->setCellValue('AP35', 'x');
                break;
            case'contrato indefinido':
                $hojaCargada->getActiveSheet()->setCellValue('AL38', 'x');
                break;
        }
    }

    private function validarTipoActivo($tipoActivo, &$hojaCargada) {
        switch (strtolower(trim($tipoActivo))) {
            case 'carro':
                $hojaCargada->getActiveSheet()->setCellValue('E54', 'x');
                break;
            case 'moto':
                $hojaCargada->getActiveSheet()->setCellValue('H54', 'x');
                break;
            case 'casa':
                $hojaCargada->getActiveSheet()->setCellValue('E55', 'x');
                break;
            case 'otro':
                $hojaCargada->getActiveSheet()->setCellValue('E56', 'x');
                break;
        }
    }

    private function validarDeclaraRenta($declaraRenta, &$hojaCargada) {
        switch (strtolower(trim($declaraRenta))) {
            case'sí':
                $hojaCargada->getActiveSheet()->setCellValue('H68', 'x');
                break;
            case'no':
                $hojaCargada->getActiveSheet()->setCellValue('M68', 'x');
                break;
        }
    }

    private function validarTipoCuenta($tipoCuenta, &$hojaCargada) {
        switch (strtolower(trim($tipoCuenta))) {
            case 'cuenta ahorros':
                $hojaCargada->getActiveSheet()->setCellValue('N85', 'x');
                break;
            case 'cuenta corriente':
                $hojaCargada->getActiveSheet()->setCellValue('T85', 'x');
                break;
        }
    }

    //</editor-fold>
}
