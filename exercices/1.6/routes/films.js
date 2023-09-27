var express = require('express');
var router = express.Router();

const films = [
  {
    id: 1,
    title: 'Star Wars: The Phantom Menace (Episode I)',
    duration: 136,
    budget: '115',
    link: 'https://en.wikipedia.org/wiki/Star_Wars:_Episode_I_%E2%80%93_The_Phantom_Menace',
  },
  {
    id: 2,
    title: 'Star Wars: Episode II – Attack of the Clones',
    duration: 142,
    budget: 115,
    link: 'https://en.wikipedia.org/wiki/Star_Wars:_Episode_II_%E2%80%93_Attack_of_the_Clones',
  },
  {
    id: 3,
    title: "Zack Snyder's Justice League",
    duration: 242,
    budget: 70,
    link: 'https://en.wikipedia.org/wiki/Zack_Snyder%27s_Justice_League',
  },
];

// Read all the films
router.get('/', function (req, res) {
  if (req.query["minimum-duration"] === undefined) {
    return res.json(films);
  } else {
    const minimumDuration = parseInt(req.query["minimum-duration"]);
    if (isNaN(minimumDuration) || minimumDuration <= 0){
      return res.sendStatus(400);
    } else {
      return res.json(films.filter(film => film.duration >= req.query["minimum-duration"]));
    };
  };
});

// Read one film
router.get('/:id', function (req, res) {
  if (req.params.id === undefined) {
    return res.sendStatus(400);
  }else if (req.params.id < 1 || req.params.id > films.length) {res.sendStatus(404)};
    return res.json(films.find(film => film.id === parseInt(req.params.id)));
});

// Delete one film
router.delete('/:id', function (req, res) {
  const filmIndex = films.findIndex(film => film.id === parseInt(req.params.id));
  if (isNaN(filmIndex) || filmIndex === undefined) {
    return res.sendStatus(400);
  }else if (filmIndex < 1 || filmIndex > films.length) {res.sendStatus(404)};

  const filmDeleted = films.splice(filmIndex, 1);

  return res.json(filmDeleted[0]);

});

// Modifie one film
router.patch('/:id', function (req, res) {
  const filmIndex = films.findIndex(film => film.id === parseInt(req.params.id));
  if (isNaN(filmIndex) || filmIndex === undefined) {
    return res.sendStatus(400);
  }else if (filmIndex < 1 || filmIndex > films.length) {res.sendStatus(404)};

  const title = req?.body?.title;
  const duration = req?.body?.duration;
  const budget = req?.body?.budget;
  const link = req?.body?.link;

  if (!title && !duration && !budget && !link) { return res.sendStatus(400)};
  if (title?.length === 0 || duration?.length === 0 || budget?.length === 0 || link?.length === 0) { return res.sendStatus(400)};

  const updatedFilm = {...films[filmIndex], ...req.body };
  films[filmIndex] = updatedFilm;

  res.json(updatedFilm);
});

// Create or modifiy a film
router.put('/:id', function (req, res) {
  const filmIndex = films.findIndex(film => film.id === parseInt(req.params.id));
  if (isNaN(filmIndex) || filmIndex === undefined) {
    return res.sendStatus(400);
  }else if (filmIndex < 1) {res.sendStatus(404)};

  const title = req?.body?.title?.length !== 0 ? req.body.title : undefined;
  const duration = req?.body?.duration?.length !== 0 ? req.body.duration : undefined;
  const budget = req?.body?.budget?.length !== 0 ? req.body.budget : undefined;
  const link = req?.body?.link?.length !== 0 ? req.body.link : undefined;

  if (!title && !duration && !budget && !link) { return res.sendStatus(400)};
  if (title?.length === 0 || duration?.length === 0 || budget?.length === 0 || link?.length === 0) { return res.sendStatus(400)};

  if (films[filmIndex]) {
    const updatedFilm = {...films[filmIndex], ...req.body };
    films[filmIndex] = updatedFilm;
  
    res.json(updatedFilm);
  }else{
    const filmExisting = films.find(film => film.title === title)
    if ( filmExisting ) { return res.sendStatus(409)};

    films.push({
      id: parseInt(req.params.id),
      title: title,
      duration: duration,
      budget: budget,
      link: link,
    });
  
    return res.json(films);
  }

});

// Post a new film
router.post('/', function (req, res) {
  const title = req?.body?.title?.length !== 0 ? req.body.title : undefined;
  const duration = req?.body?.duration?.length !== 0 ? req.body.duration : undefined;
  const budget = req?.body?.budget?.length !== 0 ? req.body.budget : undefined;
  const link = req?.body?.link?.length !== 0 ? req.body.link : undefined;

  if (!title || !duration || !budget || !link) { return res.sendStatus(400)};

  const filmExisting = films.find(film => film.title === title)
  if ( filmExisting ) { return res.sendStatus(409)};

  const lastItemIndex = films?.length !== 0 ? films.length - 1 : undefined;
  const lastId = lastItemIndex !== undefined ? films[lastItemIndex]?.id : 0;
  const nextId = lastId + 1;

  films.push({
    id: nextId,
    title: title,
    duration: duration,
    budget: budget,
    link: link,
  });

  return res.json(films);
});
module.exports = router;
