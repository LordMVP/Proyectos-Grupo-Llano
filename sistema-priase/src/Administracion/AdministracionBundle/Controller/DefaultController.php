<?php

namespace Administracion\AdministracionBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('AdministracionAdministracionBundle:Default:index.html.twig', array('name' => $name));
    }
}
