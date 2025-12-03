<?php

namespace Llanogas\LlanogasBundle\Utiles;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Lee una sesión legada.
 *
 * @author hrey
 */
use Symfony\Component\HttpFoundation\Session\Storage\NativeSessionStorage;

class LegacySessionStorage extends NativeSessionStorage {

    private $data;

    /** {@inheritdoc} */
    protected function loadSession(array &$session = null) {
        if (null === $session) {
            $session = &$_SESSION;
        }

        foreach ($session as $key => $value) {
            $this->data[$key] = $value;
        }
        $this->started = true;
        $this->closed = false;
    }

    /**
     * Obtiene la información de la sesión.
     * @return type
     */
    public function getData() {
        return $this->data;
    }

}

?>
