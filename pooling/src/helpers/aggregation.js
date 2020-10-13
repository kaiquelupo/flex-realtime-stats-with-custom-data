const { increaseValueByPath } = require("./utils");

const countTasksPerBPOandChannel = (tasks) => {

    const queues = {};

    const { TASK_BPO_SELECTOR } = process.env;

    tasks.forEach(task => {

        const { [TASK_BPO_SELECTOR]: bpo } = JSON.parse(task.attributes);

        increaseValueByPath(
            queues, 
            `${task.task_queue_friendly_name}.${bpo || "rest"}.tasks.${task.assignment_status}.${task.task_channel_unique_name}`
        )

        increaseValueByPath(
            queues, 
            `${task.task_queue_friendly_name}.all.tasks.${task.assignment_status}.${task.task_channel_unique_name}`
        )
            
    });

    return queues;

}

const countWorkersPerBPOandChannel = (workers) => {

    const queues = {};

    const { WORKER_BPO_SELECTOR } = process.env;

    workers.forEach(worker => {

        const { [WORKER_BPO_SELECTOR]: bpo, queues: workerQueues } = JSON.parse(worker.attributes);
        const { activity_name, attributes } = worker;

        const channels = JSON.parse(attributes).channels || ["none"];

        if(workerQueues) { 

            workerQueues.forEach(queue => 
                channels.forEach(channel => {

                    increaseValueByPath(
                        queues, 
                        `${queue}.${bpo || "rest"}.workers.${activity_name.toLowerCase()}.${channel}`
                    )

                    increaseValueByPath(
                        queues, 
                        `${queue}.all.workers.${activity_name.toLowerCase()}.${channel}`
                    )

                })
            )

        }

        increaseWorkerPerActivityAndChannel(channels, activity_name, bpo, queues);
        increaseWorkerPerActivity(activity_name, bpo, queues);

    });

    return queues;
}

const increaseWorkerPerActivityAndChannel = (channels, activity_name, bpo, queues) => {

    channels.forEach(channel => {
        increaseValueByPath(
            queues, 
            `general.${bpo || "rest"}.workers.${activity_name.toLowerCase()}.${channel}`
        )

        increaseValueByPath(
            queues, 
            `general.all.workers.${activity_name.toLowerCase()}.${channel}`
        )
    })

}

const increaseWorkerPerActivity = (activity_name, bpo, queues) => {

    increaseValueByPath(
        queues, 
        `general.${bpo || "rest"}.workers.${activity_name.toLowerCase()}.total`
    )

    increaseValueByPath(
        queues, 
        `general.all.workers.${activity_name.toLowerCase()}.total`
    )

}

module.exports = {
    countTasksPerBPOandChannel,
    countWorkersPerBPOandChannel
}