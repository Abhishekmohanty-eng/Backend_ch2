const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;
let db;

(async () => {
  db = await open({
    filename: "tracks_database.sqlite",
    driver: sqlite3.Database,
  });
})();

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD4.1 HW2 Template" });
});

// YOUR ENDPOINTS GO HERE
/**
Exercise 1: Retrieve All Tracks

Define the endpoint /tracks to retrieve all music tracks.

Define the function name fetchAllTracks which returns all tracks from the database.

API call

http://localhost:3000/tracks

Expected Output

{
  'tracks': [
    {
      id: 1,
      title: 'Raabta',
      genre: 'Romantic',
      release_year: 2012,
      artist: 'Arijit Singh',
    },
    {
      id: 2,
      title: 'Naina Da Kya Kasoor',
      genre: 'Pop',
      release_year: 2018,
      artist: 'Amit Trivedi',
    },
    {
      id: 3,
      title: 'Ghoomar',
      genre: 'Traditional',
      release_year: 2018,
      artist: 'Shreya Ghoshal',
    },
    {
      id: 4,
      title: 'Bekhayali',
      genre: 'Rock',
      release_year: 2019,
      artist: 'Sachet Tandon',
    },
    {
      id: 5,
      title: 'Hawa Banke',
      genre: 'Romantic',
      release_year: 2019,
      artist: 'Darshan Raval',
    },
    {
      id: 6,
      title: 'Ghungroo',
      genre: 'Dance',
      release_year: 2019,
      artist: 'Arijit Singh',
    },
    {
      id: 7,
      title: 'Makhna',
      genre: 'Hip-Hop',
      release_year: 2019,
      artist: 'Tanishk Bagchi',
    },
    {
      id: 8,
      title: 'Tera Ban Jaunga',
      genre: 'Romantic',
      release_year: 2019,
      artist: 'Tulsi Kumar',
    },
    {
      id: 9,
      title: 'First Class',
      genre: 'Dance',
      release_year: 2019,
      artist: 'Arijit Singh',
    },
    {
      id: 10,
      title: 'Kalank Title Track',
      genre: 'Romantic',
      release_year: 2019,
      artist: 'Arijit Singh',
    },
  ]
}
*/

async function fetchAllTracks(){
  try {
    const tracks = await db.all("SELECT * FROM tracks");
    return tracks;
  } catch (err) {
    console.error("Error fetching tracks:", err.message);
    throw err;
  }
}

app.get("/tracks", async (req, res) => {
  try {
    if (!db) {
      await initializeDb();
    }
    let results = await fetchAllTracks();
    res.status(200).json({ tracks: results });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/**
Exercise 2: Retrieve Tracks by Artist

Define the endpoint /tracks/artist/:artist to retrieve tracks by a specific artist.

Define the function name fetchTracksByArtist which returns tracks for a given artist from the database.

API call

http://localhost:3000/tracks/artist/Arijit%20Singh

Expected Output

{
  'tracks': [
    { 'id': 1, 'title': 'Raabta', 'genre': 'Romantic', 'release_year': 2012, 'artist': 'Arijit Singh' },
    { 'id': 6, 'title': 'Ghungroo', 'genre': 'Dance', 'release_year': 2019, 'artist': 'Arijit Singh' },
    { 'id': 9, 'title': 'First Class', 'genre': 'Dance', 'release_year': 2019, 'artist': 'Arijit Singh' },
    { 'id': 10, 'title': 'Kalank Title Track', 'genre': 'Romantic', 'release_year': 2019, 'artist': 'Arijit Singh' }
  ]
}
*/
async function fetchTracksByArtist(artist){
  try {
    const tracks = await db.all("SELECT * FROM tracks WHERE artist = ?", artist);
    return tracks;
  } catch (err) {
    console.error("Error fetching tracks by artist:", err.message);
    throw err;
  }
}
app.get("/tracks/artist/:artist", async (req, res) => {
  try {
    if (!db) {
      await initializeDb();
    }
    let results = await fetchTracksByArtist(req.params.artist);
    res.status(200).json({ tracks: results });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/**
Exercise 3: Retrieve Tracks by Genre

Define the endpoint /tracks/genre/:genre to retrieve tracks by genre.

Define the function name fetchTracksByGenre which returns tracks for a given genre from the database.

API call

http://localhost:3000/tracks/genre/Romantic

Expected Output

{
  'tracks': [
    { 'id': 1, 'title': 'Raabta', 'genre': 'Romantic', 'release_year': 2012, 'artist': 'Arijit Singh' },
    { 'id': 5, 'title': 'Hawa Banke', 'genre': 'Romantic', 'release_year': 2019, 'artist': 'Darshan Raval' },
    { 'id': 8, 'title': 'Tera Ban Jaunga', 'genre': 'Romantic', 'release_year': 2019, 'artist': 'Tulsi Kumar' },
    { 'id': 10, 'title': 'Kalank Title Track', 'genre': 'Romantic', 'release_year': 2019, 'artist': 'Arijit Singh' }
  ]
}

Exercise 4: Retrieve Tracks by Release Year

Define the endpoint /tracks/release_year/:year to retrieve tracks by release year.

Define the function name fetchTracksByReleaseYear which returns tracks for a given release year from the database.

API call

http://localhost:3000/tracks/release_year/2019

Expected Output

{
  'tracks': [
    { 'id': 4, 'title': 'Bekhayali', 'genre': 'Rock', 'release_year': 2019, 'artist': 'Sachet Tandon' },
    { 'id': 5, 'title': 'Hawa Banke', 'genre': 'Romantic', 'release_year': 2019, 'artist': 'Darshan Raval' },
    { 'id': 6, 'title': 'Ghungroo', 'genre': 'Dance', 'release_year': 2019, 'artist': 'Arijit Singh' },
    { 'id': 7, 'title': 'Makhna', 'genre': 'Hip-Hop', 'release_year': 2019, 'artist': 'Tanishk Bagchi' },
    { 'id': 8, 'title': 'Tera Ban Jaunga', 'genre': 'Romantic', 'release_year': 2019, 'artist': 'Tulsi Kumar' },
    { 'id': 9, 'title': 'First Class', 'genre': 'Dance', 'release_year': 2019, 'artist': 'Arijit Singh' },
    { 'id': 10, 'title': 'Kalank Title Track', 'genre': 'Romantic', 'release_year': 2019, 'artist': 'Arijit Singh' }
  ]
}


*/

async function fetchTracksByReleaseYear(year){
  try {
    const tracks = await db.all("SELECT * FROM tracks WHERE release_year = ?", year);
    return tracks;
  } catch (err) {
    console.error("Error fetching tracks by release year:", err.message);
    throw err;
  }
}
app.get("/tracks/release_year/:year", async (req, res) => {
  try {
    if (!db) {
      await initializeDb();
    }
    let results = await fetchTracksByReleaseYear(req.params.year);
    res.status(200).json({ tracks: results });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});