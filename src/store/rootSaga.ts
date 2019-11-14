import { all } from 'redux-saga/effects'
import rates from './rates/sagas'
import accounts from './accounts/sagas'
import pockets from './pockets/sagas'

export default function* rootSaga() {
  yield all([rates(), accounts(), pockets()])
}
