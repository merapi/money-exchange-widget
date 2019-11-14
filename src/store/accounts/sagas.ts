import { call, put, takeLatest, cancelled } from 'redux-saga/effects'
import Api, { FetchAccountsResponse } from 'api'
import { AccountsActionsConsts } from './types'
import * as actions from './actions'

export function* fetchAccounts() {
  const abortController = new window.AbortController()
  try {
    const response: FetchAccountsResponse = yield call(Api.user.fetchAccounts, abortController)
    yield put(actions.setAccounts(response.raw))
  } catch (e) {
    yield put(actions.fetchAccountsError(e))
    console.error(`fetchAccounts`, e)
  } finally {
    if (yield cancelled()) {
      abortController.abort()
    }
  }
}

export default function*() {
  yield takeLatest(AccountsActionsConsts.FETCH_ACCOUNTS, fetchAccounts)
}
