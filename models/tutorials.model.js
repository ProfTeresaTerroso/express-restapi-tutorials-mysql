const sql = require("./db.js");

// constructor
const Tutorial = function (tutorial) {
    this.title = tutorial.email;
    this.description = tutorial.description;
    this.published = tutorial.published;
};

//RESULT will have an "(error, data)", meaning it will return either an error message or some sort of data
Tutorial.getAll = (title, result) => {
    // console.log(title)

    // const existingParams = ["title"].filter(field => query[field]);
    // // console.log(existingParams)
    // // console.log(existingParams.map(field => `${field} LIKE ?`))
    // // console.log(existingParams.map(field => query[field]))

    // if (existingParams.length) {
    //     queryStr += " WHERE ";
    //     queryStr += existingParams.map(field => `${field} LIKE ?`).join(" AND ");
    // }
    // existingParams.map(field => `%${query[field]}%`),
    // // existingParams.map(field => query[field]),

    // Tutorial.getAll = ( result) => {
    let queryStr = "SELECT * FROM tutorials";

    if (title)
        queryStr += " WHERE title LIKE ?";
    // console.log(queryStr)

    sql.query(queryStr, [`%${title}%`],
        (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            // console.log(res)
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
    // sql.query(`SELECT * FROM tutorials WHERE id = ${id}`, (err, res) => {
    sql.query('SELECT * FROM tutorials WHERE id = ?', [id], (err, res) => {
        //console.log(err, res)
        if (err) {
            result(err, null);
            return;
        }
        // if length of results is greater than 0, means that one tutorial was found
        if (res.length) {
            result(null, res[0]);
            return;
        }

        // not found Tutorial with the id: setup a new error property 'kind'
        result({ kind: "not_found" }, null);
    });
};

Tutorial.updateById = (id, tutorial, result) => {
    //console.log(tutorial, id)
    let query = 'UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?';
    sql.query(
        query,
        [tutorial.title, tutorial.description, tutorial.published, id],
        (err, res) => {
            if (err) {
                // console.log("error: ", err);
                result(err, null);
                return;
            }
            // console.log(res.changedRows + " record(s) updated");
            // not found Tutorial with the id
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
        console.log(res.affectedRows)
        // affectedRows informs about the number of record(s) deleted
        if (res.affectedRows == 0) {
            // not found Tutorial with the id
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


Tutorial.getAllByTitle = (title, result) => {
    sql.query("SELECT * FROM tutorials WHERE title LIKE ?", `%${title}%`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};

// Export model
module.exports = Tutorial;