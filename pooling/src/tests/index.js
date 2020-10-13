const { backOff } = require("exponential-backoff");
var PromisePool = require('es6-promise-pool');

const { ACCOUNT_SID, AUTH_TOKEN, WORKSPACE_SID, WORKFLOW_SID } = process.env;

const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

const generatePromises = function * () {
    for (let i = 1; i <= 600; i++) {
        yield createTask(i);
    }
}

var createTask =  (number) => {

    return backOff(async () => {

        const task = await client.taskrouter.workspaces(WORKSPACE_SID)
            .tasks
            .create({
                attributes: 
                JSON.stringify({
                    type: 'load_test',
                    number
                }), 
                workflowSid: WORKFLOW_SID,
                taskChannel: "chat"
            });

        console.log(`Task ${task.sid} created`);

    }
    , {
        jitter: "full"
    });

}


(async () => {

    try {

        var concurrency = 10;

        const promiseIterator = generatePromises();
        const pool = new PromisePool(promiseIterator, concurrency)

        console.log("Starting requests...");

        await pool.start();

    } catch (e) {

        console.log(e);

    }

})();


