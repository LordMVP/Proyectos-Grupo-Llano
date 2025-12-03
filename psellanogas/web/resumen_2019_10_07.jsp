<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta charset="UTF-8" />
        <title>Llanogas - Pagos en línea</title>


        <meta name="keywords" content="" />
        <meta name="description" content="" />
        <link rel="shortcut icon" href="https://www.llanogas.com/favicon.ico" type="image/vnd.microsoft.icon" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.3/css/bootstrap.min.css" integrity="sha384-Zug+QiDoJOrZ5t4lssLdxGhVrurbmBWopoEl+M6BdEfwnCJZtKxi1KgxUyJq13dy" crossorigin="anonymous"/>

        <link href="https://www.llanogas.com/resources/skins/blue/css/contents.css" rel="stylesheet" type="text/css" />
        <link href="https://www.llanogas.com/resources/skins/blue/css/public.css" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href="https://www.llanogas.com/resources/js/dhtmlwindow/modal.css" type="text/css" />
        <link href="https://www.llanogas.com/resources/skins/blue/css/menu_bar_horizontal.css" rel="stylesheet" type="text/css" />

        <link rel="stylesheet" href="../css/font-awesome.min.css" />
        <style>
            #header {
                height: 105px;
                border-radius: 0px 0px 15px 15px;
            }

            #container{
                width: 960px;
                height: auto;
                float: left;
                margin: 0;
                padding: 20px 20px 70px 20px;
                background-color: #FFF;
                border-radius: 10px 10px 0px 0px;
                margin-top: 15px;
                position: relative;
                z-index: 9999999;
                min-height: 450px;
                box-shadow: 1px 0 5px #f1f1f1, -1px 0 5px #f1f1f1;
            }

            .big-title{
                font-size: 2em !important;
            }

            .dark-gray{
                color:#484848;
            }

            .fa-fix-h{
                margin-top: 5px;
                margin-bottom: 5px;
            }

            .fa-fix-w{
                margin-left: 5px;
                margin-right: 5px;
            }

            #navbar ul li a {
                height: 41px;
            }

            #client-details {
                padding: 0px 20px 15px 25px;
                border-radius: 10px;
            }
            .invoice-title{
                font-size: 1.5em;
                margin-bottom: 7px;
            }
            #client-details.pending .invoice-title{
                color: #2798d0;
            }
            #client-details.success .invoice-title{
                color: #3c763d;
            }
            #client-details.failed .invoice-title{
                color: #b7615f;
            }
            #client-details.pending{
                border: solid 1px #87d8ff;
                background-color: rgba(240, 246, 255, 0.36);                
            }
            #client-details.success{
                border: solid 1px #dff0d8;
                background-color: rgba(223, 240, 216, 0.2);                
            }
            #client-details.failed{
                border: solid 1px #a94442;
                background-color: rgba(242, 222, 222, 0.3);
            }

            .client-name-title{
                font-size: 1.7em;
                margin-bottom: 7px;
                margin-top: 50px;
            }


            #footer {
                position: relative;
                bottom: 0px;
                background-image: none;
            }

            #footer-b{
                background-image:url(http://www.llanogas.com/resources/skins/blue/image/bg_logos_footer.jpg); background-position:bottom; background-repeat:repeat-x; background-size: cover;
                width: 100%;
            }
            #footerlogos { 
                background-color: #FFF;
            }
        </style>
    </head>

    <body>
        <div id="all">
            <div id="header">
                <div id="logosite">
                    <a href="http://www.llanogas.com/">
                        <img src="http://www.llanogas.com/resources/skins/blue/image/img_logo_llano.gif" width="265" height="93" alt="Llanogas" />
                    </a>
                </div>
                <div id="usertools">
                    <ul>
                        <!-- REEMPLAZAR CON MARGEN -->	
                    </ul>
                </div>
                <div id="navbar">
                    <ul id="MainMenuBar">
                        <li><a  href="http://www.llanogas.com/">Regresar al Inicio</a></li>
                        <li><a  href="/wspse">Realizar otro pago</a></li>
                    </ul>
                </div>
            </div>
            <div>
                <div id="container">
                    <div>
                        <h1 class="text-center big-title dark-gray">Resumen Pago en L&iacute;nea </h1>
                    </div>

                    <div id="pay-information">
                        <div id="client-details" class="col-md-8 offset-md-2
                             <c:if test="${listaDetalles[0].estadoPago == estadoOK}">
                                 success
                             </c:if>
                             <c:if test="${listaDetalles[0].estadoPago == estadoPendiente}">
                                 pending
                             </c:if>
                             <c:if test="${listaDetalles[0].estadoPago == estadoRechazado}">
                                 failed
                             </c:if>
                             ">
                            <h4 class="client-name-title">
                                <i class="fa fa-user"></i> 
                                <span class="client-name">${nombreCliente}</span>
                            </h4> 

                            <h5 class="invoice-title mt-4"><i class="fa fa-info-circle" aria-hidden="true"></i> Informaci&oacute;n del Pago Transacci&oacute;n: ${ID}</h5>
                            <p>
                                <i class="fa fa-calendar"></i> Fecha del Pago: <span class="invoice-date">${resumen.fecha}</span> <br />
                                <i class="fa fa-university"></i> Banco: <span class="bank">${resumen.bankCode}</span> <br />

                                <c:set var="total" value="${0}"/>
                                <c:if test="${empty listaDetalles}">
                                    Rechazado
                                </c:if>
                                <c:forEach items="${listaDetalles}" var="detalle">
                                    <c:set var="total" value="${total + detalle.valorPago}"/>
                                    <c:if test="${detalle.idEmpresa eq idEmpresaLlanogas}">
                                        <span><i class="fa fa-check-square-o"></i> Estado: 
                                            <span>
                                                <c:if test="${detalle.estadoPago eq estadoOK}">
                                                    Pago realizado satisfactoriamente
                                                </c:if>
                                                <c:if test="${detalle.estadoPago ne estadoOK}">
                                                    ${detalle.estadoPago}
                                                </c:if>
                                            </span> </span> <br />
                                        <span><i class="fa fa-usd"></i> Llanogas S.A  E.S.P: <span class="invoice-date pull-right">${detalle.valorPago}</span> </span> <br />
                                        <span><i class="fa fa-user"></i> Referencia de Pago Gas: <span class="invoice-date pull-right">${detalle.idSuscripcion}</span> </span> <br />
                                    </c:if>
                                    <c:if test="${detalle.idEmpresa eq idEmpresaBioagricola}">
                                        <span><i class="fa fa-usd"></i> Bioagricola del Llano: <span class="invoice-date pull-right">${detalle.valorPago}</span> </span><br />
                                        <span><i class="fa fa-user"></i> Referencia de Pago Aseo: <span class="invoice-date pull-right">${detalle.idSuscripcion}</span> </span> <br />
                                    </c:if>
                                </c:forEach>
                                <hr/>
                                <i class="fa fa-usd"></i> Valor Total: <span class="valor pull-right"><c:out value="${total}"></c:out></span> <br />
                            </p>
                        </div>

                    </div>
                </div>

            </div>
            <div class="clear"></div>


        </div>
        <div id="footer">
            <div id="footerlogos">
                <ul style="margin-left:15px;">
                    <li><img src="http://www.llanogas.com/resources/skins/blue/image/icontec.png" height="99" alt="ssp" style="margin-left:100px;" /></li>
                    <li><img src="http://www.llanogas.com/resources/skins/blue/image/ssp.jpg" height="80" alt="ssp" style="margin-top:5px;"/></li>
                    <li><img src="http://www.llanogas.com/resources/skins/blue/image/minminas.png" height="60" alt="Min energía" style="margin-top:20px;"/></li>
                </ul>
            </div>
            <div id="footer-b">
                <div id="footercontent">
                    <div id="legal">
                        © 2010  <strong>LLANOGAS S.A. Empresa de servicios públicos E.S.P.</strong>  <br /> 
                        Todos los derechos reservados. I <a href="">Términos y condiciones de uso</a><br />
                        PBX: (+57 8) 6819130 Fax: (+57 8) 6640584<br />
                        Línea de Atención al Cliente: (+57 8) 6819080</div>
                    <div id="socialmedia">
                        <ul>
                            <li><a href=""><img src="http://www.llanogas.com/resources/skins/blue/image/ico_facebook.gif" width="16" height="16" alt="Facebook" /></a></li>
                            <li><a href="https://twitter.com/llanogassaesp" target="_blank"><img src="http://www.llanogas.com/resources/skins/blue/image/ico_twitter.gif" width="16" height="16" alt="Twitter" /></a></li>
                            <li><a href=""><img src="http://www.llanogas.com/resources/skins/blue/image/ico_mailus.gif" width="16" height="16" alt="Mail us" /></a></li>
                            <li><a href=""><img src="http://www.llanogas.com/resources/skins/blue/image/ico_share_this.gif" width="16" height="16" alt="Share this" /></a></li>
                        </ul>
                        <div class="emzac"><a href="http://www.emzac.com" target="_blank"><img src="http://www.llanogas.com/resources/skins/blue/image/img_logo_emzac.gif" width="18" height="14" alt="emzac" /></a></div>
                    </div>
                </div>
            </div>
        </div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    </body>
</html>