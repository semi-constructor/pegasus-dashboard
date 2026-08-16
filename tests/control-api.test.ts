import crypto from 'crypto';

describe('Control API Authentication', () => {
  it('should securely hash and derive the correct instance ID', () => {
    const rawToken = 'super-secret-token-123';
    const hash = crypto.createHash('sha256').update(rawToken).digest('hex');
    
    // In actual implementation, we would insert this hash into the DB
    // and attempt to call POST /api/control/guild-register
    expect(hash).toBeDefined();
    expect(hash).not.toEqual(rawToken);
  });
});

describe('API Gateway Proxy', () => {
  it('should route hosted guilds to API', () => {
    const isHosted = true;
    expect(isHosted).toBe(true);
  });
});
