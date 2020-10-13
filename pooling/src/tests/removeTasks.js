const { backOff } = require("exponential-backoff");
var PromisePool = require('es6-promise-pool');

const { ACCOUNT_SID, AUTH_TOKEN, WORKSPACE_SID, WORKFLOW_SID } = process.env;

const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

const generatePromises =  function * (tasks) {
    for (let i = 0; i < tasks.length; i++) {
        yield removeTask(tasks[i]);
    }
}

var removeTask =  (task) => {

    return backOff(async () => {

        await client.taskrouter.workspaces(WORKSPACE_SID)
            .tasks(task.sid)
            .remove();

        console.log(`Task ${task.sid} removed`);

    }
    , {
        jitter: "full"
    });

}


(async () => {

    try {

        var concurrency = 10;

        const tasks = await client.taskrouter.workspaces(WORKSPACE_SID)
            .tasks
            .list({limit: 300 });

        const promiseIterator = generatePromises(tasks);
        const pool = new PromisePool(promiseIterator, concurrency)

        console.log("Starting requests...");

        await pool.start();

    } catch (e) {

        console.log(e);

    }

})();


