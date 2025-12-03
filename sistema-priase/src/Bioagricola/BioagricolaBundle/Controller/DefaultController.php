<?php

namespace Bioagricola\BioagricolaBundle\Controller;use Symfony\Bundle\FrameworkBundle\Controller\Controller;class DefaultController extends Controller{public function indexAction($name)
    {return $this->render('BioagricolaBioagricolaBundle:Default:index.html.twig', array('name' => $name));
    }}
