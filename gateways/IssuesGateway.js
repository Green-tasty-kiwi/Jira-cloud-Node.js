module.exports = class IssuesGateway {
    constructor({ jiraService }) {
        this._jiraService = jiraService;
    }

    findAll({
        filter
    }) {
        return this._jiraService.send({
            url: '/search',
            queryString: `jql=filter=${filter}&fields=status,assignee`,
        })
    }
}