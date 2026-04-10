import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

// eslint-config-next v16 ships native flat configs, so we spread them directly.
// (The old FlatCompat wrapper breaks with v16's self-referential plugin configs.)
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // Next 16 ships react-hooks plugin v6 with new, aggressive rules. These
    // fire on legitimate post-mount browser-sync patterns and on vendored
    // shadcn/ui components we don't hand-edit — keep them as warnings.
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
];

export default eslintConfig;
