
import React from 'react';
//import styles from './FormTitle.css';
import { MdAddCircle } from 'react-icons/md';

interface IFormTitleProps {
  title: string;
  onNew: any;
  active?: boolean;
}

class FormTitle extends React.Component<IFormTitleProps, any>{
  constructor(props: IFormTitleProps) {
    super(props);
  }
  componentDidMount() { }
  handleClick = () => {
    this.props.onNew();
  }
  render() {
    return (
      <div className="d-flex w-100 justify-content-between">
        <h6 className="mb-1">
          {this.props.title}
        </h6>
        {this.props.active && <a onClick={this.handleClick}>
          <MdAddCircle size="2em" color="#0d46a0" /> Nuevo
              </a>
        }
      </div>
    );
  }


}
export default FormTitle;