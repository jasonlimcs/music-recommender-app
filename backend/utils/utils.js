
const path = require('path');
const csv = require('jquery-csv');
const fs = require('fs');


const songDataPath = path.join(__dirname, '../artifacts/song_data.csv');
const trackNamesPath = path.join(__dirname, '../artifacts/track_names.csv');
const tracksPath = path.join(__dirname, '../artifacts/tracks.csv');


const csvData = fs.readFileSync(songDataPath, 'utf8');
// console.log(csvData)

let __dataset = csv.toObjects(csvData);

function cosineSimilarity(vectorA, vectorB) {
    const dotProduct = vectorA.reduce((sum, val, idx) => sum + val * vectorB[idx], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, val) => sum + val ** 2, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val ** 2, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

function recommendSongs(dataset, inputSong, n = 10) {
    if (!dataset || dataset.length === 0) {
        alert("Dataset is empty! Please process a CSV file first.");
        return;
    }

    const features = [
        "bpm", "danceability_%", "valence_%", "energy_%",
        "acousticness_%", "instrumentalness_%", "liveness_%", "speechiness_%"
    ];

    // Find the input song in the dataset
    const inputRow = dataset.find(row => row.track_name.toLowerCase() === inputSong.toLowerCase());
    if (!inputRow) {
        return `Song '${inputSong}' not found in the dataset.`;
    }

    const inputFeatures = features.map(feature => parseFloat(inputRow[feature]));

    // Compute similarity for all songs
    const similarities = dataset.map(row => {
        const rowFeatures = features.map(feature => parseFloat(row[feature]));
        return {
            track_name: row.track_name,
            artist_name: row["artist(s)_name"],
            similarity: cosineSimilarity(inputFeatures, rowFeatures)
        };
    });

    // Sort by similarity and exclude the input song itselfS
    const recommendations = similarities
        .filter(row => row.track_name.toLowerCase() !== inputSong.toLowerCase())
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, n);

    return recommendations;
}

const trackNames = fs.readFileSync(trackNamesPath, 'utf8').split("\n").splice(1);
const tracks = fs.readFileSync(tracksPath, 'utf8').split("\n").splice(1);



module.exports = {
    recommendSongs,
    trackNames,
    __dataset,
    tracks
};