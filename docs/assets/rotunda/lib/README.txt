Rotunda statue viewers: three.js r160 (minified ES module), GLTFLoader, BufferGeometryUtils and
RoomEnvironment from the three.js examples. MIT licence (LICENSE.txt; RoomEnvironment's header
credits Google's model-viewer, from which three.js adapted it).

These are the exact bytes that atlas embedded (base64) in the three figure pages of record,
handoff/rotunda/tray1/{socrates,shiva,isis}-figure.html on staging/ready-line. They were split out
unchanged so that no file on the site passes the 2 MB budget, and so the three pages share one
cached copy. The museum itself uses the separate r186 copy in assets/vendor/three/; do not mix them.
The .glb meshes in assets/rotunda/ are likewise the exact meshes embedded in those pages.
