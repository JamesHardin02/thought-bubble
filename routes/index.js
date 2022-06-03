// import express router and api routes
const router = require('express').Router();
const apiRoutes = require('./api/index');

router.use('/api', apiRoutes);

// for routes that don't exist
router.use((req, res) => {
    res.status(404).json('This route does not exist!');
});

module.exports = router;