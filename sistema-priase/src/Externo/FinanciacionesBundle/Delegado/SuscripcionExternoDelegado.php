<?php

namespace Externo\FinanciacionesBundle\Delegado;

use Doctrine\DBAL\Connection;
use Externo\FinanciacionesBundle\Models\SuscripcionExternoModel;
use Externo\FinanciacionesBundle\Models\VentaExternoModel;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Utiles\Validacion;

/**
 * Description of SegutidadDelegado
 *
 * @author god
 */
class SuscripcionExternoDelegado {

    /**
     * Información del usuario que está en el sistema
     * @var array (
     *              idacceso,idusuario,cedula,
     *              usuario,idempresa,empresa,
     *              idperfil
     *            )
     */
    private $sesion;

    /**
     * Conexión a la base de datos 
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var SuscripcionExternoModel 
     */
    private $suscripcionExternoModel;

    /**
     * Clase encargada de validar los parámetros de las 
     * peticiones 
     * @var Validacion 
     */
    private $validacion;

    /**
     * Constructor de la clase 
     * @param Connection $conexion Conexion a la base de datos 
     */
    public function __construct(&$conexion, array $sesion) {
        $this->conexion = $conexion;
        $this->suscripcionExternoModel = new SuscripcionExternoModel($conexion, $sesion);
        $this->sesion = $sesion;
        $this->validacion = new Validacion();
    }

    /**
     * Consulta todas las empresas que prestan 
     *  el servicios públicos 
     * @return array Lista de las empresas que prestan el servicios públicos 
     */
    public function consultarEmpresasServicio() {
        return $this->suscripcionExternoModel->consultarEmpresasServicio();
    }

    /**
     * Consulta la información de la suscripción 
     * @param array $parametros (idsuscripción o código de anterior)
     * @return array (suscripcion,tercero,propiedad)
     */
    public function consultarSuscripcion($parametros) {
        $this->validacion->validar($parametros, [
            "codigo" => "required"], 'El código de la suscripción es obligatorio');
        $codigoSuscripcion = trim($parametros['codigo']);
        $suscripcion = $this->suscripcionExternoModel->consultarSuscripcionDetalle($codigoSuscripcion);
        $idSuscripcion = $suscripcion['idsuscripcion'];
        $info = array();
        $info['suscripcion'] = $suscripcion;
        $info['tercero'] = $this->suscripcionExternoModel->consultarSuscripcionTercero($idSuscripcion);
        $info['propiedad'] = $this->suscripcionExternoModel->consultarSuscripcionPropiedad($idSuscripcion);
        $info['empresaservicio'] = $this->suscripcionExternoModel->consultarEmpresa($idSuscripcion);
        return $info;
    }

}
