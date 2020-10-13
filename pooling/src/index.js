const { ACCOUNT_SID, AUTH_TOKEN, WORKSPACE_SID, SERVICE_SID, TASKS_DOCUMENT_SID, WORKERS_DOCUMENT_SID } = process.env;

const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);
const { countTasksPerBPOandChannel, countWorkersPerBPOandChannel } = require("./helpers/aggregation");
const { pool } = require("./helpers/pooling");
const { get } = require("./helpers/fetch");


(async () => {

    pool(async () => {

        const tasks = await get(`https://taskrouter.twilio.com/v1/Workspaces/${WORKSPACE_SID}/Tasks`, "tasks", {
            PageSize: 500
        });
        
        const data = countTasksPerBPOandChannel(tasks);

        await client.sync.services(SERVICE_SID)
            .documents(TASKS_DOCUMENT_SID)
            .update({ data })

    }, 5000);

    pool(async () => {

        const tasks = await get(`https://taskrouter.twilio.com/v1/Workspaces/${WORKSPACE_SID}/Workers`, "workers", {
            PageSize: 500
        });
        
        const data = countWorkersPerBPOandChannel(tasks);

        await client.sync.services(SERVICE_SID)
            .documents(WORKERS_DOCUMENT_SID)
            .update({ data })

    }, 5000);

})();
