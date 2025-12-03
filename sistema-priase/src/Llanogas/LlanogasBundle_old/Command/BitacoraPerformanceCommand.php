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
 * Generarción de notificaciones Mail 
 *
 * @author lmrubio
 */
class BitacoraPerformanceCommand extends ContainerAwareCommand {

    /**
     *
     * @var \Doctrine\DBAL\Connection 
     */
    private $Conexion;
    private $genericoDelegado;
    private $generoModel;

    /**
     * Empresa: Id de empresa con la cual se va a realizar el seguimiento
     * Proceso: Campo filtro para condicionar los datos que se deben validar para el seguimiento 
     */
    protected function configure() {
        $this
                ->setName('Llanogas:achagua:generacionBitacora')
                ->setDescription('Genera Estadisticas en tabla jmeter para analisis de Pool de Conexiones')
                ->addArgument('basedatos', InputArgument::REQUIRED, 'Nombre Base Datos');
        $this->Conexion = ConexionBD::getConexion();
        /*
         * Se debe ajustar la instanciacion de los parametros de referencia de los metodos que se consumen del delegado , 
         * porque genera conflicto si se pasan parametos por referencias desde Comandos de Symfony , por lo cual se comentarea la siguiente linea 
         */
    }

    protected function execute(InputInterface $input, OutputInterface $output) {
        try {

            $fecha = (new \DateTime());
            print_r("\n Inicia Bitacora :");
            print_r($fecha->format("d-m-Y h:i:s"));

            $baseDatos = $input->getArgument('basedatos');
            $this->ConsultaBitacoraBaseDatos($baseDatos);
        } catch (\Exception $ex) {
            print_r("\n Error Generando Bitacora:" . $ex->getMessage());
        }
    }

    private function ConsultaBitacoraBaseDatos($baseDatos) {
        $fecha = (new \DateTime());
        $this->genericoDelegado = new GenericoDelegado($this->Conexion);
        $this->genericoModel = new GenericoModel($this->Conexion);
        $resultado = $this->genericoModel->consultaConexionesActivas($baseDatos);
        print_r($resultado);
        print_r("\n Fin Generación Bitacora   ");
        print_r($fecha->format("d-m-Y h:i:s"));
    }

}
