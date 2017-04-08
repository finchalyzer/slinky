export function slugify(text: string){

   return text.toString().toLowerCase().trim()
   .replace(/\s+/g, '-')
   .replace(/&/g, '-and-')
   .replace(/[^\w\-]+/g, '')
   .replace(/\-\-+/g, '-')

}

export function isURL(string: string){
   const pattern = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)
   return pattern.test(string)
}

export function isEmail(string: string) {
   const pattern = new RegExp(/^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,14}$/)
   return pattern.test(string)
}

export function rgbaToHex(rgba: {red(): number, green(): number, blue(): number, alpha(): number}){

   function componentToHex(c) {
      var hex = c.toString(16)
      return hex.length == 1 ? "0" + hex : hex
   }

   return "#" + componentToHex(Math.floor(rgba.red() * 255)) + componentToHex(Math.floor(rgba.green() * 255)) + componentToHex(Math.floor(rgba.blue() * 255))

}

export function NSrgbaToHex(rgba: {redComponent(): number, greenComponent(): number, blueComponent(): number, alphaComponent(): number}){

   function componentToHex(c) {
      var hex = c.toString(16)
      return hex.length == 1 ? "0" + hex : hex
   }

   return "#" + componentToHex(Math.floor(rgba.redComponent() * 255)) + componentToHex(Math.floor(rgba.greenComponent() * 255)) + componentToHex(Math.floor(rgba.blueComponent() * 255))

}

export function expandCSS(value: string){

   let valueParts = value.split(" ")

   if(valueParts.length === 1) valueParts.push(valueParts[0])
   if(valueParts.length === 2) valueParts.push(valueParts[0])
   if(valueParts.length === 3) valueParts.push(valueParts[1])

   return valueParts
}

export function contractCSS(values: string[]){

   if (values[1] == values[3]) values.splice(3, 1)
   if (values[0] == values[2] && values.length == 3) values.splice(2, 1)
   if (values[0] == values[1] && values.length == 2) values.splice(1, 1)

   return values

}

export function indent(ammount: number, content: string){
   const indentChar = `    `
   return `${Array(ammount + 1).join(indentChar)}${content}\n`
}

export function isCircle(layer: MSLayer){

   if(layer.class() === MSShapeGroup && layer.layers().length == 1){

      if(layer.layers()[0].class() === MSOvalShape) return true
      if(layer.layers()[0].class() !== MSShapePathLayer) return false

      var points = layer.layers()[0].allCurvePoints()
      if(points.length < 4) return false

      var isCircle = true

      points.forEach(function(point){
         if(Math.round(((point.point().x -0.5)*(point.point().x-0.5) + (point.point().y-0.5)*(point.point().y - 0.5))*100) !== 25){
            isCircle = false
         }
      })

      return isCircle

   } else {

      return false

   }

}
