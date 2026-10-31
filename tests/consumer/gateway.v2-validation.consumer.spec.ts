import { createGatewayPact } from '../../src/pact/pactFactory';
import { clm } from '../../src/testdata';
import { deepLike } from '../../src/matchers/common';

describe('Gateway v2 Validation Consumer Tests', () => {
  const pact = createGatewayPact();

  it('should verify CLM v2 status endpoint', async () => {
    await pact.addInteraction({
      state: 'CLM v2 status is available',
      uponReceiving: 'a request for CLM v2 status',
      withRequest: {
        method: 'GET',
        path: '/api/proxy/CLM/v2/status',
        headers: { Accept: 'application/json' },
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: deepLike(clm.statusV2),
      },
    });
  });
});
