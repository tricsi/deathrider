import typescript from '@rollup/plugin-typescript';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import glsl from 'rollup-plugin-glsl';
import bundle from 'rollup-plugin-html-bundle';
import { terser } from 'rollup-plugin-terser';
import roadroller from './bin/roadroller';
import del from 'rollup-plugin-delete';

const isDev = process.env.npm_lifecycle_event !== 'build';

export default {
    input: 'src/main.ts',
    output: {
        dir: 'build',
        format: 'iife',
        sourcemap: isDev
    },
    plugins: [
        del({ targets: 'build/index.html.zip' }),
        json(),
        typescript({
            exclude: '**/*.tsx',
            noEmitOnError: false
        }),
        image(),
        glsl({ include: /\.(frag|vert)$/ }),
        terser({
            ecma: 2020,
            module: true,
            toplevel: true,
            compress: !isDev,
            mangle: !isDev
        }),
        roadroller({ pass: isDev }),
        bundle({
            template: 'src/index.html',
            target: 'build/dev.html',
            inline: !isDev
        })
    ]
};
