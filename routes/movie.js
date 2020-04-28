const express = require("express");
const router = express.Router();
const fs = require("fs");

const movies = [
  {
    id: "1",
    title: "Lord of the Rings: The Fellowship of the Ring",
    year: "2001",
    runtime: "2h 58min",
    genre: "fantasy",
    image: { url: "../images/lord-of-rings-fellowship.jpg" },
  },
  {
    id: "2",
    title: "Lord of the Rings: The Two Towers",
    year: "2002",
    runtime: "2h 59min",
    genre: "fantasy",
    image: { url: "../images/lord-of-rings-towers.jpg" },
  },
  {
    id: "3",
    title: "Lord of the Rings: The Return of the King",
    year: "2003",
    runtime: "3h 21min",
    genre: "fantasy",
    image: { url: "../images/lord-of-rings-return.jpg" },
  },
  {
    id: "4",
    title: "Love Actually",
    year: "2003",
    runtime: "2h 15min",
    genre: "romance",
    image: { url: "../images/love-actually.jpg" },
  },
];

fs.writeFile("movies.json", JSON.stringify(movies), function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("The file was saved!");
});

router.get("/:id", (req, res) => {
  if (req.params.id === "all") {
    res.status(200).json(movies);
  } else {
    const reqMovieId = req.params.id;
    const correctMovie = movies.find((movie) => movie.id === reqMovieId);
    if (correctMovie) {
      res.status(200).json(correctMovie);
    } else {
      res.status(500).json("error: can't find the movies you were looking for");
    }
  }
});

router.get("/genre/:genre", (req, res) => {
  const genre = req.params.genre;
  const isGenre = movies.filter(
    (movie) => movie.genre.toLowerCase() === genre.toLowerCase()
  );
  if (isGenre.length > 0) {
    res.status(200).json(isGenre);
  } else {
    res.status(500).json("not a valid genre");
  }
});

router.get("/search/:search", (req, res) => {
  const search = req.params.search;
  const results = movies.filter((movie) =>
    String(Object.values(movie)).toLowerCase().includes(search.toLowerCase())
  );
  if (results.length > 0) {
    res.status(200).json(results);
  } else {
    res.status(500).json("your search came up empty");
  }
});

router.post("/", (req, res) => {
  const reqBodyKeys = Object.keys(req.body);
  const movie = Object.keys(movies[0]);
  if (JSON.stringify(reqBodyKeys) === JSON.stringify(movie)) {
    movies.push(req.body);
    res.status(200).json(`${req.body.title} has been added to movies`);
  } else {
    res.status(500).json("not a valid movie");
  }
});

router.put("/", (req, res) => {
  const updatedMovie = req.body;
  const correctMovieIndex = movies.findIndex(
    (movie) => updatedMovie.id === movie.id
  );
  if (correctMovieIndex !== -1) {
    const correctMovie = movies.find((movie) => movie.id === updatedMovie.id);
    const updatedMovieKeys = Object.keys(updatedMovie);
    const correctMovieKeys = Object.keys(correctMovie);
    let difference = correctMovieKeys.filter(
      (key) => !updatedMovieKeys.includes(key)
    );
    movies[correctMovieIndex] = updatedMovie;
    if (difference.length > 0) {
      res
        .status(200)
        .json(
          `${JSON.stringify(difference)} was added to ${correctMovie.title}`
        );
    } else {
      res.status(200).json(`${correctMovie.title} was updated`);
    }
  } else {
    res.status(500).json("this isn't a movie we have");
  }
});

router.delete("/", (req, res) => {
  const movieToBeDeleted = req.body;
  const correctMovieIndex = movies.findIndex(
    (movie) => movieToBeDeleted.id === movie.id
  );
  if (correctMovieIndex !== -1) {
    movies.splice(correctMovieIndex, 1);
    res
      .status(200)
      .json(`${movieToBeDeleted.title} has been removed from movies`);
  } else {
    res.status(500).json("this isn't a movie we have");
  }
});

module.exports = router;
