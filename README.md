## General

This repository was created together with [this blog post](https://medium.com/hatchsoftware/how-to-overcome-api-gateway-timeouts-using-websocket-86d946fabb93).

The original setup using a REST API endpoint can be found on [this branch](https://github.com/HatchSoftware/lambda-websocket-demo/tree/original)

The final setup using Websockets can be found on [this branch](https://github.com/HatchSoftware/lambda-websocket-demo/tree/final)

### Client project

This project was generated with the [Angular CLI](https://angular.io/cli/new).

```bash
cd websocket-demo-client/
``` 

#### Install dependencies

```bash
npm install
``` 

#### Run locally

```bash
npm start
``` 

### API project

This project was generated with the [Serverless CLI](https://www.serverless.com/framework/docs/providers/aws/cli-reference/create/) using the 'aws-nodejs-typescript' template.

```bash
cd websocket-demo-api/
``` 

#### Install dependencies

```bash
npm install
``` 

#### Deploy API

```bash
sls deploy
``` 

#### Remove API

```bash
sls remove
``` 
