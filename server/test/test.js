require('mocha')
let assert = require('assert')
let request = require('supertest')

const hostname = process.env.API_HOST || "localhost";
const port = process.env.API_PORT || "5000";

describe('Server tests', () => {
    request = request(`http://${hostname}:${port}`);

    it('should return the correct counties', () => {
        let query_list = [
            "/api/v1/county/counties?state=AL,AZ&fips=01001,01005,04017",
            "/api/v1/county/counties?fips=04017",
            "/api/v1/county/counties?state=TX&page=2&page_size=5",
            "/api/v1/county/counties?state=NYC",
            "/api/v1/county/counties?fips=123456",
            "/api/v1/county/counties?state=NY OR 1=1",
            "/api/v1/county/counties?state=;DROP TABLE County;"
        ]
        let expected_list = [
            [
                {FIPS: '01001', NAME: 'Autauga', STATE: 'AL'},
                {FIPS: '01005', NAME: 'Barbour', STATE: 'AL'},
                {FIPS: '04017', NAME: 'Navajo', STATE: 'AZ'}
            ],
            [
                {FIPS: '04017', NAME: 'Navajo', STATE: 'AZ'}
            ],
            [
                {FIPS: "48011", NAME: "Armstrong", STATE: "TX"},
                {FIPS: "48013", NAME: "Atascosa", STATE: "TX"},
                {FIPS: "48015", NAME: "Austin", STATE: "TX"},
                {FIPS: "48017", NAME: "Bailey", STATE: "TX"},
                {FIPS: "48019", NAME: "Bandera", STATE: "TX"}
            ],
            [], [], [], [], [{FIPS:"66010",NAME:"Guam",STATE:"GU"}]
        ];
        query_and_compare(query_list, expected_list);
    });

    it('should return correct election data', (done) => {
        let query_list = [
            "/api/v1/county/elections?fips=01005",
            "/api/v1/county/elections?fips=01005a",
            "/api/v1/county/elections?fips=72001",
        ]
        let expected_list = [
            [{"YEAR":2016,"CANDIDATE_NAME":"Hillary Clinton","PARTY":"Democrat","CANDIDATE_VOTES":4871},{"YEAR":2016,"CANDIDATE_NAME":"Donald Trump","PARTY":"Republican","CANDIDATE_VOTES":5454},{"YEAR":2012,"CANDIDATE_NAME":"Barack Obama","PARTY":"Democrat","CANDIDATE_VOTES":5912},{"YEAR":2012,"CANDIDATE_NAME":"Mitt Romney","PARTY":"Republican","CANDIDATE_VOTES":5550},{"YEAR":2008,"CANDIDATE_NAME":"Barack Obama","PARTY":"Democrat","CANDIDATE_VOTES":5697},{"YEAR":2008,"CANDIDATE_NAME":"John McCain","PARTY":"Republican","CANDIDATE_VOTES":5866},{"YEAR":2004,"CANDIDATE_NAME":"John Kerry","PARTY":"Democrat","CANDIDATE_VOTES":4832},{"YEAR":2004,"CANDIDATE_NAME":"George W. Bush","PARTY":"Republican","CANDIDATE_VOTES":5899},{"YEAR":2000,"CANDIDATE_NAME":"Al Gore","PARTY":"Democrat","CANDIDATE_VOTES":5188},{"YEAR":2000,"CANDIDATE_NAME":"George W. Bush","PARTY":"Republican","CANDIDATE_VOTES":5096}]
            ,[],[]
        ];
        query_and_compare(query_list, expected_list);
        done();
    });

    it('should return correct annual gdp data', (done) => {
        let query_list = [
            "/api/v1/county/annual-gdp?fips=06073",
        ]
        let expected_list = [
            [{"YEAR":2001,"GDP":116021968},{"YEAR":2002,"GDP":123862997},{"YEAR":2003,"GDP":133300496},{"YEAR":2004,"GDP":144536761},{"YEAR":2005,"GDP":156046122},{"YEAR":2006,"GDP":163692662},{"YEAR":2007,"GDP":170213703},{"YEAR":2008,"GDP":170208804},{"YEAR":2009,"GDP":165603479},{"YEAR":2010,"GDP":168319438},{"YEAR":2011,"GDP":174514254},{"YEAR":2012,"GDP":180338029},{"YEAR":2013,"GDP":191511760},{"YEAR":2014,"GDP":201195988},{"YEAR":2015,"GDP":213188361},{"YEAR":2016,"GDP":219932669},{"YEAR":2017,"GDP":230789437},{"YEAR":2018,"GDP":245138815}]
        ];
        query_and_compare(query_list, expected_list);
        done();
    });

    it('should return correct top industry data', (done) => {
        let query_list = [
            "/api/v1/county/top-industry?fips=06001",
        ]
        let expected_list = [
            [{"Description":"Real estate and rental and leasing","GDP":22078540},{"Description":"Government and government enterprises","GDP":16153990},{"Description":"Professional, scientific, and technical services","GDP":15135562},{"Description":"Information","GDP":13074123},{"Description":"Durable goods manufacturing","GDP":11068874}],
        ];
        query_and_compare(query_list, expected_list);
        done();
    });

    it('should return correct growing industry data', (done) => {
        let query_list = [
            "/api/v1/county/growing-industry?fips=53033",
        ]
        let expected_list = [
            [
                { Description: 'Retail trade', Growth: 7.58 }, { Description: 'Information', Growth: 7 }, { Description: 'Accommodation and food services', Growth: 6.17 }, { Description: 'Health care and social assistance', Growth: 5.81 }, { Description: 'Professional, scientific, and technical services', Growth: 5.72 }
            ]
        ];
        query_and_compare(query_list, expected_list);
        done();
    });

    function query_and_compare(query_list, expected_list){
        for (let i = 0; i < query_list.length; i++) {
            request.get(query_list[i]).expect(200, (err, res) => {
                if (err) done(err);
                let expected = expected_list[i];
                let actual = res.body;

                assert(res.body !== undefined);
                assert(expected.length === actual.length)
                for (let j = 0; j < expected.length; j++) {
                    let keys = Object.keys(expected[j])
                    for (let k = 0; k < keys.length; k++) {
                        assert(expected[j][keys[k]] === actual[j][keys[k]])
                    }
                }
            });
        }
    }
})
