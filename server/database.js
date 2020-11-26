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
    execQueryRow(query).then((rows) => {
        res.json(rows);
    });
}

/**
 * Executes given query and sets the response's body;
 *
 * @param query SQL query string
 * @param res   response body
 */
function execQueryRow(query) {
    return new Promise(function (resolve, reject) {
        let value = useCache ? cache.get(query) : undefined;

        if (value !== undefined) {
            resolve(value)
        } else {
            pool.query(query, function (err, rows, fields) {
                if (err) return reject(err)
                if (useCache) cache.set(query, rows)
                resolve(rows);
            });
        }
    })
}

module.exports = {
    pool: pool,
    execQuery: execQuery,
    execQueryRow: execQueryRow
};
