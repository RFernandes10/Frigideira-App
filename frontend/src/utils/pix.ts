/**
 * Adiciona o ID, o tamanho e o valor de um campo ao payload.
 */
export const formatField = (id: string, value: string): string => {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
};

/**
 * Calcula o CRC16-CCITT-FALSE para o payload PIX.
 */
export const crc16 = (payload: string): string => {
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc <<= 1;
      }
    }
  }

  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
};

/**
 * Gera o payload completo do PIX "Copia e Cola".
 */
export const generatePixPayload = (
  pixKey: string,
  merchantName: string,
  merchantCity: string,
  txid: string,
  amount: number
): string => {
  const formattedAmount = amount.toFixed(2);
  
  const cleanPixKey = pixKey.replace(/[\s\(\)\-]/g, '');
  
  const cleanMerchantName = merchantName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .substring(0, 25)
    .trim();
    
  const cleanMerchantCity = merchantCity
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .substring(0, 15)
    .trim();

  const cleanTxid = txid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 25) || '***';

  const merchantAccountInfo =
    formatField('00', 'br.gov.bcb.pix') +
    formatField('01', cleanPixKey);

  const additionalData = formatField('05', cleanTxid);

  const payload = [
    formatField('00', '01'),
    formatField('26', merchantAccountInfo),
    formatField('52', '0000'),
    formatField('53', '986'),
    formatField('54', formattedAmount),
    formatField('58', 'BR'),
    formatField('59', cleanMerchantName),
    formatField('60', cleanMerchantCity),
    formatField('62', additionalData),
  ].join('');

  const payloadWithCRCIdentifier = payload + '6304';
  const crcValue = crc16(payloadWithCRCIdentifier);

  return payloadWithCRCIdentifier + crcValue;
};
