<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Models\HabilitarVentaDespuesAprobarModel;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Genera el proceso de  documentos de pago
 *
 * @author Sergio andrés vargas
 * @date 07 / sep / 2015
 * 
 * 
 */
class HabilitarVentaDespuesAprobarDelegado {
    // <editor-fold desc="variables ">  

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
     * @var \Llanogas\LlanogasBundle\Models\HabilitarVentaDespuesAprobarModel
     */
    private $HabilitarVentaDespuesAprobarModel;

   

    /*
     * 
     */
    private $id_hventa;
// </editor-fold>  
    // <editor-fold desc="constructor">  

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->HabilitarVentaDespuesAprobarModel = new HabilitarVentaDespuesAprobarModel($this->conexion);
        
        $this->sesion = $sesion;
    }

    /**
     * Listado de ciclos
     * @return type
     */
    public function buscaVentasAprobadas() {
        $empresa = $this->sesion->get('idempresa');
        return $this->HabilitarVentaDespuesAprobarModel->buscaVentasAprobadasModel($empresa);
    }
    
    public function buscarComentariosVentas($idVenta){
        $empresa = $this->sesion->get('idempresa');
        return $this->HabilitarVentaDespuesAprobarModel->buscaComentariosModel($empresa,$idVenta);
    }
    
    
    public function buscaVentas($idVenta,$observacion){
        try{
            $this->conexion->beginTransaction();
            $empresa = $this->sesion->get('idempresa');
            $registroVenta = $this->HabilitarVentaDespuesAprobarModel->buscaVentaModel($empresa,$idVenta);
            if(empty($registroVenta)){
                throw new MyException('No se encontraron las ventas', -1);
            }

            $idVentaHistorico =  $this->insertaVentaHistorico($registroVenta,$observacion);
            $this->id_hventa = $idVentaHistorico;
            $this->buscaDetalleVentaHistorico($idVenta, $idVentaHistorico);
            $this->buscaVentaLiquidacion($idVenta);
            $this->buscaVentaFinanciada($idVenta);
            $this->buscaDetalleVentaFinanciada($idVenta);
            $this->buscaInformacionFinanciada($idVenta);
            $this->actualizarVenta($idVenta);
            $this->conexion->commit();
        } catch (Exception $e){
            
            $this->conexion->rollBack();
        }
    }
    
    public function insertaVentaHistorico($registroVenta,$observacion){
        return $this->HabilitarVentaDespuesAprobarModel->insertaHistoricoVentas($registroVenta, $observacion, $this->sesion->get('idusuario'));
    }
    
    public function buscaDetalleVentaHistorico($idVenta, $idVentaHistorico){
        $registroDetalle = $this->HabilitarVentaDespuesAprobarModel->buscarDetalleVenta($idVenta);
        foreach ($registroDetalle as $detalle){
           
            $this->insertaDetallesVentaHistorico($detalle, $idVentaHistorico);
        }
    }
    
    public function insertaDetallesVentaHistorico($detalles, $idVentaHistorico){
        $detalles['hven_ideregistr'] = $this->id_hventa;
        $this->HabilitarVentaDespuesAprobarModel->insertarDettallesHistorico($detalles);
    } 
    
    public function buscaVentaLiquidacion($idVenta){
        $ventaLiquidaciones = $this->HabilitarVentaDespuesAprobarModel->buscaVentasLiquidaciones($idVenta);
        foreach ($ventaLiquidaciones as $liquidaciones){
            $liquidaciones['hven_ideregistr'] = $this->id_hventa;
        $this->HabilitarVentaDespuesAprobarModel->insertarVentaLiquidaciones($liquidaciones);
        }
    }
    
    public function buscaVentaFinanciada($idVenta){
        $ventaFinanciada = $this->HabilitarVentaDespuesAprobarModel->buscaVentaFinanciaciones($idVenta);
        foreach ($ventaFinanciada as $venFinanciada){
            $venFinanciada['hven_ideregistr'] = $this->id_hventa;
            $this->HabilitarVentaDespuesAprobarModel->insertarVentaFinanciada($venFinanciada);
        }
    }
    
    public function buscaDetalleVentaFinanciada($idVenta){
        $venDetalleFinanciada = $this->HabilitarVentaDespuesAprobarModel->buscaDetalleVentaFinanciaciones($idVenta);
        foreach ($venDetalleFinanciada as $venDetFinanciada){
            $venDetFinanciada['hven_ideregistr'] = $this->id_hventa;
            $this->HabilitarVentaDespuesAprobarModel->insertarDetalleVentaFinanciada($venDetFinanciada);
        }
    }
    
    public function buscaInformacionFinanciada($idVenta){
        $informacionFinanciada = $this->HabilitarVentaDespuesAprobarModel->buscaInformacionFinanciaciones($idVenta);
        foreach ($informacionFinanciada as $informacionFinanciada){
            $informacionFinanciada['hven_ideregistr'] = $this->id_hventa;
            $this->HabilitarVentaDespuesAprobarModel->insertarInformacionFinanciada($informacionFinanciada);
        }
    }
    
    public function actualizarVenta($idVenta){
        $this->HabilitarVentaDespuesAprobarModel->actualizarVentas($idVenta);
    }
    
    public function informacionCliente($idVenta){
        return $this->HabilitarVentaDespuesAprobarModel->informacionClienteVenta($idVenta);
    }
    
}