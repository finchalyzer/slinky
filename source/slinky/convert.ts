import { slugify, rgbaToHex, NSrgbaToHex, isURL, isEmail } from "./helpers"
import { exportAssets } from "./Appkit"
import { template } from "./layout"

export function convert(artboard: MSArtboardGroup){

   // Get all visible layers from the artboard
   const data = sketchToLayers(artboard.layers())

   let layout: Layer[] = []

   let offset ={
      minX: artboard.frame().width(),
      maxX: 0,
   }

   // Append layer to the layer containing it
   data.layers.forEach(layer => {
      if(layer.x1 < offset.minX) offset.minX = layer.x1
      if(layer.x2 > offset.maxX) offset.maxX = layer.x2
      layout = appendLayers(layout, layer)
   })

   // Change absolute positions to relative
   layout = relatativePosition(layout, {x: offset.minX, y: 0})

   // Create the table layout
   let table = createTable(layout, {
      width: offset.maxX - offset.minX,
      height: artboard.frame().height()
   })

   const bodyBackground = rgbaToHex(artboard.backgroundColorGeneric())

   return {
      table: template(bodyBackground, table),
      assets: data.assets
   }

}


function createTable(layers: Layer[], size: {width: number, height: number}){

   // Sort layers to start from upper left position
   layers = layers.sort((a, b) => a.x1 - b.x1)
   layers = layers.sort((a, b) => a.y1 - b.y1)

   // Table holds the final table column and row positions
   const table = {
      columns: [],
      rows: [0, size.height]
   }

   // Add table column and row position based on layer position
   let lastRow = 0
   layers.forEach(layer => {

      if(layer.y2 >= lastRow && table.rows.indexOf(layer.y2) < 0) table.rows.push(layer.y2)

      if(layer.y1 >= lastRow){
         if(table.rows.indexOf(layer.y1) < 0) table.rows.push(layer.y1)
         lastRow = layer.y2
      }

      if(table.columns.indexOf(layer.x1) < 0) table.columns.push(layer.x1)
      if(table.columns.indexOf(layer.x2) < 0) table.columns.push(layer.x2)

   })

   table.rows = table.rows.sort((a, b) => a - b)
   table.columns = table.columns.sort((a, b) => a - b)

   // Table grid holds final table cell content
   let tableGrid = []

   for(var row = 0; row < table.rows.length - 1; row ++){
      for(var column = 0; column < table.columns.length - 1; column ++){

         let cellContent = null

         layers.forEach((layer, layerIndex) => {

            if(typeof cellContent === "number") return

            if (layer.x1 < table.columns[column+1] && layer.x2 > table.columns[column] && layer.y1 < table.rows[row+1] && layer.y2 > table.rows[row]){
               cellContent = layerIndex
            }

         })

         if(!tableGrid[row]) tableGrid[row] = []
         tableGrid[row].push(cellContent)

      }
   }

   // Start result with table wrapper
   let result = `<table style="border-collapse:collapse;table-layout:fixed;width:${size.width}px;margin:auto;" border="0" width="${size.width}" height="${size.height}">\n`


   // Append <col> widths to result
   if(table.columns.length > 2){

      result += "<colgroup>"

      for(var column = 0; column < table.columns.length - 1; column ++){

         let cellWidth = table.columns[column + 1] - table.columns[column]

         if(column === 0 && table.columns[0] > 0) cellWidth += table.columns[0]
         if(column === table.columns.length - 2 && table.columns[column + 1] < size.width) cellWidth += size.width - table.columns[column + 1]

         result += `<col style="width:${cellWidth}px;"/>`

      }

      result += "</colgroup>"
   }

   // Parse the tableGrid content
   tableGrid.forEach((row, rowIndex) => {

      result += ` <tr>\n`

      let colspan = 1
      let empty = false

      row.forEach((cell, cellIndex) => {

         // Calculate cell width
         let cellWidth = table.columns[cellIndex + 1] - table.columns[cellIndex]
         if(cellIndex === 0 && table.columns[0] > 0) cellWidth += table.columns[0]

         // The cell is part of a cell with rowspan > 1, ignore it
         if(cell === "rowspanned"){

         } else

         // An empty cell, fill with &shy; for Outlook
         if(typeof cell !== "number"){
            if(cellIndex == tableGrid[0].length - 1 || (typeof tableGrid[rowIndex][cellIndex + 1] === "number" || tableGrid[rowIndex][cellIndex + 1] === "rowspanned" )){
               result += `   <td colspan="${colspan}" style="width:${cellWidth}px;height:${table.rows[rowIndex + 1] - table.rows[rowIndex]}px">&shy;</td>\n`
               colspan = 1
               empty = false
            } else {
               colspan ++
               empty = true
            }
         } else

         // The next cell is the same, don't output anything yet
         if(cellIndex < tableGrid[0].length - 1 && tableGrid[rowIndex][cellIndex + 1] === cell){
            colspan ++
         } else

         // Finally, output the cells content
         {

            // Calculate rowspan
            let rowspan = 1
            for(var i = rowIndex + 1; i < tableGrid.length; i ++){
               if(tableGrid[i][cellIndex] === cell){
                  rowspan++
                  for(var z = 0; z < colspan; z++){
                     tableGrid[i][cellIndex - z] = "rowspanned"
                  }
               } else {
                  break
               }
            }

            // Calculate the offset of the content
            let childStyle = ""
            if(layers[cell].y1 - table.rows[rowIndex] > 0) childStyle += `margin-top:${layers[cell].y1 - table.rows[rowIndex]}px;`
            if(cellIndex - (colspan - 1) === 0 && table.columns[0] > 0) childStyle += `margin-left:${table.columns[0]}px;`

            // Calculate cell's size
            let cellStyle = "vertical-align:top;padding:0px;"
            cellStyle += `width:${layers[cell].x2 - layers[cell].x1}px;`
            cellStyle += `height:${layers[cell].y2 - layers[cell].y1}px;`

            // Prepare cell's content
            const cellContent = (layers[cell].children.length === 0) ? getCellContent(layers[cell]) : createTable(layers[cell].children, {width: layers[cell].x2 - layers[cell].x1, height: layers[cell].y2 - layers[cell].y1})
            const isLink = (isURL(layers[cell].title))

            result +=  `   <td style="${cellStyle}" colspan="${colspan}" rowspan="${rowspan}">${(isLink) ? `<a href="${layers[cell].title}" style="text-decoration:none;" target="_blank">` : ""}<div style="${childStyle}${getCellStyle(layers[cell])}">${cellContent}</div>${(isLink) ? `</a>` : ""}</td>\n`

            colspan = 1

         }

      })

      result += ` </tr>\n`

   })

   return `${result}\n</table>`

}

