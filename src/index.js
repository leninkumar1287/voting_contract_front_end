import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { ConnectionProvider } from './connection/connection_provider';

// Wrapped in ConnectionProvider to get a global state using context API
ReactDOM.render(
    <ConnectionProvider>
        <App />
    </ConnectionProvider>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
