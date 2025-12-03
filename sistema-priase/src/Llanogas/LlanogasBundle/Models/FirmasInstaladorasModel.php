<?php

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Description of FinanciacionModel
 *
 * @author hrey
 */
class FirmasInstaladorasModel extends AuditoriaServices {

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     * Constructor de la clase
     * @param Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    public function consultarempleadocertificaciones($tercero, $empresa) {
        $parametros['tercero'] = $tercero;
        $parametros['empresa'] = $empresa;
        $sql = " SELECT cofi.*,uni.uni_ideregistro idcompetencia,uni.uni_nombre1 nombrecompetencia 
                 FROM 
                   cofi_comfirmains cofi
                 INNER JOIN uni_unidad uni on uni.uni_ideregistro = cofi.uni_competencia 
                 INNER JOIN est_estructura est on est.est_ideregistro = uni.est_ideregistro
                 INNER JOIN esem_estempresa esem on esem.est_ideregistro=est.est_ideregistro
                 WHERE 
                    esem.emp_ideregistro = :empresa AND
                    est.cla_ideregistro=18 AND
                    ter_ideregistro = :tercero ";

        $resultado = $this->executeQuery($sql, $parametros);

        return $resultado;
    }

    public function consultarcompetencias($empresa) {

        $parametros['empresa'] = $empresa;
        $sql = " SELECT uni.uni_ideregistro idcompetencia,uni.uni_nombre1 nombrecompetencia 
                 FROM 
                 uni_unidad uni 
                 INNER JOIN est_estructura est on est.est_ideregistro = uni.est_ideregistro
                 INNER JOIN esem_estempresa esem on esem.est_ideregistro=est.est_ideregistro
                 WHERE 
                    esem.emp_ideregistro = :empresa AND
                    est.cla_ideregistro=18 ";
        $resultado = $this->executeQuery($sql, $parametros);

        return $resultado;
    }

    public function grabarColaboradorCertificacion($Datos) {
        $parametros = array();
        try {
            $this->setCampo($Datos, $parametros, 'tercero', 'ter_ideregistro');
            $this->setCampo($Datos, $parametros, 'nit_empleado', 'cofi_nitempleado');
            $this->setCampo($Datos, $parametros, 'nombre_empleado', 'cofi_nomempleado');
            $this->setCampo($Datos, $parametros, 'inicio_vigencia', 'cofi_inivigencia');
            $this->setCampo($Datos, $parametros, 'fin_vigencia', 'cofi_finvigencia');
            $this->setCampo($Datos, $parametros, 'competencia', 'uni_competencia');
            $this->setCampo($Datos, $parametros, 'usuario', 'usu_ideregistro');
            $this->setCampo($Datos, $parametros, 'codigosic', 'cofi_codigosic');
            $this->setCampo($Datos, $parametros, 'inicio_vigenciasic', 'cofi_inivigenciasic');
            $this->setCampo($Datos, $parametros, 'fin_vigenciasic', 'cofi_finvigenciasic');
            $resultado = $this->insertar($parametros, 'cofi_comfirmains', 'sq_cofi_ideregistr');
        } catch (\Exception $ex) {
            throw new MyException("Error insertando Firmas Certificadoras: ".$ex->getMessage() , -1);
        }
        return $resultado;
    }

    public function actualizarColaboradorCertificacion($Datos) {
        $parametros = array();
        try {
        $this->setCampo($Datos, $parametros, 'tercero', 'ter_ideregistro');
        $this->setCampo($Datos, $parametros, 'nit_empleado', 'cofi_nitempleado');
        $this->setCampo($Datos, $parametros, 'nombre_empleado', 'cofi_nomempleado');
        $this->setCampo($Datos, $parametros, 'inicio_vigencia', 'cofi_inivigencia');
        $this->setCampo($Datos, $parametros, 'fin_vigencia', 'cofi_finvigencia');
        $this->setCampo($Datos, $parametros, 'competencia', 'uni_competencia');
        $this->setCampo($Datos, $parametros, 'usuario', 'usu_ideregistro');
        $this->setCampo($Datos, $parametros, 'codigosic', 'cofi_codigosic');
        $this->setCampo($Datos, $parametros, 'inicio_vigenciasic', 'cofi_inivigenciasic');
        $this->setCampo($Datos, $parametros, 'fin_vigenciasic', 'cofi_finvigenciasic');
        $condicion = " cofi_ideregistr = " . $Datos['idregistro'];
        $resultado = $this->actualizar($parametros, 'cofi_comfirmains', $condicion);
        }catch(\Exception $ex) {
        throw new MyException("Error actualizando Firmas Certificadoras: ".$ex->getMessage(), -1);
        }
        return $resultado;
    }
    
    public function consultarPermisosGrabar($idPrograma, $idUsuario){
        
        $parametros['idusuario'] = $idUsuario;
        $parametros['idprograma'] = $idPrograma;
        $sql="select uspu.usu_ideregistro existe
                from 		prun_prgunidad  prun 
                INNER JOIN 	uspu_usuprgunid  uspu on uspu.prun_ideregistr = prun.prun_ideregistr
                where 		uspu.usu_ideregistro = :idusuario   and 	prun.prg_ideregistro = :idprograma";
        
        return $this->executeQuery($sql, $parametros);
    }

}
