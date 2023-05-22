const express = require('express');
const router = express.Router();

const configs = require('../util/config')

let visits = 0
let test = 4

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits,
    test,
  });
});

module.exports = router;
