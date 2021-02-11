const axios = require('axios');

module.exports = class JiraService {
    constructor({
        apiUsername,
        apiToken,
        apiUrl,
    }) {
        this._apiUsername = apiUsername;
        this._apiToken = apiToken;
        this._apiUrl = apiUrl;
    }

    async send({
        url,
        queryString,
        method = 'GET',
    }) {
        if (queryString) {
            url = `${url}?${queryString}`
        }

        try {
            const response = await axios({
                url: `${this._apiUrl}${url}`,
                method,
                headers: {
                    'Authorization': `Basic ${Buffer.from(
                        `${this._apiUsername}:${this._apiToken}`
                    ).toString('base64')}`,
                    'Accept': 'application/json'
                },
            });

            return response.data

        } catch (error) {
            console.log('error: ', error.response)
        }
    }
}