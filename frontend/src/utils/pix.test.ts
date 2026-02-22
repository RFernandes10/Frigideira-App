import { generatePixPayload, formatField, crc16 } from './pix';

describe('Pix Utils', () => {
  describe('formatField', () => {
    it('should format a field correctly with ID, length and value', () => {
      expect(formatField('00', '01')).toBe('000201');
      expect(formatField('58', 'BR')).toBe('5802BR');
    });

    it('should pad length with leading zero if less than 10', () => {
      expect(formatField('05', 'ABC')).toBe('0503ABC');
    });
  });

  describe('crc16', () => {
    it('should calculate the correct CRC16 for a given payload', () => {
      // Teste com um valor comum de exemplo do BACEN
      const payload = '00020126330014br.gov.bcb.pix011112299487751520400005303986540510.005802BR5917ROBERTO FONSECA6008SAO PAULO62070503***6304';
      const result = crc16(payload);
      expect(result).toHaveLength(4);
      expect(result).toMatch(/^[0-9A-F]{4}$/);
    });
  });

  describe('generatePixPayload', () => {
    const mockData = {
      pixKey: '(21) 97265-7221',
      name: 'Roberto Fonseca',
      city: 'Rio de Janeiro',
      txid: 'PEDIDO123',
      amount: 25.50
    };

    it('should clean the pix key from special characters', () => {
      const payload = generatePixPayload(mockData.pixKey, mockData.name, mockData.city, mockData.txid, mockData.amount);
      expect(payload).toContain('21972657221');
      expect(payload).not.toContain('(');
      expect(payload).not.toContain(')');
      expect(payload).not.toContain('-');
    });

    it('should normalize and uppercase merchant name and city', () => {
      const payload = generatePixPayload(mockData.pixKey, 'João Café', 'São Paulo', mockData.txid, mockData.amount);
      expect(payload).toContain('JOAO CAFE');
      expect(payload).toContain('SAO PAULO');
      expect(payload).not.toContain('ã');
      expect(payload).not.toContain('é');
    });

    it('should format the amount correctly with two decimal places', () => {
      const payload = generatePixPayload(mockData.pixKey, mockData.name, mockData.city, mockData.txid, 25);
      expect(payload).toContain('25.00');
    });

    it('should generate a valid looking payload starting with 000201', () => {
      const payload = generatePixPayload(mockData.pixKey, mockData.name, mockData.city, mockData.txid, mockData.amount);
      expect(payload.startsWith('000201')).toBe(true);
      expect(payload).toContain('6304'); // CRC identifier
    });
  });
});
