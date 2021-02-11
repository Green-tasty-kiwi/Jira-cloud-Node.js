const fs = require("fs");
const express = require('express');
const router = express.Router();
const createMainPageController = require('./createMainPageController')

module.exports = function ({ issuesGateway, filtersGateway, statusesGateway }) {
    router
        .get('/', async function (request, response) {
            response.format({
                'text/html': function () {
                    response.redirect('/atlassian-connect.json');
                },
                'application/json': function () {
                    response.redirect('/atlassian-connect.json');
                }
            });
        });


    router.get('/main-page', createMainPageController({
        issuesGateway,
        filtersGateway,
        statusesGateway,
    }));
    return router;
};

