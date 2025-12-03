import { createStore, compose, applyMiddleware } from 'redux';
// import { thunk as idleThunk, readyStatePromise, crashReporter } from 'redux-middleware'
import thunk from 'redux-thunk';
import combineReducers from '../reducers/root';
// import history from '../store/configureHistory'
// import { middleware as idleMiddleware, actions as idleActions } from '../components/state/react-idle-monitor/Index'
// import { thunk as idleThunk, readyStatePromise, crashReporter } from 'redux-middleware'
// import { routerMiddleware } from 'react-router-redux'
    // const middleware = routerMiddleware(history)
/*Create a function called configureStore */
// , idleThunk, readyStatePromise, crashReporter
// const composeStore = compose(applyMiddleware(thunk, idleThunk,idleMiddleware,readyStatePromise, crashReporter))(createStore)


const composeStore = compose( applyMiddleware(thunk) ) (createStore)

export default function configureStore() {


    const store = composeStore(combineReducers)

    // Will start the idle monitoring when the user logs in, and stop it if the user is signed out.

    // let currentIsAuthorized = false

    // store.subscribe(() => {
    //     let state = store.getState()
    //     let previousIsAuthorized = currentIsAuthorized
    //     // calls a function that selects whether the user is authorized from the current state
    //     currentIsAuthorized = (state.user.authenticated ? true : false) //selectIsAuthorized(state)

    //     if (currentIsAuthorized !== previousIsAuthorized)
    //         store.dispatch((currentIsAuthorized ? idleActions.start : idleActions.stop)())
    // })

    return store
}
