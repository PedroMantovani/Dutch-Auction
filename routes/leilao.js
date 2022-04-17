var express = require('express');
var router = express.Router();

/* GET leilão listing. */
router.get('/', function (req, res, next) {
    res.render('pageleilao', { title: 'Leilão Holandes - Item Leilão' });
});

module.exports = router;
