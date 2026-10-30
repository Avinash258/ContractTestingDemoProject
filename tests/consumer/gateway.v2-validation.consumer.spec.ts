import { createGatewayPact } from '../../src/pact/pactFactory';
import { createJsonClient, getJson } from '../../src/clients/httpJson';
import { MatchersV3 } from '@pact-foundation/pact';
import { clm, testDefaults } from '../../src/testdata';

const { like, string, integer, boolean, eachLike } = MatchersV3;

/**
 * ContractImplementNew — durable consumer for DiffAuditor missing/new:
 *   GET /api/proxy/CLM/v2/status (clm_v2_status)
 *
 * Coverage requires this literal withRequest path in consumer source
 * (pact-only orphans are dropped by CI).
 */
describe('Gateway CLM v2 routes (Swagger missing/new)', () => {
  const pact = createGatewayPact();
  const sample = clm.v2Status;

  it('GET /api/proxy/CLM/v2/status', async () => {
    await pact
      .addInteraction()
      .given('CLM v2 status is available')
      .uponReceiving('a client GET CLM v2 status')
      .withRequest('GET', '/api/proxy/CLM/v2/status', (b) => {
        b.headers({ Accept: 'application/json' });
      })
      .willRespondWith(testDefaults.httpOk, (b) => {
        b.headers({ 'Content-Type': 'application/json' });
        b.jsonBody(
          like({
            apiVersion: integer(sample.apiVersion),
            service: string(sample.service),
            ready: boolean(sample.ready),
            engagementId: string(sample.engagementId),
            entityName: string(sample.entityName),
            taxYear: integer(sample.taxYear),
            correlationId: string(sample.correlationId),
            feeds: eachLike(string(sample.feeds[0]), 1),
          })
        );
      })
      .executeTest(async ({ url }) => {
        const { status, data } = await getJson(
          createJsonClient(url),
          '/api/proxy/CLM/v2/status'
        );
        expect(status).toBe(testDefaults.httpOk);
        expect(data.apiVersion).toBe(2);
        expect(data.service).toBe('CLM');
        expect(typeof data.ready).toBe('boolean');
        expect(data.engagementId).toBeTruthy();
        expect(data.entityName).toBeTruthy();
        expect(Array.isArray(data.feeds)).toBe(true);
      });
  });
});
