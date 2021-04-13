const Tutorial = require('../models/tutorials.model.js');


// Display list of all tutorials
exports.findAll = (req, res) => {

    if (Object.keys(req.query).length) { // this will run when your req.query is 'NOT EMPTY'
        if (!req.query.title) {
            res.status(400).json({ message: "Tutorials can only by filtered by title!" });
            return;
        }
    }
   
    Tutorial.getAll(req.query.title, (err, data) => {
        if (err) {
            if (err.kind === "not_found")
                res.status(404).json({
                    message: 'Not found Tutorial with specified filter.'
                });
            else
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving tutorials."
                });
        }
        else
            res.status(200).json(data); // all is OK, send response data back to client
    });

};

// Handle tutorial creation on POST
exports.create = (req, res) => {
    // Validate request
    if (!req.body || !req.body.title) {
        res.status(400).json({ message: "Title can not be empty!" });
        return;
    }

    // Create a Tutorial object
    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    };

    // Save Tutorial in the database
    Tutorial.create(tutorial, (err, data) => {
        if (err)
            res.status(500).json({
                message: err.message || "Some error occurred while creating the Tutorial."
            });
        else{
            // all is OK, send new tutorial ID in the response
            res.status(201).json({ message: "New tutorial created.", location: "/tutorials/" + data.insertId });
        } 
            
    });
};

// List just one tutorial
exports.findOne = (req, res) => {
    Tutorial.findById(req.params.tutorialID, (err, data) => {
        if (err) {
            if (err.kind === "not_found")
                res.status(404).json({
                    message: `Not found Tutorial with id ${req.params.tutorialID}.`
                });
            else
                res.status(500).json({
                    message: `Error retrieving Tutorial with id ${req.params.tutorialID}.`
                });
        } else
            res.status(200).json(data); // all is OK, send response data back to client
    });
};

exports.update = (req, res) => {
    // Validate request
    if (!req.body || !req.body.title) {
        res.status(400).json({ message: "Request can not be empty!" });
        return;
    }

    // Create a Tutorial object
    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    };

    // Update Tutorial in the database
    Tutorial.updateById(req.params.tutorialID, tutorial, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).json({
                    message: `Not found Tutorial with id ${req.params.tutorialID}.`
                });
            } else {
                res.status(500).json({
                    message: "Error updating Tutorial with id " + req.params.tutorialID
                });
            }
        } else res.status(200).json({ message: "Updated tutorial.", location: `/tutorials/${req.params.tutorialID}` });
    });
};

exports.delete = (req, res) => {
    Tutorial.remove(req.params.tutorialID, (err, data) => {
        console.log(err, data)
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).json({
                    message: `Not found Tutorial with id ${req.params.tutorialID}.`
                });
            } else {
                res.status(500).json({
                    message: `Could not delete Tutorial with id ${req.params.tutorialID}.`
                });
            }
            return;
        } 
        res.status(200).json({ message: `Tutorial with id ${req.params.tutorialID} was successfully deleted!` });
        // res.status(204).json({}); //when using a status code 204, must send a NO CONTENT answer
    });
};

// Display list of all published tutorials
exports.findAllPublished = (req, res) => {
    Tutorial.getAllPublished((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message ||  "Some error occurred while retrieving tutorials."
            });
        else {
            res.status(200).json(data); // all is OK, send response data back to client
        }
    });
};