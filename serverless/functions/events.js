exports.handler = async function(context, event, callback) {

  const client = context.getTwilioClient();
  const { EventType, WorkerAttributes, TaskSid, TaskAttributes } = event;
  const { TASK_BPO_SELECTOR, WORKER_BPO_SELECTOR } = process.env

  const reservationReset = ["reservation.canceled", "reservation.rescinded", "reservation.rejected", "reservation.timeout" ]

  if(reservationReset.includes(EventType)) {

    const attributes = JSON.parse(TaskAttributes);

    await client.taskrouter.workspaces('WS3d53d66c03ddf8898cb6e23d4be6cffb')
      .tasks(TaskSid)
      .update({
        attributes: JSON.stringify({
          ...attributes,
          [TASK_BPO_SELECTOR]: null
        })
      });

  }


  if(EventType === "reservation.created") {

    const { [WORKER_BPO_SELECTOR]:bpo } = JSON.parse(WorkerAttributes);
    const attributes = JSON.parse(TaskAttributes);

    await client.taskrouter.workspaces('WS3d53d66c03ddf8898cb6e23d4be6cffb')
      .tasks(TaskSid)
      .update({
        attributes: JSON.stringify({
          ...attributes,
          [TASK_BPO_SELECTOR]: bpo
        })
      });
  }

  callback(null);
};
