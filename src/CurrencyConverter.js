import React, { useState, useEffect } from 'react';

const apiKey = 'fca_live_zQShfWQrEOLoRMMVFjcOTTQIwaJSbbsAVzfBzaqN';
const baseUrl = 'https://api.freecurrencyapi.com/v1';

function CurrencyConverter() {
    const [currencies, setCurrencies] = useState([]);
    const [baseCurrency, setBaseCurrency] = useState('');
    const [targetCurrency, setTargetCurrency] = useState('');
    const [amount, setAmount] = useState(1);
    const [convertedAmount, setConvertedAmount] = useState('');
    const [historicalRate, setHistoricalRate] = useState('');
    const [favoritePairs, setFavoritePairs] = useState([]);
    const [historicalDate, setHistoricalDate] = useState('2022-01-01');

    useEffect(() => {
        fetch(`${baseUrl}/currencies?apikey=${apiKey}`)
            .then(response => response.json())
            .then(data => setCurrencies(Object.entries(data.data)))
            .catch(error => console.error('Error fetching currencies:', error));

        loadFavoritePairs();
    }, []);

    const convertCurrency = () => {
        fetch(`${baseUrl}/latest?apikey=${apiKey}&base_currency=${baseCurrency}&currencies=${targetCurrency}`)
            .then(response => response.json())
            .then(data => setConvertedAmount((data.data[targetCurrency] * amount).toFixed(2)))
            .catch(error => console.error('Error converting currency:', error));
    };

    const viewHistoricalRates = () => {
        fetch(`${baseUrl}/historical?apikey=${apiKey}&date=${historicalDate}&base_currency=${baseCurrency}&currencies=${targetCurrency}`)
            .then(response => response.json())
            .then(data => {
                const rate = data.data[historicalDate][targetCurrency];
                if (rate) {
                    setHistoricalRate(`Historical exchange rate on ${historicalDate}: 1 ${baseCurrency} = ${rate} ${targetCurrency}`);
                } else {
                    setHistoricalRate(`No historical exchange rate available for ${historicalDate}.`);
                }
            })
            .catch(error => console.error('Error fetching historical rates:', error));
    };

    const saveFavoritePair = () => {
        const favoritePair = `${baseCurrency}/${targetCurrency}`;
        fetch('/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pair: favoritePair })
        })
            .then(response => response.json())
            .then(() => loadFavoritePairs())
            .catch(error => console.error('Error saving favorite pair:', error));
    };

    const loadFavoritePairs = () => {
        fetch('/favorites')
            .then(response => response.json())
            .then(data => setFavoritePairs(data))
            .catch(error => console.error('Error loading favorite pairs:', error));
    };

    return (
        <div className="converter">
            <label htmlFor="base-currency">Base Currency:</label>
            <select id="base-currency" value={baseCurrency} onChange={e => setBaseCurrency(e.target.value)}>
                <option value="">Select a currency</option>
                {currencies.map(([code, details]) => (
                    <option key={code} value={code}>{`${code} - ${details.name}`}</option>
                ))}
            </select>
            <label htmlFor="amount">Amount:</label>
            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} min="0" />
            <label htmlFor="target-currency">Target Currency:</label>
            <select id="target-currency" value={targetCurrency} onChange={e => setTargetCurrency(e.target.value)}>
                <option value="">Select a currency</option>
                {currencies.map(([code, details]) => (
                    <option key={code} value={code}>{`${code} - ${details.name}`}</option>
                ))}
            </select>
            <p>Converted Amount: <span id="converted-amount">{convertedAmount}</span></p>
            <button onClick={convertCurrency}>Convert</button>
            <label htmlFor="historical-date">Historical Date:</label>
            <input type="date" id="historical-date" value={historicalDate} onChange={e => setHistoricalDate(e.target.value)} />
            <button onClick={viewHistoricalRates}>View Historical Rates</button>
            <div id="historical-rates-container">{historicalRate}</div>
            <button onClick={saveFavoritePair}>Save Favorite</button>
            <div id="favorite-currency-pairs">
                {favoritePairs.map(pair => (
                    <button key={pair.id} onClick={() => {
                        const [base, target] = pair.pair.split('/');
                        setBaseCurrency(base);
                        setTargetCurrency(target);
                    }}>
                        {pair.pair}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CurrencyConverter;
