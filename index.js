
var os = require('os'),
    AWS = require('aws-sdk');


AWS.config = new AWS.Config({
  region: process.env.AWS_REGION || 'us-east-1'
});


var lambda = new AWS.Lambda();
var swf = new AWS.SWF();


var config = {
   "domain": process.env.DOMAIN || "testdomain",
   "taskList": {"name": "lambda-activity-tasklist"},
   "identity": 'LambdaActivityPoller-' + os.hostname() + '-' + process.pid,
};



var stop_poller = false;


var _ = {
  clone: function (src) {
    var tgt = {}, k;
    for (k in src) {
       if (src.hasOwnProperty(k)) {
          tgt[k] = src[k];
       }
    }
    return tgt;
  }
};


var poll = function () {


   // Copy config
   var o = _.clone(config);

   console.log("polling...");

   // Poll request on AWS
   // http://docs.aws.amazon.com/amazonswf/latest/apireference/API_PollForActivityTask.html
   swf.pollForActivityTask(o, function (err, result) {

      if (err) {
        console.log("Error in polling ! ", err);
        poll();
        return;
      }

      // If no new task, re-poll
      if (!result.taskToken) {
         poll();
         return;
      }

      _onNewTask(result);
      poll();
   });

};


var _onNewTask = function(task) {

  console.log(JSON.stringify(task, null, 3));

  var lambdaConfig = JSON.parse(task.input);

  var lambdaName = lambdaConfig.lambda;
  var lambdaParams = lambdaConfig.params;
  var taskToken = task.taskToken;


  var params = {
    FunctionName: lambdaName,
    InvocationType: 'Event', // Do not wait for execution
    LogType: 'None',
    Payload: JSON.stringify({
      input: lambdaParams,
      taskToken: taskToken
    })
  };
  console.log('Invoking lambda', params);
  lambda.invoke(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });

};


poll();
