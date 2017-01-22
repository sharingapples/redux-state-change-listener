class ReduxStateChangeListener {
  constructor(store) {
    this._store = store;
    this._state = null;
    this._unsubscribe = null;
    this._mappers = [];
  }

  register(mapper, callback, ignoreNull = true, fireOnTrue = false) {
    this._mappers.push({ mapper, callback, ignoreNull, fireOnTrue });
  }

  start() {
    // Get the original state (to check the difference with)
    this._state = this._store.getState();
    this._mappedValues = this._mappers.map(event => event.mapper(this._state));

    // Subscribe to the redux store
    this._unsubscribe = this._store.subscribe(() => {
      const nextState = this._store.getState();
      this._mappedValues = this._mappers.map((event, idx) => {
        const newValue = event.mapper(nextState);

        // handle if the mapper provided a complex logic
        if (event.fireOnTrue && newValue) {
          event.callback(nextState, this._state);
          return newValue;
        }

        // See if ignore null has been set
        if (event.ignoreNull && newValue === null) {
          return newValue;
        }


        // The normal use case checking if the values for the given
        // state part has changed
        const oldValue = this._mappedValues[idx];
        if (newValue !== oldValue) {
          event.callback(newValue, oldValue);
        }

        return newValue;
      });
    });
  }

  stop() {
    this._unsubscribe();
  }
}

module.exports = ReduxStateChangeListener;
