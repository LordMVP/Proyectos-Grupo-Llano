<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\GenerarFinanciacionModel;

/**
 * Description of Generar financiacion delegado
 * Clase encargada de tener la lógica de generar una financiación 
 * por medio del módulo de cartera
 * @author Sergio andrés vargas
 * @date 29 / jul / 2015
 * 
 */
class GenerarFinanciacionDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var FinanciacionModel 
     */
    private $financiaciones;

    /**
     *
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->financiaciones = new GenerarFinanciacionModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->sesion = $sesion;
    }

// <editor-fold desc="suscripcion">  

    /**
     * Permite listar las facturas de una suscripcion asociadas al documetno
     * @param int $idSuscripcion
     * @param int $idDocumento
     * @param int $idTipoDocumento
     * @return Array Facturas
     */
    public function consultarFacturasSuscripcionDocumento($idSuscripcion, $idDocumento, $idTipoDocumento, $idconceptodescarte) {
        return $this->financiaciones->consultarFacturasPorSuscripcionDocumentoModel($idSuscripcion, $idDocumento, $idTipoDocumento,$idconceptodescarte);
    }

    /**
     * permite obtener la secuencia de la financiacion
     * @return int secuencia financiacion
     */
    public function obtenerSecuenciaFinanciacion() {
        $respuesta = $this->financiaciones->obtenerSecuenciaFinanciacion();
        return $respuesta;
    }

    public function obtenerTopeFinanciacion() {
        $usuario = $this->sesion->get('idusuario');
        $respuesta = $this->financiaciones->obtenerTopeFinanciacionModel($usuario);
        return $respuesta;
    }

    /**
     * permite consultar las liquidaciocnes financiables asociadas a una suscripcion
     * @param int $idsuscripcion código de la suscripcion
     * @return Array liquidaciones asociadas a la suscripcion
     */
    private function consultarLiquidacionFinanciacion($idsuscripcion) {
        $idusuario = $this->sesion->get('idusuario');
        $idempresa = $this->sesion->get('idempresa');
        $tiposDocumentos = $this->financiaciones->consultarTipoDocumentoModel($idsuscripcion, $idusuario, $idempresa);
        $respuesta["tiposdocumentos"] = $tiposDocumentos;
        $respuesta["fechaFinanciacion"] = date('Y-m-d');
        $cicloPeridodo = $this->consultarCicloPeriodo($idsuscripcion);
        $respuesta['idCiclo'] = $cicloPeridodo[0]['idciclo'];
        $respuesta['ciclo'] = $cicloPeridodo[0]['ciclo'];
        $respuesta['idPeriodo'] = $cicloPeridodo[0]['idperiodo'];
        $respuesta['periodo'] = $cicloPeridodo[0]['periodo'];
        return $respuesta;
    }

    /**
     * Lista los documentos asociados a un tipo de documento que se encuentre en el perfil del usuario activo
     * @param int $idsuscripcion
     * @param int $idtipodocumento 
     * @return Array listado documnetos por tipo documento de peril
     */
    public function consultarDocumentosFinanciacion($idsuscripcion, $idtipodocumento) {
        $idusuario = $this->sesion->get('idusuario');
        $idempresa = $this->sesion->get('idempresa');
        $documentos = $this->financiaciones->consultarDocumentoModel($idsuscripcion, $idusuario, $idempresa, $idtipodocumento);
        return $documentos;
    }

    /**
     * Permite consultar el ciclo periodo de la suscripcion
     * @param int $idsuscripcion identificador de suscripción
     * @return Array consultar ciclo periodo
     * @throws MyException No se encontraron resultados. Para ciclos periodos
     */
    private function consultarCicloPeriodo($idsuscripcion) {
        $cicloPeridodo = $this->genericoModel->getCicloPeriodo($idsuscripcion);
        if (empty($cicloPeridodo)) {
            throw new MyException("No se encontraron resultados. Para ciclos periodos", 0);
        }
        return $cicloPeridodo;
    }

    /**
     * Permite filtrar suscripciones por financiación
     * @param int $idsuscripcion
     * @param int $codigoAnterior
     */
    public function filtrarSuscripcionesFinanciacion($idsuscripcion, $codigoAnterior) {
        $parametros['idsuscripcion'] = $idsuscripcion;
        $parametros['codigoanterior'] = $codigoAnterior;
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $parametros['estado'] = "'E'";
        $idusuario = $this->sesion->get('idusuario');
        $suscripcion = $this->financiaciones->getSuscripcion($parametros, $idusuario);
        if (empty($suscripcion)) {
            throw new MyException("No se encontraron resultados para la suscripción ó no esta Activa", 0);
        }
        $respuesta = $this->consultarLiquidacionFinanciacion($suscripcion[0]['idsuscripcion']);
        $respuesta["suscripcion"] = $suscripcion;
        return $respuesta;
    }

