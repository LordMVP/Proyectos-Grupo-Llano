
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <title>Llanogas - Pagos en línea</title>


        <meta name="keywords" content="" />
        <meta name="description" content="" />
        <link rel="shortcut icon" href="https://www.llanogas.com/favicon.ico" type="image/vnd.microsoft.icon" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.3/css/bootstrap.min.css" integrity="sha384-Zug+QiDoJOrZ5t4lssLdxGhVrurbmBWopoEl+M6BdEfwnCJZtKxi1KgxUyJq13dy" crossorigin="anonymous"/>

        <link href="https://www.llanogas.com/resources/skins/blue/css/contents.css" rel="stylesheet" type="text/css" />
        <link href="https://www.llanogas.com/resources/skins/blue/css/public.css" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href="https://www.llanogas.com/resources/js/dhtmlwindow/modal.css" type="text/css" />
        <link href="https://www.llanogas.com/resources/skins/blue/css/menu_bar_horizontal.css" rel="stylesheet" type="text/css" />

        <link rel="stylesheet" href="css/font-awesome.min.css" />

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

            #client-details, #option-redirect {
                display: none;
                border: solid 1px #87d8ff;
                padding: 0px 20px 15px 25px;
                border-radius: 10px;
                background-color: rgba(240, 246, 255, 0.36);
            }

            .client-name-title{
                font-size: 1.7em;
                margin-bottom: 7px;
                margin-top: 50px;
            }
            #linkRedirect{
                font-size: 1.3em;                
            }

            .invoice-title, .pay-title{
                font-size: 1.5em;
                margin-bottom: 7px;
                color: #2798d0;
            }

            #footer {
                position: relative;
                bottom: 0px;
                background-image: none;
            }

            #footer-b{
                background-image:url(https://www.llanogas.com/resources/skins/blue/image/bg_logos_footer.jpg); background-position:bottom; background-repeat:repeat-x; background-size: cover;
                width: 100%;
            }
            #footerlogos { 
                background-color: #FFF;
            }

            #no-details{
                display: none;
                border: solid 1px #ffd687;
                padding: 0px 20px 10px 10px;
                border-radius: 10px;
                background-color: rgba(255, 245, 240, 0.36);
            }
            #div-success{
                display: none;
            }            
            .no-details-title, .error-title, .title-pay{
                font-size: 1.7em;
                margin-bottom: 25px;
                margin-top: 35px;
            }
            .no-details-title{
                color: #F90;
            }
            .error-title{
                color: #a94442;
            }

            #no-details p{
                margin-bottom: 6px;
            }
            #pay-information{
                display: none;
            }

            #div-loader {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 9999999;
                background-color: rgba(255,255,255,0.6);
                width: 100%;
                height: 100%;
                display: none;
            }            

            #div-loader  div{
                width:100px;
                height:100px;
                border-radius:100%;
                position:absolute;
                border: 1px solid #3eb9e5;
                animation: up 1s;
                animation-iteration-count: infinite;
                transition:2s;
                border-bottom:none;
                border-right:none;
                animation-timing-function:linear;
                margin-left: -70px;
                margin-top: -70px;
                left:50%;
                top:50%;

            }

            @keyframes up{
                from{transform:rotate(0deg); }
                50%{transform:rotate(180deg);}
                100%{transform:rotate(360deg);}
            }
            #div-loader  #img2{
                width:90px;
                height:90px;
                left:50.35%;
                top:50.7%;
                animation-delay:.2s;

            }
            #div-loader  #img3{
                width:80px;
                height:80px;
                left:50.70%;
                top:51.4%;
                animation-delay:.4s;
            }
            #div-loader #img4{
                width:70px;
                height:70px;
                left:51.05%;
                top:52.1%;
                animation-delay:.6s;

            }
            #div-loader #img5{
                width:60px;
                height:60px;
                left:51.40%;
                top:52.8%;
                animation-delay:.8s;
            }
            #div-error{
                display: none;
            }
            .has-error .form-control{
                border-color: #a94442;
                -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
                box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
            }

        </style>



    </head>

    <body>


        <div id="all">
            <div id="header">
                <div id="logosite">
                    <a href="https://www.llanogas.com/">
                        <img src="https://www.llanogas.com/resources/skins/blue/image/img_logo_llano.gif" width="265" height="93" alt="Llanogas" />
                    </a>
                </div>
                <div id="usertools">
                    <ul>
                        <!-- REEMPLAZAR CON MARGEN -->	
                    </ul>
                </div>
                <div id="navbar">
                    <ul id="MainMenuBar">
                        <li><a  href="https://www.llanogas.com/">Regresar al Inicio</a></li>
                    </ul>
                </div>
            </div>
            <div>
                <div id="container">
                    <div>
                        <h1 class="text-center big-title dark-gray">Pagos en Línea</h1>
                        <p class="text-center">Consulta y paga en línea, tus facturas del servicio de Gas. <br /> La transacción será completamente segura a través de la plataforma de pagos PSE.</p>
                    </div>

                    <div id="search-account">
                        <div id="form">
                            <div class="form-group">
                                <label for="txtClientCode">Referencia de pago:</label>
                                <div class="input-group mb-3">
                                    <input type="text" id="txtClientCode" class="form-control" value="<%= request.getParameter("codigo")==null ?"":request.getParameter("codigo")%>" placeholder="000001" aria-label="Código del Cliente" aria-describedby="basic-addon2" autofocus="autofocus">
                                        <div class="input-group-append">
                                            <button class="btn btn-success" type="button" id="btnSearch">
                                                <i class="fa fa-search fa-fix-h"></i>
                                            </button>
                                            <button class="btn btn-primary" type="button">
                                                <i class="fa fa-question fa-fix-h fa-fix-w"></i>
                                            </button>
                                        </div>
                                </div>
                            </div>
                        </div>

                        <div id="no-details" class="col-md-8 offset-md-2">
                            <h4 class="no-details-title text-center">
                                <i class="fa fa-exclamation-circle" aria-hidden="true"></i> No se encontraron resultados
                            </h4>

                            <p class="text-center">Revise que el <b>Código del Cliente</b> digitado sea el correcto e intente nuevamente. </p>
                            <p class="text-center">Si sigue sin obtener resultados, es posible que no tenga facturas con saldo.</p>
                        </div>
                        <div id="div-error" class="col-md-8 offset-md-2 alert alert-danger">
                            <h4 class="error-title text-center">
                                <i class="fa fa-times-circle" aria-hidden="true"></i> Ocurrió un error al realizar la operación
                            </h4>
                            <p class="text-center" id="p-message-error">Ocurrió un error inesperado. Intente de nuevo más tarde o comuníquese con el administrador del sistema. </p>
                        </div>
                        <div id="div-success" class="col-md-8 offset-md-2 alert alert-success">
                            <h4 class="title-pay text-center">
                                <i class="fa fa-check-circle" aria-hidden="true"></i> <strong> ¡Pago exitoso! </strong>
                            </h4>
                            <p class="text-center text-message"></p>
                        </div>
                        <div class="clear"></div>
                    </div>


                    <div id="pay-information">
                        <div id="client-details" class="col-md-8 offset-md-2">
                            <h4 class="client-name-title"><i class="fa fa-user"></i> <span class="client-name"></span></h4>
                            <p><i class="fa fa-map-marker"></i> <span class="client-address"></span></p>	
                            <hr />
                            <h5 class="invoice-title"><i class="fa fa-info-circle" aria-hidden="true"></i> Información de la Factura</h5>
                            <p>
                                <i class="fa fa-date"></i>Fecha de Vencimiento: <span class="invoice-date"></span> <br />
                                <i class="fa fa-usd" aria-hidden="true"></i> Valor Gas: <span class="value1"></span> <br />
                                <i class="fa fa-usd" aria-hidden="true"></i> Valor Aseo: <span class="value2"></span> <br />
                                <i class="fa fa-usd" aria-hidden="true"></i> Valor Total: <span class="value3"></span> 
                            </p>
                        </div>
                        <div class="mb-4"></div>

                        <div class="col-sm-9 offset-md-2 pl-0 pr-5" id="frm-payer">
                            <h5 class="pay-title">
                                <i class="fa fa-user" aria-hidden="true"></i> Información del Pagador
                            </h5>
                            <div class="col-sm-12 form-group row px-0">
                                <label class="col-sm-3 col-form-label" for="txtNamePayer">Nombres: </label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control" id="txtNamePayer" required maxlength="70" />
                                </div>
                            </div>

                            <div class="col-sm-12 form-group row px-0">
                                <label class="col-sm-3 col-form-label" for="txtLastNamePayer">Apellidos: </label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control" id="txtLastNamePayer" required maxlength="70" />
                                </div>
                            </div>

                            <div class="col-sm-12 form-group row px-0">
                                <label class="col-sm-3 col-form-label" for="cmbDocumentType">Tipo Documento: </label>
                                <div class="col-sm-9">
                                    <select id="cmbDocumentType" class="form-control" required >
                                        <option value="CC">Cédula de Ciudadanía</option>
                                        <option value="CE">Cédula de Extranjería</option>
                                        <option value="NI">NIT</option>
                                        <option value="OT">Otro</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-12 form-group row px-0">
                                <label class="col-sm-3 col-form-label" for="txtNumberDocument">Núm. Documento: </label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control" id="txtNumberDocument" required maxlength="12" />
                                </div>
                            </div>
                            <div class="col-sm-12 form-group row px-0">
                                <label class="col-sm-3 col-form-label" for="txtEmail">Correo: </label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control" id="txtEmail" required maxlength="70" />
                                </div>
                            </div>

                            <div class="col-sm-12 form-group row px-0">
                                <label class="col-sm-3 col-form-label" for="txtPhoneNumber">Teléfono/Celular: </label>
                                <div class="col-sm-9">
                                    <input type="number" class="form-control" id="txtPhoneNumber" required maxlength="15" />
                                </div>
                            </div>
                            <div class="alert alert-danger mt-2 mb-2 mr-4" id="alert-form" style="display: none">
                                <strong><i class="fa fa-times-circle"></i> Información Incompleta</strong>
                                <p> Complete los campos del formulario e intente nuevamente.</p>
                            </div>

                            <div id="verify-pay">
                                <div class="checkbox"> 
                                    <label> 
                                        <input type="checkbox" id="chkAutorizo"> 
                                            Autorizo el uso de mis datos para que me contacten y acepto los 
                                            <a id="linkAutorizo" href="#" target="_blank">términos de aviso de privacidad.  </a>
                                    </label> 
                                </div>
                                <div class="col-xs-12 mr-4">
                                    <div id="divCaptcha"></div>
                                </div>
                            </div>
                            <div>
                                <div id="option-redirect" class="col-xs-12 pt-3 mb-3 mt-3 mr-3 pb-1">
                                    <p>
                                        <i class="fa fa-link"></i>
                                        <strong>Se direccionará a la página de pagos PSE.</strong>
                                    </p>
                                    <div class="clear"></div>
                                </div>
                            </div>
                            <div class="col-sm-12 text-right pr-4">
                                <button id="btnPay" class="btn btn-default" disabled="disabled">
                                    <i class="fa fa-credit-card-alt"></i> Pagar
                                </button>
                                <button id="btnCancel" class="btn btn-danger">
                                    <i class="fa fa-times-circle"></i> Cancelar
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
                <div class="clear"></div>


            </div>
        </div>
        <div id="footer">
            <div id="footerlogos">
                <ul style="margin-left:15px;">
                    <li><img src="https://www.llanogas.com/resources/skins/blue/image/icontec.png" height="99" alt="ssp" style="margin-left:100px;" /></li>
                    <li><img src="https://www.llanogas.com/resources/skins/blue/image/ssp.jpg" height="80" alt="ssp" style="margin-top:5px;"/></li>
                    <li><img src="https://www.llanogas.com/resources/skins/blue/image/minminas.png" height="60" alt="Min energía" style="margin-top:20px;"/></li>
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
                            <li><a href=""><img src="https://www.llanogas.com/resources/skins/blue/image/ico_facebook.gif" width="16" height="16" alt="Facebook" /></a></li>
                            <li><a href="https://twitter.com/llanogassaesp" target="_blank"><img src="https://www.llanogas.com/resources/skins/blue/image/ico_twitter.gif" width="16" height="16" alt="Twitter" /></a></li>
                            <li><a href=""><img src="https://www.llanogas.com/resources/skins/blue/image/ico_mailus.gif" width="16" height="16" alt="Mail us" /></a></li>
                            <li><a href=""><img src="https://www.llanogas.com/resources/skins/blue/image/ico_share_this.gif" width="16" height="16" alt="Share this" /></a></li>
                        </ul>
                        <div class="emzac"><a href="http://www.emzac.com" target="_blank"><img src="https://www.llanogas.com/resources/skins/blue/image/img_logo_emzac.gif" width="18" height="14" alt="emzac" /></a></div>
                    </div>
                </div>
            </div>
        </div>
        <div id="div-loader" >
            <div id="img1" class="img"></div>
            <div id="img2" class="img"></div>
            <div id="img3" class="img"></div>
            <div id="img4" class="img"></div>
            <div id="img5" class="img"></div>
        </div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

        <script>
            var _captcha = null;
            (function () {
                $.fn.keyNumber = function (e) {
                    return this.each(function () {
                        var _this = $(this);
                        var events = {keypress: function (e) {
                                if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
                                    e.preventDefault();
                                    return false;
                                }
                                return true;
                            }};
                        _this.on(events);
                    });
                };

                var app = _ = {
                    CONST: {
                        TECLAS: {
                            ENTER: 13
                        },
                        RESPUESTAS: {
                            SIN_DATOS: 0,
                            OK: 1,
                            ERROR: -1
                        }
                    },

                    request: function (params, success) {
                        $.ajax({
                            url: params.url,
                            data: params.data,
                            type: 'POST',
                            dataType: 'JSON',
                            beforeSend: _.mostrarCargador,
                            success: function (respuesta) {
                                _.ocultarCargador();
                                if (_.validarRespuesta(respuesta)) {
                                    success(respuesta);
                                }
                            },
                            error: _.onRequestError
                        });
                    },

                    mostrarCargador: function () {
                        _.cargador.slideDown('fast');
                        setTimeout(function () {
                            _.cargador.css('height', $('body').height() + 188 + 'px');
                        }, 250);

                    },

                    ocultarCargador: function () {
                        _.cargador.slideUp('fast');
                    },

                    validarRespuesta: function (respuesta) {
                        if (respuesta.codigo === _.CONST.RESPUESTAS.ERROR) {
                            _.mostrarRespuestaError(respuesta.mensaje);
                            return false;
                        }
                        return true;
                    },

                    onRequestError: function (error) {
                        _.ocultarCargador();
                        _.mostrarRespuestaError("Ocurrió un error inesperado. Intente nuevamente más tarde o comuníquese con el administrador del sistema");
                    },

                    init: function () {
                        _.referenciarControles();
                        _.configurarEventos();
                        _.consultarAutorizacionTratamiento();
                        _.consultarPorCodigo();



                    },

                    referenciarControles: function () {
                        _.form = $('#form');
                        _.searchAccount = $('#search-account');
                        _.clientDetails = $('#client-details');
                        _.txtClientCode = _.form.find('#txtClientCode');
                        _.btnSearch = _.form.find('#btnSearch');
                        _.noDetails = $('#no-details');
                        _.divError = $('#div-error');
                        _.cargador = $('#div-loader');
                        _.btnPay = $('#btnPay');
                        _.btnCancel = $('#btnCancel');
                        _.payInformation = $('#pay-information');
                        _.formPayer = $('#frm-payer');
                        _.alertPayer = $('#alert-form');
                        _.alertSuccess = $('#div-success');
                        _.alertRedirect = $('#option-redirect');
                        _.linkAutorizo = $('#linkAutorizo');
                        _.chkAutorizo = $('#chkAutorizo');
                        _.divCaptcha = $('#divCaptcha');
                        _.verifyPay = $('#verify-pay');


                    },

                    configurarEventos: function () {
                        _.txtClientCode.on('keypress', _.onEnterKeyCodigoCliente);
                        _.btnSearch.on('click', _.consultarPorCodigo);
                        _.btnCancel.on('click', _.cancelarPago);
                        _.btnPay.on('click', _.enviarInformacionPagador);
                        _.chkAutorizo.on('change', _.habilitarBotonPagar);

                        _.formPayer.find('#txtNumberDocument').keyNumber();
                        _.formPayer.find('#txtPhoneNumber').keyNumber();
                    },
                    consultarAutorizacionTratamiento: function () {
                        _.request({url: 'cliente/autorizacion'}, _.onConsultarAutorizacionTratamiento);
                    },
                    onConsultarAutorizacionTratamiento: function (data) {
                        _.linkAutorizo.attr('href', data.datos);
                    },
                    onEnterKeyCodigoCliente: function (evento) {
                        if (evento.keyCode === _.CONST.TECLAS.ENTER) {
                            _.consultarPorCodigo();
                        }
                    },

                    consultarPorCodigo: function () {
                        var codigo = _.txtClientCode.val().trim();
                        if (codigo.length === 0) {
                            return;
                        }

                        _.limpiarDatosCliente();
                        var params = {
                            data: {
                                codigoCliente: codigo
                            },
                            url: 'cliente/consultar'
                        };
                        _.request(params, _.onConsultarPorCodigoCompleto);
                    },

                    onConsultarPorCodigoCompleto: function (respuesta) {
                        if (respuesta.codigo === _.CONST.RESPUESTAS.SIN_DATOS || respuesta.codigo === _.CONST.RESPUESTAS.ERROR) {
                            _.mostrarRespuestaSinDatos();
                            return;
                        }

                        _.mostrarSuscripcion(respuesta.datos);
                        _.mostrarFormularioPago();
                    },

                    mostrarSuscripcion: function (suscripcion) {
                        _.idSuscripcion = suscripcion.idSuscripcion;
                        _.clientDetails.slideDown('fast').addClass('current-panel');
                        _.clientDetails.find('.client-name').text(suscripcion.nombres);
                        _.clientDetails.find('.client-address').text(suscripcion.direccion);
                        _.clientDetails.find('.invoice-date').text(suscripcion.fechaVencimiento);
                        _.clientDetails.find('.value1').text(suscripcion.valorGas);
                        _.clientDetails.find('.value2').text(suscripcion.valorAseo);
                        _.clientDetails.find('.value3').text(suscripcion.valorAseo + suscripcion.valorGas);
                    },
                    mostrarFormularioPago: function () {
                        _.searchAccount.slideUp('fast', function () {
                            _.payInformation.slideDown('fast');
                        });
                    },
                    ocultarFormularioPago: function () {
                        _.payInformation.slideUp('fast', function () {
                            _.searchAccount.slideDown('fast');
                        });
                    },
                    deshabilitarFormulario: function () {
                        _.divCaptcha.addClass('hidden');
                        _.btnPay.attr('disabled', 'disabled');
                        _.formPayer.find('input, select').attr('disabled', 'disabled');
                    },
                    habilitarFormulario: function () {
                        _.divCaptcha.removeClass('hidden');
                        _.btnPay.attr('disabled', 'disabled');
                        _.formPayer.find('input, select').removeAttr('disabled');
                    },
                    habilitarBotonPagar: function () {
                        if (_.chkAutorizo.get(0).checked && _.checkCaptcha) {
                            _.btnPay.removeAttr('disabled');
                            return;
                        }
                        _.btnPay.attr('disabled', 'disabled');
                    },
                    captchaChecked: function () {
                        _.checkCaptcha = true;
                        _.habilitarBotonPagar();
                    },
                    mostrarRespuestaSinDatos: function () {
                        _.limpiarDatosCliente();
                        _.noDetails.slideDown('fast').addClass('current-panel');
                    },
                    mostrarRespuestaError: function (mensaje) {
                        _.limpiarDatosCliente();
                        _.divError.find('#p-message-error').text(mensaje);
                        _.divError.slideDown('fast').addClass('current-panel');
                    },
                    mostrarRespuestaExitosa: function () {
                        _.limpiarDatosCliente();
                        _.alertSuccess.slideDown('fast').addClass('current-panel');
                    },
                    cancelarPago: function () {
                        _.limpiarDatosCliente();
                        _.windowPay = false;
                        _.ocultarDireccionar();

                    },
                    enviarInformacionPagador: function () {
                        if (!_.chkAutorizo.get(0).checked || !_.checkCaptcha) {
                            _.alertPayer.find('p').text('Debe autorizar el uso de datos y seleccionar no soy un robot');
                            _.alertPayer.slideDown('fast');
                            return false;
                        }
                        if (_.idSuscripcion && _.validarInformacionPagador()) {
                            var data = {
                                codigoCliente: _.idSuscripcion,
                                pagador: _.obtenerInformacionPagador()
                            };
                            _.limpiarErroresPagador();
                            _.request({data: data, url: 'cliente/pagar'}, _.direccionarAPago);
                        }
                    },
                    obtenerInformacionPagador: function () {
                        var datos = {
                            nombreCliente: _.formPayer.find('#txtNamePayer').val(),
                            idCliente: _.formPayer.find('#txtNumberDocument').val(),
                            telefonoCliente: _.formPayer.find('#txtPhoneNumber').val(),
                            apellidoCliente: _.formPayer.find('#txtLastNamePayer').val(),
                            tipoDocumentoCliente: _.formPayer.find('#cmbDocumentType').val(),
                            correo: _.formPayer.find('#txtEmail').val()
                        };
                        return JSON.stringify(datos);
                    },
                    limpiarErroresPagador: function () {
                        _.habilitarFormulario();
                        _.alertPayer.slideUp('fast');
                        _.formPayer.find('*[required]').parents('.form-group').removeClass('has-error has-success');
                    },
                    validarInformacionPagador: function () {
                        var validaciones = true;
                        var requeridos = _.formPayer.find('*[required]');
                        var exp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


                        for (var i = 0; i < requeridos.length; i++) {
                            var item = $(requeridos[i]);
                            var valor = item.val();
                            var validacion = item[0].tagName === 'INPUT' ? valor.length > 0 && valor.trim() !== '' : valor !== null && valor !== '-1';
                            validaciones = validaciones && validacion === true;
                            item.parents('.form-group').removeClass('has-errorhas-success').addClass(validacion === true ? 'has-success' : 'has-error');
                        }
                        if (!exp.test(_.formPayer.find('#txtEmail').val())) {
                            _.formPayer.find('#txtEmail').parents('.form-group').removeClass('has-error has-success').addClass('has-error');
                            validaciones = false;
                        }
                        if (!validaciones) {
                            _.alertPayer.find('p').text('Complete los campos del formulario e intente nuevamente.');
                            _.alertPayer.slideDown('fast', function () {
                                _.formPayer.find('div.has-error:first input').focus();
                            });
                            return false;
                        }
                        return true;
                    },

                    direccionarAPago: function (respuesta) {
                        if (respuesta.codigo === _.CONST.RESPUESTAS.SIN_DATOS) {
                            _.mostrarRespuestaError("No se encontró la transacción para direccionar al pago");
                            return false;
                        }

                        _.deshabilitarFormulario();
                        _.redirect(respuesta.datos.url);
                        _.mostrarDireccionar(respuesta.datos.url);
                        _.idTransaccion = respuesta.datos.idTransaccion;
                    },
                    redirect: function (url) {
//                        _.windowPay = window.open(url, "Pagando factura llanogas");
//                        _.timer = setInterval(_.validarEstadoVentaEmergente, 500);
                        window.location.href = url;
                    },
                    mostrarDireccionar: function (href) {
                        _.verifyPay.slideUp('fast');
                        _.alertRedirect.slideDown('fast');
                    },
                    ocultarDireccionar: function () {
                        if (!_.windowPay) {
                            _.alertRedirect.slideUp('fast');
                        }
                    },
                    validarEstadoVentaEmergente: function () {
                        if (_.windowPay && _.windowPay.closed) {
                            clearInterval(_.timer);
                            _.windowPay = false;
                            _.timer = false;
                            _.validarEstadoPago();
                        }
                        if (!_.windowPay && _.timer) {
                            clearInterval(_.timer);
                        }
                    },
                    validarEstadoPago: function () {
                        _.ocultarDireccionar();
                        _.limpiarDatosCliente();

                        window.location.replace('cliente/confirmarpago?ID=' + _.idTransaccion);
                    },
                    onValidarEstadoPago: function (respuesta) {
                        if (respuesta.codigo === _.CONST.RESPUESTAS.SIN_DATOS) {
                            _.mostrarRespuestaError("Transacción rechazada!");
                            return;
                        }
                        _.ocultarDireccionar();
                        _.limpiarDatosCliente();
                        _.mostrarRespuestaExitosa();
                        _.alertSuccess.find('.text-message').text(respuesta.datos);
                    },
                    limpiarDatosCliente: function () {
                        _.clientDetails.find('.client-name').text('');
                        _.clientDetails.find('.client-address').text('');
                        _.clientDetails.find('.invoice-date').text('');
                        _.clientDetails.find('.value1').text('');
                        _.clientDetails.find('.value2').text('');
                        _.chkAutorizo.prop('checked', false);
                        _.verifyPay.slideDown('fast');
                        $('.current-panel').removeClass('current-panel').slideUp('fast');
                        _.ocultarFormularioPago();
                        _.habilitarFormulario();
                        _.limpiarDatosPagador();


                        if (_captcha != null) {
                            _.checkCaptcha = false;
                            grecaptcha.reset(_captcha);
                        }
                    },
                    limpiarDatosPagador: function () {
                        _.limpiarErroresPagador();
                        _.payInformation.find('input').val('');
                        _.payInformation.find('select option:first').attr('selected', 'selected');
                    }
                };

                app.init();
            })();

            configurarCaptcha = function () {
                _captcha = grecaptcha.render(document.getElementById('divCaptcha'), {
                    'sitekey': '6LdrNkkUAAAAADcoepa9Q6HDRCvn86y9-0ebdVHb',
                    'callback': _.captchaChecked
                });
            };
        </script>
        <script src="https://www.google.com/recaptcha/api.js?onload=configurarCaptcha&render=explicit&hl=es-419" async defer>
        </script>
    </body>
</html>
