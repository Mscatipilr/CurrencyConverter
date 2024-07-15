//React and other files are pulled in here. Most of the html page is written in javascript through react components.
import React from 'react';
import CurrencyConverter from './CurrencyConverter';
import './App.css';

function App() {
    return (
        <div className="App">
            <h1>Currency Converter</h1>
            <CurrencyConverter />
        </div>
    );
}

export default App;
