three.js r186 (npm "three" 0.186.1), MIT licence (LICENSE.txt). Used by the Virtual Museum only.

The npm package ships only unminified ES modules, so the two files here were minified once:
  esbuild build/three.core.js   --minify --format=esm --outfile=three.core.min.js
  esbuild build/three.module.js --minify --format=esm --outfile=three.module.min.js
and three.module.min.js's import of "./three.core.js" was pointed at "./three.core.min.js".
No other change. To upgrade, repeat with the new version and re-test museum.html.
