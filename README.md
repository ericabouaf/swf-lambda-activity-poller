# swf-lambda-activity-poller

A SWF Activity Poller, which starts a lambda.

This allows to manage long-running tasks through AWS Lambda.

Important: It is up to the lambda to respond to SWF, or to delegate it to a third party system !

## Usage

### register the activity

TODO LATER: register with gulp !

For the time being, register an activity:
  name: 'lambda-activity'
  version: '1.0'
  taskList: 'lambda-activity-tasklist'
  schedule to start timeout: 10s
  start to close timeout: 10days


### Calling the lambda

Example for crowdflower

{
  activity: 'lambda-activity',
  input: {
    'lambda': 'some-very-long-job',
    'params': {
      ...
    }
  }
}
