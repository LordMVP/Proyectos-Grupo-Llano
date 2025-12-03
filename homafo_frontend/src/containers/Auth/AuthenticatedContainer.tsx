import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { object } from 'prop-types';
import { withRouter } from 'react-router-dom';

export default function (ComposedComponent) {

  class AuthenticatedContainer extends PureComponent<{authenticated :boolean , history:any},{}> {

    static contextTypes = {
      router: object
    }

    componentWillMount() {

      if (this.props.authenticated) {
        //  this.context.router.history.push('/home');
        this.props.history.push('/home')

      }
    }

    componentWillUpdate(nextProps: any) {

      if (nextProps.authenticated)
        this.props.history.push('/home')

    }

    render() {
      return <ComposedComponent {...this.props} />
    }

  }

  function mapStateToProps(state: any) {
    return {
      authenticated: state.user.authenticated,
    };
  }

  return withRouter(connect(mapStateToProps)(AuthenticatedContainer));

}