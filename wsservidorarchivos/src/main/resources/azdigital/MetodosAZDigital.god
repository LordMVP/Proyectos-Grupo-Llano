CargarArchivo =>[
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsds="http://www.analitica.com.co/AZDigital/xsds/">
   <soapenv:Header/>
   <soapenv:Body>
      <xsds:CargarArchivo __PROPIEDADES__ >
         <Archivo>__ARCHIVO__</Archivo>
      </xsds:CargarArchivo>
   </soapenv:Body>
</soapenv:Envelope>
]

SolicitarArchivo =>[
 <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsds="http://www.analitica.com.co/AZDigital/xsds/">
   <soapenv:Header/>
   <soapenv:Body>
      <xsds:SolicitarArchivo __IDARCHIVO__  Codificacion="Base64"/>
   </soapenv:Body>
</soapenv:Envelope>
]

BorrarArchivo =>[
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsds="http://www.analitica.com.co/AZDigital/xsds/">
   <soapenv:Header/>
   <soapenv:Body>
      <xsds:Borrar __IDELEMENTO__ TipoElemento="Archivo"/>
   </soapenv:Body>
</soapenv:Envelope>
]