function relatativePosition(layout: Layer[], offset: {x: number, y: number}){

   for(var i=0; i < layout.length; i++){

      if(layout[i].children.length > 0){
         layout[i].children = relatativePosition(layout[i].children, {x: layout[i].x1 + layout[i].border, y: layout[i].y1 + layout[i].border})
      }

      layout[i].x1 -= offset.x
      layout[i].x2 -= offset.x
      layout[i].y1 -= offset.y
      layout[i].y2 -= offset.y

   }

   return layout

}

function getCellContent(layer: Layer){

   if(layer.source && layer.source.length > 0){
      return `<img src="${layer.source}" width="${layer.x2 - layer.x1 - layer.border*2}" height="${layer.y2 - layer.y1 - layer.border*2}" alt="${layer.title}"/>`
   }

   if(layer.content && layer.content.length > 0){

      let content = ""

      layer.content.forEach(textLayer => {

         let style = ""
         let linkStyle = "text-decoration:none;"

         for (var attribute in textLayer.css) {
            if(!textLayer.css.hasOwnProperty(attribute)) continue
            if(attribute == "text-decoration") linkStyle = ``
            style += `${attribute}:${textLayer.css[attribute]};`
         }

         const isLink = isURL(textLayer.text)

         if(isLink){
            content += `<a href="${(isEmail(textLayer.text)) ? "mailto:" : ""}${textLayer.text}" style="${linkStyle}${style}" target="_blank" style="${style}">${textLayer.text}</a>`
         } else {
            content += `<span style="${style}">${textLayer.text.replace("\n","<br/>")}</span>`
         }


      })


      return content


   }

   return ""

}

function getCellStyle(layer: Layer, onlyCSS?: boolean){

   let style = "display:block;"

   style += `width:${layer.x2 - layer.x1 - layer.border*2}px;`
   style += `height:${layer.y2 - layer.y1 - layer.border*2}px;`

   for (var attribute in layer.css) {

      if(!layer.css.hasOwnProperty(attribute)) continue
      if(layer.source && attribute == "background-color") continue

      style += `${attribute}:${layer.css[attribute]};`

   }

   if(layer.children.length > 0 && layer.source){
      style += `background-image:url(${layer.source});background-size:100% 100%;`
   }

   return style

}

function appendLayers(layout: Layer[], currentLayer: Layer){

   var appended = false

   layout.forEach((layer, layerIndex, layoutObj) => {

      if(appended) return

      if(currentLayer.x1 >= layer.x1 && currentLayer.y1 >= layer.y1 && currentLayer.x2 <= layer.x2 && currentLayer.y2 <= layer.y2){
         layoutObj[layerIndex].children = appendLayers(layer.children, currentLayer)
         appended = true
      }

   })

   if(!appended) layout.push(currentLayer)

   return layout

}

