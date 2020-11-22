let mysql = require('mysql');
require('dotenv').config()
let pool = mysql.createPool({
    connectionLimit: process.env.DB_MAX_CONNECTIONS || 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DEFAULT_DATABASE,
});

let useCache = true;
let NodeCache = require('node-cache');
let cache = new NodeCache({
    stdTTL: 15 * 60,         // expire after 15 mins
    checkPeriod: 10 * 60     // evict every 10 mins
});

/**
 * Executes given query and sets the response's body;
 *
 * @param query SQL query string
 * @param res   response body
 */
function execQuery(query, res) {
    let value = useCache ? cache.get(query) : undefined;

    if (value === undefined) {
        pool.query(query, function (err, rows, fields) {
            if (err) console.error(err);
            else {
                if (useCache) {
                    cache.set(query, rows)
                }
                res.json(rows);
            }
        });
    } else {
        res.json(value);
    }
}

module.exports = {
    pool: pool,
    execQuery: execQuery
};
