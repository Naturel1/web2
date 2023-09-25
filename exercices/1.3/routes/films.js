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
    return res.json(films.filter(film => film.duration >= req.query["minimum-duration"]));
  }
});

// Read one film
router.get('/:id', function (req, res) {
  return res.json(films.find(film => film.id === parseInt(req.params.id)));
});

// Post a new film
router.post('/', function (req, res) {
  const title = req?.body?.title?.length !== 0 ? req.body.title : undefined;
  const duration = req?.body?.duration?.length!== 0 ? req.body.duration : undefined;
  const budget = req?.body?.budget?.length!== 0? req.body.budget : undefined;
  const link = req?.body?.link?.length!== 0? req.body.link : undefined;

  if (!title || !duration || !budget || !link) { return res.status(400)};

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
