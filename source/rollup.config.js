import typescript from "rollup-plugin-typescript"

export default {
   entry: "./slinky/Slinky.ts",
   dest: "../Slinky.sketchplugin/Contents/Sketch/Slinky.js",
   format: "es",
   sourceMap: false,
   plugins: [
      typescript()
   ]
}
