const express = require('express');
const router = express.Router();
const createAddonInstallHandler = require('./jira/createAddonInstallHandler');

module.exports = ({ database }) => {
    router.all('/installed', createAddonInstallHandler(({ database })))

    return router;
}
