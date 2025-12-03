var menuControl = {
    resultado: undefined,
    obtenerMenu: function(data) {
        return menuControl.enviarPeticion({
            'url': '../../menu',
            'async': false,
            'data': data
        });
    },
    enviarPeticion: function(args) {
        var result = undefined;
        var defecto = {
            'url': args.url,
            'data': (args.data) ? args.data : null,
            'type': (args.metodo) ? args.metodo : 'POST',
            'async': (args.async !== null || args.async !== undefined) ? args.async : true,
            'dataType': (args.tipo) ? args.tipo : 'json',
            'success': (args.async !== undefined && args.async === false) ? function(data) {
                __dom.ocultarCargador();
                result = data;
            } : args.completado,
            'error': (args.error) ? args.error : this.capturarError,
            'beforeSend': (!args.background) ? __dom.mostrarCargador : null
        };
        $.ajax(defecto);
        return result;
    }
};