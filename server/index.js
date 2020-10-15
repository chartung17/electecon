const express = require('express');
const bodyParser = require('body-parser');
const routes = require("./routes.js");
const cors = require('cors');
const router = express();

require('dotenv').config()
const hostname = process.env.HOST || "localhost";
const port = process.env.PORT || "5000";

router.use(cors())  // all origins
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

/********************* ROUTES *********************/

const API_V1 = "/api/v1";

// County page routes
router.get(API_V1 + '/county/counties', routes.getCounties);
router.get(API_V1 + '/county/elections', routes.getElections);
router.get(API_V1 + '/county/annual-gdp', routes.getAnnualGDP);
router.get(API_V1 + '/county/top-industry', routes.getTopIndustry);
router.get(API_V1 + '/county/growing-industry', routes.getGrowingIndustry);

// Map page routes
router.get(API_V1 + '/map/counties', routes.getAllCounties);
router.get(API_V1 + '/map/parties', routes.getParties);
router.get(API_V1 + '/map/rep-dem-diff', routes.getRepDemDiff);
router.get(API_V1 + '/map/dem-votes', routes.getDemVotes);
router.get(API_V1 + '/map/rep-votes', routes.getRepVotes);
router.get(API_V1 + '/map/other-votes', routes.getOtherVotes);



// Put last
router.use((req, res, next) => {
    res.status(404).json(
        {"status": 404, "message": "Resource not found."}
    );
});
router.listen(port, hostname, () => {
    console.log(`Server listening at http://${hostname}:${port}`);
});
