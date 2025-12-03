<?php

namespace Llanogas\LlanogasBundle\Utiles;

use Llanogas\LlanogasBundle\Utiles\jwt\JWT;

class Hash {

    public static function encrypt($usuario, $key) {
        $time = time();
        $token = array(
            'iat' => $time, // Tiempo que inició el token
            'exp' => $time + (60 * 60 * 10), // Tiempo que expirará el token (+10 hora)
            'data' => $usuario
        );
        $jwt = JWT::encode($token, $key);
        return $jwt;
    }

    public static function decrypt($jwt, $key) {
        $data = JWT::decode($jwt, $key, array('HS256'));
        return $data;
    }

    /**
     * Encrypts a string
     *
     * Do not use this function, it is only here for historical reference
     *
     * @param string $key Encryption key, also required for decryption
     * @param string $raw Raw string to be encrypted
     *
     * @return string Raw data encrypted with key
     */
//    public static function encrypt($raw, $key) {
//        return base64_encode(mcrypt_encrypt(
//                        MCRYPT_RIJNDAEL_256, md5($key), $raw, MCRYPT_MODE_CBC, md5(md5($key))
//        ));
//    }
//
//    /**
//     * Decrypts an encrypted string
//     *
//     * Do not use this function, it is only here for historical reference
//     *
//     * @param string $key       Encryption key, also used during encryption
//     * @param string $encrypted Encrypted string to be decrypted
//     *
//     * @return string Decrypted string or `null` if key/meta has been tampered with
//     */
//    public static function decrypt($encrypted, $key) {
//        return rtrim(
//                mcrypt_decrypt(
//                        MCRYPT_RIJNDAEL_256, md5($key), base64_decode($encrypted), MCRYPT_MODE_CBC, md5(md5($key))
//                )
//        );
//    }
}
