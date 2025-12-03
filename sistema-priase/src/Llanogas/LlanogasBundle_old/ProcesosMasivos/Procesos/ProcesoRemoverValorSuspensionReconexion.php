<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Models\ProcesoSuspensionModel;

/**
 * Description of ProcesoRemoverValorSuspensionReconexion
 *
 * @author JEISSON
 */
class ProcesoRemoverValorSuspensionReconexion {

    /**
     * @var array
     */
    private $parametros;

    /**
     * 
     * @var int identificador del proceso que se está ejecutando 
     */
    private $idProceso;

    /**
     * Información de la sesión
     * @var array 
     */
    private $sesion;

    /**
     *
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var ProcesoSuspensionModel 
     */
    private $procesoSuspensionModel;

    /**
     * Método constructor de la clase
     * @param array $parametros
     */
    public function __construct(array $parametros) {
        print_r("Removimiento suspension y reconexion");
        $this->parametros = $parametros;
        $this->idciclo = -1;
        $this->idprograma = $parametros['idprograma'];
        if (isset($parametros['idciclo'])) {
            $this->idciclo = $parametros['idciclo'];
        }
        $this->conexion = ConexionBD::getConexion();
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->procesoSuspensionModel = new ProcesoSuspensionModel($this->conexion);
        $this->sesion = $this->genericoModel->getInfoSesion($parametros['idacceso']);
        print_r("Removimiento suspension y reconexion final ");
    }

    /**
     * Método que inicia el proceso de remover el valor de suspensión y reconexión
     * @param array $listaSuspensiones
     * @return type
     */
    public function iniciar(&$idCiclo) {
        print_r("QUITAR VALORES SUSPENSIÓN ====== CICLO " . $idCiclo . " ==== \n");
        $listaSuspensiones = $this->procesoSuspensionModel->consultarSuspensionesRealizadas($idCiclo);
        print_r($listaSuspensiones);
        foreach ($listaSuspensiones as $suspension) {
            $this->removerValorSuspensionReconexion($suspension);
        }
    }

    ///DEPRECATED
    public function validarValorConceptosSuspende($suspension) {
        $cicloperiodo = $this->genericoModel->getCicloPeriodoSuscripcion($suspension['idsuscripcion']);
        $listaFacturasConSaldo = $this->genericoModel->getFacturasConSaldo($suspension['idsuscripcion']);
        foreach ($listaFacturasConSaldo as $factura) {
            $parametros['idfactura'] = $factura['idfactura'];
            $parametros['idciclo'] = $cicloperiodo['idciclo'];
            $parametros['idperiodo'] = $cicloperiodo['idperiodo'];
            $parametros['valorsuspension'] = VALOR_SUSPENSION_RECONEXION;
            $complemento = 'WHERE dfac.fac_ideregistro= :idfactura '
                    . 'AND fac.cic_ideregistro = :idciclo '
                    . 'AND fac.per_ideregistro = :idperiodo '
                    . 'AND fac.cic_ano = cic.cic_anoactual '
                    . "AND con_suspende = 'S' "
                    . 'AND con_valor > :valorsuspension '
                    . 'AND fac.fac_fecvence < ssp.ssp_fecejesuspe ';
            $listaConceptos = $this->procesoSuspensionModel->getConceptosSuspension($complemento, $parametros);
            if (count($listaConceptos) > 0) {
                return false;
            }
        }
        return true;
    }

    ///DEPRECATED
    public function validarRecaudos($suspension) {
        $listaRecaudos = $this->procesoSuspensionModel->getRecaudosAnterioresSuspension($suspension);

        if (count($listaRecaudos) > 0) {
            print_r("Recaudo  ==== " . $listaRecaudos[0]['idrecaudo'] . "\n");
            return true;
        }
        return false;
    }

    /**
     * Remover el valor de la suspensión y de la reconexión 
     * @param type $suspension
     */
    public function removerValorSuspensionReconexion($suspension) {
        print_r("SE REMOVERÁ EL VALOR " . $suspension['idsuspension'] . "\n");
        $this->procesoSuspensionModel->removerValorSuspension($suspension);
        $reconexion = $this->procesoSuspensionModel->getReconexionSuspension($suspension);
        if (count($reconexion) > 0) {
            $this->procesoSuspensionModel->removerValorReconexion($reconexion);
        }
    }

}
