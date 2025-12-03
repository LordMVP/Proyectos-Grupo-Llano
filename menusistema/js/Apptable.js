/****DEPENDENCIES****/
//--jQuery 1.10+ / 2.0+
//--EventTarget.js


var MOUSE_OVER = false;


//var Apptable = (function(){

var Apptable = function (selector, options, data) {

    this.__ = getApptableController();

    this.ajaxOperations = {
        firstLoad: true, //by default true, to indicate the first load to ajax
        sort: false,
        search: false,
        pageChange: false
    };

    this.defaults = {
        title: '',
        columns: [],
        pagination: true,
        showColumnsToggler: false,
        linesPerPage: 10,
        searchable: true,
        searchableMinLength: 3,
        lg: {//language
            linesPerPage: 'Lines per page:',
            totalItems: 'Total Records: #',
            currentPage: 'Page _# of #_ ',
            toggleColumns: 'Show/Hide columns',
            seachInputPlaceHolder: 'Search and Enter',
            noFilteredDataMessage: 'No Results'
        }
    };


    this.selector = selector;
    this.table = this.__.validateSelector(selector);
    this.data = this.__.validateCollection(data);
    this.op = $.extend(this.defaults, options);
    this.__.Apptable = this;

    this.validateContainer();

    if (this.op.ajax) {
        this.ajax(this.op.ajax);
        return;
    }

    if (this.data && this.table) {
        this.op.totalItems = this.data.length;
        this.fillTable();
        return;
    }
};

Apptable.prototype.ajax = function (params) {
    var context = this;
    if (!context.__.validateAjaxObject(params)) {
        throw new Error('Ajax Exception: incorrect ajax params format', params);
    }
    var ajaxParams = {
        url: params.url,
        data: context.__.createDataAjaxObject(params),
        type: params.type ? params.type : 'POST',
        dataType: params.dataType ? para.dataType : 'json',
        success: function (data) {
            if (params.onAjaxRequestComplete) {
                params.onAjaxRequestComplete(data);
            }
            if (!data || !data.totalItems || data.totalItems === 0 || !data.data || data.data.length === 0) {
                context.showNoDataMessage();
                return;
            }
            context.data = context.__.validateCollection(data.data);
            context.validateContainer();
            context.op.totalItems = data.totalItems;
            context.updatePaginationPanel();
            params.success ? params.success.call(context, context.data) : context.onAjaxComplete.call(context, context.data);
        },
        error: function (err) {
            params.error ? params.error.call(context, err) : context.onAjaxError.call(context, err);
        }
    };

    if (params.beforeSend) {
        ajaxParams.beforeSend = params.beforeSend;
    }

    $.ajax(ajaxParams);
};

Apptable.prototype.destroy = function (partialDestroy) {
    //partialDestroy: if true only remove data, whithout destroy container o configuration
    if (partialDestroy) {
        this.data = [];
        this.table.empty();
        return;
    }


    if (this.table) {
        this.table.empty();
        if (this.container) {
            this.table.insertBefore(this.container);
            this.container.remove();
            this.container = undefined;
        }
        this.data = [];
        this.op = {
            title: '',
            columns: [],
            pagination: true,
            linesPerPage: 10,
            lg: {//language
                linesPerPage: 'Lines per page:',
                totalItems: 'Total Records: #',
                currentPage: 'Page _# of #_ ',
                currentPage: 'No result'
            }
        }

    }
    return null;
};

Apptable.prototype.getObjectById = function (id) {
    for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].at_id && this.data[i].at_id == id) {
            return this.data[i];
        }
    }
    return false;
};

Apptable.prototype.getSelectedItem = function () {
    if (!this.selectedRowId) {
        return false;
    }
    return this.getObjectById(this.selectedRowId);
};

