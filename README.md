# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## QUERY RESULTS:
### COLD START
```
filter @type="REPORT" 
| fields @memorySize / 1000000 as memorySize
| parse @message /^REPORT.*Duration: (?<duration>.*) ms.*Init Duration: (?<initDuration>.*) ms.*/
| parse @log /^.*\/aws\/lambda\/dev-lambda-optimizer-lambda-(?<functionName>.*)/
| stats 
count(initDuration) as countInit,
ceil(avg(initDuration)) as avgInit, 
min(initDuration) as minInit,
max(initDuration) as maxInit
by functionName, memorySize
```

### CODE
```
filter @type="REPORT" 
| fields @memorySize / 1000000 as memorySize
| parse @message /^REPORT.*Duration: (?<duration>.*) ms.*Billed.*/
| parse @log /^.*\/aws\/lambda\/dev-lambda-optimizer-lambda-(?<functionName>.*)/
| stats 
count(duration) as countInvoke,
ceil(avg(duration)) as avg, 
min(duration) as min,
max(duration) as max
by functionName, memorySize
```
### OPTIMIZE
```
filter @type="REPORT" 
| fields @memorySize / 1000000 as memorySize
| parse @message /^REPORT.*Duration: (?<duration>.*) ms.*Billed.*/
| parse @log /^.*\/aws\/lambda\/dev-lambda-optimizer-lambda-(?<functionName>.*)/
| stats 
count(duration) as countInvoke,
ceil(avg(duration)) as avg, 
min(duration) as min,
max(duration) as max
by functionName, memorySize
```
