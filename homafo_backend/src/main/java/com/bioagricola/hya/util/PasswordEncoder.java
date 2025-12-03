package com.bioagricola.hya.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Clase para administracion de encriptacion de la contraseña (MD5)
 */
public class PasswordEncoder {

    private static PasswordEncoder instance = new PasswordEncoder();

    private PasswordEncoder() {
    }

    public static PasswordEncoder getInstance() {
        return instance;
    }

    public String getMD5SecurePassword(String passwordToHash) {
        String generatedPassword = null;
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] bytes = md.digest(passwordToHash.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < bytes.length; i++) {
                sb.append(Integer.toString((bytes[i] & 0xff) + 0x100, 16).substring(1));
            }
            generatedPassword = sb.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return generatedPassword;
    }

    public static void main(String[] args) {
        String pass = PasswordEncoder.getInstance().getMD5SecurePassword("1234");
        System.out.println(pass);
        System.out.println(pass.length());
    }

}
