import * as AWS from 'aws-sdk';
import { handler } from './lambdaFunction';

const apiGateway = new AWS.APIGateway({ region: 'us-west-2' });
const lambda = new AWS.Lambda({ region: 'us-west-2' });

export async function createApi() {
  const restApi = await apiGateway.createRestApi({
    name: 'Financial Record API',
    description: 'API for processing financial transactions',
  }).promise();

  const resource = await apiGateway.createResource({
    restApiId: restApi.id,
    parentId: restApi.rootResourceId,
    pathPart: 'transactions',
  }).promise();

  const method = await apiGateway.createMethod({
    restApiId: restApi.id,
    resourceId: resource.id,
    httpMethod: 'POST',
    authorization: 'NONE',
  }).promise();

  const integration = await apiGateway.createIntegration({
    restApiId: restApi.id,
    resourceId: resource.id,
    httpMethod: 'POST',
    integrationHttpMethod: 'POST',
    type: 'LAMBDA',
    uri: `arn:aws:apigateway:${process.env.AWS_REGION}:lambda:path/2015-03-31/functions/${process.env.LAMBDA_FUNCTION_ARN}/invocations`,
  }).promise();

  const deployment = await apiGateway.createDeployment({
    restApiId: restApi.id,
    stageName: 'prod',
  }).promise();

  console.log(`API created: ${restApi.id}`);
  console.log(`Resource created: ${resource.id}`);
  console.log(`Method created: ${method.httpMethod} ${method.resourceId}`);
  console.log(`Integration created: ${integration.httpMethod} ${integration.uri}`);
  console.log(`Deployment created: ${deployment.id}`);
}

export async function deleteApi() {
  const restApi = await apiGateway.getRestApi({ restApiId: 'assnw4hmb2' }).promise();
  await apiGateway.deleteRestApi({ restApiId: restApi.id }).promise();
  console.log(`API deleted: ${restApi.id}`);
}

createApi().then(() => console.log('API created')).catch((err) => console.error(err));