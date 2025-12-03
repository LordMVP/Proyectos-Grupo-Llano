<?php

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;
use Llanogas\LlanogasBundle\Utiles\Util;

class AppKernel extends Kernel {

    public function registerBundles() {

        $bundles = array(
            new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
            new Symfony\Bundle\SecurityBundle\SecurityBundle(),
            new Symfony\Bundle\TwigBundle\TwigBundle(),
            new Symfony\Bundle\MonologBundle\MonologBundle(),
            new Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle(),
            new Symfony\Bundle\AsseticBundle\AsseticBundle(),
            new Doctrine\Bundle\DoctrineBundle\DoctrineBundle(),
            new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),
            new Llanogas\LlanogasBundle\LlanogasLlanogasBundle(),
            new Reportes\ReportesBundle\ReportesBundle(),
            new Libranza\LibranzaBundle\LibranzaBundle(),
            new Administracion\AdministracionBundle\AdministracionAdministracionBundle(),
            new Externo\FinanciacionesBundle\ExternoFinanciacionesBundle(),
            new Nominaciones\NominacionesBundle\NominacionesNominacionesBundle(),
            new Agendamiento\AgendamientoBundle\AgendamientoAgendamientoBundle(),
            new Reial\ReialBundle\ReialReialBundle(),
            new Rugii\RugiiBundle\RugiiRugiiBundle(),
            new Dorbi\DorbiBundle\DorbiDorbiBundle(),
            new Bioagricola\BioagricolaBundle\BioagricolaBioagricolaBundle(),
            new Contacto\ContactoBundle\ContactoContactoBundle(),
            new Homafo\HomafoBundle\HomafoHomafoBundle(),
            new GestionCartera\GestionCarteraBundle\GestionCarteraGestionCarteraBundle(),
            new LiquidacionyNotas\LiquidacionyNotasBundle\LiquidacionyNotasLiquidacionyNotasBundle(),
            new Aprovechamiento\AprovechamientoBundle\AprovechamientoAprovechamientoBundle(),
        );

        if (in_array($this->getEnvironment(), array('dev', 'test'))) {
            $bundles[] = new Acme\DemoBundle\AcmeDemoBundle();
            $bundles[] = new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
            $bundles[] = new Sensio\Bundle\DistributionBundle\SensioDistributionBundle();
            $bundles[] = new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle();
        }

        return $bundles;
    }

    public function registerContainerConfiguration(LoaderInterface $loader) {
        $loader->load(__DIR__ . '/config/config_' . $this->getEnvironment() . '.yml');
    }

}
