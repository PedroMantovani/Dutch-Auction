var express = require('express');
var router = express.Router();

/* GET leilão listing. */
router.get('/:id', function (req, res, next) {
    console.log(req.user)
    res.render('pageleilao', { title: 'Leilão Holandes - Item Leilão' });
});

module.exports = router;
