module.exports = class FiltersGateway {
    constructor({ jiraService }) {
        this._jiraService = jiraService;
    }

    findAll() {
        return this._jiraService.send({ url: '/status' })
    }


}