function sketchToLayers(layerGroup: MSLayer[], offset?: {x: number, y: number}){

   let layers: Layer[] = []
   let assets: string[] = []

   layerGroup.forEach((layer, type) => {

      if(layer.isVisible() && (!offset || !layer.parentGroup().isLayerExportable())){

         if(layer.class() == MSSymbolInstance && !layer.isLayerExportable()){


               const children = sketchToLayers( layer.symbolMaster().layers(), {x: layer.frame().x()  + ((offset) ? offset.x : 0), y: layer.frame().y()  + ((offset) ? offset.y : 0)})

               layers = layers.concat(children.layers)
               assets = assets.concat(children.assets)

         } else

         if(layer.class() == MSLayerGroup && !layer.isLayerExportable()){

            if(!offset){

               const children = sketchToLayers(layer.children(), {x: layer.frame().x(), y: layer.frame().y()})

               layers = layers.concat(children.layers)
               assets = assets.concat(children.assets)

            }

         } else {

            if([MSLayerGroup, MSTextLayer, MSShapeGroup, MSBitmapLayer].indexOf(layer.class()) > -1){

               const layerCSS = getCSS(layer)

               const borderWidth = (layerCSS["border"]) ? parseFloat(layerCSS["border"].split(" ")[0]) : 0

               layers.push({
                  id: unescape(layer.objectID()),
                  title: unescape(layer.name()),
                  x1: layer.frame().x() + ((offset) ? offset.x : 0),
                  y1: layer.frame().y() + ((offset) ? offset.y : 0),
                  x2: layer.frame().x() + layer.frame().width()  + ((offset) ? offset.x : 0),
                  y2: layer.frame().y() + layer.frame().height()  + ((offset) ? offset.y : 0),
                  border: borderWidth,
                  css: layerCSS,
                  content: (layer.class() == MSTextLayer) ? splitText(layer) : null,
                  source: (layer.isLayerExportable()) ? `assets/${unescape(layer.objectID())}@2x.png` : null,
                  children: []
               })

            }

            if(layer.isLayerExportable()){
               assets.push(unescape(layer.objectID()))
            }

         }

      }

   })

   return {layers: layers, assets: assets}

}

function splitText(layer: MSLayer){

   const textStorage = layer.createTextStorage()
   const attributeRuns = textStorage.attributeRuns()
   const attributeRunsCount = attributeRuns.count()

   const fontWeights = ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"]
   const fontStyles = ["italic", "oblique"]

   var textElements: {
      text: string,
      css: any
   }[] = []

   for(var i = 0; i < attributeRunsCount; i++) {

      var obj = attributeRuns.objectAtIndex(i)

      var textAttributes = {
         text: "",
         css: {}
      }

      textAttributes.text = unescape(obj.string())

      var font = obj.font()

      const fontFamily = unescape(font.familyName())
      const fontName = unescape(font.displayName())
      const fontVariants = fontName.substr(fontFamily.length + 1).split(" ")

      const fontWeight = fontVariants.filter(variant => fontWeights.indexOf(variant.toLowerCase()) > -1)
      if(fontWeight.length == 1) textAttributes.css["font-weight"] = (fontWeights.indexOf(fontWeight[0].toLowerCase()) + 1) * 100

      const fontStyle = fontVariants.filter(variant => fontStyles.indexOf(variant.toLowerCase()) > -1)
      if(fontStyle.length == 1) textAttributes.css["font-style"] = fontStyle[0].toLowerCase()

      if(obj.attribute_atIndex_effectiveRange_("NSUnderline", 0, null)){
         textAttributes.css["text-decoration"] = "underline"
      }

      textAttributes.css["font-family"] = `'${fontFamily}'`
      textAttributes.css["font-size"] = font.pointSize() + 'px'

      var color = obj.foregroundColor().colorUsingColorSpaceName(NSCalibratedRGBColorSpace)
      textAttributes.css["opacity"] = color.alphaComponent()
      textAttributes.css["color"] = NSrgbaToHex(color)

      textElements.push(textAttributes)

   }

   return textElements

}

function getCSS(layer: MSLayer){

   var properties = parseCSSAttributes(layer.CSSAttributes().slice(1))

   if(layer.class() === MSTextLayer){

      const textAlignment = [
         'left', 'right', 'center', 'justify'
      ][layer.textAlignment()]
      if(textAlignment) properties["text-align"] = textAlignment

      var textDecoration: string = null
      if(layer.styleAttributes().NSStrikethrough) textDecoration = 'line-through'
      if(layer.styleAttributes().NSUnderline) textDecoration = 'underline'
      if(textDecoration) properties["text-decoration"] = textDecoration

      var textTransform: string = null
      if(layer.styleAttributes().MSAttributedStringTextTransformAttribute === 1) textTransform = 'uppercase'
      if(layer.styleAttributes().MSAttributedStringTextTransformAttribute === 2) textTransform = 'lowercase'
      if(textTransform) properties["text-transform"] = textTransform
   }

   return properties

}

function parseCSSAttributes(attributes){

   var result = {}

   attributes.forEach(function (property) {

      var parts = property.split(': ')
      if (parts.length !== 2) return

      var propName = parts[0]
      var propValue = parts[1].replace(';', '')

      switch (propName) {
         case "background":
         propName = "background-color"
         break
      }

      result[propName] = propValue

   })

   return result

}
