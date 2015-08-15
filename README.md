# Balance an Express server over available CPU cores

## To run the example:

`npm start`

## Sample output:

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

Note that different PID's are handling incoming requests from various clients. In the above example the machine running has 4 cores as you can see by the initial 4 lines of input. Each core is sharing the same socket listening on port 3001.