Apptable.prototype.fillTable = function (data) {


    if (!this.table) {
        throw new Error('Must declare a table object, can use Apptable.table, to set a valid jQuery Object');
    }

    this.validateContainer();

    if (data && this.__.validateCollection(data)) {
        this.data = data;
    }

    var context = this;



    var height = this.container.find('.at-data-table').height() + this.container.find('.at-header-table').height() + this.container.find('.at-footer-table').height();
    context.container.find('.at-data-table, .at-footer-table').show();
    context.container.find('at-preloader').show();
    context.op.status = 'LOADING';

    setTimeout(function () {

        (function () {
            if (this.fixedCols === undefined) { //validate this case, when a new columns configuration is set
                if (this.fixedCols) {
                    if (this.container.find('.at-tbl-primary').length === 0) {
                        this.container.empty();
                        this.container.append($('<table>').addClass('at-tbl-fixed at-tbl-primary'));
                        this.container.append($('<table>').addClass('at-tbl-fixed at-tbl-secondary'));
                        this.container.append('<hr class="at-clear">');
                    } else {
                        this.container.find('.at-tbl-fixed tbody').remove();
                    }
                }
            }

            var tbody = this.fixedCols ? $('<tbody>, <tbody>') : $('<tbody>');

            var startIndex = 0;
            var endIndex = this.data.length;

            if (this.op.pagination && !this.op.ajax) {
                startIndex = (!this.op.pageStartIndex) ? 0 : this.op.pageStartIndex;
                endIndex = (!this.op.pageEndIndex) ? this.op.linesPerPage : this.op.pageEndIndex;
                this.updatePaginationPanel();
                if (endIndex > this.data.length) {
                    endIndex = this.data.length;
                }
            }


            if (this.op.ajax) {
                endIndex = this.op.linesPerPage;
                this.updatePaginationPanel();
                if (endIndex > this.data.length) {
                    endIndex = this.data.length;
                }
            }



            for (var i = startIndex; i < endIndex; i++) {
                var item = this.data[i];
                if (item.exclude) {
                    endIndex += endIndex < this.data.length ? 1 : 0;
                    continue;
                }

                if (!item.at_id) {
                    item.at_id = this.__.getRandomId();
                }
                this.renderRow(item, tbody);
            }

            if (!this.lastSort) {
                if (!this.fixedCols) {
                    this.table.empty();
                    this.renderTableHead(this.op.columns, this.table);
                } else {
                    this.renderTableHead(this.op.columns, this.container);
                }
            }

            if (!this.fixedCols) {
                //TAKE A LOOK OVER THIS, PROBABLY NEEDS SOME CHANGES
                this.table.find('tbody').remove();
                this.table.append(tbody);
                this.__.configEventsTable.call(this);
            } else {
                this.container.find('.at-tbl-primary').append(tbody[0]);
                this.container.find('.at-tbl-secondary').append(tbody[1]);

                var secondaryTbody = $(tbody[1]);

                var fixedTbody = $(tbody[0]);
                var trSecondaryHead = secondaryTbody.prev().find('tr');
                secondaryTbody.on('scroll', function (e) {
                    fixedTbody.scrollTop(e.currentTarget.scrollTop);
                    trSecondaryHead.scrollLeft(e.currentTarget.scrollLeft);
                });

                var fxPreventBodyScroll = function (e) {
                    if (MOUSE_OVER) {
                        this.__.preventDefault(e);
                    }
                };

                $('body').off('mousewheel', fxPreventBodyScroll).on('mousewheel', fxPreventBodyScroll);

                fixedTbody.mouseenter(function () {
                    MOUSE_OVER = true;
                });
                fixedTbody.mouseleave(function () {
                    MOUSE_OVER = false;
                });
                fixedTbody.on('mousewheel', function (e) {
                    var delta = e.originalEvent.wheelDelta;
                    if (delta > 0) {
                        secondaryTbody.scrollTop(secondaryTbody.scrollTop() + (-delta));
                    } else {
                        secondaryTbody.scrollTop(secondaryTbody.scrollTop() - delta);
                    }
                });
            }
            this.setTitle();   //FIXME: This setTitle method must respond to both, single table and fixed tables
            if (this.op.cellNavigable && this.op.nextCellToSelect !== undefined) {
                if (this.op.nextCellToSelect === 0) {  // if 0 then the first td must be selected, else last td must be selected
                    this.table.find('tbody tr:first td:first')[0].focus();
                    setTimeout(function () {
                        context.container.find('.at-data-table').scrollLeft(0);
                    }, 100);
                } else {
                    this.table.find('tbody tr:last td:last')[0].focus();
                    setTimeout(function () {
                        context.container.find('.at-data-table').scrollLeft(context.table.width());
                    }, 100);
                }
            }
            context.container.find('#at-loader').hide();
            context.op.status = 'LOADED';
            if (context.op.onRenderBodyComplete) {
                context.op.onRenderBodyComplete.call(context);
            }
        }).call(context);
    }, 100);
};

Apptable.prototype.filter = function (text) {
    
    var isAjax = !!this.op.ajax; // the !! expression is used to track the this.op.ajax object as a boolean, if exists the sentences throws true.
    if (isAjax) {
        this.__.resetPagination();
        this.ajax(this.op.ajax);
        return;
    }

    if (text.length === 0) {
        for (var i = 0; i < this.data.length; i++) {
            delete this.data[i].exclude;
        }
        this.op.currentPage = 1;
        this.op.totalItems = this.data.length;
        this.updatePaginationPanel();
        this.container.find('.at-search-wrapper span.no-filtered-data-span').text('');
        this.fillTable(this.data);
        return;
    }

    var data = this.data;
    var cols = [];
    for (var i = 0; i < this.op.columns.length; i++) {
        var col = this.op.columns[i];
        if ((col.sortable === undefined || col.searchable === true) && (col.type === undefined || col.type === 'text')) {
            cols.push(this.op.columns[i].data);
        }
    }

    var totalFounds = 0;
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var found = 0;
        for (var c = 0; c < cols.length; c++) {
            var col = cols[c];

            var itemSubColValue = '';
            if (col.indexOf('.') !== -1) {  //IF col is a json object route, use eval eg: item.idsubitem.idsubitem.name
                itemSubColValue = eval('item.' + col);
                itemSubColValue = !!itemSubColValue ? itemSubColValue.toString() : '';
            } else {
                itemSubColValue = item[col].toString();
            }

            if (itemSubColValue.indexOf(text) !== -1) {
                found++;
                totalFounds++;
                break;
            }
        }
        item.exclude = (found <= 0);
    }

    if (totalFounds > 0) {
        this.op.currentPage = 1;
        this.op.totalItems = totalFounds;
        this.updatePaginationPanel();
        this.container.find('.at-search-wrapper span.no-filtered-data-span').text('');
        this.fillTable(data);
    } else {
        this.handleNoFilterResult();
    }
};

Apptable.prototype.handleNoFilterResult = function () {

    var context = this;
    if (context.op.onNoFilterResult) {
        context.op.onNoFilterResult();
        return;
    }
    context.container.find('.at-search-wrapper span.no-filtered-data-span').text(context.op.lg.noFilteredDataMessage);
    context.container.find('.at-search-wrapper input').focus().select();
    context.container.find('.at-data-table, .at-footer-table').hide();

};

Apptable.prototype.hideColumn = function (colIndex) {
    var col = this.op.columns[colIndex];
    col.visible = false;
    this.fillTable();
    this.container.find('th[at-headId="' + col.at_id + '"]').hide();
};

