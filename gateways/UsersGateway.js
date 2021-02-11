module.exports = class UsersGateway {
    constructor({ jiraService }) {
        this._jiraService = jiraService;
    }

    async findAll() {
        const users = await this._jiraService.send({
            url: '/users/search',
        })

        return users.filter(({ accountType }) => accountType === 'atlassian');
    }


}