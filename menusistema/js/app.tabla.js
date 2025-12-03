
/** 
 * Función que configura una tabla para visualizar información recibida
 * @param {object} selector - Selector de la tabla que se desea configurar
 * @param {object} format - Objeto con nombre e información por columnas
 * @param {object} data - Información que se debe mostrar en la tabla
 * @param {string} caption - Título de la tabla
 * @param {boolean} sorted - Si se desea ordenar las columnas de las tablas
 **/

function fillTable(selector, format, data, caption, sorted){
    data = eval(data);
    if(__app.esArreglo(data)){

        var tbl = $('#'+selector).html('').attr('format',format);
        var tbody = null;
        var _format = eval(format);

        if (!sorted && tbl.find('caption').length>0) {
            tbl.find('caption').remove();
            tbl.find('thead').remove();
            tbl.find('tbody').remove();
        }

        if(!sorted || sorted==undefined || sorted==null){
            if(caption)tbl.append($('<caption>').text(caption));
            var thead = $('<thead>');
            var thRow = $('<tr>');
            $.each(_format.thead, function(i, item){
                var th = $('<th>').attr('id', item.id);

                if(item.type==="check"){
                    var checkGeneral = $('<input type="checkbox">');
                    checkGeneral.attr({id:'check_general_'+selector+'_'+i});
                    var lblCheck = $('<label>').text(item.text)
                                               .attr('for', 'check_general_'+selector+'_'+i)
                                               .css('display','inline');
                    th.append(checkGeneral).append(lblCheck);
                    checkGeneral.on('click', function(e){
                        var estado = $(this).prop('checked');
                        var checks = $('#'+selector+' tbody td[header="'+item.id+'"] input[type="checkbox"]')
                                        .each(function(c, _check){
                                            $(_check).prop('checked', !estado).click();    //.prop('checked', estado)
                                        });
                         
                        if (estado===true) {
                            checks.parent().parent().addClass('selected');
                        }else{
                            checks.parent().parent().removeClass('selected');
                        }


                    });
                    th.css({'text-align':'left', 'padding-left':'5px'});
                }else{
                    th.text(item.text);
                }
                if (item.sort) {
                    th.attr('data-sort','asc');
                    if(item.refer!=null){
                        th.attr('data-refer',item.refer);
                    }
                    th.on('click', sortTable);
                };
                thRow.append(th);

                if (item.style) {
                    th.css(item.style);
                }


            });
            thead.append(thRow);
            tbl.append(thead);
            tbody = $('<tbody>');
            tbl.append(tbody);
        }else{
            tbody = tbl.find('tbody').html('');
        }
        //recorrido de cada objeto JSON de la coleccion
        $.each(data, function(j, obj){
            var tr = $('<tr>').attr('data-fila', j);
            //recorrido de los atributos del formato de la tabla
            $.each(_format.thead, function(k, value){
                var td = $('<td>');
                if (!!value.valueField) {
                    td.attr('data-value', obj[value.valueField]);
                }

                if(value.type=='text')
                {
                    td.text(obj[value.refer]===null?'-':obj[value.refer]).attr('header', value.id);
                } else if (value.type == 'href')
                {
                    var a = $('<a>');
                    var div = $('<div>');
                    div.text(obj[value.refer]===null?'-':'Ver');
                    a.attr('href', obj[value.refer]);
                    a.append(div);
                    td.append(a);
                } else 
                {
                    var elementId = selector+'_tdControl_'+value.type+'_'+j+'_'+k;
                    td = addControlToTd(value, obj[value.refer], selector, j, k, td, obj);
                    td.attr('id', elementId);
                    //obj[elementId] = td;
                    td.attr('header', value.id);
                }
                if (value.style) {
                    td.css(value.style);
                }
                tr.append(td);
            });
            tbody.append(tr);
        });
        return tbl;
    }
}

/**
 * Función para ordenar los resultados de una tabla
 * @return {void}
 **/
function sortTable(){
    var _this = $(this);
    var that = window;
    var parentTbl = _this.parent().parent().parent();
    var sort = false;
    if(_this.attr('data-sort')==='asc'){
        _this.attr('data-sort', 'desc');
        sort = true;
    }else{
        _this.attr('data-sort', 'asc');
        sort = false;
    }
    var selector = parentTbl.attr('id');
    var data = parentTbl.attr('data');
    var format = parentTbl.attr('format');
    var refer = _this.attr('data-refer');
    sortJSON(eval(data), refer, sort);
    fillTable(selector, format, data, null, true);
}

/** 
 * Función para agregar controles a un TD y retornar dicho TD
 * @param {object} format - Información de la fila a la que se está agregando td
 * @param {object} val - Información que debe tener el campo
 * @param {object} selector - Tabla a la que se agrega campo
 * @param {object} j - Índice de la fila actual
 * @param {object} k - Índice de la columna en la que se ubicará el campo
 * @param {object} td - TD donde se agregará el control 
 * @param {object} fullObj - Toda la información que tiene la fila actual
 * @return {void}  
 **/
