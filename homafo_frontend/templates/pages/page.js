
import React from 'react';
import styles from './TemplateNamePage.css';

interface ITemplateNamePageProps {
}

class TemplateNamePage extends React.Component<ITemplateNamePageProps, any>{
    constructor(props: ITemplateNamePageProps) {
        super(props);
    }
    componentDidMount() { }
    render() {
        return (
            <div>
                <Suspense fallback={<div>Cargando...</div>}>
                </Suspense>
            </div>
        );
    }

}
export default TemplateNamePage;