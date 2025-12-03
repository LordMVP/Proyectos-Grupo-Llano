import React from 'react'
import { Wave } from 'better-react-spinkit'
import CSS from 'csstype';

const aStyle: CSS.Properties = {
    position: "relative"    
  };

const Loader = ( props) => {

    return (
        <div style={props.isRelative ? aStyle : undefined}>
            <div style={{ position: 'absolute', zIndex: 999, top: '50%', left: '51%', transform: 'translate(-50%, -50%)' }} className='centered'>
                <Wave
                    size={60}
                    color={'#BCE9F9'}
                    gutterwidth={2}
                    columnwidth='10%'
                    scaleyend={2}
                    scaleystart={1}
                />
            </div>
        </div>

    )
}

export default Loader
