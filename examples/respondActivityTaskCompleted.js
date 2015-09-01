/**
 * respondActivityTaskCompleted
 *
 * Lambda example to be called by swf-lambda-activity-poller (ie with a taskToken)
 * It is up to this lambda to respond to SWF, and this is an example to do so.
 * However, this lambda is just given as a test, and shouldn't be used normally,
 * since SWF is able to directly run lambdas.
 *
 * Sample workflow using swf-lambda-decider :

 exports.handler = require('swf-lambda-decider')(function (w) {
   w.activity({
      name: 'step0',
      activity: 'lambda-activity',
      input: {
        'lambda': 'respondActivityTaskCompleted',
        'params': {
          msg: 'This activity was launched by myworkflow'
        }
      }
    })(function(err, results) {
     w.stop({
       result: results
     });
   });
 });

 */
var AWS = require('aws-sdk');
var swf = new AWS.SWF();

exports.handler = function(event, context) {

  console.log(event);
  // event.input => from the workflow
  // event.taskToken => SWF taskToken

  var output = event.input;

  var params = {
    taskToken: event.taskToken,
    result: JSON.stringify(output)
  };

  swf.respondActivityTaskCompleted(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      context.fail('Something went wrong: '+err.message);
      return;
    }
    context.succeed(data);
  });

};
