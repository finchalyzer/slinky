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

export function indent(ammount: number, content: string){
   const indentChar = `    `
   return `${Array(ammount + 1).join(indentChar)}${content}\n`
}
