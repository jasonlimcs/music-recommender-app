const utils = require('./utils/utils.js');
const ejs = require('ejs');

const express = require('express');
const path = require('path');
const app = express();

const PORT = 8080;
const VIEWS_FOLDER = path.join(__dirname, "views/");

app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static("../node_modules/bootstrap/dist/css"));

app.listen(PORT, () => {    
    console.log(`Server listening on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.render(VIEWS_FOLDER + "index.html", {trackNames: utils.tracks});
});

app.post('/recommendSongs', (req, res) => {
    const inputSong = req.body.song.split('[')[0].trim();
    const recommendedSongs = utils.recommendSongs(utils.__dataset, inputSong);
    res.render(VIEWS_FOLDER + "recommendations.html", {recommendedSongs: recommendedSongs});
    // res.send(recommendedSongs);
});