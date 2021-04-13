const express = require('express');

const tutorialController = require("../controllers/tutorials.controller");

// express router
let router = express.Router();

router.use((req, res, next) => {
    const start = Date.now();
    //compare a start time to an end time and figure out how many seconds elapsed
    res.on("finish", () => { // the finish event is emitted once the response has been sent to the client
        const end = Date.now();
        const diffSeconds = (Date.now() - start) / 1000;
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

// Use router.route() to avoid duplicate route naming and thus typing errors
// This approach re-uses the single 'tutorials/' path and adds handlers for various HTTP methods
router.route('/')
    .get(tutorialController.findAll) // this route will capture requests with query strings
    .post(tutorialController.create);

// // Above is the same as
// router.get('/', tutorialController.findAll);
// router.post('/', tutorialController.create);

//needs to be BEFORE route /:tutorialID (otherwise, "published" string will be treated as an ID)
router.route('/published')
    .get(tutorialController.findAllPublished)

router.route('/:tutorialID')
    .get(tutorialController.findOne)
    .put(tutorialController.update)
    .delete(tutorialController.delete);

// this route is only hitted when none of the above is captured
// 'all' means that acceptes all HTTP methods (verbs)
router.all('*', function (req, res) {
    //send an predefined error message 
    res.status(404).json({ message: 'TUTORIALS: invalid request' });
})

module.exports = router;