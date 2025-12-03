import React, { PureComponent } from 'react'
import { Button, Form } from 'react-bootstrap';
import Loader from '../../components/loader/Init'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as userActions from '../../actions/userActions'
import logo from '../../assets/img_logo.jpg'

class Login extends PureComponent<{ actions : any,empresas:any},{}> {

    static defaultProps = {
        empresas: []
    }
    _isMounted = false;

    state = {
        title: 'Sistema de información Bio',
        username: '',
        password: '',
        empresa:'',
        loading: true,
        error: false
    }

    componentDidMount() {
        this._isMounted = true
        this.setState({ loading: false })


    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    handleSubmit = () => {
        this.setState({ loading: true })
        const { username, password, empresa } = this.state
        this.props.actions.login({ username, password, empresa }, (data:any) => {
            
            if (data.error)
                this.setState({ loading: false, error: data.error })
        })


    }
    handleChange = (e : React.ChangeEvent<HTMLInputElement>) => this.setState({ [e.target.name]: e.target.value })

    render() {

        const {  loading } = this.state
     
        return (
            <div id="login">
                {loading ? <Loader /> :
                    <div className="login-wrapper" >
                        <img src={logo} alt="logo" />

                        <Form className="login" onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                            </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Login
                            </Button>
                        </Form>

                    </div >

                }
            </div >
        )
    }

}
const mapStateToProps = state => {
    return {
        user: state.user

    }
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...userActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

