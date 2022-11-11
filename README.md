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

# OPTIMIZATION ROADMAP:

## 1. Cold start
### optimized ❌
### not-optimized ❌
* ✅ JS_V3 instead of JS_V2
* ❌ Use esbuild to minify and bundle your Node.js AWS Lambda functions
* ✅ avoid wildcard when importing modules. do this instead import Lambda from "aws-sdk/clients/lambda";
* ❓ which programming language matter
* ❓ place your lambda outside the VPC, when possible. (TODO is it cold start optimization?)
* ❓ Bonus: warm up your lambda


## 2. Code
### optimized ❌
### not-optimized ❌
* ✅ Use AWS_NODEJS_CONNECTION_REUSE_ENABLED to 1 to make the SDK reuse connections by default. JS_V3 is enabled by default https://aws.amazon.com/blogs/developer/http-keep-alive-is-on-by-default-in-modular-aws-sdk-for-javascript/
* ✅ Reuse the container, imports and declaration using container invocation, not within the handler. Hence initialize outside the handler. You can also use cache within the container (keep in mind the limits).
* ❓ Multiprocessing nodeJS in Lambda and calculate vCPU https://www.sentiatechblog.com/aws-re-invent-2020-day-3-optimizing-lambda-cost-with-multi-threading
* ❓/✅ Specify region when initializing aws resources
* ❓ Don’t log too much, only log when necessary
* ✅ execute code in parallel 


## 3. Resource
### optimized ❌
### not-optimized ❌
* AWS Lambda Power Tuning
* Use arm64 architecture
* Use short timeouts is essential at scale, you can also keep track of it using a filter patter on “Task timed out after”. Do not put your timeout too high if possible.

## 4. All together
### optimized ❌
### not-optimized ❌



### ✅ 