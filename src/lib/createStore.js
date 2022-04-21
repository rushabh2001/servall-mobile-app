import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers from '../reducers';
import sagas from '../sagas';

let sagaMiddleware;
let enhancers;

if (__DEV__) {
	sagaMiddleware = createSagaMiddleware();

	enhancers = compose(
		applyMiddleware(sagaMiddleware)
	);
} else {
	sagaMiddleware = createSagaMiddleware();
	enhancers = compose(
		applyMiddleware(sagaMiddleware)
	);
}

const store = createStore(reducers, enhancers);
sagaMiddleware.run(sagas);

export default store;
