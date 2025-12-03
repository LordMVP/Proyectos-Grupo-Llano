<?php

namespace Bioagricola\BioagricolaBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Bioagricola\BioagricolaBundle\Models\ConsultarFinanciacionModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
//use \DateTime;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Carga las financiaciones Especiales
 *
 * @author rsagudelo
 */
class ConsultarFinanciacionDelegado {

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
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    /**
     *
     * @var CargarFinanciacionesModel 
     */
    private $conFinancModel;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde el cual se hizo la petición.
     */
    /*
     * @var ProcesoModel
     */
    private $procesoModel;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->conFinancModel = new ConsultarFinanciacionModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->sesion = $sesion;
    }
   
    /**
     * Consulta las financiaciones por codigo de usuario o id_financiacion 
     * @param array con datos para laconsulta
     * @return Object con los datos de las financiaciones
     */
    public function consultarDatosCodUsuario($parametros) {
        $parametros['id_empresa'] = $this->sesion->get('idempresa');  
        $resultado['financiaciones'] = $this->conFinancModel->consultarDatCodUSuario($parametros);
        return $resultado;
    }
    
    /**
     * Consulta los pagos de las financiaciones 
     * @param array con datos para laconsulta
     * @return Object con los datos de los pagos
     */
    public function consultarPagosFinanciacion($parametros) {
        $parametros['id_empresa'] = $this->sesion->get('idempresa');  
        return $this->conFinancModel->consultarPagosFinanciaciones($parametros);

    }
    /**
     * Consulta las amortizaciones de las financiaciones 
     * @param array con datos para laconsulta
     * @return Object con los datos de los pagos
     */
    public function consultarAmortFinanciacion($parametros) {
        $parametros['id_empresa'] = $this->sesion->get('idempresa');  
        return $this->conFinancModel->consultarAmortizacFinanciaciones($parametros);
    }    
    /**
     * Consulta las amortizaciones de las financiaciones 
     * @param array con datos para laconsulta
     * @return Object con los datos de los pagos
     */
    public function consultarTercerosFinanciacion($parametros) {
        $parametros['id_empresa'] = $this->sesion->get('idempresa');  
        return $this->conFinancModel->consultarTercerosFinanciaciones($parametros);

    } 
    
     /**
     * Consulta los totales de todas las financiaciones 
     * @return Object con el resumen de la financiacion
     */
    public function consultarResumenFinanciaciones() {
        $parametros['id_empresa'] = $this->sesion->get('idempresa');  
        $resultado['financiaciones'] = $this->conFinancModel->consultarTotalesFinanciaciones($parametros);
        return $resultado;
    }
    
     /**
     * Consulta los totales de todas las amortizaciones 
     * @return Object con el resumen de las amortizaciones
     */
    public function consultarResumenAmortizaciones() {
        $parametros['id_empresa'] = $this->sesion->get('idempresa');  
        $resultado = $this->conFinancModel->consultarResumenAmortizaciones($parametros);
        return $resultado;
    }
    
     /**
     * Consulta los totales de los pagos de las financiaciones 
     * @return Object con el resumen de los pagos
     */
    public function consultarResumenPagos() {
        $parametros['id_empresa'] = $this->sesion->get('idempresa');  
        $resultado = $this->conFinancModel->consultarResumenPagos($parametros);
        return $resultado;
    }
    
     /**
     * Consulta los totales de la dictibucion de terceros de las financiaciones 
     * @return Object con el resumen de los pagos
     */
    public function consultarResumenTercerosFinan() {
        $parametros['id_empresa'] = $this->sesion->get('idempresa');  
        $resultado= $this->conFinancModel->consultarResumenTerceros($parametros);
        if(!empty($resultado))
        {
            $res= $this->conFinancModel->consultarTotalTerceros($parametros);
            if(!empty($res))
            {
                $resultado[]=$res[0];
            }           
        }
        return $resultado;
    }
    
}
