import typescript from "rollup-plugin-typescript"
import resolve from "rollup-plugin-node-resolve"

export default {
   entry: "./slinky/Slinky.ts",
   dest: "../Slinky.sketchplugin/Contents/Sketch/Slinky.js",
   format: "es",
   sourceMap: false,
   plugins: [
      typescript(),
      resolve()
   ]
}
