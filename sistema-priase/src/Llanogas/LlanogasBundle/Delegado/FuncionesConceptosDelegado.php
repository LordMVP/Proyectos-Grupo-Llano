<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\FuncionesConceptosModel;
use Llanogas\LlanogasBundle\MyException;

/**
 * Clase encargada de ejecutarse por  medio del proceso de 
 * liquidación, se hace mediante el calculo del valor de cada concepto
 * 
 */
class FuncionesConceptosDelegado {

    private $idSuscripcion;

    /**
     *
     * @var Connection
     */
    private $conexion;

    /**
     *
     * @var array  
     */
    private $sesion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var type FuncionesConceptosModel
     */
    private $funcionesConceptosModel;

    /**
     *
     * @var int identificador del programa 
     */
    private $idPrograma;

    public function __construct(Connection &$conexion, $idAcceso, $idSuscripcion, $idPrograma) {
        $this->conexion = $conexion;
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $this->genericoModel->getInfoSesion($idAcceso);
        $this->idSuscripcion = $idSuscripcion;
        $this->funcionesConceptosModel = new FuncionesConceptosModel($conexion);
        $this->idPrograma = $idPrograma;
    }

    public function estrato(array $concepto) {
        $resultado = $this->funcionesConceptosModel->estrato($this->idSuscripcion);
        if (empty($resultado)) {
            throw new MyException('No se encontró el estrato para la suscripción ', -1);
        }
        return $resultado[0]['estrato'];
    }

    public function factor_correccion(array $concepto) {
        $resultado = $this->funcionesConceptosModel->factor_correccion($this->idSuscripcion, $this->sesion['idusuario']);
        if (empty($resultado)) {
            throw new MyException('No se encontró el estrato para la suscripción ', -1);
        }
        return $resultado['factor'];
    }

    public function exento(array $concepto) {
        $resultado = $this->funcionesConceptosModel->exento($this->idSuscripcion, $this->sesion['idusuario']);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['exento'];
    }

    public function lectura_actualciclo(array $concepto) {
        return 1;
    }

    public function lectura_anteriorciclo(array $concepto) {
        $infoLectura = $this->funcionesConceptosModel->lecturaActualCiclo($this->idSuscripcion);
        return $infoLectura['lecturaactual'];
    }

    public function estratoDos(array $concepto) {
        return 2;
    }

    public function valorConceptoRelacionado(array $concepto) {
        if (isset($concepto['valortotal'])) {
            return $concepto['valortotal'];
        }
        return 0;
    }

    public function valorCalculoConcepto(array $concepto) {
        if (isset($concepto['valortotal'])) {
            return $concepto['valortotal'];
        }
        return 0;
    }

    public function lecturaActual(array $concepto) {
        return 1;
    }

    public function horas_novedadDES(array $concepto) {
        return 1;
    }

    public function consumoMtrs(array $concepto) {
        switch ($this->idPrograma) {
            case PROGRAMA_FACTURAR_PERIODO:
                return $this->funcionesConceptosModel->consumoMtrs($this->idSuscripcion);
            case PROGRAMA_MODIFICAR_LECTURAS:
                return $this->funcionesConceptosModel->consultarConsumoModificarLecturas($this->idSuscripcion);
            default :
                $resultado = $this->funcionesConceptosModel->consumoMtrsUltimoProcesado($this->idSuscripcion)[0]['consumo'];
                return $resultado;
        }
        throw new MyException('No se pudo calcular el concepto consumo metros', -1);
    }

    public function suspension_cicloactual(array $concepto) {
        $respuesta = $this->funcionesConceptosModel->suspension_cicloactual($this->idSuscripcion);
        return $respuesta;
    }

    public function reconexion_cicloactual(array $concepto) {
        return $this->funcionesConceptosModel->reconexion_cicloactual($this->idSuscripcion);
    }

    public function corte_acometida(array $concepto) {
        return $this->funcionesConceptosModel->corte_acometida($this->idSuscripcion);
    }

    public function ICBF(array $concepto) {
        return $this->funcionesConceptosModel->ICBF($this->idSuscripcion);
    }
    
    public function VIP(array $concepto) {
        return $this->funcionesConceptosModel->VIP($this->idSuscripcion);
    }

    public function valorNovedadConceptoSuscripcion(array $concepto) {
        $respuesta = $this->funcionesConceptosModel->valorNovedadConceptoSuscripcion($this->idSuscripcion, $concepto);
        return $respuesta;
    }

    public function consumo_promedio(array $concepto) {
        $respuesta = $this->funcionesConceptosModel->calculoConsumoPromedio($this->idSuscripcion);
        return $respuesta;
    }

