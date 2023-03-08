const express = require('express');
const router = express.Router();
const { GameInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
const ObjectId = require("bson-objectid");

// Get all game information by id
router.get('/byID', async (req, res) => {
    // Error Checking
    if (req.body && req.body.id) {
        const game = await GameInfo.findOne({"_id": ObjectId(req.body.id)});
        if (game === null) {
            res.status(400).json({'error': 'No Data Found'});
        }
        else {
            res.status(200).json(game);
        }
    }
    else {
        res.status(400).json({'error': 'Request must contain university ID'});
    }
});

// Get all game information
router.get('/all', async (req, res) => {
    const game = await GameInfo.find({});
    if (game === null) {
        res.status(400).json({'error': 'No Data Found'});
    }
    else {
        res.status(200).json(game);
    }
});

// Update game information
router.put('/', async (req, res) => {

    if (req.body && req.body._id) {
        const updGame = await GameInfo.findOne({_id: ObjectId(req.body._id)});

        if (updGame) {
            const {updatedData} = req.body;
            GameInfo.updateOne({_id: updGame._id}, updatedData, function (err, result) {
                if (err !== null) {
                    res.status(500).json(err);
                }
                else {
                    res.status(200).json({result});
                }
            });
        }
        else {
            res.status(404).json({"error": "Game Not Found"});
        }
    }
    else {
        res.status(404).json({"error": "Incomplete Input"});
    }
        
});

// Create new game
router.post('/', async (req, res) => {
    if (req.body && req.body.universityID && req.body.homeTeam && req.body.awayTeam) {
        const {universityID, homeTeam, awayTeam} = req.body;

        const data = new GameInfo({
            universityID,
            homeTeam,
            awayTeam,
            winningTeam: null,
            gameFinished: false,
            gameTime: new Date()
        });

        try {
            const dta = await data.save();
            const dataToSave = await GameInfo.findOne({_id: dta._id});
            res.status(200).json(dataToSave);
        }
        catch (error) {
            res.status(500).json({'error': error});
        }
    }
    else {
        res.status(500).json({'error': "missing inputs"});
    }
});

module.exports = router;