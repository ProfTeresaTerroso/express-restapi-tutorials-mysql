const sql = require("./db.js");

// constructor
const Tutorial = function (tutorial) {
    this.title = tutorial.email;
    this.description = tutorial.description;
    this.published = tutorial.published;
};

//RESULT will have an "(error, data)", meaning it will return either an error message or some sort of data
Tutorial.getAll = (title, result) => {
 
    let queryStr = "SELECT * FROM tutorials";
    // filter data IF title variable is not null
    if (title)
        queryStr += " WHERE title LIKE ?";

    sql.query(queryStr, [`%${title}%`],
        (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            // not found Tutorials within the specified title filter: setup a new error property 'kind'
            if (res.length === 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            result(null, res);
        });
};

Tutorial.create = (newTutorial, result) => {
    sql.query("INSERT INTO tutorials SET ?", newTutorial, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        //console.log("created tutorial: ", { id: res.insertId, newTutorial });
        result(null, res);
    });
};

Tutorial.findById = (id, result) => {
    // AVOID building queries like this: `SELECT * FROM tutorials WHERE id = ${id}`
    sql.query('SELECT * FROM tutorials WHERE id = ?', [id], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        // if length of results is greater than 0, means that one tutorial was found
        if (res.length) {
            result(null, res[0]);
            return;
        }

        // not found Tutorial with the specified ID: setup a new error property 'kind'
        result({ kind: "not_found" }, null);
    });
};

Tutorial.updateById = (idTutorial, tutorial, result) => {

    // OR let query = 'UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?';
    let query = 'UPDATE tutorials SET ? WHERE ?';

    let q = sql.query(
        query,
        // OR [tutorial.title, tutorial.description, tutorial.published, id]
        [tutorial, {id: idTutorial}], // objects are turned into key = 'val' pairs for each enumerable property
        (err, res) => {
            
            //console.log(q.sql); // to check the query string

            if (err) {
                result(err, null);
                return;
            }
            // res.affectedRows: number of selected rows to update
            // res.changedRows: number of effectively updated rows
            
            // not found Tutorials with the specified ID: setup a new error property 'kind'
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            result(null, res);
        });
};

Tutorial.remove = (id, result) => {
    sql.query("DELETE FROM tutorials WHERE id = ?", id, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        // affectedRows informs about the number of record(s) deleted
        if (res.affectedRows == 0) {
            // not found Tutorials with the specified ID: setup a new error property 'kind'
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, res);
    });
};


Tutorial.getAllPublished = result => {
    sql.query("SELECT * FROM tutorials WHERE published = true", (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};


// Export model
module.exports = Tutorial;