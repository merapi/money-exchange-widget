import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { ReduxSagaEmitter } from 'kuker-emitters'
import rootReducer from './rootReducer'
import rootSaga from './rootSaga'

let sagaOptions = {}
let emitter: any
if (process.env.NODE_ENV === 'development') {
  emitter = ReduxSagaEmitter()

  sagaOptions = { sagaMonitor: emitter.sagaMonitor }
}

const sagaMiddleware = createSagaMiddleware(sagaOptions)

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(sagaMiddleware),
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ ? (window as any).__REDUX_DEVTOOLS_EXTENSION__() : compose,
  ),
)

if (emitter) {
  emitter.setStore(store)
}

sagaMiddleware.run(rootSaga)

export default store
