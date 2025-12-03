import React, { useContext } from 'react'
import { useAccordionToggle, Badge } from "react-bootstrap";
import AccordionContext from "react-bootstrap/AccordionContext";
import CSS from 'csstype';

const aStyle: CSS.Properties = {
  fontWeight: 'bold',
  color: 'black',
  cursor: 'pointer'  
};


function CustomToggle({ children, eventKey }) {
  const currentEventKey = useContext(AccordionContext);
    const decoratedOnClick = useAccordionToggle(eventKey,()=>{});

    const isCurrentEventKey = currentEventKey === eventKey;
    return (
      <a onClick={decoratedOnClick} style={aStyle}>
        <Badge variant="primary">{isCurrentEventKey ? '-':'+'}</Badge> {children}
      </a>
    );
  }

  export default CustomToggle;