// </editor-fold>
// <editor-fold desc="Financiacion">  
    /**
     * Permite consultar el banco
     * @param string $nombre
     * @return Array consultar banco
     */
    public function consultarBanco($nombre) {
        return $this->genericoDelegado->consultarTerceros(UNIDAD_CONSULAR_BANCOS, $nombre);
    }

    /**
     * Permite evaluar los mconceptos de la financiación
     * @param int $idLiquidacion tipo de liquidación
     * @param string $facturas
     * 
     */
    public function validarConceptosFinanciacion($idLiquidacion, $facturas) {
        $respuesta = $this->financiaciones->validarConceptosFinanciacionModel($idLiquidacion, $facturas);
        /* if (empty($respuesta)) {
          throw new MyException('No existen conceptos de validación', -1);
          } */
        return $respuesta;
    }

    /**
     * permite cargar las liquidaciones asociadas a un documentos espécifico
     * @param int $idsuscripcion
     * @param int $iddocumento
     * @param int $idtipodocumento
     * @return Array listadode liquidaciones
     * @throws MyExecption No existen liquidaciones a cargar
     */
    public function consultarLiquidaciones($iddocumento, $idtipodocumento) {
        $idempresa = $this->sesion->get('idempresa');
        $respuesta = $this->financiaciones->consultarLiquidacionFinanciacionModel($iddocumento, $idtipodocumento, $idempresa);
        if (empty($respuesta)) {
            throw new MyExecption('No existen liquidaciones a cargar', -1);
        }
        return $respuesta;
    }

    /**
     * permite obtener el interes de la liquidación
     * @param int $idliquidacion identificador de la liquidacion
     * @return float interes 
     */
    public function consultarInteresLiquidacion($idliquidacion) {
        $respuesta = $this->financiaciones->consultarInteresLiquidacionModel($idliquidacion);
        $formula = json_decode($respuesta['formulainteres'], true);
        return $formula[0]['valor'];
    }

    /**
     * permite obtener el interes de la liquidación
     * @param int $idliquidacion identificador de la liquidacion
     * @return float interes 
     */
    public function consultarInteresIvaLiquidacion($idliquidacion) {
        $respuesta = $this->financiaciones->consultarInteresIvaLiquidacion($idliquidacion);
        if (empty($respuesta)) {
            return;
        }
        $formula = json_decode($respuesta[0]['formulainteres'], true);
        return $formula[0]['valor'];
    }

    /**
     * Consulta los días que hay entre la fecha actual y la 
     * fecha de finalización del periodo activo
     * @param type $idSuscripcion
     * @return type
     * @throws MyException
     */
    public function consultarDiasPeriodo($idSuscripcion) {
        $respuesta = $this->financiaciones->consultarDiasPeriodo($idSuscripcion);
        if (empty($respuesta)) {
            throw new MyException("No se encontró el día de finalización del período", 0);
        }
        return $respuesta[0]['diasterminoperiodo'];
    }

    /**
     * permite consumir los detalles de los conceptos para una factura especifica
     * @param int $idfactura identificador de la factura
     * @param char $estado 'S'/'N'
     * @return Array detalles de concepto
     * 
     */
    public function consultarDetallesConceptos($idfactura, $estado) {
        $respuesta = $this->financiaciones->consultarDetallesConceptosModel($idfactura, $estado);
        return $respuesta;
    }

    /**
     * permite armar una financiacion
     * @param financiacion $financiacion
     * @return Array Financiacion Armada
     */
    private function armarFinanciacion($financiacion) {
        /*
         * Verificar si la fecha actual es mayor  ó igual de la fecha de liquidacion 
         * 
         * return  True ó False 
         */
        $resultadoValidacion = $this->genericoModel->verificaFechaInicioLiquidacion($financiacion['idsuscripcion'], PROGRAMA_FACTURAR_PERIODO);
        //carga la información del ciclo periodo 
        $cicloPeriodo = $resultadoValidacion === 1 ? $this->genericoModel->getPeriodoSiguienteSuscripcion($financiacion['idsuscripcion']) : $this->genericoModel->getCicloPeriodoSuscripcion($financiacion['idsuscripcion']);
        $idEmpresa = $this->sesion->get("idempresa");
        $armarFinanciacion['idempresa'] = $idEmpresa;
        $armarFinanciacion['idciclo'] = $cicloPeriodo['idciclo'];
        $armarFinanciacion['cicloanio'] = $cicloPeriodo['cicloanio'];
        $armarFinanciacion['idperiodo'] = $cicloPeriodo['idperiodo'];
        $armarFinanciacion['facturas'] = $financiacion['facturas'];
        $armarFinanciacion['idsuscripcion'] = $financiacion['idsuscripcion'];
        $armarFinanciacion['idtipodocumento'] = $financiacion['idtipodocumento'];
        $armarFinanciacion['idsolicita'] = $financiacion['idsolicitante'];
        $armarFinanciacion['idparentesco'] = $financiacion['idparentesco'];
        $armarFinanciacion['identidad'] = $financiacion['identidad'];
        $armarFinanciacion['numerocuotas'] = $financiacion['numcuotas'];
        $armarFinanciacion['idliquidacion'] = $financiacion['idliquidacion'];
        $armarFinanciacion['valortotalfinanciar'] = $financiacion['valorTotalFinanciar'];
        $armarFinanciacion['idusuario'] = $this->sesion->get('idusuario');
        $iddocumento = $this->genericoModel->getDocumentoLiquidacion($financiacion['idliquidacion']);
        $armarFinanciacion['iddocumento'] = $iddocumento['iddocumento'];
        $armarFinanciacion['valorfinanciable'] = $financiacion['valorfinanciable'];
        if (empty($armarFinanciacion['idfinanciacion'])) {
            $idfinanciacion = $this->obtenerSecuenciaFinanciacion();
            $armarFinanciacion['idfinanciacion'] = $idfinanciacion['idfinanciacion'];
        }
        return $armarFinanciacion;
    }

    /**
     * Genera el número de la finaciación o el número del pagaré 
     * de acuerdo a la tabla nudo
     * @param type $idfinanciacion
     * @return type
     */
    public function generarNumeroPagare($idfinanciacion) {
        try {
            $this->conexion->beginTransaction();
            $idempresa = $this->sesion->get("idempresa");
            $numerofinanciacion = $this->genericoModel->obtenerNumeroDocumento($idempresa, 0, TIPO_DOCUMENTO_PAGARE_VENTA);
            $this->genericoModel->actualizarNumeroDisponible($numerofinanciacion['numero'], $numerofinanciacion['idnumero']);
            $this->financiaciones->actualizarNumeroFinanciacion($idfinanciacion, $numerofinanciacion['numero']);
            $this->conexion->commit();
            return $numerofinanciacion['numero'];
        } catch (MyException $ex) {
            $this->conexion->rollBack();
        }
    }

    /**
     * Crea una nueva financiación de acuerdo de las facturas que el usuario 
     * haya seleccionado
     * @param type $financiacion
     * @return type
     * @throws MyException
     */
    public function generarNuevaFinanciacion($financiacion) {
        try {
            $this->conexion->beginTransaction();
            $idFinanciacion = $this->CrearNuevaFinanciacion($financiacion);
            $this->conexion->commit();
            return $idFinanciacion;
        } catch (MyException $e) {
            $this->conexion->rollBack();
            throw $e;
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException('Error al crear la financiación', -1);
        }
    }

    /**
     * Permite construir una nueva financiación
     * @param financiaciones $financiacion
     * @return int número generado de financiación
     */
    public function CrearNuevaFinanciacion($financiacion) {
        $financiacionArmada = $this->armarFinanciacion($financiacion);
        $numfinanciacion = $this->procesarFinanciacion($financiacionArmada);
        if (!empty($financiacion['archivos'])) {
            $this->actualizarAdjuntoFinanciacion($financiacion['archivos'], $numfinanciacion);
        }
        if (!empty($financiacion['personanatural'])) {
            $this->insertarInformacionFinanciera($financiacion['personanatural'], $numfinanciacion);
        }
        if (!empty($financiacion['personajuridica'])) {
            $this->insertarInformacionFinanciera($financiacion['personajuridica'], $numfinanciacion);
        }
        return $numfinanciacion;
    }

    /**
     * Adiciona la información financiera de la financiación
     * @param type $informacion
     * @param type $idfinanciacion
     */
    private function insertarInformacionFinanciera($informacion, $idfinanciacion) {
        $informacion['idfinanciacion'] = $idfinanciacion;
        $informacion['idusuario'] = $this->sesion->get('idusuario');
        $this->financiaciones->insertarInformacionFinanciera($informacion);
    }

    /**
     * Permite actualizar un nuevo numero disponible para procesar las nuevas notas
     * @param array $infoFacturaNotas recibe los siguientes parámetros requeridos de la factura idinfofactura, factura creada , iddocumento , idtipodocumento ,idempresa
     */
    private function actualizarNumeroDisponible($idFactura, $idDocumento, &$infoFacturaInicial) {
        $infoFactura['idempresa'] = $infoFacturaInicial['idempresa'];
        $infoFactura['iddocumento'] = $idDocumento;
        $infoFactura['idtipodocumento'] = $infoFacturaInicial['idtipodocumento'];
        $infoFactura['tipo'] = 'FA';
        $infoNumero = $this->financiaciones->obtenerNumeroFacturaModel($infoFactura);
        $parametros['fac_numero'] = $infoNumero['numero'];
        $parametros['fac_ideregistro'] = $idFactura;
        $this->financiaciones->actualizarFacturaModel($parametros);
        $this->genericoModel->actualizarNumeroDisponible($infoNumero['numero'], $infoNumero['idnumero']);
    }

    /**
     * obtiene las facturas configurando el nuevo padre
     * @param int $idfactura
     * @param array $parametros
     * @param int $valorfinanciar
     * @return array Infofacturaspadre
     */
    private function obtenerFacturaInicial($idfactura) {
        return $this->financiaciones->consultarFacturaModel($idfactura);
    }

    /**
     * Genera los detalles de una nota ya sea por la nota NF o SF
     * @param type $financiacion
     * @param type $idFacturaNota
     * @param type $infoFacturaInicial
     */
    private function insertarDetalleNotaFactura(&$financiacion, $idFacturaNota, &$infoFacturaInicial) {
        $listaDetallesFactura = $this->financiaciones->consultarDetalleFacturaSaldoModel($infoFacturaInicial['idfactura']);
        $valorFinanciableNoFinanciable = $this->financiaciones->getValorFinanciableNoFinanciable($infoFacturaInicial['idfactura']);
        $contador = 1;
        $acumuladoPagoRealConcepto = 0;
        foreach ($listaDetallesFactura as $detalleFactura) {
            /**
             * Realiza el redondeo de los detalles de financiación
             */           
            $pagorealconcepto = Util::ponderarConcepto($detalleFactura['saldo'], $valorFinanciableNoFinanciable['valorfinanciable'], $infoFacturaInicial['valorfinanciar']);
            $pagorealconcepto = $this->redondearValor($detalleFactura, $pagorealconcepto);
            $acumuladoPagoRealConcepto = $acumuladoPagoRealConcepto + $pagorealconcepto;
            if($contador++ == count($listaDetallesFactura)){
                $pagorealconcepto = $infoFacturaInicial['valorfinanciar'] - ($acumuladoPagoRealConcepto - $pagorealconcepto);
            }
            $detalleFactura['idempresa'] = $financiacion['idempresa'];
            $detalleFactura['idfinanciacion'] = $financiacion['idfinanciacion'];
            $detalleFactura['saldo'] = abs($pagorealconcepto) * -1;
            $detalleFactura['valortotal'] = abs($pagorealconcepto);
            $detalleFactura['valorunitario'] = $pagorealconcepto;
            $detalleFactura['valorreal'] = ($pagorealconcepto) * -1;
            $detalleFactura['idfactura'] = $idFacturaNota;
            $detalleFactura['cic_ano'] = $financiacion['cicloanio'];
            $detalleFactura['idusuario'] = $this->sesion->get('idusuario');
            $detalleFactura['fac_ideregistro'] = $idFacturaNota;
            $detalleFactura['idciclo'] = $financiacion['idciclo'];
            $detalleFactura['idperiodo'] = $financiacion['idperiodo'];
            $idDetalleFacturaNota = $this->financiaciones->insertarDetalleFacturaNotaModel($detalleFactura, 'NF');
            $this->financiaciones->insertarNotaFacturaModel($financiacion['idnotanueva'], $idDetalleFacturaNota, $detalleFactura, $infoFacturaInicial['idfactura']);
            $this->insertarDetalleFinanciacion($detalleFactura, $financiacion, $infoFacturaInicial);
        }
    }

    /**
     * Genera la nota de la parte que el usuario no financió
     * @param type $financiacion
     * @param type $idFacturaNota
     * @param type $infoFacturaInicial
     */
    private function insertarDetalleNotaFacturaSaldo($financiacion, $idFacturaNota, &$infoFacturaInicial) {
        $listaDetallesFactura = $this->genericoModel->getConceptos($infoFacturaInicial['idfactura']);
        foreach ($listaDetallesFactura as $detalleFactura) {
            if ($detalleFactura['saldo'] <= 0) {
                continue;
            }
            $detalleFactura['cantidad'] = 1;
            $detalleFactura['valortotal'] = $detalleFactura['saldo'];
            $detalleFactura['valorreal'] = $detalleFactura['saldo'] * -1;
            $detalleFactura['valorunitario'] = $detalleFactura['saldo'];
            $detalleFactura['idfactura'] = $idFacturaNota;
            $detalleFactura['cic_ano'] = $financiacion['cicloanio'];
            $detalleFactura['idusuario'] = $this->sesion->get('idusuario');
            $detalleFactura['fac_ideregistro'] = $idFacturaNota;
            $detalleFactura['idciclo'] = $financiacion['idciclo'];
            $detalleFactura['idperiodo'] = $financiacion['idperiodo'];
            $detalleFactura['saldo'] = $detalleFactura['saldo'] * -1;
            $idDetalleFacturaNota = $this->financiaciones->insertarDetalleFacturaNotaModel($detalleFactura, 'SF');
            $this->financiaciones->insertarNotaFacturaModel($financiacion['idnotanueva'], $idDetalleFacturaNota, $detalleFactura, $infoFacturaInicial['idfactura']);
            $detalleFactura = array();
        }
    }

    /**
     * Genera los detalles de financiación con toda la información de las facturas 
     * que se vieron involucradas en el proceso de la financiación
     * @param array $detalleFactura
     * @param array $financiacion
     * @param type $infoFacturaInicial
     */
    public function insertarDetalleFinanciacion(array $detalleFactura, array $financiacion, &$infoFacturaInicial) {
        $detalleFinanciacion['idfinanciacion'] = $financiacion['idfinanciacion'];
        $detalleFinanciacion['iddetallefactura'] = $detalleFactura['iddetallefactura'];
        $detalleFinanciacion['fac_ideregistro'] = $infoFacturaInicial['idfactura'];
        $detalleFinanciacion['idsuscripcion'] = $detalleFactura['idsuscripcion'];
        $detalleFinanciacion['idliquidacion'] = $financiacion['idliquidacion'];
        $detalleFinanciacion['idconcepto'] = $detalleFactura['idconcepto'];
        $detalleFinanciacion['valortotal'] = abs($detalleFactura['valortotal']);
        $detalleFinanciacion['valorunitario'] = abs($detalleFactura['valortotal']);
        $detalleFinanciacion['saldo'] = abs($detalleFactura['saldo']);
        $detalleFinanciacion['valorreal'] = abs($detalleFactura['saldo']);
        $detalleFinanciacion['idciclo'] = $financiacion['idciclo'];
        $detalleFinanciacion['idperiodo'] = $financiacion['idperiodo'];
        $detalleFinanciacion['idempresa'] = $this->sesion->get('idempresa');
        $detalleFinanciacion['idusuario'] = $this->sesion->get('idusuario');
        $detalleFinanciacion['cic_ano'] = $financiacion['cicloanio'];
        $this->financiaciones->insertarDetalleFinanciacionModel($detalleFinanciacion);
    }

    /**
     * Inserta los de talles de la nota de financiación que el usuario financió
     * @param type $financiacion
     * @param type $idFacturaNota
     * @param type $infoFacturaInicial
     */
    private function insertarDetalleFacturaSaldo($financiacion, $idFacturaNota, &$infoFacturaInicial) {
        $listaDetallesFactura = $this->genericoModel->getConceptos($infoFacturaInicial['idfactura']);
        foreach ($listaDetallesFactura as $detalleFactura) {
            $detalleFactura['valortotal'] = $detalleFactura['saldo'];
            $detalleFactura['valorreal'] = $detalleFactura['saldo'];
            $detalleFactura['cic_ano'] = $financiacion['cicloanio'];
            $detalleFactura['idusuario'] = $this->sesion->get('idusuario');
            $detalleFactura['fac_ideregistro'] = $idFacturaNota;
            $detalleFactura['idciclo'] = $financiacion['idciclo'];
            $detalleFactura['idperiodo'] = $financiacion['idperiodo'];
            $this->financiaciones->insertarDetalleFacturaNotaModel($detalleFactura, 'FF');
        }
    }

    /**
     * Permite actualizar la factura para dejarla como financiada
     * @param int $idfactura
     */
    private function actualizarFacturaFinanciada($idfactura, $idfinanciacion) {
        $parametros['fac_estado'] = 'F';
        $parametros['fac_fecfinancia'] = 'now()';
        $parametros['fac_ideregistro'] = $idfactura;
//$parametros['fin_ideregistro'] = $idfinanciacion;
        $this->financiaciones->actualizarFacturaModel($parametros);
    }

    /**
     * permite procesar las notas de la financiación
     * @param array $financiacion
     */
    private function procesarNotas(&$financiacion) {
        foreach ($financiacion['facturas'] as $factura) {
            $infoFacturaInicial = $this->obtenerFacturaInicial($factura['idfactura']);
            $infoFacturaInicial['valorfinanciar'] = $factura['valorfinanciar'];
            $infoFacturaInicial['version'] = $factura['version'];
            //NF   Nota financiación => Es lo que se le resta a la factura que fue financiada (VALOR FINANCIADO, negativa) 
            $this->procesarNotaFactura($infoFacturaInicial, $financiacion);
            $infoFacturaInicialActualizada['version'] = $factura['version'];
            if ($infoFacturaInicial['saldofactura'] - $factura['valorfinanciar'] > 0) {
                //SF   Saldo financiacion => Es el resultado (SALDO LUEGO FINANCIACIÓN, negativa)
                $infoFacturaInicialActualizada = $this->procesarNotasSaldos($financiacion, $infoFacturaInicial);
                //FF Factura financiada => Esta es la factura que queda para que el usuario pague el saldo de la financiación
                $this->procesarFacturasSaldos($infoFacturaInicialActualizada, $financiacion, $infoFacturaInicial);
            }
            $this->actualizarFacturaFinanciada($factura['idfactura'], $financiacion['idfinanciacion']);
            $this->genericoDelegado->actualizarFacturaSaldo($factura['idfactura'], $infoFacturaInicialActualizada['version']);
        }
    }

    /**
     * Méotod encargado de realizar la nota de financiación  la NF 
     * @param type $infoFacturaInicial
     * @param array $financiacion
     */
    private function procesarNotaFactura(&$infoFacturaInicial, &$financiacion) {
        $idNota = $this->financiaciones->insertarNotaModel($financiacion);
        $financiacion['idnotanueva'] = $idNota;
        $infoNotaTipo = $this->financiaciones->consultarDetalleDocumentoTipoDocumentoModel($infoFacturaInicial['iddocumento'], $infoFacturaInicial['idtipodocumento'], 'NF');
        $idFacturaNF = $this->financiaciones->insertarFacturaNotaModel($infoFacturaInicial, $infoNotaTipo, $financiacion);
        $this->insertarDetalleNotaFactura($financiacion, $idFacturaNF, $infoFacturaInicial);
        $this->actualizarNumeroDisponible($idFacturaNF, $infoNotaTipo['iddocumento'], $infoFacturaInicial);
        $this->genericoDelegado->actualizarFacturaSaldo($idFacturaNF, 1, 'NT');
    }

    /**
     * permite procesar las notas de la financiación
     * @param array $financiacion
     */
    private function procesarNotasSaldos($financiacion, &$infoFacturaInicial) {
        $idNota = $this->financiaciones->insertarNotaModel($financiacion);
        $financiacion['idnotanueva'] = $idNota;
        $this->genericoDelegado->actualizarFacturaSaldo($infoFacturaInicial['idfactura'], $infoFacturaInicial['version']);
        $infoFacturaInicialActualizada = $this->obtenerFacturaInicial($infoFacturaInicial['idfactura']);
        $infoFacturaInicialActualizada['valorfinanciar'] = $infoFacturaInicialActualizada['saldofactura'];
        $infoNotaTipo = $this->financiaciones->consultarDetalleDocumentoTipoDocumentoModel($infoFacturaInicialActualizada['iddocumento'], $infoFacturaInicialActualizada['idtipodocumento'], 'SF');
        $idFacturaSF = $this->financiaciones->insertarFacturaNotaModel($infoFacturaInicialActualizada, $infoNotaTipo, $financiacion);
        $this->insertarDetalleNotaFacturaSaldo($financiacion, $idFacturaSF, $infoFacturaInicialActualizada);
        $this->actualizarNumeroDisponible($idFacturaSF, $infoNotaTipo['iddocumento'], $infoFacturaInicialActualizada);
        $this->genericoDelegado->actualizarFacturaSaldo($idFacturaSF, 1, 'NT');
        return $infoFacturaInicialActualizada;
    }

    /**
     * Método encargado de generar la nueva factura con el saldo 
     * que el usuario no financió
     * @param type $infoFacturaInicialActualizada
     * @param type $financiacion
     * @param type $infoFacturaInicial
     */
    private function procesarFacturasSaldos($infoFacturaInicialActualizada, $financiacion, &$infoFacturaInicial) {
        $tipoDocumentoFacturaSaldo = $this->financiaciones->consultarDetalleDocumentoTipoDocumentoModel($infoFacturaInicial['iddocumento'], $infoFacturaInicial['idtipodocumento'], 'FF');
        $idFacturaFF = $this->financiaciones->insertarFacturaSaldoModel($infoFacturaInicial, $infoFacturaInicialActualizada, $tipoDocumentoFacturaSaldo, $financiacion);
        $this->insertarDetalleFacturaSaldo($financiacion, $idFacturaFF, $infoFacturaInicial);
        $this->actualizarNumeroDisponible($idFacturaFF, $tipoDocumentoFacturaSaldo['iddocumento'], $infoFacturaInicial);
        $this->genericoDelegado->actualizarFacturaSaldo($idFacturaFF, 1);
    }

    /**
     * Inicial el proceso de generar una nueva financiación
     * @param type $financiacion
     */
    private function crearFinanciacion(&$financiacion) {
        if (empty($financiacion['idfinanciacion'])) {
            $financiacion['idfinanciacion'] = $this->financiaciones->obtenerSecuenciaFinanciacion();
        }
        $this->financiaciones->insertarFinanciacionModel($financiacion);
        $financiacion['cuotasamortizadas'] = 0;
        $financiacion['estado'] = 'A';
        $idAmortizacionFinanciacion = $this->financiaciones->insertarAmortizacionFinanciacionModel($financiacion);
        $financiacion['idamortizacionfinanciacion'] = $idAmortizacionFinanciacion;
    }

    /**
     * Genera el proceso de guardado en base de datos de la financiación. teniendo en cuenta sus reglas de negocio
     * @param financiacion $financiacion
     */
    public function procesarFinanciacion(&$financiacion) {
        $financiacion['idusuario'] = $this->sesion->get('idusuario');
        $this->crearFinanciacion($financiacion);
        $this->procesarNotas($financiacion);
        return $financiacion['idfinanciacion'];
    }

