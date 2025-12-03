<?php

namespace Llanogas\LlanogasBundle;

use Symfony\Component\Security\Acl\Exception\Exception;

class ValidacionException extends Exception {

    private $data;

    public function getData() {
        return $this->data;
    }

    public function setData($data) {
        $this->data = $data;
    }

}
