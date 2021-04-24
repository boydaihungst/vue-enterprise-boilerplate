---
to: tests/e2e/specs/<%= h.changeCase.kebab(name) %>.e2e.ts
---
import { describe, it } from 'local-cypress';

describe('<%= h.changeCase.pascal(name) %>', () => {
  it('should be implemented');
});
