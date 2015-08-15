# Balance an Express server over available CPU cores

## Overview
NodeJS as of v0.12 comes with the [cluster](https://stash1.internal.jibe.com/projects/NJS/repos/jibe-node-labs-cluster/browse) package. This allows us to balance our Node apps across multiple CPU cores despite NodeJS being inherently single threaded. We could begin using multi-core machines to improve throughput of our apps, while still load balancing those machines themselves for reliability.

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