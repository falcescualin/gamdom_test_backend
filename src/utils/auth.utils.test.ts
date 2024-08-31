import dns from 'dns';

import { sign } from 'jsonwebtoken';

import { UITokenJWTTypes } from '@generated/data-contracts';
import { logger } from '@logger/index';
import { generateJWTToken, isValidEmailDomain } from '@utils/auth.utils';

jest.mock('dns');
jest.mock('jsonwebtoken');

const mockSign = sign as unknown as jest.MockedFunction<(token: string) => string>;

describe('[AuthUtils]', () => {
  describe('isValidEmailDomain', () => {
    it('should return true for a valid email domain with MX records', async () => {
      (dns.resolveMx as unknown as jest.Mock).mockImplementation(
        (hostname: string, callback: (err: NodeJS.ErrnoException | null, addresses: dns.MxRecord[]) => void) => {
          callback(null, [{ exchange: 'mail.example.com', priority: 10 }]);
        }
      );

      const result = await isValidEmailDomain('user@example.com');
      expect(result).toBe(true);
      expect(logger.silly).toHaveBeenCalledWith('Domain example.com has valid MX records: [{"exchange":"mail.example.com","priority":10}]');
    });

    it('should return false for an invalid email domain with no MX records', async () => {
      (dns.resolveMx as unknown as jest.Mock).mockImplementation(
        (hostname: string, callback: (err: NodeJS.ErrnoException | null, addresses: dns.MxRecord[]) => void) => {
          callback(null, []);
        }
      );

      const result = await isValidEmailDomain('user@invalid.com');
      expect(result).toBe(false);
    });

    it('should handle errors and return false', async () => {
      (dns.resolveMx as unknown as jest.Mock).mockImplementation(
        (hostname: string, callback: (err: NodeJS.ErrnoException | null, addresses: dns.MxRecord[]) => void) => {
          callback(new Error('DNS resolution error'), []);
        }
      );
      const result = await isValidEmailDomain('user@error.com');
      expect(result).toBe(false);
    });
  });

  describe('generateJWTToken', () => {
    it('should generate a JWT token for ACCESS type', () => {
      const token = 'mockedToken';
      mockSign.mockReturnValue(token);

      const result = generateJWTToken(UITokenJWTTypes.ACCESS);
      expect(result).toBe(token);
      expect(sign).toHaveBeenCalledWith({ type: UITokenJWTTypes.ACCESS }, process.env.SECRET_KEY, { expiresIn: '1h' });
    });

    it('should generate a JWT token for REFRESH type', () => {
      const token = 'mockedToken';
      mockSign.mockReturnValue(token);

      const result = generateJWTToken(UITokenJWTTypes.REFRESH);
      expect(result).toBe(token);
      expect(sign).toHaveBeenCalledWith({ type: UITokenJWTTypes.REFRESH }, process.env.SECRET_KEY, { expiresIn: '20d' });
    });

    it('should throw an error for an invalid token type', () => {
      expect(() => {
        generateJWTToken('INVALID_TYPE' as UITokenJWTTypes);
      }).toThrow('Invalid token type: INVALID_TYPE');
    });
  });
});
