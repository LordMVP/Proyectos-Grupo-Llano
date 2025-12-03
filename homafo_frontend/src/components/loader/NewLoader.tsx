import React, { useState } from "react";
import { css } from "@emotion/core";
import { ScaleLoader } from "react-spinners";


// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function NewLoader() {
    const [loading] = useState(true);

    return (
        <div style={{ position: 'absolute', zIndex: 999, top: '50%', left: '51%', transform: 'translate(-50%, -50%)' }} className='centered'>
            <ScaleLoader
                height={50}
                width={4}
                radius={2}
                margin={7}
                css={override}                
                color={"#36B5D7"}
                loading={loading}
            />
        </div>
    );

}

export default NewLoader;