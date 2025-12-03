


    export function currentDate(){
        
        const today = new Date(),
        date = today.getFullYear() + '-' 
        + ((today.getMonth() + 1).toString().padStart(2, '0')) + '-' 
        + today.getDate().toString().padStart(2, '0');

        return date
    }


    