// </editor-fold>
// <editor-fold desc="Subida de documentos anexos">  
    /**
     * Permite realizar la actualizacion de los adjuntos
     * @param type $archivos
     * @param type $numfinanciacion
     */
    public function actualizarAdjuntoFinanciacion($archivos, $numfinanciacion) {
        if (!empty($numfinanciacion)) {
            foreach ($archivos as $archivo) {
                $idarchivo = $archivo['idarchivo'];
                $this->financiaciones->actualizarAdjuntoFinanciacionModel($idarchivo, $numfinanciacion);
            }
        }
    }

    /**
     * permite obtener todos los documentos de la financiacion activa
     * @param int $idfinanciacion
     * @return Array documentos financiados
     */
    public function obtenerDocumentosAdjuntosFinanciacion($idfinanciacion) {
        $documentosFinanciado = $this->financiaciones->obtenerDocumentosAdjuntosFinanciacionModel($idfinanciacion);
        return $documentosFinanciado;
    }

    /**
     * Procesa los adjuntos de la financiación
     * @param array $listaArchivos
     * @return type
     * @throws MyException
     */
    private function almacenarArchivoAdjunto(array $listaArchivos) {
        try {
            $archivos = array();
            foreach ($listaArchivos as $archivo) {
                $archivo['tipoarchivo'] = 'pdf';
                $archivos[] = $this->financiaciones->insertarAdjuntoFinanciacionModel($archivo);
            }
            return $archivos;
        } catch (\Exception $e) {
            throw new MyException('Error al adjuntar el archivo', -1);
        }
    }

    /**
     * Permite la eliminación del archivo adjunto
     * @param int $idarchivo identificador del archivo a eliminar
     * @throws MyException Error al eliminar el archivo
     */
    public function eliminarArchivoAdjunto($idarchivo) {
        try {
            $archivo = $this->financiaciones->obtenerAdjuntoFinanciacionModel($idarchivo);
            if (file_exists($archivo['rutaarchivo'])) {
                unlink($archivo['rutaarchivo']);
            }
            $this->financiaciones->eliminarAdjuntosFinanciacionModel($idarchivo);
        } catch (\Exception $e) {
            throw new MyException('Error al eliminar el archivo', -1);
        }
    }

    /**
     * permite almacenar un fichero adjunto para ser almacenado en la financiación 
     * @param stream $request  fichero a almacenar
     */
    public function subirArchivoAdjunto($request) {
        $this->conexion->beginTransaction();
        try {
            $idUsuario = $this->sesion->get('idusuario');
            $listaArchivos = Util::subirAdjunto($request, $idUsuario, 'financiacion');
            $archivo = $this->almacenarArchivoAdjunto($listaArchivos);
            $this->conexion->commit();
            return $archivo;
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException('Error al adjuntar el archivo', -1);
        }
    }
    
    public function redondearValor($infoConcepto,$valor){
     //   print_r($infoConcepto['metodo']);
         
        if ($infoConcepto['metodo'] === 'T') {
            return int($valor);
        }
        if ($infoConcepto['metodo'] === 'R') {
            return round($valor, $infoConcepto['precision']);
        }
        return $valor;
    }
     /**
     * Permite listar las facturas de una suscripcion asociadas al documetno
     * @param int $idSuscripcion
     * @param int $idDocumento
     * @param int $idTipoDocumento
     * @return Array Facturas
     */
    public function consultarFacturasDescarteSuscripcionDocumento($idSuscripcion, $idDocumento, $idTipoDocumento) {
        return $this->financiaciones->consultarConceptoPorSuscripcionDocumentoModel($idSuscripcion, $idDocumento, $idTipoDocumento);
    }

// </editor-fold>
}
