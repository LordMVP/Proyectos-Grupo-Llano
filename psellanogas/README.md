# WS PSE

_Este servicio permite integrar el servicio de pagos en linea con las paginas web de Cusiana y Llanogas. Ofreciendo las funcionalidades de consulta de saldos de facturas y enlazandolo con la entidad bancaria según requiera el usuario._

### Pre-requisitos 📋

_Este servicio esta creado como un servicio web realizado en java, para el despligue se requiere un contenedor de aplicaciónes como wildfly, una conexion a base de datos cuyo nombre por defecto **java:/PoolPSE** y una parametrización basica la cual esta contenida en la tabla **par_parametros**._

_La parametrización esta en formato JSON y contiene todos los parametros necesarios para la configuración del servicio, esta parametrización se carga una vez se inicia el servicio, en caso de existan cambios en la parametrización y se quieran aplicar al servicio en funcionamiento se debe cargar en el navegador las siguientes rutas._

#### Para Llanogas 
	**http://10.43.51.165:8280/wspse/sistema/administracion/cargar**
	**http://10.43.51.171:8280/wspse/sistema/administracion/cargar**

#### Para Cusiana
	**http://10.43.51.171:8280/psecusianagas/sistema/administracion/cargar**


### Instalación 🔧

* _Inicialmente se debe crear el pool de conexión en el contenedor de aplicaciones._

* _Para el caso de Llanogas se debe modificar el archivo del proyecto **jboss-web.xml** y modificar el contexto para que sea **/wspse** y en la clase **RecaudoWebDAO.java** en la linea 175 y 221 colocar el parametro **EEmpresa.ID_LLANOGAS**_

```
ps.setObject("empresa", EEmpresa.ID_LLANOGAS);
```

* _Para el caso de Cusianagas se debe modificar el archivo del proyecto **jboss-web.xml** y modificar el contexto para que sea **/psecusianagas** y en la clase **RecaudoWebDAO.java** en la linea 175 y 221 colocar el parametro **EEmpresa.ID_CUSIANAGAS**_

```
ps.setObject("empresa", EEmpresa.ID_CUSIANAGAS);
```


* _Se debe definir los parametros del servicio por empresa en la tabla par_parametro, según se muestra a continuación:_


```
"PSE_PARAMETROS": {
    "pse.password": "xxxx",
    "pse.servicecode": "xxxxx",
    "pse.servidor.ip.publica": "xxx.x.x.xxx",
    "pse.servidor.privado": "transactional.llanogas.com",
    "pse.servidor.publico": "transactional.llanogas.com",
    "pse.entityurl": "https://__SERVIDOR__/psecusianagas/cliente/confirmarpago",
    "pse.mensaje": "Pago factura cisianagas",
    "pse.codigo.cusiana": "8002186822",
    "pse.urlbancos": "https://www.psepagos.co/PSEHostingUI/GetBankListWS.aspx?enc=",
    "pse.tiempoconsultapse": 7,
    "pse.ticketOfficeId": 9055,
    "pse.url": "https://200.1.124.118/PSEHostingWebServices/PSEHostingWS.asmx?wsdl",
    "pse.proceso.tiempo": "500000",
    "empresas.cusiana.id": 319,
    "empresas.cusiana.nit": "8002186822",
    "oficina.id": 31,
    "mediopago.pse": 1398,
    "usuario.pse": 708,
    "formapago.pse": 75,
    "recaudo.proceso.tiempo": "500000",
    "mail.smtp.servidor": "smtp-relay.gmail.com",
    "mail.smtp.starttls.enable": "FALSE",
    "mail.smtp.port": 587,
    "mail.smtp.auth": "FALSE",
    "mail.email": "lmrubio@grupodellano.com",
    "mail.password": "",
    "mail.asunto": "Aplicar Recaudo Cusiana",
    "mail.to": "eariveros@gmail.com",
    "mail.cc": "avcastro@grupodellano.com",
    "url_autorizacion_habeas_data": "https://www.llanogas.com/resources/uploaded/files/autorizacion_cusianagas.pdf",
    "url_politica_habeas_data": "https://www.llanogas.com/resources/uploaded/files/politica_cusianagas.pdf"
  }
	
```

_Finalmente se debe compilar el proyecto y desplegar el servicio_


## Validar que el proyecto funcione correctamente ⚙️

* _En el caso de Llanogas se debe acceder a la siguiente URL **https://transactional.llanogas.com/wspse/**_

* _En el caso de Cusianagas se debe acceder a la siguiente URL **https://transactional.llanogas.com/psecusianagas/cusiana/**_
