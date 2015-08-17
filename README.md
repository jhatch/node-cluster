# Balance an Express server over available CPU cores

### Tested against Node 0.12.5 specifically.

## Overview
NodeJS as of v0.12 comes with the [cluster](https://stash1.internal.jibe.com/projects/NJS/repos/jibe-node-labs-cluster/browse) package. This allows us to balance our Node apps across multiple CPU cores despite NodeJS being inherently single threaded. We could begin using multi-core machines to improve throughput of our apps, while still load balancing those machines themselves for reliability.

## No-downtime Deploys
Having your app balanced over multiple processes also allows for deployment of code without needing to restart your entire app:

    1. while your current cluster is running, deploy the new code
    2. initiate a hot reload with `npm run reload`
    3. the master process will then spin up a new worker for each current worker
    4. as each worker initializes and begins listening, master kills their predecessor

After each worker is replaced, all workers will be running your shiny new code! Since each old worker isn't killed until its replacement is up and ready to go - clients to your web server would have at no time had 0 workers listening for their requests - and hence its a no-downtime deploy.

## Caveats
Each worker has its own memory space. If processes need to share state they cannot do it via in-memory objects! For example with sessions, you'd need to use something like Redis to share that state as a simple in-memory cache would not work across processes.

## To run the example:

`npm start`

## Sample output:

```
[PID=13275] server running on port 3001
[PID=13277] server running on port 3001
[PID=13276] server running on port 3001
[PID=13278] server running on port 3001
[PID=13275] handling a request
[PID=13277] handling a request
[PID=13275] handling a request
[PID=13276] handling a request
[PID=13278] handling a request
[PID=13275] handling a request
[PID=13277] handling a request
[PID=13276] handling a request
[PID=13278] handling a request
```

In the above example the machine running has 4 cores as you can see by the initial 4 lines of input. Each core is sharing the same socket listening on port 3001. As requests come in to that socket connection, they are round-robin'd off to the workers who then do the actual request handling.