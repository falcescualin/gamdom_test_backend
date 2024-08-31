import dns from 'dns';
import util from 'util';

import * as jwt from 'jsonwebtoken';

import { SECRET_KEY } from '@config';
import { UITokenJWTTypes } from '@generated/data-contracts';
import { expiryTimeMapping } from '@interfaces/auth.interface';
import { logger } from '@logger/index';

const resolveMxAsync = util.promisify(dns.resolveMx);

export const isValidEmailDomain = async (email: string): Promise<boolean> => {
  try {
    const domain = email.split('@')[1];

    const addresses = await resolveMxAsync(domain);

    console.log(addresses);

    if (addresses && addresses.length > 0) {
      logger.silly(`Domain ${domain} has valid MX records: ${JSON.stringify(addresses)}`);
      return true;
    }

    return false;
  } catch (err) {
    logger.error(err);
    return false;
  }
};

export const generateJWTToken = (type: UITokenJWTTypes, additionalData?: Record<string, any>): string => {
  if (Object.values(UITokenJWTTypes).indexOf(type) === -1) {
    throw new Error('Invalid token type: ' + type);
  }

  return jwt.sign(
    {
      type,
      ...additionalData,
    },
    SECRET_KEY,
    {
      expiresIn: expiryTimeMapping[type],
    }
  );
};