Apptable.prototype.navigateThroughPages = function (arg) {
    var goNext = false;  //if true, then the info goes to right, else info goes to left;
    if ('number' === typeof arg) {
        if (arg <= 0) {
            this.op.currentPage = 1;
        } else if (arg >= this.op.totalPages) {
            goNext = true;
            this.op.currentPage = Math.ceil(this.op.totalItems / this.op.linesPerPage);
        } else {
            if (this.op.currentPage <= arg) {
                goNext = true;
            }
            this.op.currentPage = arg;
        }
    } else {
        this.op.nextCellToSelect = 0;
        goNext = true;
        switch (arg.attr('at-navigation-action')) {
            case 'first-page':
                if (this.op.currentPage === 1) {
                    return;
                }
                this.op.currentPage = 1;
                break;
            case 'prev-page':
                this.op.currentPage--;
                if (this.op.currentPage === 0) {
                    this.op.currentPage = 1;
                }
                break;
            case 'next-page':
                this.op.currentPage++;
                if (this.op.currentPage > Math.ceil(this.op.totalItems / this.op.linesPerPage)) {
                    this.op.currentPage = Math.ceil(this.op.totalItems / this.op.linesPerPage);
                }
                break;
            case 'last-page':
                if (this.op.currentPage === this.op.totalPages) {
                    return;
                }
                this.op.currentPage = Math.ceil(this.op.totalItems / this.op.linesPerPage);
                break;
        }
    }

    this.op.pageStartIndex = (this.op.currentPage * this.op.linesPerPage) - this.op.linesPerPage;
    this.op.pageEndIndex = this.op.pageStartIndex + this.op.linesPerPage;

    if (this.op.cellNavigable) {
        var context = this;
        this.op.nextCellToSelect = (goNext) ? 0 : 1; //0 will select the first td  || 1 will select the last td
    }

    if (this.op.ajax) {
        this.__.Apptable.ajaxOperations.firstLoad = false;
        this.__.Apptable.ajaxOperations.pageChange = true;
        this.ajax(this.op.ajax);
        return;
    }
    this.fillTable();
    //validate if op.rowNavigable === true
    //FIXME: if current page == 1 or lastPage, don't reload the table....
};

Apptable.prototype.onAjaxComplete = function (data) {
    this.fillTable(data);
};

Apptable.prototype.onAjaxError = function (err) {
    console.error('An Ajax error has ocurred: ', err);
};

Apptable.prototype.renderCell = function (item, col) {
    var td = $('<td>');
    td.attr({
        'headers': col.headers,
        'class': col.class,
        'at-sort': col.sortable,
        'at-search': col.search,
        'at-resize': col.adaptable,
        'at-updowndisable': col.keyUpDownDisabled
    });

    var value = (col.data && col.data.indexOf('.') !== -1) ? eval('item.' + col.data) : item[col.data];

    switch (col.type) {
        case 'text':
            td.text(value);
            break;
        case 'currency':
            td.text(this.__.toCurrencyFormat(value));
            break;
        case 'numeric':
            td.text(this.__.toNumericFormat(value));
            break;
        case 'checkbox':
            td.append(this.__.renderCellCheckBox.call(this, item, col));
            break;
        case 'radio':
            td.append(this.__.renderCellRadio.call(this, item, col));
            break;
        case 'link':
            td.append(this.__.renderCellLink.call(this, item, col));
            break;
        case 'input':
            td.append(this.__.renderCellInput.call(this, item, col));
            break;
        case 'input-number':
            //HEY, you have to add the renderCellNumericInput
            td.append(this.__.renderCellInput.call(this, item, col));
            break;
        case 'select':
            td.append(this.__.renderCellSelect.call(this, item, col));
            break;
        case 'button':
            td.append(this.__.renderCellButton(item, col));
            break;
        case 'text-function':
            if (typeof col.tdCallback === 'string') {
                td.html(eval(col.tdCallback + '(value, item, col)'));
            } else {

                td.html(col.tdCallback(value, item, col));
            }
            break;
        case 'td-function':
            if (typeof col.tdCallback === 'string') {
                td.html(eval(col.tdCallback + '(value, item, col, td)'));
            } else {
                col.tdCallback(value, item, col, td);
            }
            break;
        default:
            td.text(value);
            break;
            //take a look on Columns types Trello card ;)
    }
    if (this.op.cellNavigable) {
        td.attr('tabindex', 0);
    }
    return td;
};

Apptable.prototype.renderRow = function (item, tbody) {
    var context = this;
    var tr1, tr2, tb1, tb2;
    if (context.fixedCols) {
        tb1 = $(tbody[0]);
        tb2 = $(tbody[1]);
        tr1 = $('<tr>').attr('id', item.at_id).addClass('at-tr at-tr-fixed-primary');
        tr2 = $('<tr>').attr('id', item.at_id).addClass('at-tr at-tr-fixed-secondary');
    } else {
        tb1 = tbody;
        tr1 = $('<tr>').attr('id', item.at_id).addClass('at-tr');
    }

    if (context.op.rowNavigable && !context.op.cellNavigable) {
        tr1.attr('tabindex', 0);
        if (tr2) {
            tr2.attr('tabindex', 0);
        }
    }
    for (var i = 0; i < context.op.columns.length; i++) {
        var col = context.op.columns[i];
        if (col.visible === undefined || col.visible === true) {
            if (col.fixed || !context.fixedCols) {
                tr1.append(context.renderCell(item, col));
                tb1.append(tr1);
            } else {
                tr2.append(context.renderCell(item, col));
                tb2.append(tr2);
            }
        }
    }

    if (context.op.onRowComplete) {
        if (!context.fixedCols) {
            context.op.onRowComplete(item, tr1);
        } else {
            context.op.onRowComplete(item, [tr1, tr2]); //HEY CHECK THIS, IT MUST BE WRONG
        }
    }

    if (context.op.onRowEnterKey) {
        tr1.on('keypress', function (e) {
            if (e.keyCode === 13) {
                context.op.onRowEnterKey(item, tr1, e);  //CHECK WHEN FIXED COLS IS ENABLE
            }
        });
    }

    if (context.op.onDoubleClick) {
        tr1.on('dblclick', function (e) {
            context.op.onDoubleClick(item, tr1, e); //CHECK WHEN FIXED COLS IS ENABLE
        });
    }
};

