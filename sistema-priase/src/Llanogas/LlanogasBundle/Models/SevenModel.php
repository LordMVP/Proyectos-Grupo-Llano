<?php

namespace Llanogas\LlanogasBundle\Models;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
/**
 * Conexion con Base de Datos Seven 
 */

class SevenModel extends AuditoriaServices {

    private $genericoModel;
    private $clasesNativaPHP;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct() {
        $conexion = new ConexionBD();
        $parametrosConexion = $conexion->getConexionSeven();
        $this->clasesNativaPHP = new \consultasSQLServer($parametrosConexion);
    }

    /**
     * carla el listado de las liquidaciones 
     * @param int $idsuscripcion identificador de la suscripción 
     * @return array 
     */
    public function ValidarMovimientoContable($parametros) {
        $idmovimiento = $parametros['pContable']['Mco_nume'];
        $idtipoperacion = $parametros['pContable']['Top_codi'];
        $idempresa = $parametros['pContable']['Emp_codi'];
        try{
        $sql = "SELECT (case COALESCE((SUM(DATOS.aplicados)+sum(DATOS.anulados)+sum(DATOS.otros)),0)
                    when 0 then 0 -- No existe. Continua el proceso de exportacion
                    else 
                    (case when COALESCE(SUM(DATOS.otros),0) > 0 then 2 -- Tiene movimientos inconsistentes. No exporta movimiento
                    else	
                    (case when COALESCE(SUM(DATOS.aplicados),0) = 1 then  1 -- Ya existe. No exporta movimiento
                    when COALESCE(SUM(DATOS.aplicados),0) > 1	then  3 -- Existen varios movimiento Aplicados. No exporta movimiento
                    when COALESCE(SUM(DATOS.aplicados),0) = 0 then  0 -- No existe. Continua el proceso de exportacion
                    end) end) end) seven
                    FROM 
                    (SELECT MCO_CONT cont,sum(MCO_CRED) credito,sum(MCO_DEBI) debito,count(*) aplicados, 0 anulados, 0 otros
                    from CN_MCONT where top_codi=$idtipoperacion 
                    and mco_desc like 'CON'+'$idmovimiento'+'-%' and mco_esta='A' and EMP_CODI=$idempresa
                    GROUP BY MCO_CONT
                    UNION ALL
                    SELECT 0 cont,sum(MCO_CRED) credito,sum(MCO_DEBI) debito,0 aplicados, count(*) anulados, 0 otros
                    from CN_MCONT 
                    where top_codi=$idtipoperacion 
                    and mco_desc like 'CON'+'$idmovimiento'+'-%' and mco_esta='N' and EMP_CODI=$idempresa 
                    GROUP BY MCO_CONT 
                    UNION ALL
                    SELECT 0 cont,sum(MCO_CRED) credito,sum(MCO_DEBI) debito,0 aplicados, 0 anulados, count(*) otros 
                    from CN_MCONT 
                    where top_codi=$idtipoperacion 
                    and mco_desc like 'CON'+'$idmovimiento'+'-%' and mco_esta not in ('N','A')  and EMP_CODI=$idempresa
                    GROUP BY MCO_CONT) DATOS " ;
        
        $respuesta = $this->clasesNativaPHP->executeQuery($sql);
       
        } catch (\SQLSrvException $ex){
            print_r($ex);
        }
        return $respuesta;
    }

       /**
     * carla el listado de las liquidaciones 
     * @param int $idsuscripcion identificador de la suscripción 
     * @return array 
     */
    public function ValidarConsignacionDirecta($parametros) {
        $idmovimiento = $parametros['pConsig']['Mte_nume'];
        $idtipoperacion = $parametros['pConsig']['Top_codi'];
        $idempresa = $parametros['pConsig']['Emp_codi'];
        try{
        $sql = "SELECT (case COALESCE((SUM(DATOS.aplicados)+sum(DATOS.anulados)+sum(DATOS.otros)),0)
                        when 0 then 0 -- No existe. Continua el proceso de exportacion
                        else 
                        (case when COALESCE(SUM(DATOS.otros),0) > 0 then 2 -- Tiene movimientos inconsistentes. No exporta movimiento
                        else	
                        (case when COALESCE(SUM(DATOS.aplicados),0) = 1 then  1 -- Ya existe. No exporta movimiento
                        when COALESCE(SUM(DATOS.aplicados),0) > 1	then  3 -- Existen varios movimiento Aplicados. No exporta movimiento
                        when COALESCE(SUM(DATOS.aplicados),0) = 0 then  0 -- No existe. Continua el proceso de exportacion
                        end) end) end) seven
                    FROM
                        (SELECT MTE.MTE_CONT cont,sum(MTE.MTE_VALO) total,count(*) aplicados, 0 anulados, 0 otros
                        from TS_MTESO MTE
                        inner join CN_MCONT MCO on MCO.MCO_CONT=MTE.MCO_CONT
                        where MTE.top_codi=$idtipoperacion 
                        and MTE.mte_desc like 'CSG'+'$idmovimiento'+'-%' and MTE.mte_esta='A'  and MTE.EMP_CODI=$idempresa and MCO.mco_esta='A'
                        GROUP BY MTE.MTE_CONT
                        UNION ALL
                        SELECT MTE.MTE_CONT cont,sum(MTE.MTE_VALO) total,0 aplicados, count(*) anulados, 0 otros
                        from TS_MTESO MTE 
                        inner join CN_MCONT MCO on MCO.MCO_CONT=MTE.MCO_CONT
                        where MTE.top_codi=$idtipoperacion 
                        and MTE.mte_desc like 'CSG'+'$idmovimiento'+'-%' and MTE.mte_esta='N'  and MTE.EMP_CODI=$idempresa and MCO.mco_esta='N'
                        GROUP BY MTE.MTE_CONT
                        UNION ALL
                        SELECT MTE.MTE_CONT cont,sum(MTE.MTE_VALO) total,0 aplicados, 0 anulados, count(*) otros
                        from TS_MTESO MTE 
                        inner join CN_MCONT MCO on MCO.MCO_CONT=MTE.MCO_CONT
                        where MTE.top_codi=$idtipoperacion 
                        and MTE.mte_desc like 'CSG'+'$idmovimiento'+'-%' and MTE.mte_esta not in ('A','N') and MTE.EMP_CODI=$idempresa and MCO.mco_esta='N'
                        GROUP BY MTE.MTE_CONT )DATOS  " ;
         $respuesta = $this->clasesNativaPHP->executeQuery($sql);
          } catch (\SQLSrvException $ex){
            print_r($ex);
        }
        return $respuesta;
    }
    
       /**
     * carla el listado de las liquidaciones 
     * @param int $idsuscripcion identificador de la suscripción 
     * @return array 
     */
    public function ValidarReacaudoDirecto($parametros) {
        $idmovimiento = $parametros['pRecaudo']['Mte_nume'];
        $idtipoperacion = $parametros['pRecaudo']['Top_codi'];
        $idempresa = $parametros['pRecaudo']['Emp_codi'];
        try{
        $sql = "SELECT (case COALESCE((SUM(DATOS.aplicados)+sum(DATOS.anulados)+sum(DATOS.otros)),0)
                        when 0 then 0 -- No existe. Continua el proceso de exportacion
                        else 
                        (case when COALESCE(SUM(DATOS.otros),0) > 0 then 2 -- Tiene movimientos inconsistentes. No exporta movimiento
                        else	
                        (case when COALESCE(SUM(DATOS.aplicados),0) = 1 then  1 -- Ya existe. No exporta movimiento
                        when COALESCE(SUM(DATOS.aplicados),0) > 1	then  3 -- Existen varios movimiento Aplicados. No exporta movimiento
                        when COALESCE(SUM(DATOS.aplicados),0) = 0 then  0 -- No existe. Continua el proceso de exportacion
                        end) end) end) seven
                    FROM
                        (SELECT MTE.MTE_CONT cont,sum(MTE.MTE_VALO) total,count(*) aplicados, 0 anulados, 0 otros
                        from TS_MTESO MTE
                        inner join CN_MCONT MCO on MCO.MCO_CONT=MTE.MCO_CONT
                        where MTE.top_codi=$idtipoperacion 
                        and MTE.mte_desc like 'REC'+'$idmovimiento'+'-%' and MTE.mte_esta='A'  and MTE.EMP_CODI=$idempresa and MCO.mco_esta='A'
                        GROUP BY MTE.MTE_CONT
                        UNION ALL
                        SELECT MTE.MTE_CONT cont,sum(MTE.MTE_VALO) total,0 aplicados, count(*) anulados, 0 otros
                        from TS_MTESO MTE 
                        inner join CN_MCONT MCO on MCO.MCO_CONT=MTE.MCO_CONT
                        where MTE.top_codi=$idtipoperacion 
                        and MTE.mte_desc like 'REC'+'$idmovimiento'+'-%' and MTE.mte_esta='N'  and MTE.EMP_CODI=$idempresa and MCO.mco_esta='N'
                        GROUP BY MTE.MTE_CONT
                        UNION ALL
                        SELECT MTE.MTE_CONT cont,sum(MTE.MTE_VALO) total,0 aplicados, 0 anulados, count(*) otros
                        from TS_MTESO MTE 
                        inner join CN_MCONT MCO on MCO.MCO_CONT=MTE.MCO_CONT
                        where MTE.top_codi=$idtipoperacion 
                        and MTE.mte_desc like 'REC'+'$idmovimiento'+'-%' and MTE.mte_esta not in ('A','N') and MTE.EMP_CODI=$idempresa and MCO.mco_esta='N'
                        GROUP BY MTE.MTE_CONT )DATOS " ;
         $respuesta = $this->clasesNativaPHP->executeQuery($sql);
          } catch (\SQLSrvException $ex){
            print_r($ex);
        }
        return $respuesta;
    }
    
        /**
     * carla el listado de las liquidaciones 
     * @param int $idsuscripcion identificador de la suscripción 
     * @return array 
     */
    public function ValidarFacturaProveedor($parametros) {
  
        $idmovimiento = $parametros['pFactura']['Fac_nume'];
        $idtipoperacion = $parametros['pFactura']['Top_codi'];
        $idempresa = $parametros['pFactura']['Emp_codi'];
        try{
        $sql = "SELECT (case COALESCE((SUM(DATOS.total)),0)
                    when 0 then 0 -- No existe. Continua el proceso de exportacion
                    else 
                    (case when COALESCE(SUM(DATOS.otros),0) > 0 then 2 -- Tiene movimientos inconsistentes. No exporta movimiento
                    else	
                    (case when COALESCE(SUM(DATOS.aplicados),0) = 1 then  1 -- Ya existe. No exporta movimiento
                    when COALESCE(SUM(DATOS.aplicados),0) > 1	then  3 -- Existen varios movimiento Aplicados. No exporta movimiento
                    when COALESCE(SUM(DATOS.aplicados),0) = 0 then  0 -- No existe. Continua el proceso de exportacion
                    end) end) end) seven
                    FROM 
                    (SELECT FAC_CONT cont,sum(FAC_VATO) total,count(*) aplicados, 0 anulados, 0 otros
                    from PO_FACTU where top_codi=$idtipoperacion 
                    and fac_desc like 'PVD'+'$idmovimiento'+'-%' and fac_esta='A' and EMP_CODI=$idempresa
                    GROUP BY FAC_CONT
                    UNION ALL
                    SELECT 0 cont,sum(FAC_VATO) total,0 aplicados, count(*) anulados, 0 otros
                    from PO_FACTU 
                    where top_codi=$idtipoperacion 
                    and fac_desc like 'PVD'+'$idmovimiento'+'-%' and fac_esta='N' and EMP_CODI=$idempresa 
                    GROUP BY FAC_CONT 
                    UNION ALL
                    SELECT 0 cont,sum(FAC_VATO) total,0 aplicados, 0 anulados, count(*) otros 
                    from PO_FACTU 
                    where top_codi=$idtipoperacion 
                    and fac_desc like 'PVD'+'$idmovimiento'+'-%' and fac_esta not in ('N','A')  and EMP_CODI=$idempresa
                    GROUP BY FAC_CONT) DATOS " ;
        
        $respuesta = $this->clasesNativaPHP->executeQuery($sql);
       
        } catch (\SQLSrvException $ex){
            print_r($ex);
        }
        return $respuesta;
    }
    
        /**
     * Consulta si se creo el tercero en el sistema seven  
     * @param int $idsuscripcion identificador de la suscripción 
     * @return array 
     */
    public function consultaTerceroSeven($parametros) {
  
        $idEmpresa = $parametros['idempresa'];
        $terCoda = $parametros['pcodigo'];
        try{
        $sql = "SELECT * from gn_terce where ter_coda ='".$terCoda."'  and emp_codi = $idEmpresa ;  " ;
        $respuesta = $this->clasesNativaPHP->executeQuery($sql);
       
        } catch (\SQLSrvException $ex){
            print_r($ex);
        }
        return $respuesta;
    }
    
    
}
