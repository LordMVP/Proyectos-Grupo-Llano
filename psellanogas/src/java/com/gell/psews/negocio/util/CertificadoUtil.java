/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.util;

import java.io.FileInputStream;
import java.security.Key;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.SecureRandom;
import java.security.Signature;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Base64;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import org.w3c.dom.Element;

/**
 *
 * @author lrey
 */
public class CertificadoUtil {

    public static final String CLAVE_CERTIFICADO = "ZAn7UsRv75";
    public static final String ALIAS = "pse";
    public static KeyStore llavero = null;

    public static final String CERTIFICADO_PSE = "/opt/wildfly/standalone/configuration/certificadoPSE";
    public static final String LLAVE_PRIVADA = "/opt/wildfly/standalone/configuration/pse.pkcs8";

    private static FileInputStream getArchivo(String ruta) throws Exception {
        FileInputStream archivoCertificado = new FileInputStream(ruta);
        return archivoCertificado;
    }

    public static KeyStore getKeyStore() throws Exception {
        if (llavero != null) {
            return llavero;
        }
        llavero = KeyStore.getInstance(KeyStore.getDefaultType());
        llavero.load(getArchivo(CERTIFICADO_PSE), CLAVE_CERTIFICADO.toCharArray());
        return llavero;
    }

    public static void validarCertificados() throws Exception {
        System.setProperty("javax.net.ssl.trustStore", CERTIFICADO_PSE);
        System.setProperty("javax.net.ssl.trustStorePassword", CLAVE_CERTIFICADO);

        //CertificadoUtil.getKeyStore();
        KeyManagerFactory keyManager = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
        keyManager.init(llavero, CLAVE_CERTIFICADO.toCharArray());
        SSLContext sc = SSLContext.getInstance("SSL");
        TrustManager[] trustAllCerts = new TrustManager[]{
            new X509TrustManager() {
                @Override
                public void checkClientTrusted(java.security.cert.X509Certificate[] xcs, String string) throws CertificateException {
                    LogUtil.info("Alias Cliente:" + string);
                }

                @Override
                public void checkServerTrusted(java.security.cert.X509Certificate[] xcs, String string) throws CertificateException {
                }

                @Override
                public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                    return null;
                }
            }
        };
        sc.init(null, trustAllCerts, new SecureRandom());
        HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

        HttpsURLConnection.setDefaultHostnameVerifier(new HostnameVerifier() {
            @Override
            public boolean verify(String string, SSLSession ssls) {
                return true;
            }
        });
    }

    public static Key getKey() throws Exception {
        KeyStore keyStore = getKeyStore();
        return keyStore.getKey(ALIAS, CLAVE_CERTIFICADO.toCharArray());
    }

    public static PrivateKey getLlavePrivada() throws Exception {
        getKeyStore();
        KeyStore.PrivateKeyEntry entrada = (KeyStore.PrivateKeyEntry) llavero.getEntry(ALIAS, new KeyStore.PasswordProtection(CLAVE_CERTIFICADO.toCharArray()));
        return entrada.getPrivateKey();

    }

    public static X509Certificate getCertificadoPrivado() throws Exception {
        getKeyStore();
        KeyStore.PrivateKeyEntry entrada = (KeyStore.PrivateKeyEntry) llavero.getEntry(ALIAS, new KeyStore.PasswordProtection(CLAVE_CERTIFICADO.toCharArray()));
        return (X509Certificate) entrada.getCertificate();
    }

    public static X509Certificate getCertificado() throws Exception {
        X509Certificate certificado = (java.security.cert.X509Certificate) getKeyStore().getCertificate(ALIAS);
        return certificado;
    }

    public static String getSignature(Element message) throws Exception {
        /*String id = UUID.randomUUID().toString();
        WSSConfig config = WSSConfig.getDefaultWSConfig();
        config.setWsseNS("http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd");
        config.setWsuNS("http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd");

        Element elemetSecurityToken = WSSecurityUtil.createBinarySecurityToken((Document) message, id, config);
        BinarySecurity binary = new BinarySecurity(config, elemetSecurityToken);
        binary.setID(id);*/

 /*Element securityElement = sec.getElement();
        Timestamp timestamp = new Timestamp(config, message);
        WSSecurityEngine security = new WSSecurityEngine(config);
        security.handleTimestamp(timestamp);
        Reference ref = new Reference(config, message);
        ref.setURI("#body");
        ref.setValueType("http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3");
        SecurityTokenReference securityTokenReference = new SecurityTokenReference(config, message);
        securityTokenReference.setReference(ref);*/
 /*Element securityElement = securityTokenReference.getReference().getElement();
        securityElement.setAttribute("ValueType", "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3");
        securityElement.setAttribute("URI", "#_0Sahwev58iYfewi7gYLx9g22");*/
 /*List<X509Certificate> x509Content = new ArrayList<>();
        x509Content.add(getCertificado());
        DOMSignContext dsc = new DOMSignContext(getKey(), message);
        XMLSignatureFactory fac = XMLSignatureFactory.getInstance("DOM");
        fac.newSignatureMethod(SignatureMethod.RSA_SHA1, null);
        Reference ref = fac.newReference("", fac.newDigestMethod(DigestMethod.SHA1, null), Collections.singletonList(fac.newTransform(CanonicalizationMethod.EXCLUSIVE, (TransformParameterSpec) null)), null, null);
        SignedInfo si = fac.newSignedInfo(fac.newCanonicalizationMethod(CanonicalizationMethod.EXCLUSIVE, (C14NMethodParameterSpec) null), fac.newSignatureMethod(SignatureMethod.RSA_SHA1, null), Collections.singletonList(ref));
        KeyInfoFactory kif = fac.getKeyInfoFactory();
        X509Data newX509Data = kif.newX509Data(x509Content);
        KeyInfo ki = kif.newKeyInfo(Collections.singletonList(newX509Data));
        XMLSignature signature = fac.newXMLSignature(si, ki);
        signature.sign(dsc);*/
        X509Certificate certificado = getCertificadoPrivado();
        return Base64.getEncoder().encodeToString(certificado.getEncoded());
    }

    public static byte[] sign(String data) throws Exception {
        Signature rsa = Signature.getInstance("SHA1withRSA");
        rsa.initSign(getLlavePrivada());
        rsa.update(data.getBytes());
        return rsa.sign();
    }

}
