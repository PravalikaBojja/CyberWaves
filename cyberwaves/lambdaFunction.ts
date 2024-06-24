import * as AWS from 'aws-sdk';
import { anonymizeData } from './anonymization';
import { calculateRisk } from './riskAssessment';
import { enrichData } from './dataEnrichment';

const s3 = new AWS.S3({ region: 'us-west-2' });


const kms = new AWS.KMS({ region: 'us-west-2' });

async function encryptData(data: any, userId: string): Promise<string> {
  const keyId = '9b1d0181-a725-44ad-8ff1-dde4d0e27aad';
  const plaintext = JSON.stringify(data);
  const encryptedData = await kms.encrypt({
    KeyId: keyId,
    Plaintext: plaintext,
  }).promise();
  return encryptedData.CiphertextBlob.toString('base64');
}

export async function handler(event: any) {
  const data = event.body;
  const anonymizedData = anonymizeData(data);
  const enrichedData = enrichData(anonymizedData);
  const riskScore = calculateRisk(enrichedData);
  const encryptedData = encryptData(anonymizedData, anonymizedData.userId);

  // store encrypted data in S3
  const params = {
    Bucket: 's3bucketfinancialtransaction',
    Key: `transactions/${anonymizedData.transactionId}.json`,
    Body: JSON.stringify(encryptedData)
  };
  await s3.putObject(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ riskScore }),
  };
}