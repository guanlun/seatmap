import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import './index.css';
import App from './App';
import reducer from './reducers';

const store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>,
    document.getElementById('root')
);
