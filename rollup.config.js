import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import pkg from "./package.json";

export default {
  input: "src/index.js",
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "esm" },
  ],
  plugins: [
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: ["@babel/preset-env", "@babel/preset-react"],
    }),
    resolve(),
    commonjs(),
    terser(),
    postcss(),
  ],
  external: Object.keys(pkg.peerDependencies),
};
