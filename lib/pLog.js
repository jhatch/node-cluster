// as we are trying to demonstrate cross process communication
// make a simple utility logger showing PID
let pLog = () => {
  let args = Array.prototype.slice.call(arguments);
  args.unshift('[PID=' + process.pid + ']');
  console.log.apply(console, args);
};

module.exports = pLog;