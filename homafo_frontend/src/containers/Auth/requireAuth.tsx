import React, { Component } from 'react';
import { connect } from 'react-redux';

export default (ChildComponent : any) => {

  class ComposedComponent extends Component<{authenticated:boolean,history:any},{}> {

    componentWillMount() {
      this.shouldNavigateAway();
    }
    componentWillUpdate() {
      this.shouldNavigateAway();
    }
    shouldNavigateAway() {
      if (!this.props.authenticated) {
        this.props.history.push('/')
      }
    }
    render() {
      return <ChildComponent {...this.props} />
    }

  }
  const mapStateToProps = ( state : IRootState ) => {
    return {
      authenticated: state.user.authenticated
    };
  }
  return connect(mapStateToProps)(ComposedComponent);

}

interface IRootState {
  user: any;
}