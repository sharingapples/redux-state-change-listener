# redux-state-change-listener
A simple redux library for listening on changes of a specific part of redux
state tree.

## Purpose
Redux started as a library to be used with React but quickly became an independent
library that has a very good bindings with React. When using redux with something other
than react, the ease provided by `mapStateToProps` are not available and using the
`subscribe` method itself doesn't seem straight forward. This library provides a very
simple binding for listening on changes on the individual items on the redux state tree.

## Installation
With npm
> `npm install --save redux-state-change-listener`

With yarn
> `yarn add redux-state-change-listener`

## Usage
A callback can be registered to be triggered whenever a specific value on
a state tree changes. Consider the following example.

```javascript
...
const store = createStore(rootReducer, applyMiddleware());

// Event called back whenever the todos list is changed
onTodosChanged = (todos) => {
  console.log('New set of todos', todos);
}

// Event called back whenever the filter is changed
onFilterChanged = (filter, oldFilter) => {
  console.log(`Todo visibility filter changed from ${oldFilter} to ${filter}`);
}

// Create the state callback manager
const stateCallbackManager = new ReduxStateChangeListener(store);
stateCallbackManager.register(state => state.todos, onTodosChanged);
stateCallbackManager.register(state => state.filter, onFilterChanged);

// Start the manager, after which the callbacks would be called whenever
// the state changes as per the registered event
stateManager.start();
```

By default, when the value changes to null, it is not considered as a change and
the callback is not fired. This could be overriden by passing a third parameter
`ignoreNull` as `false`. Ex:
```javascript
stateCallbackManager.register(state => state.todos, onTodosChanged, false);
```

## Advanced Usage
For some advanced use case, you can even check between different values from the
current state and the previous state. For this to work, the fourth parameter on
`register` call `fireOnTrue` should be `true`. The first parameter in this case
must be a function that returns `true` if the callback needs to be fired. Example:

```javascript
stateCallbackManager.register((state, prev) => (
  (state.filter === 'ALL' || state.filter === 'INCOMPLETE') && state.todos !== prev.todos
), onActiveTodosChanged, true, true);
```

## LICENSE
MIT License

Copyright (c) 2017 SharingApples.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
