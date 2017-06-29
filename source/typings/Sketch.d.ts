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
   layers(): MSShapePathLayer[]
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
   firstPoint(): {
      point(): {x: number, y: number}
   }
   lastPoint(): {
      point(): {x: number, y: number}
   }
   style():{
      fills(): MSStyleFill
   }
   attributedStringValue(): any
}

interface MSStyleFill{
   firstObject(): MSStyleFill
   color(): {
      red(): number,
      green(): number,
      blue(): number,
      alpha(): number
   }
}


declare var NSMakeRange: any
declare var MSTextLayer: MSLayer
declare var MSLayerGroup: MSLayer
declare var MSShapeGroup: MSLayer
declare var MSBitmapLayer: MSLayer
declare var MSSymbolInstance: MSLayer

interface MSCurvePoint{
   point():{x: number, y: number}
}

interface MSShapePathLayer{
   class(): any
   allCurvePoints(): MSCurvePoint[]
}

declare var MSShapePathLayer: MSShapePathLayer
declare var MSOvalShape: MSShapePathLayer

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
   backgroundColor(): {
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
   selectedLayers():{
      layers(): MSLayer[]
   }
}

interface MSPluginCommand{
   setValue_forKey_onLayer(value: string, key: string, layer: MSLayer): void
   valueForKey_onLayer(key: string, layer: MSLayer): string
}

interface SketchContext{
   document: MSDocument
   scriptPath: string
   scriptURL: string
   api: any
   command: MSPluginCommand
   selection: MSArtboardGroup
   plugin: {
      urlForResourceNamed(name: string): string
   }
   actionContext:{
      oldSelection: MSLayer[]
      document: MSDocument
   }
}


declare var unescape: (input: string) => string
