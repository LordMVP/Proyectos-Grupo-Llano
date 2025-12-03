<?php

namespace Libranza\LibranzaBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('LibranzaBundle:Default:index.html.twig', array('name' => $name));
    }
}