    public function indicador_consumo_promedio(array $concepto) {
        $respuesta = $this->funcionesConceptosModel->IndicadorConsumoPromedio($this->idSuscripcion);
        return $respuesta;
    }
    
    
     //* funcion adicional por emergencia COVID 19
    public function fn_porcentajesubsidioalcaldia(array $concepto) {
        return $this->funcionesConceptosModel->porcentajesubsidioalcaldia($this->idSuscripcion);
    }
    
    public function calculoCompartoMiEnergia(       array $concepto) {
        $respuesta = $this->funcionesConceptosModel->calculoCompartoMiEnergia($this->idSuscripcion,$concepto);
        return $respuesta;
    }      
      
    public function fn_calculaVlrAporteVoluntario(array $concepto) {
        return $this->funcionesConceptosModel->calculaVlrAporteVoluntario($this->idSuscripcion);
    }
    
    // funcion adicional por OPCION TARIFARIA

    public function fn_VinculoOpcionTarifaria(array $concepto) {
	return $this->funcionesConceptosModel->vinculopciontarifaria($this->idSuscripcion);
    }

	
    // fin funcion adicional por OPCION TARIFARIA

    
    // Funcion FECF calcula porcentaje por municipio
     public function fn_calculaSubsidioPorcentajeMunicipio(array $concepto) {
	return $this->funcionesConceptosModel->calculaSubsidioPorcentajeMunicipio($this->idSuscripcion);
    }
    
    // FIN  Funcion FECF calcula porcentaje por municipio
    
    
// Funcion OPCION TARIFARIA calcula consumo mtrs mes anterior
     public function fn_ConsumoMtrMesAnterior(array $concepto) {
	return $this->funcionesConceptosModel->ConsumoMtrMesAnterior($this->idSuscripcion);
    }
    
     public function fn_GetValorTarifaSuperior_147(array $concepto) {
	return $this->funcionesConceptosModel->getValorTarifaSuperior($this->idSuscripcion, 0, 352);
    }
    
     public function fn_GetValorTarifaSuperior_048(array $concepto) {
	return $this->funcionesConceptosModel->getValorTarifaSuperior($this->idSuscripcion, 1, 352);
    }

     public function homologaEmsa(array $concepto) {
       return $this->funcionesConceptosModel->getEmpresahomologa($this->idSuscripcion,299);
    }
    public function homologagasAseo(array $concepto) {
        $validaHomologacionEnergia = $this->funcionesConceptosModel->getEmpresahomologa($this->idSuscripcion,299);
          return ( $validaHomologacionEnergia <=0 ) ? 1 : 0 ;
    }
    public function aplicaDINC(array $concepto) {
       return $this->funcionesConceptosModel->getRelacionConceptoSuscripcion($this->idSuscripcion ,5259 );
    }
    public function aplicaDescDesh(array $concepto) {
       return $this->funcionesConceptosModel->getRelacionConceptoSuscripcion($this->idSuscripcion,5261);
    } 
    public function aplicaDescPtaPta(array $concepto) {
       return $this->funcionesConceptosModel->getRelacionConceptoSuscripcion($this->idSuscripcion,5263);
    } 
    public function aplicaAforadoAseo(array $concepto) {
       return  ($this->funcionesConceptosModel->getRelacionConceptoSuscripcion($this->idSuscripcion,5262)>0 ) ? (($this->funcionesConceptosModel->getRelacionConceptoSuscripcion($this->idSuscripcion,5261)>0) ? 0 : 1 ) : 0  ;
    } 
     public function aplicaFacturacionPlena(array $concepto) {
       return $this->funcionesConceptosModel->getFacturacionPlena($this->idSuscripcion);
    } 
     public function obtenerTAFNA(array $concepto){
        return $this->funcionesConceptosModel->getTAFNA($this->idSuscripcion);
    }  
     public function aplicaNoAforadoAseo(array $concepto) {          
         return ($this->funcionesConceptosModel->getRelacionConceptoSuscripcion($this->idSuscripcion,5262)>0 ) ? (($this->funcionesConceptosModel->getRelacionConceptoSuscripcion($this->idSuscripcion,5261)>0) ? 1 : 0 ) : 1  ;
       /*return ($this->funcionesConceptosModel->getRelacionConceptoSuscripcion($this->idSuscripcion,5262)>0 ) ? 0 : 1 ; 
        * 
        */
    } 
      public function NoaplicaDINC(array $concepto) {
       return ($this->funcionesConceptosModel->getRelacionConceptoSuscripcion($this->idSuscripcion,5259)>0 ) ? 0 : 1  ; 
    }
    public function obtenerVisitasAforoExtraOrdinario(array $concepto){
        return $this->funcionesConceptosModel->getCantidadVisitasAforoExtraOrdinario($this->idSuscripcion);
    } 
    public function obtenerVisitasAforoMultExtraOrdinario(array $concepto){
        return 0;
    }
       
     
}
