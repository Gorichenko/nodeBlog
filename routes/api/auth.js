const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        ok: true
    });
});

router.post('/register', (req, res) => {
    res.json({
       error: true
    });
});

module.exports = router;