<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Externo\FinanciacionesBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;

/**
 * Description of ReporteVentasExternoModel
 *
 * @author god
 */
class ReporteVentasExternoModel extends AuditoriaServices {

    /**
     *
     * @var array 
     */
    private $session;

    public function __construct(Connection &$conexion, array $sesion = array()) {
        parent::setConexion($conexion);
        $this->session = $sesion;
    }

    /**
     * Consulta el números de facturas registrados en seven en prisma 
     * @param type $fechaInicio Fecha de inicio del reporte 
     * @param type $fechaFin Fecha fin del reporte 
     * @param type $idFirmas ter_ideregistro que identifica a la firma 
     * @return array Lista de numeros de factura de seven  
     */
    public function consultarNumeroContratos($fechaInicio, $fechaFin, $idFirmas = null) {
        $parametro['idfirmas'] = $idFirmas;
        $parametro['fechainicio'] = $fechaInicio;
        $parametro['fechafin'] = $fechaFin;
        $complemento = (empty($idFirmas) ? '' : " AND cofi.ter_ideregistro IN ($idFirmas) ");
        $sql = "SELECT 
                  emv.emv_ideseven id
                FROM ven_venta ven
                  INNER JOIN mvfp_facproveedseven mvpv ON ven.fac_ideregistro = mvpv.fac_ideregistro
                  INNER JOIN emv_expmovimient emv ON emv.emv_ideregistro = mvpv.emv_ideregistro
                  INNER JOIN cofi_comfirmains cofi on ven.cofi_ideregistr = cofi.cofi_ideregistr
                WHERE 1 = 1 AND emv.emv_ideseven > 0
                  AND ven.ven_fecha BETWEEN :fechainicio :: DATE AND :fechafin :: DATE $complemento ";
        return $this->executeQuery($sql, $parametro);
    }

    public function eliminarDatosUsuario() {
        $this->executeQuery("DELETE FROM rfcm_datoreportefincartera");
    }

    /**
     * Insertar la información que llega de seven 
     * @param array $info Información de la factura en seven 
     */
    public function insertarDatosReporte($info) {
        $parametros['emp_ideregistro'] = $this->session['idempresa'];
        $parametros['usu_ideregistro'] = $this->session['idusuario'];
        $parametros['rfcm_vlrfactura'] = $info['valorFactura'];
        $parametros['rfcm_numpagoseven'] = $info['numeroPago'];
        $parametros['rfcm_fecpagoseven'] = $info['fechaPago'];
        $parametros['rfcm_vlrpagoseven'] = $info['valorPago'];
        $parametros['ven_numcontrato'] = $info['numeroContrato'];
        $parametros['rfcm_descripcion'] = $info['facturaSeven'];
        $this->insertar($parametros, 'rfcm_datoreportefincartera', 'sq_rfcm_ideregistro');
    }

}
