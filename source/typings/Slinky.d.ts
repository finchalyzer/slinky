interface Layer{
   title: string
   id: string
   x1: number
   y1: number
   x2: number
   y2: number
   css: any
   border: number
   content:{
      text: string,
      css: string[]
   }[]
   source: string
   children: Layer[]
}
