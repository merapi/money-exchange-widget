import { all } from 'redux-saga/effects'
import rates from './rates/sagas'

export default function* rootSaga() {
  yield all([rates()])
}
