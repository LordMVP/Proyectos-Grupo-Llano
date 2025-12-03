import { useEffect } from "react";
import { useState } from "react";
import AforoInfoDTO from "../../../models/dto/AforoInfoDTO";

type AforoLiquidacionComponentProps = {
    aforo:AforoInfoDTO;
}

function AforoLiquidacionComponent(props:AforoLiquidacionComponentProps) {
    const [aforo,setAforo] = useState<AforoInfoDTO>();
    
    useEffect(()=>{        
        setAforo(props.aforo);
    },[props.aforo]);

    return aforo;

}


export default AforoLiquidacionComponent;