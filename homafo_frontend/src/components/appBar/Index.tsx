import React from 'react';

import { connect } from 'react-redux'
import { bindActionCreators ,Dispatch  } from 'redux'
import * as userActions from '../../actions/userActions'
import logo from '../../assets/logo.png'
import './Index.css'
import { Navbar ,NavDropdown } from 'react-bootstrap'

interface IMenu {
  logout: any
}

class MenuAppBar extends React.Component<IMenu,{}> {
  
  closeSession = () => this.props.logout()

  render() {


    return (
      <div >


        <Navbar>
          <Navbar.Brand href="#home">
            <img width={100} src={logo} alt="Bioagricola" title="Bioagricola" />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <NavDropdown title="opciones" id="basic-nav-dropdown">
           
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">log out</NavDropdown.Item>
            </NavDropdown>
            
          </Navbar.Collapse>
        </Navbar>

      </div>
    );
  }
}


const mapDispatchToProps = (dispatch :Dispatch) => {
  return  bindActionCreators({ ...userActions }, dispatch)
  
}

export default connect(null, mapDispatchToProps)(MenuAppBar)

