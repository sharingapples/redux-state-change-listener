const expect = require('chai').expect;
const { createStore } = require('redux');

const ReduxStateChangeListener = require('../');

const initialState = {
  counter: 0,
}

const testReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREASE':
      return Object.assign({}, {
        counter: state.counter + 1,
      });
    case 'RESET':
      return Object.assign({}, {
        counter: null,
      });
    default:
      return state;
  }
}

const expectations = {};

const store = createStore(testReducer);
const stateListener = new ReduxStateChangeListener(store);
stateListener.register(state => state.counter, (value) => expectations.counterButNull = value, false);
stateListener.register(state => state.counter, (value) => expectations.counter = value);
stateListener.start();

describe('Test ReduxStateChangeListener', () => {
  it('checks for standard usage', () => {
    store.dispatch({ type: 'INCREASE' });
    expect(expectations.counter).to.equal(1);
    expect(expectations.counterButNull).to.equal(1);

    store.dispatch({ type: 'RESET'});
    expect(expectations.counter).to.equal(1);
    expect(expectations.counterButNull).to.equal(null);
  });
});