module.exports = ({
    filtersGateway,
    statusesGateway,
    issuesGateway
}) => async (request, response, next) => {

    const filters = await filtersGateway.findAll();

    const statuses = await statusesGateway.findAll();

    const issues = await issuesGateway.findAll({
        filter: request.query.filter
    });

    const users = {};
    for (const issue of issues.issues) {
        if (!issue.fields.assignee) continue
        const accountId = issue.fields.assignee.accountId;

        if (!users[accountId]) {
            users[accountId] = {
                issues: {},
                displayName: issue.fields.assignee.displayName
            };

            statuses.forEach((status) => users[accountId].issues[status.name] = 0)
        }

        users[accountId].issues[issue.fields.status.name] += 1;
    }

    response.render("main-page", {
        filters: filters.values,
        statuses,
        users
    })
}