Apptable.prototype.renderTableHead = function (cols, container) {
    var context = this;
    var trhead = $('<tr>');
    var trhead2 = null;
    var fixed = context.fixedCols;

    if (fixed) {
        trhead2 = $('<tr>');
    }

    for (var i = 0; i < cols.length; i++) {
        var col = cols[i];
        if (col.visible === false) {
            continue;
        }

        var complementId = '_' + context.__.getRandomId();

        col.at_id = (col.headers) ? col.headers + complementId : col.data + complementId;

        var th = $('<th>').attr({
            'id': col.headers,
            'class': col.class,
            'at-search': col.search,
            'at-resize': col.adaptable,
            'at-data': col.data,
            'at-order': 'asc',
            'at-type': (col.sortType && col.sortType === 'number') ? 'number' : 'string',
            'at-headId': col.at_id
        });

        if ((col.sortable == true || col.sortable === undefined) && col.data) {
            th.attr('at-sort', true).addClass('header-sortable');

            var sortIcon = $('<i>').addClass('fa fa-sort at-sort-icon').css({'margin-right': '2px'});
            th.append(sortIcon);

            th.on('click', function () {
                var th = $(this);
                var order = th.attr('at-order');
                context.sortCollection(th.attr('at-data'), th.attr('at-order'), th.attr('at-type'));

                if (order === 'asc') {
                    th.find('i.at-sort-icon').removeClass('fa-sort').addClass('fa-sort-desc');
                    th.attr('at-order', 'desc');
                } else {
                    th.find('i.at-sort-icon').removeClass('fa-sort').addClass('fa-sort-asc');
                    ;
                    th.attr('at-order', 'asc');
                }

                if (context.op.ajax) {
                    context.ajax(context.op.ajax);
                    return;
                }
                context.fillTable();
            });
        }

        var titleSpan = $('<span>').addClass('at-th-title');
        titleSpan.text(col.title ? col.title : col.text ? col.text : col.data);
        th.append(titleSpan);

        if (!fixed || col.fixed) {
            trhead.append(th);
        } else {
            trhead2.append(th);
        }
    }

    //add thead to container
    if (!fixed) {
        container.append($('<thead>').append(trhead));
    } else {
        container.find('.at-tbl-primary').append($('<thead>').append(trhead));
        container.find('.at-tbl-secondary').append($('<thead>').append(trhead2));
    }
};

Apptable.prototype.setColumnTitle = function (colIndex, title) {

    //Assume that colIndex is the headers attribute and search for a column with header's attribute
    if (typeof colIndex === 'string') {
        for (var i = 0; i < this.op.columns.length; i++) {
            if (this.op.columns[i].headers === colIndex) {
                colIndex = i;
                break;
            }
        }
    }

    var col = this.op.columns[colIndex];
    col.title = title;
    var theaders = this.table.find('thead tr th');
    $(theaders[colIndex]).find('span.at-th-title').text(col.title);
}

Apptable.prototype.setTitle = function (title) {
    this.op.title = title ? title : this.op.title;
    this.container.find('.at-header-title-panel h3').text(this.op.title);
};

Apptable.prototype.showColumn = function (colIndex) {
    var col = this.op.columns[colIndex];
    col.visible = true;
    this.fillTable();
    this.container.find('th[at-headId="' + col.at_id + '"]').show();
};

Apptable.prototype.showNoDataMessage = function () {
    //FIXME: Delete the entire records, drop rows and show a message on Body tag with a no data text.
    this.data = [];
    this.destroy(true); //send true to just destroy the data and table
    if (this.defaults.onNoData) {
        this.defaults.onNoData();
        return;
    }
    alert('NO DATA');
};

Apptable.prototype.showTogglePanel = function () {
    this.container.find('.at-toggle-container').slideDown();
};

Apptable.prototype.sortCollection = function (property, order, type) {
    this.__.quick_sort(this.data, property, order, type);
    this.lastSort = {property: property, order: (order !== 'asc' ? 'asc' : 'desc')};
};

