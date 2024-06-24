import * as crypto from 'crypto';

interface AnonymizedData {
  transactionId: string;
  userId: string;
  transactionDetails: {
    amount: number;
    currency: string;
    transactionDate: string;
    paymentMethod: string;
    merchantDetails: {
      merchantId: string;
      name: string;
      category: string;
      countryCode: string;
    };
  };
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    billingAddress: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  additionalInfo: {
    deviceIp: string;
    userAgent: string;
  };
}

export function anonymizeData(data: any): AnonymizedData {
  const pseudonym = generatePseudonym(data.userId);
  const encryptedData = encryptData(data, pseudonym);
  return {
    transactionId: data.transactionId,
    userId: pseudonym,
    transactionDetails: encryptedData.transactionDetails,
    userDetails: encryptedData.userDetails,
    additionalInfo: encryptedData.additionalInfo,
  };
}

function generatePseudonym(userId: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256');
  hash.update(`${userId}${salt}`);
  return hash.digest('hex');
}

function encryptData(data: any, pseudonym: string): any {
  const cipher = crypto.createCipher('aes-256-cbc', pseudonym);
  const encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  return JSON.parse(encryptedData);
}