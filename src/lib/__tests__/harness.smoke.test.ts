// Smoke test — proves the jest-expo harness runs in CI. Real unit tests for the
// API client, token store, and payload parsing land with issue #1. Delete this
// once those exist if it feels redundant; for now it keeps "no test, no push"
// honest with a green suite from day one.
describe('test harness', () => {
  it('executes the jest-expo suite', () => {
    expect(1 + 1).toBe(2);
  });
});
