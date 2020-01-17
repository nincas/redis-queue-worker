const express = require('express');
const Queue = require('bull');
const { setQueues, UI } = require('bull-board')

// Create / Connect to a named work queue
let workQueue = new Queue('LiveMatchQueues', { redis: {
    port: 6379,
    host: '1.1.0.207',
    password: '0ayy2pak'
}});


// Set where dashboard get all queues
setQueues([
    workQueue
]);

let app = express(), PORT = 3003

// Load dashboard
app.use('/', UI)

let jobs = []
const asyncProcessor = async (work) => {
    let job = await workQueue.add(work, {
        attempts: 3
    });
    jobs.push({ id: job.id })
}

// Logic on adding queues
[1, 2, 3].map(work => asyncProcessor(work))


// You can listen to global events to get notified when jobs are processed
workQueue.on('global:completed', (jobId, result) => {
    console.log(`Job completed with result ${result}`);
});

app.listen(PORT, () => console.log("Server started!"));
