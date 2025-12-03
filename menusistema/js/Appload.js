var Appload = function (selector, options) {
    var context = this;
    context.control = $(selector).css('display', 'none');

    var language = {
        versionError: 'Appload.js is not compatible with this explorer version.',
        labelInput: 'Select Files',
        fileTypesErrorDeclaration: 'The file types must be declared in a String or an Array, unexpected type defintion',
        removeAllFilesBtn: 'Remove all files',
        uploadAllFilesBtn: 'Upload all files',
        singleUploadBtn: 'Upload this file',
        singleDiscardBtn: 'Discard this file',
        singleDownloadBtn: 'Download this file',
        singleDeleteBtn: 'Delete this file from server',
        fileNotExists: 'The selected file not exists or is corrupt',
        notEspecifiedURL: 'An URL must be especified',
        errorUploadingFile: 'There was a problem uploading this file!',
        uploading: 'Uploading...',
        fileTypeError: 'This file cannot be uploaded, filetype error, ',
        mustSelectFile: 'Must select at least one file',
        uploadComplete: 'Files has been uploaded correctly!',
        filesNotLoaded: 'There are <b>#</b> files that can not be loaded.<br />',
        allowedExtensions: 'Only files with <b>#</b> extensions are allowed.<br />',
        fileSizeExceeded: 'Files can not exceed <b>#Kb.</b><br>',
        summaryFileErrors: '<br>These are the files with errors:',
    }



    //defaults
    context.options = {
        showDiscardButton: true,
        showUploadButton: true,
        fileTypes: '*',
        maxSize: -1,
        multiple: false,
        showErrors: true,
        traceErrors: true,
        showDownloadBtn: false,
        showDeleteBtn: false,
        showSingleUploadBtn: true,
        showSingleDiscardButton: true,
        lg: language,
        autoUpload: false,
        showFilesSummary: true,
    };
    $.extend(context.options, options);

    if (context.options.multiple) {
        context.control.attr('multiple', 'multiple');
    }

    if (context.options.fileTypes) {
        //fixme
        context.setAllowedTypes();
    }

    if (!window.FormData) {
        alert(context.options.lg.versionError);
        return;
    }

    context.linkSelectFiles = $('<a href="#">').text(context.options.lg.labelInput).addClass('appload-input');
    context.linkSelectFiles.on('click', function (evt) {
        context.stopEvent(evt);
        if (!context.options.multiple && context.files.length >= 1) {
            return;
        }
        context.control[0].click();
    });
    context.linkSelectFiles.insertAfter(context.control);


    context.discartedFiles = [];
    context.files = [];
    context.control.on('change', function (evt) {
        context.previewFile.call(context, evt);
    });
    $.extend(context, new EventTarget());
}

Appload.prototype.setAllowedTypes = function () {
    //FIXME
};

Appload.prototype.setFileTypes = function (types) {
    if (Array.isArray(types) || (typeof types === 'string')) {
        this.options.fileTypes = types;
        return true;
    }
    if (this.options.traceErrors) {
        console.error(this.options.lg.fileTypesErrorDeclaration);
    }
    return false;
};


Appload.prototype.previewFile = function (evt) {
    var context = this;
    var txt = $(evt.target);
    if (!context.container) {
        var divFiles = $('<div>').addClass('appload-container');
        divFiles.insertAfter(context.linkSelectFiles);
        context.container = divFiles;
        context.container.append('<div class="files-list">');
        context.container.append('<div class="files-notifications" style="display:none;">');
        var divButtons = $('<div>').addClass('appload-buttons');
        if (context.options.showDiscardButton === undefined || context.options.showDiscardButton !== false) {
            var btnDiscard = $('<button>').text(context.options.lg.removeAllFilesBtn).addClass('btn-remove-all-files');
            context.btnDiscard = btnDiscard;
            btnDiscard.on('click', function (e) {
                context.discardFiles.call(context);
            });
            divButtons.append(btnDiscard);
        }
        if (context.options.showUploadButton === undefined || context.options.showUploadButton !== false) {
            var btnUpload = $('<button>').text(context.options.lg.uploadAllFilesBtn).addClass('btn-upload-all-files');
            ;
            context.btnUpload = btnUpload;
            btnUpload.on('click', function (e) {
                context.uploadFiles.call(context);
            });
            divButtons.append(btnUpload);
        }
        context.container.append(divButtons);
        context.container.show();
    }
    for (var i = 0; i < evt.target.files.length; i++) {
        var file = evt.target.files[i];
        if (context.validateFileType(file, context.options.fileTypes)) {
            file.fileCode = context.getFileCode(file.name);
            context.files.push(file);
            context.fire({type: 'onFileSelected', data: file});
            context.addFileToList(file);
        } else {
            context.addRejectedFile(file);
        }
    }
    //Experimental: delete all files from the input once all files has been read
    context.control[0].value = '';

    if (context.files.length > 0) {
        context.toggleMasterButtons(true);
    }

    if (this.options.showErrors) {
        this.handleErrors();
    }
    
};


