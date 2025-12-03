
export default class BasicoDefault
{
    extraerInfoToken(token)
       {
           try
           {
            var base64Url = token.split('.')[1];
            var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(base64);
           }catch(e){return '';}
           
       }
    
       buscarParametro=(llave,parametros)=>
       {
           let resultado='';
           for(var indice in parametros)
           {
               let tmp=parametros[indice];
               let tmp2=tmp[llave];
               if(tmp2!=undefined)
               {
                   resultado=tmp2;
               }
           }
           return resultado;
       }   
}