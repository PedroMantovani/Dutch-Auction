const express = require('express');
const axios = require('axios');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  // res.render('index', { title: 'Leilão Holandes - Início' });

  axios.get('https://connector.sapios.com.br/v1/storages/625b2207bddba65ac91ddb44/dutch')
    .then(function (response) {
      res.render('index', { title: 'Leilão Holandes - Início', leilao: response.data });
    })
    .catch(function (error) {
      res.render('index', { title: 'Leilão Holandes - Início' });
    })

});

module.exports = router;
