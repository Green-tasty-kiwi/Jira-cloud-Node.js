const config = require('../../config')

module.exports = ({
    database
}) => (request, response, next) => {
    const { clientKey } = request.body;

    database.collection(config.JiraAccountInfoStore)
        .findOne({ "installed.clientKey": clientKey }, function (error, result) {
            if (error) console.log(error);

            if (!result) {
                database
                    .collection(config.JiraAccountInfoStore)
                    .insertOne(request.body, async (error) => {
                        if (error) throw error;
                        next();
                    });

                return;
            }

            database
                .collection(config.JiraAccountInfoStore)
                .updateOne(
                    { "installed.clientKey": clientKey },
                    { $set: request.body },
                    () => next()
                );
        });
}