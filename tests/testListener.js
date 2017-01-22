const { assert, expect } = require('chai');
const sinon = require('sinon');
const { createStore } = require('redux');

const ReduxStateChangeListener = require('../');

const initialState = {
  counter: 0,
  filter: '',
}

const testReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREASE':
      return Object.assign({}, state, {
        counter: state.counter + 1,
      });
    case 'RESET':
      return Object.assign({}, state, {
        counter: null,
      });
    case 'SET_FILTER':
      return Object.assign({}, state, {
        filter: action.filter,
      });
    default:
      return state;
  }
}

const store = createStore(testReducer);
const stateListener = new ReduxStateChangeListener(store);

const counterCallback = sinon.spy();
const counterButNullCallback = sinon.spy();
const filterCallback = sinon.spy();

stateListener.register(state => state.counter, counterCallback, false);
stateListener.register(state => state.counter, counterButNullCallback);
stateListener.register(state => state.filter, filterCallback);

stateListener.start();

describe('Test ReduxStateChangeListener', () => {
  it('checks for standard usage', () => {
    store.dispatch({ type: 'INCREASE' });
    assert(counterCallback.callCount === 1);
    assert(counterButNullCallback.callCount === 1);
    assert(filterCallback.callCount === 0);

    store.dispatch({ type: 'RESET'});
    assert(counterCallback.callCount === 2);
    assert(counterButNullCallback.callCount === 1);
    assert(filterCallback.callCount === 0);

    store.dispatch({ type: 'SET_FILTER', filter: 'tmp' });
    assert(counterCallback.callCount === 2);
    assert(counterButNullCallback.callCount === 1);
    assert(filterCallback.callCount === 1);
  });
});