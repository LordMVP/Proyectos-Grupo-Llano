<?php

namespace Llanogas\LlanogasBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\ProcesoFacturacionModel;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Procesar Cambios de Medidor Registrados en Tecsoft 
 *
 * @author lmrubio
 */
class EliminarFacturasCommand extends ContainerAwareCommand {

    /**
     *
     * @var \Doctrine\DBAL\Connection 
     */
    private $Conexion;
    private $ProcesoFacturacion;

    protected function configure() {
        $this
                ->setName('Llanogas:achagua:eliminarFacturasBD')
                ->setDescription('Eliminar Facturas en estado E para quitarlos fisicamente de la base de datos');
        $this->Conexion = ConexionBD::getConexion();
        $this->ProcesoFacturacion = new ProcesoFacturacionModel($this->Conexion);
    }

    protected function execute(InputInterface $input, OutputInterface $output) {
        try {

            $fecha = (new \DateTime());
            print_r("\n Inicia Proceso :");
            print_r($fecha->format("d-m-Y h:i:s"));
            $controlProceso = $this->ProcesoFacturacion->getEstadoControlProcesoEliminarFacturas();
            
            if($controlProceso['cantidad'] === 1){
                print_r("\n Se esta ejecutando un Proceso : " );
                return;
            }
            $this->ProcesoFacturacion->actualizarInicioControlProcesoEliminarFacturas();
            
            print_r("\n Eliminacion de Faturas en estado E  : ");
            $resultado = $this->ProcesoFacturacion->eliminarFacturaFisica();
            if (empty($resultado)) {
                print_r("No hay Facturas a Eliminar ");                
            }else {            
                print_r("\n Total Eliminadas : ");
                print_r($resultado);
            }
            print_r("\n Fin Proceso  Eliminacion de Facturas en estado E");
            print_r("\n Incia Proceso  Depuracion de Facturas ");
            $resultado = $this->ProcesoFacturacion->depurarDetallesFacturas();
            if (empty($resultado)) {
                print_r("No hay detalles de Facturas a Depurar ");            
            } else {
                print_r("\n Total Detalles Depurados : ");
                print_r($resultado); 
            }
            print_r("\n Fin Proceso  Depuracion de Detalle de Conceptos Informativos en Valor 0 ");
            $this->ProcesoFacturacion->actualizarFinalizacionControlProcesoEliminarFacturas();
            $this->Conexion->close();
            $fecha_fin = (new \DateTime());
            print_r($fecha_fin->format("d-m-Y h:i:s"));
           
        } catch (\Exception $ex) {
            $this->ProcesoFacturacion->actualizarFinalizacionControlProcesoEliminarFacturas();
            print_r("\n Error eliminando facturas:" . $ex->getMessage());
            
        }
        $this->Conexion->close();
    }

}
