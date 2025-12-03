<?php

namespace Llanogas\LlanogasBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Llanogas\LlanogasBundle\Utiles\Array2XML;

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
class ActualizarTercerosSevenCommand extends ContainerAwareCommand {

    /**
     *
     * @var \Doctrine\DBAL\Connection 
     */
    private $Conexion;
    private $genericoDelegado;
    private $generoModel;

    protected function configure() {
        $this
                ->setName('Llanogas:achagua:actualizarterceroSeven')
                ->setDescription('permite exportar los movimeintos aprobadoas a Seven')
                ->addArgument('empresa', InputArgument::REQUIRED, 'Codigo Seven Empresa a Procesar ')
                ->addArgument('condicion', InputArgument::REQUIRED, 'Condicion para Filtrar Suscripciones para actualizar tercero en seven');

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
            $this->genericoDelegado = new GenericoDelegado($this->Conexion);
            $this->genericoModel = new GenericoModel($this->Conexion);
            $idempresa = $input->getArgument('empresa');
            $condicion = $input->getArgument('condicion');

            $datos = $this->genericoModel->consultaInfoSuscripciones($idempresa, $condicion);
            foreach ($datos as $registro) {
                print_r("\n");
                print_r($registro);
                $registro['idempresa'] = $idempresa;
                $respuestaSeven = $this->genericoDelegado->invocaWsTercerosSeven($registro);
                if ($respuestaSeven['error'] == 0) {
                    print_r("\n Respuesta Satisfactoria => Resultado :" . $respuestaSeven['error'] . " Mensaje " . $respuestaSeven['mensaje']);
                } else {
                    print_r("\n Error Procesando Tercero en Seven => Resultado :" . $respuestaSeven['error'] . " Mensaje:" . $respuestaSeven['mensaje']);
                }
            }
            $fecha_fin = (new \DateTime());
            print_r("\n Fin Proceso:");
            print_r($fecha_fin->format("d-m-Y h:i:s"));
        } catch (\Exception $ex) {
            print_r("\n Error cargando información Seven:" . $ex->getMessage());
        }
        $this->Conexion->close();
    }

}
