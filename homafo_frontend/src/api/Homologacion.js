import axios from 'axios';
import utils from '../utils/Api';

export default class HomologacionApi
{
    servidor()
    {
        return 'http://localhost:8080/';
    }

    headersGeneral()
    {
       var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
             //'AUTHORIZATION': localStorage.getItem('token'),
             'Access-Control-Allow-Origin': '*', 
             withCredentials: false,
         }
         return headers;
    }

    listaProyectos () {
        return axios.get(this.servidor()+'api/proyectos/lista');
    }

    listaBarrios(codpro)
    {
        return axios.get(this.servidor()+'api/barrios/'+codpro);
    }

    listaCiclos()
    {
        return axios.get(this.servidor()+'api/cicCiclo/lista');
    }

    listaRutas(codCic)
    {
        //return axios.get(this.servidor()+'api/homologacion/busquedaDsus/'+codCic);
        return axios.get(this.servidor()+'api/rutRuta/'+codCic);
    }

    listaBusquedaRuta(codRuta)
    {
        return axios.get(this.servidor()+'api/homologacion/busquedaDsus/'+codRuta);
        //return axios.get(this.servidor()+'api/homologacion/ruta/'+codRuta);
    }
}