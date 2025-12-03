<?php

namespace Libranza\LibranzaBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Libranza\LibranzaBundle\Models\RegistroCreditoModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class DesembolsoDelegado {

    /**
     * Información de la sesión.
     * @var SessionInterface 
     */
    private $sesion;

    /**
     *  Conexión a la base de datos 
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var RegistroCreditoModel 
     */
    private $registroCreditoModel;

    /**
     *
     * @var RegistroCreditoDelegado 
     */
    private $registroCreditoDelegado;

    /**
     *
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    /**
     *
     * @var Controller 
     */
    private $control;

    public function __construct(Controller &$control, $sesion = null) {
        $this->conexion = Util::getConexion($control);
        $this->control = $control;
        $this->sesion = $sesion;
        $this->registroCreditoModel = new RegistroCreditoModel($this->conexion);
        $this->registroCreditoDelegado = new RegistroCreditoDelegado($control, $sesion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
    }

    /**
     * permite procesar el desembolso
     * @param type $creditos
     */
    public function procesarDesembolso($creditos, $idempresa, $idClico) { 
        try {
            $this->conexion->beginTransaction();
            $creditosAprobados = [];
            foreach ($creditos as $credito) {
                $parametros['idcredito'] = $credito['idcredito'];
                $parametros['documento'] = '-1';
                $parametros['nombre'] = '-1';
                $parametros['estado'] = ESTADO_RADICACION_APROBACION_APROBAR;
                $informacionCredito = $this->registroCreditoDelegado->consultar($parametros);
               // $informacionCreditoE = $this->registroCreditoDelegado->consultar_estudio($parametros);  
                $tercero = $this->procesarTercero($informacionCredito[0]);   
                $this->procesarCltTercero($tercero, $idempresa);  
                $idpropiedad = NULL ;               
                $idsuscriptor = NULL ;
                $idsuscripcion =NULL ;                            
                // validar si existe una suscripcion 
                $suscripcion = $this->validarSuscripcion($tercero , $idempresa);
                if (empty($suscripcion)) 
                {
                    //Crear una propiedad
                    $idpropiedad = $this->crearPropiedad($informacionCredito[0], $tercero);
                    //permite insertar y actualizar los campos de la porpiedad
                    $this->registroCreditoModel->actualizarPropiedad($idpropiedad);
                    //permite incluir un suscriptor
                    $idsuscriptor = $this->insertarSuscriptor($tercero);
                    //permite crear una suscripción nueva
                    $idsuscripcion = $this->CrearSuscripcion($informacionCredito[0], $idsuscriptor, $tercero, $idpropiedad, $idempresa, $idClico);
                }
                else
                {
                    $idpropiedad =  $suscripcion['pro_ideregistro'] ;               
                    $idsuscriptor = $suscripcion['sus_ideregistro'] ;
                    $idsuscripcion = $suscripcion['dsus_ideregistr'] ;                    
                    $this->actualizarPropiedad($informacionCredito[0] , $idpropiedad);
                    $this->actualizarSuscripcion($informacionCredito[0] , $idsuscripcion);
                }
                $this->registroCreditoModel->actualizarSuscripcion($idsuscripcion, $informacionCredito[0]);
                //Consulta la suscripcion registrada
                $suscripcion = $this->genericoModel->consultarInformacionSuscripcion($idsuscripcion);
                //Se crea la factura para procesar su contenido
                $idFactura = $this->procesarFactura($idempresa, $idClico, $suscripcion, $informacionCredito[0]);
                //Se cran los conceptos para la factura
                $detallefacturaArray = $this->procesarDetalleFactura($idFactura, $informacionCredito);
                //Consulta la factura
                $factura = $this->registroCreditoModel->consultarFactura($idFactura['idFactura']);
                //Consulta la factura para el amfi de la Libranzas
                $factura_amfi = $this->registroCreditoModel->consultarFacAmfiLib($idFactura['idFactura']);                
                //inserta la fianciacion
                $idfinanciacion = $this->procesarFinanciacion($factura, $informacionCredito[0]['identidadfinanciera']);
                //Se crea el detalle financiacion para el monto
                $this->procesarDetalleFinanciacion($idfinanciacion, $detallefacturaArray, $factura);
                //Se crea la amortizacion
                $this->procesarAmortizacionFinanciacion($informacionCredito[0], $idfinanciacion, $factura_amfi );
                //Crea una nota NF
                $idnotanf = $this->procesarNotasnf($factura);
                //Inserta en la tabla not_nota
                $idnota = $this->procesarNotNota($factura);
                //Crea las notas de los detalle
                $this->procesarDetallebNotaNf($detallefacturaArray, $idnotanf, $idnota);
                //Actualizar los saldos de las notas
                $this->genericoDelegado->actualizarFacturaSaldo($idnotanf, 1, 'NT');
                //Se le cambia la etapa el credito cuando se desembolsa
                $this->registroCreditoModel->validarCredito($credito['idcredito'], ESTADO_RADICACION_DESEMBOLSO_APROBADO);
                //se ctualizan los saldos de la factura
                $this->genericoDelegado->actualizarFacturaSaldo($idFactura['idFactura'], 1);
                //se ctualizan los saldos de la financiacion
                $this->genericoDelegado->actualizarFinanciacionSaldo($idfinanciacion, 1);
                //Actualizar el saldo de capital inicial
                $this->registroCreditoModel->actualizarCapitalInicialFinanciacion($idFactura['idFactura'], $idfinanciacion);
                //Se actualiza el numero de la factura
                //Se actualiza la tabla comentarios
                $this->registroCreditoModel->insertarComentarioCredito($credito['idcredito'], 882, 840, 'Desembolso');
                //Respuesta
                $respuesta['idcredito'] = $credito['idcredito'];
                $respuesta['idsuscripcion'] = $suscripcion['idsuscripcion'];
                $respuesta['idfinanciacion'] = $idfinanciacion;
                //Agrega los datos al arreglo de respuesta del metodo
                array_push($creditosAprobados, $respuesta);   
                //Actualiza el credito con algunos  datos del desembolso
                $this->registroCreditoModel->actualizarCreditoDesembolso($respuesta);
                //Se Actualiza el estado de la factura
                $facturaAtualizar['estado'] = 'F';
                $facturaAtualizar['idfactura'] = $idFactura['idFactura'];
                $this->registroCreditoModel->actualizarFactura($facturaAtualizar);
                
                // Procesar la financiacion del Estudio de Credito 
               /*if (!empty($informacionCreditoE)) 
                {
                    $idFactura = $this->procesarFactura($idempresa, $idClico, $suscripcion, $informacionCreditoE[0]);
                    //Se cran los conceptos para la factura
                    $detallefacturaArray = $this->procesarDetalleFactura($idFactura, $informacionCreditoE);
                    //Consulta la factura
                    $factura = $this->registroCreditoModel->consultarFactura($idFactura['idFactura']);
                    //Consulta la factura para el amfi de la Libranzas
                    $factura_amfi = $this->registroCreditoModel->consultarFacAmfiLib($idFactura['idFactura']);                
                    //inserta la fianciacion
                    $idfinanciacion = $this->procesarFinanciacion($factura, $informacionCreditoE[0]['identidadfinanciera']);
                    //Se crea el detalle financiacion para el monto
                    $this->procesarDetalleFinanciacion($idfinanciacion, $detallefacturaArray, $factura);
                    //Se crea la amortizacion
                    $this->procesarAmortizacionFinanciacion($informacionCreditoE[0], $idfinanciacion, $factura_amfi );
                    //Crea una nota NF
                    $idnotanf = $this->procesarNotasnf($factura);
                    //Inserta en la tabla not_nota
                    $idnota = $this->procesarNotNota($factura);
                    //Crea las notas de los detalle
                    $this->procesarDetallebNotaNf($detallefacturaArray, $idnotanf, $idnota);
                    //Actualizar los saldos de las notas
                    $this->genericoDelegado->actualizarFacturaSaldo($idnotanf, 1, 'NT');
                    //se ctualizan los saldos de la factura
                    $this->genericoDelegado->actualizarFacturaSaldo($idFactura['idFactura'], 1);
                    //se ctualizan los saldos de la financiacion
                    $this->genericoDelegado->actualizarFinanciacionSaldo($idfinanciacion, 1);
                    //Actualizar el saldo de capital inicial
                    $this->registroCreditoModel->actualizarCapitalInicialFinanciacion($idFactura['idFactura'], $idfinanciacion);
                    $facturaAtualizar['estado'] = 'F';
                    $facturaAtualizar['idfactura'] = $idFactura['idFactura'];
                    $this->registroCreditoModel->actualizarFactura($facturaAtualizar);                 

                    $respuesta['idcredito'] = $credito['idcredito'];
                    $respuesta['idsuscripcion'] = $suscripcion['idsuscripcion'];
                    $respuesta['idfinanciacion'] = $idfinanciacion;
                    //Agrega los datos de estudio al arreglo de respuesta del metodo
                    array_push($creditosAprobados, $respuesta);  
                }*/
                //Guarda los cambios
            }
            $this->conexion->commit();
            return $creditosAprobados;
        } catch (Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException($ex->getMessage(), -1);
        }
    }

    /**
     * Permite validar si existe y construir un tercero
     * @param Array $infoTercero recibe los parámetros de los terceros
     */
    public function procesarTercero($infoTercero) {
        $existeTercero = $this->registroCreditoDelegado->validarTercero($infoTercero['documento']);
        if (empty($existeTercero)) {
            $parametros['ter_documento'] = $infoTercero['documento'];
            $parametros['uni_tipidentifica'] = $infoTercero['idtipodocumento'];
            $parametros['ter_nombre'] = $infoTercero['primernombre'];
            $parametros['ter_apellido'] = $infoTercero['primerapellido'];
            $parametros['ter_nomcompleto'] = $infoTercero['primerapellido'] . ' ' . $infoTercero['primernombre'];
            $parametros['ter_sexo'] = $infoTercero['sexo'];
            $parametros['ter_telcelular'] = $infoTercero['celular'];
            $parametros['ter_telfijo'] = $infoTercero['telefonofijo'];
            $parametros['est_tiptercero'] = ESTRUCTURA_TERCEROS;
            $parametros['uni_tiptercero'] = 18; // persona natural dependiente
            $parametros['ter_correo'] = $infoTercero['correo'];
            $existeTercero = $this->registroCreditoModel->insertarTerceros($parametros);
        }
        return $existeTercero;
    }

    /**
     * Permite validar si existe y construir un tercero
     * @param Array $infoTercero recibe los parámetros de los terceros
     */
    public function procesarCltTercero($tercero , $empresa) {
        $clt_terc = CLASE_REPOR_CENTRALES_POT ;
        $existeClt_ter = $this->registroCreditoDelegado->validarClaTercero($tercero,$clt_terc, $empresa);
        if (empty($existeClt_ter)) {
            $parametros['uni_clatercero'] = $clt_terc ; 
            $parametros['ter_ideregistro'] = $tercero ;
            $existeClt_ter = $this->registroCreditoModel->insertarCltTerceros($parametros);
        }
        return $existeClt_ter;
    }

    /* Permite construir una propiedad
     * @param Array $infoTercero recibe los parámetros de los terceros
     */

    public function crearPropiedad($infoTercero, $idtercero) {
        $parametros['ter_ideregistro'] = $idtercero;
        $parametros['pro_estado'] = 'A';
        $parametros['pro_descripcion'] = 'Propiedad Potenza';
        $parametros['pro_idepropieda'] = 1; // se actualiza luego de la inserción 
        $parametros['pro_direccion'] = $infoTercero['direccion'];
        $parametros['uni_tippropieda'] = $infoTercero['idpropiedad'];
        $parametros['est_tippropieda'] = 4;
        $parametros['pro_digitos'] = 0;
        $obtenerMunicipioBarrio = $this->registroCreditoModel->obtenerMunicipioBarrioModel($infoTercero['idmunicipio'], $infoTercero['idbarrio']);
        $parametros['muba_sector'] = $obtenerMunicipioBarrio;
        $parametros['pro_seccion'] = 0;
        $parametros['pro_manzana'] = 0;
        $parametros['uni_municipio'] = $infoTercero['idmunicipio'];
        $parametros['uni_barrio'] = $infoTercero['idbarrio'];
        $parametros['pro_altriesgo'] = 'N';
        $parametros['pro_numcatastral'] = '0'; // se actualiza luego de la inserción 
        $parametros['pro_zona'] = $infoTercero['zonaresidencial'];
        $parametros['usu_ideregistro'] = $this->sesion->get('idusuario');
        $parametros['pro_gpslatitud'] = 0; //Valor quemado
        $parametros['pro_gpsaltitud'] = 0; //Valor quemado
        $parametros['pro_gpslongitud'] = 0; //Valor quemado
        return $this->registroCreditoModel->insertarPropiedad($parametros);
    }
    /* Permite actualizar una propiedad
     * @param Array $infoTercero recibe los parámetros de los terceros
     */

    public function actualizarPropiedad($infoTercero, $idpropiedad) {
        $parametros['pro_estado'] = 'A';
        $parametros['pro_direccion'] = $infoTercero['direccion'];
        $parametros['uni_tippropieda'] = $infoTercero['idpropiedad'];
        $obtenerMunicipioBarrio = $this->registroCreditoModel->obtenerMunicipioBarrioModel($infoTercero['idmunicipio'], $infoTercero['idbarrio']);
        $parametros['muba_sector'] = $obtenerMunicipioBarrio;
        $parametros['uni_municipio'] = $infoTercero['idmunicipio'];
        $parametros['uni_barrio'] = $infoTercero['idbarrio'];
        $parametros['pro_zona'] = $infoTercero['zonaresidencial'];
        $parametros['usu_ideregistro'] = $this->sesion->get('idusuario');        
        $parametros['pro_ideregistro'] = $idpropiedad;
        $parametros['pro_idepropieda'] = $idpropiedad;
        $parametros['pro_numcatastral'] = $idpropiedad;
        return $this->registroCreditoModel->actualizar($parametros, 'pro_propiedad', 'pro_ideregistro=:pro_ideregistro');
    }
    /* Permite actualizar una suscripcion
     * @param Array $infoTercero recibe los parámetros de los terceros
     */

    public function actualizarSuscripcion($infoSuscripcion, $idsuscripcion) {        
        $parametros['uni_municipio'] = $infoSuscripcion['idmunicipio'];
        $parametros['uni_barrio'] = $infoSuscripcion['idbarrio'];
        $parametros['pro_catestrato'] = $infoSuscripcion['estrato']; 
        $parametros['dsus_ideregistr'] = $idsuscripcion ; 
        return $this->registroCreditoModel->actualizar($parametros, 'dsus_detsuscrip', 'dsus_ideregistr=:dsus_ideregistr');
    }
    
    /* 
     * permite validar si existe una suscripcion para el tercero
     * @param Array $infoTercero recibe los parámetros de los terceros
     */

    public function validarSuscripcion($idtercero , $idempresa) {
        
        $datostiposuscripcion = $this->registroCreditoModel->consultarTipoSuscripcion(CLASE_TIPOSUSCRIPCION, $idempresa);
        $datostipoliqiodacion = $this->registroCreditoModel->consultarTipoLiquidacion(CLASE_TIPOLIQUIDACION, $idempresa);
        $datostipousosuscripcion = $this->registroCreditoModel->consultarTipoUsoSuscripcion(CLASE_TIPOUSOSUSCRIPCION, $idempresa);

        $parametros['est_tipsuscripc'] = $datostiposuscripcion['est_ideregistro'];  
        $parametros['uni_tipsuscripc'] = $datostiposuscripcion['uni_tipsuscripc'];  
        $parametros['est_tipusosuscr'] = $datostipousosuscripcion['est_ideregistro'];   
        $parametros['uni_tipusosuscr'] = $datostipousosuscripcion['uni_ideregistro'];  
        $parametros['est_liquidacion'] = $datostipoliqiodacion['est_liquidacion'];  
        $parametros['uni_liquidacion'] = $datostipoliqiodacion['uni_liquidacion'];  
        $parametros['emp_ideregistro'] = $idempresa;
        $parametros['ter_ideregistro'] = $idtercero;
        return $this->registroCreditoDelegado->validarSuscripcion($parametros);
    }

    /**
     * permite incrustar un nuevo suscriptor
     * @param int $idtercero identificador del tercero
     * @return type
     */
    public function insertarSuscriptor($idtercero) {
        $parametros['ter_ideregistro'] = $idtercero;
        $parametros['cnre_ideregistr'] = $this->registroCreditoDelegado->consultarConvenioId();
        $parametros['sus_descripcion'] = 'Suscriptor Potenza';
        return $this->registroCreditoModel->insertarSuscriptor($parametros);
    }

    /**
     * permite crear una suscripción
     * @param array $infoSuscripcion información de la suscripcion 
     * @param int $idsuscriptor identificador de la suscripción
     * @param int $idtercero identificador del tercero
     * @param int $idpropiedad identificador de la propiedad
     * @param int $idempresa identificador de la empresa
     */
    public function CrearSuscripcion($infoSuscripcion, $idsuscriptor, $idtercero, $idpropiedad, $idempresa, $idciclo) {

        $datostiposuscripcion = $this->registroCreditoModel->consultarTipoSuscripcion(CLASE_TIPOSUSCRIPCION, $idempresa);
        $datostipoliqiodacion = $this->registroCreditoModel->consultarTipoLiquidacion(CLASE_TIPOLIQUIDACION, $idempresa);
        $datostipousosuscripcion = $this->registroCreditoModel->consultarTipoUsoSuscripcion(CLASE_TIPOUSOSUSCRIPCION, $idempresa);

        $parametros['dsus_estado'] = 'A';
        $parametros['dsus_descripcion'] = 'Suscripción Potenza';
        $parametros['dsus_pcodigo'] = 'null'; //codmunicipio codbarrio idsuscripcion
        $parametros['sus_ideregistro'] = $idsuscriptor;
        $parametros['ter_ideregistro'] = $idtercero;
        $parametros['pro_ideregistro'] = $idpropiedad;
        $parametros['uni_municipio'] = $infoSuscripcion['idmunicipio'];
        $parametros['uni_barrio'] = $infoSuscripcion['idbarrio'];
        $parametros['est_tipsuscripc'] = $datostiposuscripcion['est_ideregistro'];  // 26
        $parametros['uni_tipsuscripc'] = $datostiposuscripcion['uni_tipsuscripc']; // 277
        $parametros['est_tipusosuscr'] = $datostipousosuscripcion['est_ideregistro']; // 2 
        $parametros['uni_tipusosuscr'] = $datostipousosuscripcion['uni_ideregistro']; // 6
        $parametros['emp_ideregistro'] = $idempresa;
        $parametros['est_liquidacion'] = $datostipoliqiodacion['est_liquidacion']; // 3
        $parametros['uni_liquidacion'] = $datostipoliqiodacion['uni_liquidacion']; // 8
        $parametros['cic_ideregistro'] = $idciclo; //120; 
        $parametros['dsus_fecinicio'] = 'now()';
        $parametros['pro_catestrato'] = $infoSuscripcion['estrato'];
        $parametros['dsus_iniestado'] = 'now()';
        $parametros['dsus_factor'] = 1;
        //return $this->registroCreditoModel->insertarSuscripcion($parametros);
        $idSuscripcion = $this->registroCreditoModel->insertarSuscripcion($parametros);
        
        /*
        * Mejora implementada para sincronizar las suscripciones como terceros en la aplicación de seven 
        */

            $condicion = " dsus_ideregistr = " . $idSuscripcion;
            $infoSuscripcion = $this->genericoModel->consultaInfoSuscripciones($this->sesion->get('idempresa'), $condicion);
            $genericoDelegado = new GenericoDelegado($this->conexion);
            $infoSuscripcion[0]['idempresa'] = $this->sesion->get('idempresa');
            $validaParametroSincronizaTercero = $genericoDelegado->consultarParametroSincronizacionSeven($this->sesion->get('idempresa'));
            /*
             *  Valida Parametro SINCRONIZA_TERCERO_SEVEN para la empresa en Sesión 
             */
            $linea_log = " Suscripcion " . $idSuscripcion . " Empresa: " . $this->sesion->get('idempresa') . " Parametro Sincronizacion: " . $validaParametroSincronizaTercero[0]['valor'];
            shell_exec("echo " . $linea_log . " > /var/www/html/achagua/sistema/app/logs/log_SincronizaTercero_Seven.log");
            if ($validaParametroSincronizaTercero[0]['valor'] == "TRUE") {
                shell_exec("echo Sincronización activa, inicia Sincronización con Seven >> /var/www/html/achagua/sistema/app/logs/log_SincronizaTercero_Seven.log");
                $respuestaSeven = $genericoDelegado->invocaWsTercerosSeven($infoSuscripcion[0]);
                shell_exec("echo Respuesta Seven :".$respuestaSeven['error']." Mensaje :" .$respuestaSeven['mensaje']."  >> /var/www/html/achagua/sistema/app/logs/log_SincronizaTercero_Seven.log");
            }        
        /*
        * Termina Mejora implementada para sincronizar las suscripciones como terceros en la aplicación de seven 
        */
            
        return $idSuscripcion;
    }

    /**
     * listar la información de los créditos aprobados
     * @return type
     */
    public function obtenerCreditosAprobados() {
        $creditosAprobados = $this->registroCreditoModel->obtenerCreditosAprobadosModel(ESTADO_RADICACION_APROBACION_APROBAR);
        $respuesta = array();
        foreach ($creditosAprobados as $credito) {
            $obj['nombre'] = $credito['nombre'];
            $obj['documento'] = $credito['documento'];
            $obj['fecha'] = $credito['fecha'];
            $obj['radicado'] = $credito['radicado'];
            $obj['valor'] = $credito['valor'];
            $obj['plazo'] = $credito['plazo'];
            $obj['interes'] = $credito['interes'];
            $obj['cuota'] = $this->calcularCuota($credito['valor'], $credito['interes'], $credito['plazo']);
            $obj['seguro'] = $credito['seguro'];
            $obj['estudiocredito'] = $credito['estudiocredito'];

            $respuesta[] = $obj;
        }
        return $respuesta;
    }

    /**
     * permite calcular a cuota
     * @param type $capitalInicial capital inicial
     * @param type $tasaInteres tasa de interes vigente
     * @param type $numeroCuotas cantidad de cuotas
     * @return int cuota calculada
     */
    private function calcularCuota($capitalInicial, $tasaInteres, $numeroCuotas) {
        if ($tasaInteres == 0) {
            return round(($capitalInicial / $numeroCuotas), CANTIDAD_DECIMALES);
        }
        $p = $capitalInicial;
        $i = $tasaInteres / 100;
        $n = $numeroCuotas;
        $numerador = $p;
        $denominador = (1 - (pow(1 + $i, -$n))) / $i;
        return round($numerador / $denominador, CANTIDAD_DECIMALES);
    }

    /**
     * Crea una factura
     * @param type $idEmpresa
     * @param type $idCiclo
     * @param type $suscripcion
     * @return type
     */
    private function procesarFactura($idEmpresa, $idCiclo, $suscripcion, $informacionCredito) {
        $docuemtosliquidacion = $this->genericoModel->getDocumentosTiposPorLiquidLibran($informacionCredito['idliquidacion']);
        $infoFactura['iddocumento'] = $docuemtosliquidacion['iddocumento']; // Estan pendiente por definir
        $infoFactura['idtipodocumento'] = $docuemtosliquidacion['idtipodocumento']; // 302 Estan pendiente por definir
        $infoFactura['idempresa'] = $idEmpresa;
        $infoFactura['tipo'] = "FA";
        $numero = $this->genericoModel->obtenerNumeroFactura($infoFactura);
        $factura['numero'] = $numero['numero'];
        $factura['metodogenera'] = 'P';
        $factura['estado'] = 'A';
        $factura['fecha'] = 'now()';
        $factura['fechaaprobacion'] = 'now()';
        $factura['fechafinanciacion'] = 'now()';
        $ciclo = $this->genericoModel->getCicloPeriodoId($idCiclo);
        if (empty($ciclo['fechavencimiento'])) {
            throw new MyException('El ciclo esta mal parametrizado', -1);
        }
        $factura['fechavencimiento'] = $ciclo['fechavencimiento'];
        $factura['idempresa'] = $idEmpresa;
        $factura['idsuscriptor'] = $suscripcion['idsuscriptor'];
        $factura['idsuscripcion'] = $suscripcion['idsuscripcion'];
        $factura['idtiposuscripcion'] = $suscripcion['idtiposuscripcion'];
        $factura['idtipousosuscripcion'] = $suscripcion['idtipousosuscripcion'];
        $factura['idliquidacion'] = $informacionCredito['idliquidacion'];
        $factura['idtercero'] = $suscripcion['idtercero'];
        $factura['idciclo'] = $ciclo['idciclo'];
        $factura['idperiodo'] = $ciclo['idperiodo'];
        $factura['iddocumento'] = $infoFactura['iddocumento'];
        $factura['idtipodocumento'] = $infoFactura['idtipodocumento'];
        $factura['cicloano'] = $ciclo['cicloanio'];
        $factura['saldofactura'] = 0;
        $factura['idtipotercero'] = 18;
        $factura['fechasuspende'] = $ciclo['fechasuspension'];
        $factura['version'] = 1;
        $factura['valortotal'] = 0;
        $numero['idFactura'] = $this->genericoModel->insertarFactura($factura);
        $this->genericoModel->actualizarNumeroDisponible($numero['idFactura'], $numero['idnumero']);
        return $numero;
    }

    /**
     * Construye los diferentes conceptos de la factura
     * @param type $idFactura
     * @param type $informacionCredito
     * @return type
     */
    public function procesarDetalleFactura($idFactura, $credito) {
        $informacionCredito = $credito[0];
        $deltallefactura = array();
        $deltallefactura[0]['idFactura'] = $idFactura['idFactura'];
        $deltallefactura[0]['valor'] = $informacionCredito['montosolicitado'];
        $deltallefactura[0]['idconcepto'] = 893; //572
        $deltallefactura[1]['idFactura'] = $idFactura['idFactura'];
        $deltallefactura[1]['valor'] = $this->valorSeguro($informacionCredito);
        $deltallefactura[1]['idconcepto'] = 897; //212;
        $deltallefactura[2]['idFactura'] = $idFactura['idFactura'];
        $valorEstudio = $informacionCredito['estudiocredito'];
        $deltallefactura[2]['valor'] = !empty($valorEstudio) ? $valorEstudio : 0;
        $deltallefactura[2]['idconcepto'] = 1121;
        return $this->insertarDetalleFactura($deltallefactura);
    }

    /**
     * Se calucula el valor total del seguro con el saldo del credito en una tabla de amortizacion
     * @param type $credito
     * @return type
     */
    public function valorSeguro($credito) {
        $datosInteres = $this->registroCreditoModel->obtenerInteresCredito($credito['numeroradicado']);
        $monto = $credito['montosolicitado'];
        $interes = $datosInteres['interes'] / 100;
        $plazo = $credito['plazo'];
        $seguro = $credito['seguro'] / 100;
        $valorCuota = $this->calcularCuota($monto, $datosInteres['interes'], $plazo);
        $valorSeguro = $monto * $seguro;
        $valorInteres = $monto * $interes;
        $amortizacion = $valorCuota - $valorInteres;
        $saldo = $monto - $amortizacion;
        for ($i = 0; $i < $plazo; $i++) {
            if ($i != 0) {
                $valorInteres = $saldo * $interes;
                $amortizacion = $valorCuota - $valorInteres;
                $saldo = $saldo - $amortizacion;
            }
            $valorSeguro += ($saldo * $seguro);
        }
        return $valorSeguro;
    }

    /**
     * Se crea del detalle de la factura con los conceptos
     * @param type $idfactura
     * @param type $valorConcepto
     * @param type $idconcepto
     * @return type
     */
    public function insertarDetalleFactura($deltallefacturasArray) {
        $respuesta = array();
        foreach ($deltallefacturasArray as $detalle) {
            $detalleFactura['estado'] = 'A';
            $detalleFactura['cantidad'] = 1;
            $detalleFactura['valorunitario'] = $detalle['valor'];
            $detalleFactura['valortotal'] = $detalle['valor'];
            $detalleFactura['valorreal'] = $detalle['valor'];
            $detalleFactura['saldoreal'] = $detalle['valor'];
            $detalleFactura['idfactura'] = $detalle['idFactura'];
            $detalleFactura['idconcepto'] = $detalle['idconcepto'];
            $detalleFactura['version'] = 1;
            $respuesta[] = $this->genericoModel->insertarDetalleFactura($detalleFactura);
        }
        return $respuesta;
    }

    /**
     * Crea la financiacion de la factura
     * @param type $factura
     * @param type $entidadfinanciera
     * @return type
     */
    public function procesarFinanciacion($factura, $entidadfinanciera) {
        $financiacion['capitalinicial'] = $factura['fac_vlrreal'];
        $financiacion['estado'] = 'A';
        $financiacion['saldo'] = $factura['fac_sdoreal'];
        $financiacion['fecharegistro'] = 'now()';
        $financiacion['idsuscipcion'] = $factura['dsus_ideregistr'];
        $financiacion['idtercero'] = $factura['ter_ideregistro'];
        $financiacion['entidadfinanciera'] = $entidadfinanciera;
        $financiacion['idciclo'] = $factura['cic_ideregistro'];
        $financiacion['idperiodo'] = $factura['per_ideregistro'];
        $financiacion['idempresasesion'] = $factura['emp_ideregistro'];
        $financiacion['anociclo'] = $factura['cic_ano'];
        $financiacion['version'] = 1;
        return $this->registroCreditoModel->insertarFinanciacion($financiacion);
    }

    /**
     * Crea el detalle de la financiacion
     * @param type $idfinanciacion
     * @param type $detallefactura
     * @param type $factura
     * @return type
     */
    public function procesarDetalleFinanciacion($idfinanciacion, $detallefacturaArray, $factura) {
        $respuesta = array();
        foreach ($detallefacturaArray as $detalle) {
            $detallefactura = $this->registroCreditoModel->consultarDetalleFactura($detalle);
            $detallefinanciacion['idfinanaciacion'] = $idfinanciacion;
            $detallefinanciacion['iddetallefactura'] = $detallefactura['dfac_ideregistr'];
            $detallefinanciacion['idfactura'] = $detallefactura['fac_ideregistro'];
            $detallefinanciacion['idsuscipcion'] = $factura['dsus_ideregistr'];
            $detallefinanciacion['idliquidacion'] = $factura['uni_liquidacion'];
            $detallefinanciacion['idconcepto'] = $detallefactura['uni_concepto'];
            $detallefinanciacion['valorunitario'] = $detallefactura['dfac_vlrunitari'];
            $detallefinanciacion['valortotal'] = $detallefactura['dfac_vlrtotal'];
            $detallefinanciacion['saldoReal'] = $detallefactura['dfac_sdoreal'];
            $detallefinanciacion['valorrealfinanciacion'] = $detallefactura['dfac_vlrtotal'];
            $detallefinanciacion['saldoRealfinanciacion'] = $detallefactura['dfac_sdoreal'];
            $detallefinanciacion['idempresa'] = $factura['emp_ideregistro'];
            $detallefinanciacion['idciclo'] = $factura['cic_ideregistro'];
            $detallefinanciacion['idperiodo'] = $factura['per_ideregistro'];
            $detallefinanciacion['fecharegistro'] = 'now()';
            $detallefinanciacion['anociclo'] = $factura['cic_ano'];
            $detallefinanciacion['version'] = 1;
            $respuesta[] = $this->registroCreditoModel->insertarDetalleFinanciacion($detallefinanciacion);
        }
        return $respuesta;
    }

    /**
     * Procesa la amortizacion de la financiacion 
     * @param type $informacionCredito
     * @param type $idfinanciacion
     * @param type $factura
     * @return type
     */
    public function procesarAmortizacionFinanciacion($informacionCredito, $idfinanciacion, $factura) {
        $amortizacion['estado'] = 'A';
        $amortizacion['numerocuotas'] = $informacionCredito['plazo'];
        $amortizacion['cuotasamotizacion'] = 0;
        $amortizacion['fecha'] = 'now()';
        $amortizacion['idfinanciacion'] = $idfinanciacion;
        $amortizacion['idliquidacion'] = $informacionCredito['idliquidacion']; //falta este
        $amortizacion['iddocumento'] = $factura['uni_documento'];
        $amortizacion['idtipodocumento'] = $factura['uni_tipdocument'];
        $amortizacion['idsuscripcion'] = $factura['dsus_ideregistr'];
        $amortizacion['idempresa'] = $factura['emp_ideregistro'];
        $amortizacion['idciclo'] = $factura['cic_ideregistro'];
        $amortizacion['idperiodo'] = $factura['per_ideregistro'];
        $amortizacion['anociclo'] = $factura['cic_ano'];
        return $this->registroCreditoModel->insertarAmortizacion($amortizacion);
    }

    /**
     * Crea la nota NF de la factura del credito 
     * @param type $factura
     * @return type
     */
    public function procesarNotasnf($factura) {
        $docuemtosnotas = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($factura['uni_documento'], $factura['uni_tipdocument'], 'NF');
        $infoFactura['iddocumento'] = $docuemtosnotas['iddocumento']; // Estan pendiente por definir
        $infoFactura['idtipodocumento'] = $factura['uni_tipdocument']; // 302 Estan pendiente por definir
        $infoFactura['idempresa'] = $factura['emp_ideregistro'];
        $infoFactura['tipo'] = "FA";
        $numeroNuevo = $this->genericoModel->obtenerNumeroFactura($infoFactura);
        $notanf['numero'] = $numeroNuevo['numero'];
        $notanf['metodogenera'] = $factura['fac_metgenera'];
        $notanf['estado'] = 'A';
        $notanf['fecha'] = 'now()';
        $notanf['fechaaprobacion'] = 'now()';
        $notanf['fechavencimiento'] = $factura['fac_fecvence'];
        $notanf['idfacturapadre'] = $factura['fac_ideregistro'];
        $notanf['idfacturaorigen'] = $factura['fac_ideregistro'];
        $notanf['idempresa'] = $factura['emp_ideregistro'];
        $notanf['idsuscriptor'] = $factura['sus_ideregistro'];
        $notanf['idsuscripcion'] = $factura['dsus_ideregistr'];
        $notanf['idtiposuscripcion'] = $factura['uni_tipsuscripc'];
        $notanf['idtipousosuscripcion'] = $factura['uni_tipusosuscr'];
        $notanf['idliquidacion'] = $factura['uni_liquidacion'];
        $notanf['idtercero'] = $factura['ter_ideregistro'];
        $notanf['idciclo'] = $factura['cic_ideregistro'];
        $notanf['idperiodo'] = $factura['per_ideregistro'];
        $notanf['iddocumento'] = $docuemtosnotas['iddocumento'];
        $notanf['idtipodocumento'] = $factura['uni_tipdocument'];
        $notanf['cicloano'] = $factura['cic_ano'];
        $notanf['saldofactura'] = $factura['fac_sdoreal'] * -1;
        $notanf['idtipotercero'] = $factura['uni_tiptercero'];
        $notanf['fechasuspende'] = $factura['fac_fecsuspens'];
        $notanf['version'] = 1;
        $notanf['valortotal'] = -$factura['fac_vlrreal'] * -1;
        $numeroNuevo['idFactura'] = $this->genericoModel->insertarFactura($notanf);
        $this->genericoModel->actualizarNumeroDisponible($numeroNuevo['idFactura'], $numeroNuevo['idnumero']);
        return $numeroNuevo['idFactura'];
    }

    public function procesarNotNota($factura) {
        $nota["idsuscripcion"] = $factura["dsus_ideregistr"];
        $nota["idciclo"] = $factura["cic_ideregistro"];
        $nota["idperiodo"] = $factura["per_ideregistro"];
        $nota["idempresa"] = $factura["emp_ideregistro"];
        $nota["cicloanio"] = $factura["cic_ano"];
        $nota["idusuario"] = $this->sesion->get('idusuario');
        $cicloperiodo = $this->genericoModel->getCicloPeriodoSuscripcion($nota['idsuscripcion']);
        return $this->registroCreditoModel->insertarNotaModel($nota, $cicloperiodo);
    }

    /**
     * Crear los detalles de las notas
     * @param type $detallefacturaArray
     * @param type $idnotanf
     * @return type
     */
    public function procesarDetallebNotaNf($detallefacturaOrigenArray, $idnotanf, $idnota) {
        foreach ($detallefacturaOrigenArray as $detalle) {
            $detallefacturaOrigen = $this->registroCreditoModel->consultarDetalleFactura($detalle);
            $detallenota['estado'] = 'A';
            $detallenota['cantidad'] = 1;
            $detallenota['valorunitario'] = $detallefacturaOrigen['dfac_vlrunitari'];
            $detallenota['valortotal'] = $detallefacturaOrigen['dfac_vlrtotal'] * -1;
            $detallenota['valorreal'] = $detallefacturaOrigen['dfac_vlrreal'] * -1;
            $detallenota['saldoreal'] = $detallefacturaOrigen['dfac_sdoreal'] * -1;
            $detallenota['idfactura'] = $idnotanf;
            $detallenota['idconcepto'] = $detallefacturaOrigen['uni_concepto'];
            $detallenota['iddetallefacturapadre'] = $detallefacturaOrigen['dfac_ideregistr'];
            $detallenota['iddetallefacturaorigen'] = $detallefacturaOrigen['dfac_ideregistr'];
            $detallenota['version'] = 1;
            $iddetallenota = $this->genericoModel->insertarDetalleFactura($detallenota);

            $detallenofa['idfacturaorigen'] = $detallefacturaOrigen['fac_ideregistro'];
            $detallenofa['iddetallefacturaorigen'] = $detallefacturaOrigen['dfac_ideregistr'];
            $detallenofa['idfactura'] = $idnotanf;
            $detallenofa['iddetallefactura'] = $iddetallenota;
            $this->registroCreditoModel->insertarNotaFacturaModel($detallenofa, $idnota);
        }
    }

    /**
     * Consulta los ciclos activos
     * @param type $idEmpresa
     * @return type
     */
    public function consultarCiclos($idEmpresa) {
        return $this->genericoModel->consultarCiclosActivos($idEmpresa);
    }

}
