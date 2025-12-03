export default class UtilsVarios
{

    convertStringToDate=(fecha)=>
    {
        let parts =fecha.split('-');
        let mydate = new Date(parts[0], parts[1] - 1, parts[2]); 
        return mydate;
    }

    convertDateToString=(fecha)=>
        {
            let dd = String(fecha.getDate()).padStart(2, '0');
            let mm = String(fecha.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = fecha.getFullYear();

            
            let resultado=yyyy + '-' + mm + '-' + dd;
            return resultado;

        }

    sumarDias=(fecha, dias)=>
    {
        fecha.setDate(fecha.getDate() + dias);
        return fecha;
    }

}