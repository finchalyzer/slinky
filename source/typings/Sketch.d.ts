interface MSLayer{
   name(): string
   objectID(): string
   isVisible(): boolean
   parentGroup(): MSLayer
   class(): MSLayer
   symbolMaster(): MSArtboardGroup
   frame(): {
      x(): number
      y(): number
      width(): number
      height(): number
   }
   absoluteRect():{
      rulerX(): number
      rulerY(): number
   }
   className(): string
   textAlignment(): number
   CSSAttributes(): any
   stringValue(): string
   styleAttributes():{
      NSColor?: any
      NSFont?: NSFont
      NSParagraphStyle?: any
      NSStrikethrough?: any
      NSUnderline?: any
      MSAttributedStringTextTransformAttribute?: number
   }
   isLayerExportable(): boolean
   children(): MSLayer[]
   createTextStorage():{
      attributeRuns(): {
         count(): number
         objectAtIndex(index: number): NSFont
      }
   }
}

declare var MSTextLayer: MSLayer
declare var MSLayerGroup: MSLayer
declare var MSShapeGroup: MSLayer
declare var MSBitmapLayer: MSLayer
declare var MSSymbolInstance: MSLayer

interface MSArtboardGroup{
   objectID(): string
   layers(): MSLayer[]
   name(): string
   backgroundColorGeneric(): {
      red(): number,
      green(): number,
      blue(): number,
      alpha(): number
   }
   frame(): {
      x(): number
      y(): number
      width(): number
      height(): number
   }
}

interface MSPage{
   currentArtboard(): MSArtboardGroup
}

interface MSDocument{
   currentPage(): MSPage
   fileURL(): string
   saveDocument(parameters: any): void
   isDocumentEdited(): boolean
}

interface SketchContext{
   document: MSDocument
   scriptPath: string
   scriptURL: string
   api: any
   command: any
   selection: MSArtboardGroup
}


declare var unescape: (input: string) => string
