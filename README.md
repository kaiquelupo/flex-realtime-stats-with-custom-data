# Realtime Stats with Custom Data

This plugin allows you to filter which realtime stats the current Flex user is going to see with the Queue Stats View. It is common to use this schema with BPO permissioning and channel separation. 

## How it works

This repository has following main parts: 

1. **pooling**: this service will pool the current tasks and workers every 5 seconds (or whatever you want) and aggregate the data saving it to a Twilio Sync Document.

2. **serverless**: for agreggating the data, it is necessary to add some attributes to the task in order to filter them correctly. To do so, we need to listen to some TaskRouter events. The endpoint for that is described as a Twilio Function here.

3. **flex-plugin**: this plugin will receive the Sync Document data and display the correct data depending on the agent access role. 

