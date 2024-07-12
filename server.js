const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const FavoritePair = sequelize.define('FavoritePair', {
    pair: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

sequelize.sync();

app.post('/favorites', async (req, res) => {
    const { pair } = req.body;
    try {
        const favoritePair = await FavoritePair.create({ pair });
        res.status(201).json(favoritePair);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save favorite pair.' });
    }
});

app.get('/favorites', async (req, res) => {
    try {
        const favoritePairs = await FavoritePair.findAll();
        res.status(200).json(favoritePairs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve favorite pairs.' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
