import React from 'react';
import { Card, Accordion} from 'react-bootstrap';
import CustomToggle from './CustomToggle';



interface ICardAccordionBasicProps { 
    eventKey?: any;
    title: string;
}

class CardAccordionBasic extends React.Component<ICardAccordionBasicProps, any>{
    
    constructor(props: ICardAccordionBasicProps) {
        super(props);
    }
    componentDidMount() { 
        
    }
    render() {
        return (
            <Card>
                <Card.Header>
                    <CustomToggle eventKey={this.props.eventKey}>
                        {this.props.title}
                    </CustomToggle>
                </Card.Header>
                <Accordion.Collapse eventKey={this.props.eventKey}>
                    <Card.Body>
                        {this.props.children}
                    </Card.Body>
                </Accordion.Collapse>
            </Card>

        );
    }

}
export default CardAccordionBasic;