Apptable.prototype.updatePaginationPanel = function () {

    var currentPage = this.op.currentPage;
    var totalPages = Math.ceil(this.op.totalItems / this.op.linesPerPage);
    if (isNaN(totalPages)) {
        totalPages = 0;
    }

    this.op.totalPages = totalPages;

    var totalItems = this.op.totalItems ? this.op.totalItems : 0;

    this.container.find('.at-footer-summary .at-currentpage-span')
            .text(this.defaults.lg.currentPage.replace(/_#/g, currentPage).replace(/#_/g, totalPages));

    this.container.find('.at-footer-summary .at-total-records-span')
            .text(this.defaults.lg.totalItems.replace(/#/g, totalItems));
};

Apptable.prototype.validateContainer = function () {
    if (!this.data || this.container) {
        return false;
    }
    this.fixedCols = this.__.validateIfFixed(this.op.columns).length > 0 ? true : false;
    if (this.fixedCols) {
        this.container = this.__.createFixedContainer(this.table);
    } else {
        this.container = this.__.createCotainer.call(this);
    }
    return true;
};

/**private methods**/
function getApptableController() {
    var __ = {
        Apptable: null,
        createCotainer: function () {
            var table = this.table;
            var tableParent = table.parent();
            var container = $('<div>').addClass('at-wrap-table');
            var headerContainer = $('<div>').addClass('at-header-table');
            var dataContainer = $('<div>').addClass('at-data-table');
            var footerContainer = $('<div>').addClass('at-footer-table');
            var preloader = $('<div>').addClass('at-preloader');

            this.__.renderHeaderContainer.call(this, headerContainer);
            this.__.renderFooterContainer.call(this, footerContainer);

            container.append(preloader, headerContainer, dataContainer, footerContainer);

            table.appendTo(dataContainer);
            return container.appendTo(tableParent);
        },
        createDataAjaxObject: function (params) {
            //The AJAX Arguments
            var data = {
                search: this.getSearchQuery(),
                columns: this.getColumnsForRequest(),
                order: this.getOrderRequest()
            };

            if (this.Apptable.op.pagination) {
                data.limit = this.Apptable.op.linesPerPage;
                data.start = 0;
                if (this.Apptable.ajaxOperations.pageChange) {
                    data.start = data.limit * (this.Apptable.op.currentPage - 1);
                }
            }

            if (params.data) {     				//if programmer send aditional parameters, merge to data request
                $.extend(data, params.data);
            }
            return data;
        },
        createFixedContainer: function (table) {
            //FIXME: at this level, you have to develop a method to create a two places container to the table.
            /*
             var container = null;
             if (!table.parent().hasClass('at-wrap-fixed-tables')) {
             container = $('<div>').addClass('at-wrap-fixed-tables');
             }else{
             container = table.parent();
             }
             container.appendTo(table.parent()).append(table);
             return container;
             */
            return $('<div>');
        },
        configEventsTable: function () {
            var context = this;
            var tbody = context.table.find('tbody');
            if (context.op.rowNavigable && !context.op.cellNavigable) {
                tbody.find('tr')
                        .off('keydown')
                        .on('keydown', function (e) {
                            context.__.navigateThroughRows.call(context, e);
                        })
                        .on('focus', function (e) {
                            context.__.focusRow.call(context, e);
                        })
                        .on('click', function (e) {
                            context.__.focusRow.call(context, e);
                        });
            }


            if (context.op.cellNavigable) {
                tbody.find('tr td')
                        .off('keydown')
                        .on('keydown', function (e) {
                            context.__.navigateThroughCells.call(context, e);
                        })
                        .on('focus', function (e) {
                            context.__.focusRow.call(context, e)
                        })
                        .on('click', function (e) {
                            context.__.focusRow.call(context, e)
                        });
            }
        },
        focusRow: function (e) {
            var currentRow = (e.currentTarget.cellIndex !== undefined) ? e.currentTarget.parentElement : e.currentTarget;
            var selectedRows = currentRow.parentElement.getElementsByClassName('at-tr-selected');
            if (selectedRows.length > 0) {
                for (var i = selectedRows.length - 1; i >= 0; i--) {
                    var selectedCells = selectedRows[i].getElementsByClassName('at-td-selected');
                    if (selectedCells.length > 0) {
                        for (var j = selectedCells.length - 1; j >= 0; j--) {
                            selectedCells[j].classList.remove('at-td-selected');
                        }
                    }
                    selectedRows[i].classList.remove('at-tr-selected');
                }
            }
            currentRow.classList.add('at-tr-selected');
            e.currentTarget.classList.add('at-td-selected');
            this.__.onSelectedItemChange.call(this, currentRow);
        },
        getColumnsForRequest: function () {
            var cols = [];
            for (var i = 0; i < this.Apptable.op.columns.length; i++) {
                var col = this.Apptable.op.columns[i];
                if (!col.data) {
                    continue;
                }
                cols.push({
                    data: col.data,
                    searchable: col.searchable ? col.searchable : true,
                    orderable: col.orderable ? col.orderable : false
                });
            }
            return JSON.stringify(cols);
        },
        getOrderRequest: function () {
            if (!this.Apptable.lastSort) {
                return null;
            }

            return JSON.stringify({
                data: this.Apptable.lastSort.property,
                type: this.Apptable.lastSort.order
            });
        },
        getRandomId: function () {
            //Special thanks to Briguy37 (http://stackoverflow.com/users/508537) - http://stackoverflow.com/a/8809472
            var d = new Date().getTime();
            if (window.performance && typeof window.performance.now === "function") {
                d += performance.now();
                ; //use high-precision timer if available
            }
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid.replace(/\-/g, '');
        },
        getSearchQuery: function () {
            if (!this.Apptable.op.searchable || !this.Apptable.container) {
                return '';
            }
            var q = this.Apptable.container.find('.at-hader-search-panel input.at-search-input').val();
            return q.trim();
        },
        goBottomCell: function (cell) {
            var row = cell.parentElement;
            if (row.nextElementSibling) {
                var newTd = row.nextElementSibling.children[cell.cellIndex];
                newTd.focus();
                return newTd;
            }
            //take care, when pagination is enable, the down arrow must pass to next page.
            return null;
        },
        goLeftCell: function (cell) {
            var newTd = null;
            var row = cell.parentElement;
            if (cell.cellIndex === 0) {
                if (row.rowIndex === 1) {
                    if (this.Apptable.op.pagination && this.Apptable.op.currentPage > 1 && this.Apptable.op.status === 'LOADED') {
                        this.Apptable.navigateThroughPages(this.Apptable.op.currentPage - 1);
                    }
                    return null; //TAKE CARE, when pagination is enable, here the previous page must be show
                }
                newTd = row.previousElementSibling.children[row.previousElementSibling.childElementCount - 1];
                var context = this;
                setTimeout(function () {
                    context.Apptable.container.find('.at-data-table').scrollLeft(context.Apptable.container.find('.at-data-table table').width());
                }, 50);
            } else {
                newTd = cell.previousElementSibling;
            }
            newTd.focus();
            return newTd;
        },
        goRightCell: function (cell) {
            var newTd = null;
            var row = cell.parentElement;
            if (cell.cellIndex + 1 === row.childElementCount) {
                if (row.rowIndex === row.parentElement.childElementCount) {
                    if (this.Apptable.op.pagination && this.Apptable.op.currentPage < this.Apptable.op.totalPages && this.Apptable.op.status === 'LOADED') {
                        this.Apptable.navigateThroughPages(this.Apptable.op.currentPage + 1);
                    }
                    return null; //TAKE CARE, when pagination is enable, here the next page must be show
                }
                newTd = row.nextElementSibling.children[0];
                var context = this;
                setTimeout(function () {
                    context.Apptable.container.find('.at-data-table').scrollLeft(0);
                }, 50);
            } else {
                newTd = cell.nextElementSibling;
            }
            newTd.focus();
            return newTd;
        },
        goTopCell: function (cell) {
            var row = cell.parentElement;
            if (row.previousElementSibling) {
                var newTd = row.previousElementSibling.children[cell.cellIndex];
                newTd.focus();
                return newTd;
            }
            return null;
        },
        goTopRow: function (row) {
            if (row.rowIndex === 1) {
                return null; //if pagination is enable, validate if there are a previous page, if exists show it
            }
            var newRow = row.previousElementSibling;
            newRow.focus();
            return newRow;
        },
        goBottomRow: function (row) {
            if (row.rowIndex + 1 === row.parentElement.childElementCount) {
                return null; //if pagination es enable, validate if there are a next page, if extists show it
            }
            var newRow = row.nextElementSibling;
            newRow.focus();
            return newRow;
        },
        navigateThroughCells: function (e) {
            var keyCode = e.keyCode;
            var currentCell = e.currentTarget;

            var keyUpDownDisabled = false;
            if (currentCell.attributes['at-updowndisable'] && currentCell.attributes['at-updowndisable'].value === 'true') {
                keyUpDownDisabled = true;
            }

            var newCell = null;

            if (e.shiftKey && e.target.tagName === 'INPUT') {
                return;
            }

            switch (keyCode) {
                case 38: //UP arrow
                    if (!keyUpDownDisabled) {
                        newCell = this.__.goTopCell(currentCell);
                    }
                    break;
                case 40: //DOWN arrow
                    if (!keyUpDownDisabled) {
                        newCell = this.__.goBottomCell(currentCell);
                    }
                    break;
                case 39: //Right arrow
                    newCell = this.__.goRightCell(currentCell);
                    break;
                case 37:  //Left arrow
                    newCell = this.__.goLeftCell(currentCell);
                    break;
                case 9:
                    if (currentCell.cellIndex === 0 && currentCell.parentElement.rowIndex === 1 && this.__.Apptable.op.currentPage === 1) {
                        return;
                    }
                    this.__.preventDefault(e);
                    newCell = e.shiftKey ? this.__.goLeftCell(currentCell) : this.__.goRightCell(currentCell);


                    break;
            }
            if (!newCell) {
                return;
            }

            this.__.onSelectedItemChange.call(this, newCell.parentElement);

            if (currentCell.parentElement !== newCell.parentElement) {
                currentCell.parentElement.classList.remove('at-tr-selected');
                newCell.parentElement.classList.add('at-tr-selected');
            } else {
                if (!currentCell.parentElement.classList.contains('at-tr-selected')) {
                    currentCell.parentElement.classList.add('at-tr-selected');
                }
            }

            if (newCell.children.length > 0) {
                var control = newCell.children[0];
                control.focus();
            }
        },
        navigateThroughRows: function (e) {
            var keyCode = e.keyCode;
            var currentRow = e.currentTarget;
            var newRow = null;
            switch (keyCode) {
                case 38: //UP arrow
                    newRow = this.__.goTopRow(currentRow);
                    break;
                case 40: //DOWN arrow
                    newRow = this.__.goBottomRow(currentRow);
                    break;
            }

            if (newRow) {
                this.__.onSelectedItemChange.call(this, newRow);
            }
        },
        onSelectedItemChange: function (e) {
            var context = this;

            var id = null;
            if (e.currentTarget) {
                id = e.currentTarget.parentElement.id;
            } else {
                id = e.id;
            }

            this.selectedRowId = id;

            if (!context.op.onSelectedItemChange || (e.id === this.selectedRowId || (e.currentTarget && e.currentTarget.parentElement.id === this.selectedRowId))) {
                return;
            }

            if (context.op.onSelectedItemChange) {
                context.op.onSelectedItemChange(context.getObjectById(id), id);
            }

        },
        preventDefault: function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            } else if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.returnValue = false;
            }
        },
        renderCellButton: function (item, options) {
            var controlId = '__' + options.type + '_' + options.data + '__' + item.at_id;
            var btn = $('<button>').text(options.text).attr('id', controlId);
            if (options.btnCallback && (typeof options.btnCallback === 'function')) {
                btn.on('click', function (e) {
                    options.btnCallback(item, e);
                });
            }
            return btn;
        },
        renderCellCheckBox: function (item, options) {
            var controlId = '__' + options.type + '_' + options.data + '__' + item.at_id;
            var context = this;
            var check = $('<input>').attr({
                type: 'checkbox',
                name: 'check_' + options.headers,
                id: controlId
            });

            check.on('click', function (e) {
                context.getObjectById(item.at_id).at_controls[controlId] = e.target.checked;
            });

            if (!this.__.validateControlExists(item, options, check)) {
                check.prop('checked', item[options.data]);
            }

            if (options.text) {
                var text = $('<span>').text(options.text);
                var label = $('<label>').append(check, text);
                return label;
            }
            return check;
        },
        renderCellInput: function (item, options) {
            var context = this;
            var controlId = '__' + options.type + '_' + options.data + '__' + item.at_id;
            var input = $('<input>').attr({
                type: 'text',
                placeholder: options.placeholder,
                id: controlId
            });

            input.on('blur', function (e) {
                context.getObjectById(item.at_id).at_controls[controlId] = e.target.value;
            });

            if (!this.__.validateControlExists(item, options, input)) {
                input.val(item[options.data]);
            }
            return input;
        },
        renderCellLink: function (item, options) {
            var link = $('<a>').attr({
                href: options.href,
                target: options.target ? options.target : '_blank'
            });
            link.text(item[options.data] ? item[options.data] : options.text);
            return link;
        },
        renderCellRadio: function (item, options) {
            var context = this;
            var controlId = '__' + options.type + '_' + options.data + '__' + item.at_id;
            var radio = $('<input>').attr({
                type: 'radio',
                name: 'radio_' + options.headers,
                id: controlId
            });

            this.__.validateControlExists(item, options, radio);
            radio.on('click', function (e) {
                context.getObjectById(item.at_id).at_controls[controlId] = e.target.checked;
            });

            if (context.op.cellNavigable) {
                radio.off('keydown');
                radio.on('keydown', function (e) {
                    context.__.preventDefault(e);
                    if (e.keyCode === 13 || e.keyCode === 32) {
                        e.target.click();
                    }

                    if (e.keyCode === 9) {
                        if (e.shiftKey) {
                            context.__.goLeftCell(e.currentTarget.parentElement.parentElement);
                        } else {
                            context.__.goRightCell(e.currentTarget.parentElement.parentElement);
                        }
                    }
                });
            }

            var label = $('<label>');
            if (options.text) {
                var text = $('<span>').text(options.text);
                label.append(radio, text);
            } else {
                label.append(radio);
            }

            return label;
        },
        renderCellSelect: function (item, options) {
            var context = this;
            var controlId = '__' + options.type + '_' + options.data + '__' + item.at_id;
            var select = $('<select>').attr('id', controlId);

            if (!!options.items && Array.isArray(options.items)) {
                for (var i = 0; i < options.items.length; i++) {
                    select.append($('<option>').val(options.items[i][options.itemvalue]).text(options.items[i][options.itemtext]));
                }
            }
            context.__.validateControlExists(item, options, select);

            if (item[options.data] !== null && item[options.data] !== undefined) {
                select.val(item[options.data]);
            }

            //prevents change of a selected option in a select when the user press the arrows keys and keyboard navigation is enabled
            if (this.op.cellNavigable || this.op.rowNavigable) {
                select.on('keydown', function (e) {
                    if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) {
                        context.__.preventDefault(e);
                    }
                });
            }

            select.on('change', function (evt) {
                $(this).attr('title', $(this).find('option:selected').text());
                context.getObjectById(item.at_id).at_controls[controlId] = $(this).val();
            });
            if (options.selectCallback) {
                select.on('change', options.selectCallback);
            }
            return select;
        },
        renderFooterContainer: function (container) {
            var context = this;
            var summaryPanel = $('<div>').addClass('at-footer-panel at-footer-summary');
            var navigationPanel = $('<div>').addClass('at-footer-panel at-footer-page-navigator');
            var totalLines = $('<span>').addClass('at-total-records-span').text(this.defaults.lg.totalItems.replace(/#/g, this.data.length));
            if (this.op.pagination) {
                var pagesMessage = $('<span>').addClass('at-currentpage-span').text(this.defaults.lg.currentPage.replace(/_#/g, this.op.currentPage).replace(/#_/g, this.op.totalPages));
                summaryPanel.append(pagesMessage);
                var navigate = function () {
                    context.navigateThroughPages.call(context, $(this));
                }

                var firstPageBtn = $('<button>').addClass('at-btn-pagination-nav at-first-page-btn').attr('at-navigation-action', 'first-page').text('<<').on('click', navigate);
                var prevPageBtn = $('<button>').addClass('at-btn-pagination-nav at-prev-page-btn').attr('at-navigation-action', 'prev-page').text('<').on('click', navigate);
                var nextPageBtn = $('<button>').addClass('at-btn-pagination-nav at-next-page-btn').attr('at-navigation-action', 'next-page').text('>').on('click', navigate);
                var lastPageBtn = $('<button>').addClass('at-btn-pagination-nav at-last-page-btn').attr('at-navigation-action', 'last-page').text('>>').on('click', navigate);

                navigationPanel.append(firstPageBtn, prevPageBtn, nextPageBtn, lastPageBtn);
            }
            summaryPanel.append(totalLines);
            container.append(summaryPanel, navigationPanel);
        },
        renderHeaderContainer: function (container) {
            var context = this;
            var pagePanel = $('<div>').addClass('at-header-panel at-header-navigation-panel');
            var titlePanel = $('<div>').addClass('at-header-panel at-header-title-panel');
            var searchPanel = $('<div>').addClass('at-header-panel at-hader-search-panel');

            if (context.op.pagination) {
                var selectLinesPage = $('<select>').attr('id', 'at_pagination_select_' + context.__.getRandomId());
                var labelLinesPage = $('<label>').text(this.defaults.lg.linesPerPage).attr('for', selectLinesPage.attr('id'));
                var linesPageRange = (context.op.linesPageRange) ? context.op.linesPageRange : [10, 20, 30, 50, 100];
                for (var i = 0; i < linesPageRange.length; i++) {
                    selectLinesPage.append($('<option>').val(linesPageRange[i]).text(linesPageRange[i]));
                }
                selectLinesPage.on('change', function () {
                    context.op.linesPerPage = parseInt($(this).val());
                    context.op.currentPage = 1;
                    context.op.pageStartIndex = 0;
                    context.op.pageEndIndex = context.op.linesPerPage;
                    context.op.nextCellToSelect = 0;
                    context.fillTable();
                });

                pagePanel.append(labelLinesPage, selectLinesPage);
                context.op.currentPage = 1;
                if (context.data && context.data.length > 0) {
                    context.op.totalPages = Math.ceil(context.data.length / linesPageRange[0]);
                    context.op.linesPerPage = linesPageRange[0];
                }
                //FIXME: Hey take a look if not data show a message
            }

            if (context.op.showColumnsToggler) {
                var toggleColumnsBtn = $('<a href="#" class="at-link-toggler">').append($('<i class="fa fa-toggle-on">'), $('<span>').text(' ' + context.op.lg.toggleColumns));
                pagePanel.append($('<div>').append(toggleColumnsBtn));
                var toggleContainer = $('<div>').addClass('at-toggle-container');

                var linkClose = $('<a class="at-link-close-toggle">').append($('<i class="fa fa-times">'));

                var items = $('<div>').addClass('at-toggle-list');
                for (var i = 0; i < context.op.columns.length; i++) {
                    var col = context.op.columns[i];
                    if (col.toggleEnabled === undefined || col.toggleEnabled === true) {
                        var link = $('<a>').addClass('at-toggle-col-btn');
                        var iconClass = col.visible || col.visible === undefined ? 'fa-toggle-on' : 'fa-toggle-off';
                        var icon = $('<i>').addClass('fa ' + iconClass);
                        var span = $('<span>').text(' ' + (col.text || col.title || col.data));
                        link.append(icon, span);
                        items.append(link);
                    }
                }
                toggleContainer.append(items, linkClose);
                pagePanel.append(toggleContainer);

                toggleColumnsBtn.on('click', function () {
                    context.showTogglePanel.call(context);
                });
            }

            titlePanel.append($('<h3>'));
            if (context.op.searchable) {
                var div = $('<div class="at-search-wrapper">');
                var input = $('<input class="at-search-input">').attr('placeholder', context.op.lg.seachInputPlaceHolder);
                var noFilteredDataSpan = $('<span class="no-filtered-data-span">');
                input.on('keyup', function (e) {
                    if (e.keyCode === 13) {
                        if (e.target.value.length >= context.op.searchableMinLength || e.target.value.length === 0) {
                            context.filter.call(context, e.target.value);
                        }
                    }
                });
                div.append(input, noFilteredDataSpan);
                searchPanel.append(div);
            }
            container.append(pagePanel, titlePanel, searchPanel);
        },
        resetPagination: function () {
            this.Apptable.ajaxOperations.firstLoad = true;
            this.Apptable.ajaxOperations.pageChange = false;

            this.Apptable.op.currentPage = 1;
            this.Apptable.op.pageStartIndex = (this.Apptable.op.currentPage * this.Apptable.op.linesPerPage) - this.Apptable.op.linesPerPage;
            this.Apptable.op.pageEndIndex = this.Apptable.op.pageStartIndex + this.Apptable.op.linesPerPage;
            return;
        },
        validateAjaxObject: function (params) {
            if (!params.url) {
                return false;
            }
            return true;
        },
        validateCollection: function (collection) {
            if (Array.isArray(collection) && collection.length > 0) {
                return collection;
            }
            if (this.Apptable) {
                return this.Apptable.showNoDataMessage();
            }
            return null;
        },
        validateControlExists: function (item, options, control) {

            if (!item.at_controls) {
                item.at_controls = {};
            }

            var controlId = '__' + options.type + '_' + options.data + '__' + item.at_id;
            var value = item.at_controls[controlId];
            if (!value) { //if the control doesn't exists, then set a value for the control when it is rendered
                switch (options.type) {
                    case 'input':
                        item.at_controls[controlId] = (item[options.data]) ? item[options.data] : '';
                        break;
                    case 'checkbox':
                        item.at_controls[controlId] = false;
                        break;
                    case 'radio':
                        item.at_controls[controlId] = false;
                        break;
                    case 'select':
                        item.at_controls[controlId] = 0;
                        break;
                }
                return false;
            }


            switch (options.type) {
                case 'input':
                    control.val(item.at_controls[controlId]);
                    break;
                case 'checkbox':
                    control.prop('checked', item.at_controls[controlId]);
                    break;
                case 'radio':
                    control.prop('checked', item.at_controls[controlId]);
                    break;
                case 'select':
                    control.val(item.at_controls[controlId]);
                    break;
            }
            return true;
        },
        validateIfFixed: function (cols) {
            var fixedCols = [];
            for (var i = cols.length - 1; i >= 0; i--) {
                if (cols[i].fixed) {
                    fixedCols.push(cols[i]);
                }
            }
            return fixedCols;
        },
        validateSelector: function (selector) {
            if (selector) {
                if (typeof selector === 'string') {
                    return $(selector);
                }
                if (selector instanceof jQuery) {
                    return selector;
                }
            }
            return null;
        },
        toCurrencyFormat: function (value) {
            var newValue = '';

            if (value === null || value === undefined || value === '') {
                return '';
            }


            if (value.indexOf('$') === 0) {
                value = value.replace(/\$/g, '');
            }
            if (isNaN(value)) {
                newValue = value;
            } else {
                newValue = this.toCurrency(value);
            }
            return newValue;
        },
        toCurrency: function (value) {
            if (!isNaN(value)) {
                strValor = '';
                if (value.toString().indexOf('.') !== -1) {
                    strValor = parseFloat(value.toString().substring(0, value.toString().lastIndexOf('.') + 3));
                } else {
                    strValor = parseFloat(value);
                }
                return ('$' + parseFloat(strValor).toFixed(2)).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            } else {
                return '-';
            }
        },
        partition: function (list, prop, begin, end, pivot, order, type) {
            var piv = list[pivot];
            this.swap(list, pivot, end - 1);
            var store = begin;
            var ix;
            for (ix = begin; ix < end - 1; ++ix) {


                if (val1 === null || val1 === undefined) {
                    if (type === 'number') {
                        val1 = 0;
                    } else {
                        val1 = '';
                    }
                }

                if (val2 === null || val2 === undefined) {
                    if (type === 'number') {
                        val2 = 0;
                    } else {
                        val2 = '';
                    }
                }

                var val1 = (type !== 'number') ? list[ix][prop] : parseFloat(list[ix][prop]);
                var val2 = (type !== 'number') ? piv[prop] : parseFloat(piv[prop]);
                /*
                 list[ix][prop] = (type!=='number')?list[ix][prop]:parseFloat(list[ix][prop]);
                 piv[prop] = (type!=='number')?piv[prop]:parseFloat(piv[prop]);
                 */



                if (order === 'asc') {
                    //if ( list[ix][prop] <= piv[prop] ) {
                    if (val1 <= val2) {
                        this.swap(list, store, ix);
                        ++store;
                    }
                } else {
                    //if ( list[ix][prop] > piv[prop] ) {
                    if (val1 > val2) {
                        this.swap(list, store, ix);
                        ++store;
                    }
                }
            }
            this.swap(list, end - 1, store);
            return store;
        },
        swap: function (obj, a, b) {
            var tmp = obj[a];
            obj[a] = obj[b];
            obj[b] = tmp;
        },
        qsort: function (list, prop, begin, end, order, type) {
            if (end - 1 > begin) {
                var pivot = begin + Math.floor(Math.random() * (end - begin));
                pivot = this.partition(list, prop, begin, end, pivot, order, type);
                this.qsort(list, prop, begin, pivot, order, type);
                this.qsort(list, prop, pivot + 1, end, order, type);
            }
        },
        quick_sort: function (list, prop, order, type) {
            this.qsort(list, prop, 0, list.length, order, type);
        }
    };
    return __;
}



//	return Apptable; //cambiar al final

//})();

