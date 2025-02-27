import { join } from 'pathe';
import type { IApi } from 'umi';
import { winPath } from 'umi/plugin-utils';
import { TEMPLATES_DIR } from '../../constants';

export default (api: IApi) => {
  api.describe({
    key: 'preset-vue:tmpFiles',
  });

  api.onGenerateFiles(async () => {
    // useAppData.ts
    const rendererPath = winPath(
      await api.applyPlugins({
        key: 'modifyRendererPath',
      }),
    );

    api.writeTmpFile({
      noPluginDir: true,
      path: 'plugin-vue/index.ts',
      tplPath: join(TEMPLATES_DIR, 'useAppData.tpl'),
      context: {
        rendererPath,
      },
    });
  });

  api.register({
    key: 'onGenerateFiles',
    fn: async () => {
      // history.ts
      const rendererPath = winPath(
        await api.applyPlugins({
          key: 'modifyRendererPath',
        }),
      );

      api.writeTmpFile({
        noPluginDir: true,
        path: 'core/history.ts',
        tplPath: join(TEMPLATES_DIR, 'history.tpl'),
        context: {
          rendererPath,
        },
      });

      // EmptyRoutes.tsx
      api.writeTmpFile({
        noPluginDir: true,
        path: 'core/EmptyRoute.tsx',
        content: `
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return () => <router-view></router-view>;
  },
});
        `,
      });

      // App.vue
      api.writeTmpFile({
        noPluginDir: true,
        path: 'core/App.vue',
        content: `
<template>
  <router-view></router-view>
</template>
        `,
      });
    },
    stage: Infinity,
  });
};
