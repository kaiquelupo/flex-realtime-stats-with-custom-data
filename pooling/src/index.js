const { ACCOUNT_SID, AUTH_TOKEN, WORKSPACE_SID, SERVICE_SID, DOCUMENT_SID } = process.env;

const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);
const { aggregate } = require("./helpers/aggregation");
const { get } = require("./helpers/fetch");


(async () => {

    let isWorking = false;

    setInterval(async () => {

        if(!isWorking) {

            try {

                isWorking = true;

                const tasks = await get(`https://taskrouter.twilio.com/v1/Workspaces/${WORKSPACE_SID}/Tasks`, "tasks", {
                    PageSize: 1000
                });

                const workers = await get(`https://taskrouter.twilio.com/v1/Workspaces/${WORKSPACE_SID}/Workers`, "workers", {
                    PageSize: 1000
                });

                const data = aggregate(tasks, workers);

                await client.sync.services(SERVICE_SID)
                    .documents(DOCUMENT_SID)
                    .update({ data })

            } catch(err) {

                console.log(err);

            } finally {

                isWorking = false;

            }
        }

    }, 5000);

})();
