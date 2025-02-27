import { join } from 'pathe';

export default {
  alias: {
    foo: './path/foo',
    dir: join(__dirname, 'path', 'dir'),
    postcss$: join(__dirname, 'path', 'postcss'),
  },
};
