import { GeneratorType } from '@umijs/core';
import { logger } from '@umijs/utils';
import { writeFileSync } from 'fs';
import { join } from 'pathe';
import { IApi } from '../../types';
import { GeneratorHelper, getUmiJsPlugin } from './utils';

export default (api: IApi) => {
  api.describe({
    key: 'generator:tailwindcss',
  });

  api.registerGenerator({
    key: 'tailwindcss',
    name: 'Enable Tailwind CSS',
    description: 'Setup Tailwind CSS configuration',
    type: GeneratorType.enable,
    checkEnable: () => {
      return !api.config.tailwindcss;
    },
    disabledDescription: () =>
      `tailwindcss has been enabled; you can remove \`tailwindcss\` fields in ${api.appData.mainConfigFile} then run this to re-setup`,
    fn: async () => {
      const h = new GeneratorHelper(api);

      h.addDevDeps({
        '@umijs/plugins': getUmiJsPlugin(),
        tailwindcss: '^3',
      });

      h.setUmirc('tailwindcss', {});
      h.appendInternalPlugin('@umijs/plugins/dist/tailwindcss');
      logger.info('Update .umirc.ts');

      writeFileSync(
        join(api.cwd, 'tailwind.config.js'),
        `
module.exports = {
  content: [
    './src/pages/**/*.tsx',
    './src/components/**.tsx',
    './src/layouts/**.tsx',
  ],
}
`.trimLeft(),
      );
      logger.info('Write tailwind.config.js');

      writeFileSync(
        join(api.cwd, 'tailwind.css'),
        `
@tailwind base;
@tailwind components;
@tailwind utilities;
`.trimLeft(),
      );
      logger.info('Write tailwind.css');

      h.installDeps();
    },
  });
};