function addControlToTd(format, val, selector, j, k, td, fullObj){

    if (!td) {
        td = $('<td>');
    }

    var idControl = selector+'_'+'td'+'_'+format.type+'_'+k+'_'+j;
    switch(format.type){
        case 'check':
            var input = $('<input>').attr({
                'type':'checkbox',
                'value':val,
                'name':selector+'_checkGroup_'+k+'_'+j,
                'id':idControl,
                'class':'tblCheck'
            });
            input.on('click', function () {
                
                if ($(this).prop('checked')) {
                    $(this).parent().parent().addClass('selected');
                }else{
                    var tblClick = $(this).parent().parent().parent().parent();
                    tblClick.find('thead th input:checkbox').prop('checked', false);
                    $(this).parent().parent().removeClass('selected');
                }
            });

            var label = $('<label>').text(format.text).attr('for', idControl);
            td.append(input).append(label);
            break;
        case 'radio':
            var input = $('<input>').attr({
                'type':'radio',
                'value':val,
                'name':selector+'_radioGroup',
                'id':idControl,
                'class':'tblRadio'
            });
            var label = $('<label>').text(format.text).attr('for', idControl);
            td.append(input).append(label);
            break;
        case 'button':
            var input = $('<input>').attr({
                'type':'button',
                'value':format.text,
                'data-id':val,
                'id':idControl,
                'class':'tblBtn'
            });
            td.append(input);
            break;
        case 'input':
            var input = $('<input>').attr({
                'type':'text',
                'value':val===null?'':val,
                'id':idControl,
                'class':'tblTxt'
            });
            td.append(input);
            break;
        case 'select':
            var input = $('<select>').attr({
                'id':idControl,
                'class':'tblCmb'
            });

            if (format.datos) {
                if (__app.esArreglo(val)) {
                    __dom.llenarCombo(input, val, format.valueText, format.displayText);
                }else{
                    __dom.llenarCombo(input, eval(format.datos), format.valueText, format.displayText);                    
                }
            }else{
                input.html(format.html);
            }

            if (val!==undefined && val!==null) {
                input.val(val);
            }

            td.append(input);
            break;
        case 'currency':
            td.text(val);
            td.tdCurrency();
            break;
        case 'function':
                td.attr('data-text', val);
                td.html(eval(format.tdCallback)(val, td, fullObj));
            break;
        case 'numeric':
            td.text(val);
            td.tdNumeric();
            break;
    }
    return td;
}

/** 
 * Función que configura un td de la tabla con formato dinero y agrega tooltip
 * @return {void}
 **/
$.fn.tdCurrency = function(fnc){
    return this.each(function () {
        var _this  = $(this);
        val = _this.text().trim();
        if (!isNaN(val) && val !== null && val !== '') {
            val = parseFloat(val);
            var strValor = '';

            if(val.toString().indexOf('.')!==-1){
                strValor = parseFloat(val.toString().substring(0, val.toString().lastIndexOf('.')+3));
            }else{
                strValor = val;
            }

            strValor = '$'+strValor.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            //strValor = '$'+strValor.toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
            
            _this.text(strValor)
                .attr({'data-valor': val, 'title':val})
                .addClass('td-currency');
        }else{
            _this.text('-').removeClass('td-currency').removeAttr('data-valor').attr('title', 'Sin valor');
        }
    });
};

/** 
 * Función que configura un td de la tabla con formato dinero y agrega tooltip
 * @return {void}
 **/
$.fn.tdNumeric = function(fnc){
    return this.each(function () {
        var _this  = $(this);
        val = _this.text().trim();
        if (!isNaN(val) && val !== null && val !== '') {
            val = parseFloat(val);
            var strValor = '';
            if(val.toString().indexOf('.')!==-1){
                strValor = parseFloat(val.toString().substring(0, val.toString().lastIndexOf('.')+3));
            }else{
                strValor = val;
            }
            strValor = strValor.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            _this.text(strValor)
                .attr({'data-valor': val, 'title':val})
                .addClass('td-currency');
        }else{
            _this.text('-').removeClass('td-currency').removeAttr('data-valor').attr('title', 'Sin valor');
        }
    });
};







/** 
 * Función para ordenar objetos JSON
 * @param {Array} arr - Arreglo que se desea ordenar
 * @param {string} prop - Nombre de la propiedad por la que se ordenará los objetos
 * @param {Bolean} asc - Define si se hará de forma ascendente
 **/
function sortJSON(arr, prop, asc) {
    arr = arr.sort(function(a, b) {
        if (asc) return (a[prop] > b[prop]);
        else return (b[prop] > a[prop]);
    });
    return arr;
}
