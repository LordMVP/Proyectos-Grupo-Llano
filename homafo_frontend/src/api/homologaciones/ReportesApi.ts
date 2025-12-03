//import { ApiDefaultReportes } froapi/common/ApiDefaultServicertes';

//const URL:string='http://190.14.232.146:8081/JasperBridge-1.0-SNAPSHOT/ws/jasper/json';

export default class ReportesApi //extends ApiDefaultReportes
{
     async metodoGeneral(parametros,URL)
     {
         let consulta= await fetch(URL, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(parametros)
        });
        let contenido = await consulta.json();
        return contenido;
     }

    generarCartas(datos,URL)
    {
        return this.metodoGeneral(datos,URL);
        //return this.instance.post('homologacion/reportes/generarCartas',datos); ////axios react
        //return this.instance.post('ws/jasper/json',datos);   ///local
    }

    generarArchivoPlano(datos,URL)
    {
        return this.metodoGeneral(datos,URL);
        //return this.instance.post('homologacion/reportes/generarCartasText',datos); ////axios react
        //return this.instance.post('ws/jasper/json',datos);   ///local
    }

    generarDetalleAforo(datos,URL)
    {
        return this.metodoGeneral(datos,URL);
    }

}