Appload.prototype.getFileCode = function (fileName) {
    return fileName.trim().replace(/\./g, '').replace(/ /g, '_').replace(/\(/, '').replace(/\)/, '') + '_' + (new Date().getTime().toString());
};

Appload.prototype.validateFileType = function (file) {

    if (this.options.maxSize !== -1 && this.options.maxSize < file.size) {
        return false;
    }


    if (this.options.fileTypes === '*') {
        return true; //accepts any kind of file
    }

    var filetypes = this.options.fileTypes;
    var fileName = file.name;
    var ext = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length - fileName.lastIndexOf('.') - 1);

    //is an array?
    if (Array.isArray(filetypes)) {
        for (var i = 0; i < filetypes.length; i++) {
            if (ext.toLowerCase() === filetypes[i].toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    if (typeof filetypes === 'string') {
        if (ext.toLowerCase() === filetypes.toLowerCase()) {
            return true;
        }
    }
    return false;
};

Appload.prototype.addFileToList = function (file) {
    var fileCode = !!file.fileCode ? file.fileCode : 'item_server';
    var url = file.url;
    var item = $('<div>').addClass('file-item').attr('id', 'item_' + fileCode);
    var icon = this.getIconType(file);
    var i = $('<i>').addClass('fa ' + icon + ' fa-2x').css({'margin-right': 6, 'font-size': 11});
    var name = $('<span>').text(file.name);
    var dl = $('<div class="file-item-desc">').append(i, name);

    var context = this;

    var dr = $('<div class="file-item-btns">').empty();

    if (context.options.showSingleUploadBtn) {
        var btnSingleUpload = $('<button class="appload-btn-upload">').html('<i class="fa fa-upload">').attr('data-filecode', fileCode).attr('title', context.options.lg.singleUploadBtn);
        btnSingleUpload.on('click', function (evt) {
            context.singleUpload.call(context, evt);
        });
        dr.append(btnSingleUpload);
    }

    if (context.options.showSingleDiscardButton) {
        var btnSingleDiscard = $('<button class="appload-btn-discard">').html('<i class="fa fa-trash">').attr('data-filecode', fileCode).attr('title', context.options.lg.singleDiscardBtn);
        btnSingleDiscard.on('click', function (evt) {
            context.singleDiscard.call(context, evt);
        });
        dr.append(btnSingleDiscard);
    }

    if (context.options.showDownloadBtn) {
        var btnSingleDownload = $('<button class="appload-btn-download">').html('<i class="fa fa-download">').attr({'disabled': 'disabled', 'data-filecode': fileCode, 'data-url': url, title: context.options.lg.singleDownloadBtn});
        btnSingleDownload.on('click', function (evt) {
            context.singleDownload.call(context, evt);
        });
        dr.append(btnSingleDownload);
    }

    if (context.options.showDeleteBtn) {
        var btnSingleDelete = $('<button class="appload-btn-delete">').html('<i class="fa fa-times">').attr({'disabled': 'disabled', 'data-filecode': fileCode, 'data-url': url, title: context.options.lg.singleDeleteBtn});
        btnSingleDelete.on('click', function (evt) {
            context.singleDelete.call(context, evt);
        });
        dr.append(btnSingleDelete);
    }

    item.append(dl, dr);
    this.container.find('div.files-list').append(item);
    if (context.options.showDiscardButton) {
        $('.btn-remove-all-files').removeAttr('disabled');
    }
    if (context.options.showUploadButton) {
        $('.btn-upload-all-files').removeAttr('disabled');
    }
    return item;
};

Appload.prototype.getIconType = function (file) {
    var icon = 'fa-file-o';
    switch (file.type) {
        case 'application/pdf':
            icon = 'fa-file-pdf-o';
            break;
        case 'image/png':
            icon = 'fa-file-image-o';
            break;
        case 'text/plain':
            icon = 'fa-file-text-o';
            break;
    }
    return icon;
};


Appload.prototype.singleUpload = function (e, arguments) {
    var context = this;
    var file = null;
    var fileCode = null;
    if (e.currentTarget) {
        fileCode = $(e.currentTarget).attr('data-filecode');
        file = context.getFileByCode(fileCode);    
    }else{
        file = e;
        fileCode = e.fileCode;
    }
    

    if (!file) {
        if (context.options.traceErrors) {
            console.error(context.options.lg.fileNotExists);
        }
        return false;
    }
    if (!context.options.url) {
        if (context.options.traceErrors) {
            console.error(context.options.lg.notEspecifiedURL);
        }
        return false;
    }

    var formData = new FormData();
    formData.append('files', file);
    formData.append('fileCode', fileCode);
    if (arguments !== undefined) {
        for (var j in arguments) {
            formData.append(j, arguments[j]);
        }
    }
    $.ajax({
        url: context.options.url,
        type: 'POST',
        dataType: 'json',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            //data: {uploadedFiles:[fileCode:'____', status:'OK']}
            context.fire({type: 'onsingleupload', data: data});

            var fileCode = '';
            if (!!data.uploadedFiles) {
                if (data.uploadedFiles.length === 0 || !data.uploadedFiles[0].fileCode) {
                    //context.fire({type:'onsingleupload', data:data});
                    var spanError = $('.span-uploading');
                    $('<span class="fa fa-warning" title="' + context.options.lg.errorUploadingFile + '">').insertBefore(spanError.parent().find('i.fa:first'));
                    spanError.remove();
                    return;
                }
                var fileResponse = data.uploadedFiles[0];
                fileCode = fileResponse.fileCode;

                var divItem = $('#item_' + fileCode);
                divItem.find('button').attr('disabled', 'disabled');
                divItem.find('.file-item-desc .span-uploading').remove();
                context.configFileButtons($('#item_' + fileCode), fileResponse);

                for (var i = 0; i < context.files.length; i++) {
                    if (context.files[i].fileCode === fileCode) {
                        context.files.splice(i, 1);
                    }
                }


                if (context.files.length === 0) {
                    if (context.options.showDiscardButton) {
                        $('.btn-remove-all-files').attr('disabled', 'disabled');
                    }
                    if (context.options.showUploadButton) {
                        $('.btn-upload-all-files').attr('disabled', 'disabled');
                    }
                }
            }
        },
        error: function (err) {
            var spanError = $('.span-uploading');
            $('<span class="fa fa-warning" title="' + context.options.lg.errorUploadingFile + '">').insertBefore(spanError.parent().find('.file-item-desc i.fa:first'));
            spanError.remove();
            if (context.options.onError) {
                context.options.onError(err);
            }
            if (context.traceErrors) {
                console.error(err);
            }
            context.fire({type: 'onsingleuploaderror', data: err});
        },
        beforeSend: function () {
            var divItem = context.container.find('.files-list #item_' + fileCode);
            divItem.find('button').attr('disabled', 'disabled');
            var spanUpload = $('<span>').addClass('span-uploading').text(context.options.lg.uploading);
            divItem.find('.file-item-desc').append(spanUpload);

        }
    });
};

Appload.prototype.singleDiscard = function (evt) {
    var fileCode = $(evt.currentTarget).attr('data-filecode');
    for (var i = 0; i < this.files.length; i++) {
        if (fileCode === this.files[i].fileCode) {
            this.removeFileItem(fileCode);
            this.files.splice(i, 1)
        }
    }

    if (this.files.length === 0) {
        this.toggleMasterButtons(false);
    }
};

Appload.prototype.singleDownload = function (evt) {
    $('<a>').attr({'href': $(evt.currentTarget).attr('data-url'), 'target': '_blank'})[0].click();
};

Appload.prototype.singleDelete = function (evt) {
//	console.log('delete ', file.name);
};

Appload.prototype.getFileByCode = function (fileCode) {
    for (var i = 0; i < this.files.length; i++) {
        if (this.files[i].fileCode === fileCode) {
            return this.files[i];
        }
    }
    return false;
};

Appload.prototype.toggleMasterButtons = function (show) {
    if (this.btnDiscard && this.options.showUploadButton) {
        (show) ? this.btnDiscard.show() : this.btnDiscard.hide();
    }
    if (this.btnUpload && this.options.showDiscardButton) {
        (show) ? this.btnUpload.show() : this.btnUpload.hide();
    }
};


Appload.prototype.removeFileItem = function (fileCode) {
    this.container.find('.files-list #item_' + fileCode).slideUp('fast', function () {
        $(this).remove();
    });
};


Appload.prototype.addRejectedFile = function (file) {
    this.discartedFiles.push(file);
    if (this.options.traceErrors) {
        console.error(this.options.lg.fileTypeError, file.name);
    }
};

Appload.prototype.uploadFiles = function (arguments) {
    if (this.files.length === 0) {
        if (this.options.traceErrors) {
            console.error(this.options.lg.mustSelectFile);
        }
        return false;
    }

    if (!this.options.url) {
        if (this.options.traceErrors) {
            console.error(this.options.lg.notEspecifiedURL);
        }
        return false;
    }

    var formData = new FormData();

    for (var i = 0; i < this.files.length; i++) {
        formData.append('files', this.files[i]);
    }

    if (arguments !== undefined) {
        for (var j in arguments) {
            formData.append(j, arguments[j]);
        }
    }

    var context = this;
    if (formData) {
        $.ajax({
            url: this.options.url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (data) {
                context.fire({type: 'onupload', data: data});
                //validar la respuesta del servidor


                context.files = [];
                context.configFileButtons(null, data);
                if (context.options.showDiscardButton) {
                    $('.btn-remove-all-files').attr('disabled', 'disabled');
                }
                if (context.options.showUploadButton) {
                    $('.btn-upload-all-files').attr('disabled', 'disabled');
                }

                if (context.options.onSuccess) {
                    context.options.onSuccess(data);
                }
            },
            error: function (err) {
                if (context.options.onError) {
                    context.options.onError(err);
                }
            },
            beforeSend: function () {
                if (context.options.beforeSend) {
                    context.options.beforeSend();
                }
            }
        });
    }
};

Appload.prototype.configFileButtons = function (div, fileResponse) {
    var container = null;
    if (!div) { //if not div, it means the program must drop the files and put new items with the server side generated URL
        this.container.find('.files-list .file-item:not(.uploaded-item)').remove();
        container = this.container.find('.files-list .file-item');
        if (!!fileResponse && !!fileResponse.uploadedFiles) {
            for (var i = 0; i < fileResponse.uploadedFiles.length; i++) {
                this.configFileButtons(this.addFileToList(fileResponse.uploadedFiles[i]), fileResponse.uploadedFiles[i]);
            }
            return;
        }
    }

    //else (the div argument is null)
    container = div;
    container.addClass('uploaded-item');
    container.find('.appload-btn-upload, .appload-btn-discard').attr('disabled', 'disabled');
    if (this.options.showDownloadBtn) {
        container.find('.appload-btn-delete').removeAttr('disabled');
    }
    if (this.options.showDeleteBtn) {
        container.find('.appload-btn-download').removeAttr('disabled').attr('data-url', fileResponse.url);
    }
    $('<span class="fa fa-check-circle-o" title="' + this.options.lg.uploadComplete + '">').insertBefore(container.find('.file-item-desc i.fa:first'));
};

Appload.prototype.handleErrors = function () {
    var context = this;
    var notificationPanel = this.container.find('.files-notifications').empty();
    if (this.discartedFiles.length === 0) {
        notificationPanel.slideUp('fast');
        return 'There are no errors';
    }

    var errMsg = this.options.lg.filesNotLoaded.replace(/#/g, this.discartedFiles.length); //'There are <b>'+this.discartedFiles.length+'</b> files that can not be loaded.<br />';
    if (this.options.fileTypes !== '*') {
        errMsg += this.options.lg.allowedExtensions.replace(/#/g, this.options.fileTypes.toString().replace(/\,/g, ' / ')); //'Only files with <b>'+this.options.fileTypes.toString().replace(/\,/g, ' / ')+'</b> extensions are allowed.<br />';
    }
    if (this.options.maxSize !== -1) {
        errMsg += this.options.lg.fileSizeExceeded.replace(/#/g, (this.options.maxSize * 0.001).toFixed(2)); //'Files can not exceed <b>'+ (this.options.maxSize*0.001).toFixed(2) +'Kb.</b><br>';	
    }
    errMsg += this.options.lg.summaryFileErrors + '<ul>';
    for (var i = 0; i < this.discartedFiles.length; i++) {
        errMsg += '<li>' + this.discartedFiles[i].name + ' - ' + (this.discartedFiles[i].size * 0.001).toFixed(2) + 'Kbs</li>';
    }
    errMsg += '<ul>';

    if (typeof this.options.showErrors === 'boolean' && this.options.showErrors) {

        notificationPanel.html(errMsg).slideDown('fast');
        var closeLink = $('<a href="#" class="link-close-notifications">').append($('<i>').addClass('fa fa-times'));
        closeLink.on('click', function (evt) {
            context.closeNotificationPanel.call(context, evt);
        });
        notificationPanel.append(closeLink);
        return true;
    }

    if (typeof this.options.showErrors === 'function') {
        this.options.showErrors(this.discartedFiles, errMsg);
        return true;
    }
};

Appload.prototype.discardFiles = function () {
    try {
        this.files = [];
        this.discartedFiles = [];
        this.container.find('.files-list').empty();
        this.control[0].value = '';
        this.toggleMasterButtons(false);
        this.container.find('.files-notifications').slideUp('fast', function () {
            $(this).empty();
        });
    } catch (e) {
    }
};


Appload.prototype.closeNotificationPanel = function (evt) {
    this.stopEvent(evt);
    this.discartedFiles = [];
    this.container.find('.files-notifications').slideUp('fast', function () {
        $(this).empty();
    })
};

Appload.prototype.stopEvent = function (evt) {
    if (evt.preventDefault) {
        evt.preventDefault();
    } else if (evt.stopPropagation) {
        evt.stopPropagation();
    } else {
        evt.returnValue = false;
    }
};