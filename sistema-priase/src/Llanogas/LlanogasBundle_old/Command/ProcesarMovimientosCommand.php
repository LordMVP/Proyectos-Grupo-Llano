<?php

namespace Llanogas\LlanogasBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Delegado\ProcesoWebServiceMovimientosContablesDelegado;
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
class ProcesarMovimientosCommand extends ContainerAwareCommand {

    /**
     *
     * @var \Doctrine\DBAL\Connection 
     */
    private $Conexion;
    private $procesoWebServiceMovimientosContablesDelegado;

    protected function configure() {
        $this
                ->setName('Llanogas:achagua:procesarmovimientos')
                ->setDescription('permite exportar los movimeintos aprobadoas a Seven');

        $this->Conexion = ConexionBD::getConexion();
/*
 * Se debe ajustar la instanciacion de los parametros de referencia de los metodos que se consumen del delegado , 
 * porque genera conflicto si se pasan parametos por referencias desde Comandos de Symfony , por lo cual se comentarea la siguiente linea 
 */
 //       $this->procesoWebServiceMovimientosContablesDelegado = new ProcesoWebServiceMovimientosContablesDelegado(null, null);
    }

    protected function execute(InputInterface $input, OutputInterface $output) {
        try {

            $fecha = (new \DateTime());
            print_r("\n Inicia Proceso :");
            print_r($fecha->format("d-m-Y h:i:s"));
            $this->procesoWebServiceMovimientosContablesDelegado->ExportarMovimientosContablesCron($this->Conexion);
            $fecha_fin = (new \DateTime());
            print_r("\n Fin Proceso:");
            print_r($fecha_fin->format("d-m-Y h:i:s"));
        } catch (\Exception $ex) {
            print_r("\n Error eliminando facturas:" . $ex->getMessage());
        }
        $this->Conexion->close();
    }

}
