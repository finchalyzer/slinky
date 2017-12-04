import typescript from "rollup-plugin-typescript"
import resolve from "rollup-plugin-node-resolve"
import cleanup from "rollup-plugin-cleanup"

export default {
   input: "./slinky/Slinky.ts",
   output:{
      file: '../Slinky.sketchplugin/Contents/Sketch/Slinky.js',
      format: "es",
      sourcemap: false
   },
   plugins: [
      typescript(),
      resolve(),
      cleanup()
   ]
}
