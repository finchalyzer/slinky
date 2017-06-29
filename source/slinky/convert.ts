import clone from "lodash-es/clone"

import { rgbaToHex, NSrgbaToHex, isURL, formatLink, indent, expandCSS, contractCSS, isCircle } from "./helpers"
import { template } from "./layout"

export function convert(artboard: MSArtboardGroup, command: MSPluginCommand, sketchVersion: number){

   // Get all visible layers from the artboard
   const data = sketchToLayers(artboard.layers(), null, command)

   let offset ={
      minX: artboard.frame().width(),
      maxX: 0,
   }

   // Append layer to the layer containing it
   for(var i = data.layers.length - 1; i >= 0; i--){
      if(data.layers[i].x1 < offset.minX) offset.minX = data.layers[i].x1
      if(data.layers[i].x2 > offset.maxX) offset.maxX = data.layers[i].x2

      const layer = clone(data.layers[i])
      data.layers.splice(i, 1)

      appendLayers(data.layers, layer)
   }

   // Change absolute positions to relative
   const layout = relatativePosition(data.layers, {x: 0, y: 0})

   // Create the table layout
   let table = createTable(layout, {
      width: offset.maxX,
      height: artboard.frame().height(),
      originalWidth: offset.maxX,
      originalHeight: artboard.frame().height(),
      offsetX: 0,
      offsetY: 0,
      depth: 3
   })


   const bodyBackground = (sketchVersion < 44) ? artboard.backgroundColorGeneric() : artboard.backgroundColor()

   return {
      table: template(rgbaToHex(bodyBackground), table),
      assets: data.assets
   }

}


function createTable(layers: Layer[], size: TableSize){

   // Sort layers to start from upper left position
   layers = layers.sort((a, b) => a.x1 - b.x1)
   layers = layers.sort((a, b) => a.y1 - b.y1)

   // Filter layers to current table viewport
   layers = layers.filter(layer => (layer.x1 >= size.offsetX && layer.x2 <= size.width + size.offsetX && layer.y1 >= size.offsetY && layer.y2 <= size.height + size.offsetY))

   // Adjust the new coords
   if(size.offsetX || size.offsetY){
      for(var i=0; i < layers.length; i++){
         layers[i].x1 -= size.offsetX
         layers[i].x2 -= size.offsetX
         layers[i].y1 -= size.offsetY
         layers[i].y2 -= size.offsetY
      }
   }

   // Table holds the final table columns and rows
   let table = {
      columns : [0, size.width],
      rows: [0, size.height]
   }

   // Add table column and row position based on layer position
   layers.forEach(layer => {
      if(table.rows.indexOf(layer.y1) < 0) table.rows.push(layer.y1)
      if(table.rows.indexOf(layer.y2) < 0) table.rows.push(layer.y2)

      if(table.columns.indexOf(layer.x1) < 0) table.columns.push(layer.x1)
      if(table.columns.indexOf(layer.x2) <  0) table.columns.push(layer.x2)
   })

   table.rows = table.rows.sort((a, b) => a - b)
   table.columns = table.columns.sort((a, b) => a - b)

   // Table grid holds final table cell content
   let tableGrid = []

   for(var row = 0; row < table.rows.length - 1; row ++){
      for(var column = 0; column < table.columns.length - 1; column ++){

         let cellContent = null

         layers.forEach((layer, layerIndex) => {
            if (layer.x1 < table.columns[column+1] && layer.x2 > table.columns[column] && layer.y1 < table.rows[row+1] && layer.y2 > table.rows[row]){
               cellContent = layerIndex
            }
         })

         if(!tableGrid[row]) tableGrid[row] = []
         tableGrid[row].push(cellContent)

      }
   }

   // Start result with table wrapper
   let result = indent(size.depth, `<table style="border-collapse:collapse;table-layout:fixed;width:${size.width}px;height:${size.height}px;margin:auto;" border="0" width="${size.width}" height="${size.height}">`)

   // Append <col> widths to result
   if(table.columns.length > 2){

      result += indent(size.depth + 1, `<colgroup>`)

      var cols = ""

      for(var column = 0; column < table.columns.length - 1; column ++){

         let cellWidth = table.columns[column + 1] - table.columns[column]

         if(column === 0 && table.columns[0] > 0) cellWidth += table.columns[0]

         cols += `<col style="width:${cellWidth}px;"/>`

      }

      result += indent(size.depth + 2, cols)
      result += indent(size.depth + 1, "</colgroup>")
   }

   // Parse the tableGrid content
   tableGrid.forEach((row, rowIndex) => {

      result += indent(size.depth + 1, `<tr>`)

      let colspan = 1
      let empty = false

      row.forEach((cell, colIndex) => {

         // The cell is part of a cell with rowspan > 1, ignore it
         if(cell === "rowspanned"){

         } else

         // An empty cell, fill with &shy
         if(typeof cell !== "number"){

            var cellWidth = table.columns[colIndex + 1] - table.columns[colIndex + 1 - colspan]

            if(colIndex == tableGrid[0].length - 1 || (typeof tableGrid[rowIndex][colIndex + 1] === "number" || tableGrid[rowIndex][colIndex + 1] === "rowspanned" )){
               result += indent(size.depth + 2, `<td colspan="${colspan}" style="width:${cellWidth}px;height:${table.rows[rowIndex + 1] - table.rows[rowIndex]}px">&shy;</td>`)
               colspan = 1
               empty = false
            } else {
               colspan ++
               empty = true
            }
         } else

         // The next cell is the same, don't output anything yet
         if(colIndex < tableGrid[0].length - 1 && tableGrid[rowIndex][colIndex + 1] === cell){
            colspan ++
         } else

         // Finally, output the cells content
         {

            // Calculate rowspan
            let rowspan = 1
            for(var i = rowIndex + 1; i < tableGrid.length; i ++){
               if(tableGrid[i][colIndex] === cell && tableGrid[i][colIndex + 1] !== cell){

                  var isFilled = true

                  for(var z = 0; z < colspan; z++){
                     if(tableGrid[i][colIndex - z] !== cell) isFilled = false
                  }

                  if(isFilled){

                     for(var z = 0; z < colspan; z++){
                        tableGrid[i][colIndex - z] = "rowspanned"
                     }
                     rowspan++

                  } else {
                     break
                  }

               } else {
                  break
               }
            }

            // Caluclate cell size
            var cellWidth = table.columns[colIndex + 1] - table.columns[colIndex + 1 - colspan]
            var cellHeight = table.rows[rowIndex + rowspan] - table.rows[rowIndex]

            // Calculate the offset of the content
            let cellOffsetX = (colIndex - (colspan - 1) === 0 && table.columns[0] > 0) ? table.columns[0] : 0
            let cellOffsetY = (layers[cell].y1 - table.rows[rowIndex] > 0) ? layers[cell].y1 - table.rows[rowIndex] : 0

            let cellStyle = "vertical-align:top;padding:0px;"
            cellStyle += `width:${cellWidth}px;`
            cellStyle += `height:${cellHeight}px;`

            //Caluclate child's size
            if(cellOffsetX) cellWidth -= cellOffsetX
            if(cellOffsetY) cellHeight -= cellOffsetY

            const childTableSize = {
               width: cellWidth,
               height: cellHeight,
               originalWidth: layers[cell].x2 - layers[cell].x1,
               originalHeight: layers[cell].y2 - layers[cell].y1,
               offsetX: table.columns[colIndex - colspan + 1] - layers[cell].x1,
               offsetY: table.rows[rowIndex] - layers[cell].y1,
               depth: size.depth + 4
            }

            // Prepare cell's content
            const cellContent = (layers[cell].children.length === 0) ? getCellContent(layers[cell], size.depth, childTableSize) : createTable(layers[cell].children, childTableSize)

            result +=  indent(size.depth + 2, `<td style="${cellStyle}" colspan="${colspan}" rowspan="${rowspan}">`)

            if(layers[cell].url) result += indent(size.depth + 3, `<a href="${formatLink(layers[cell].url)}" style="text-decoration:none;">`)

            result +=  indent(size.depth + 3, `<div style="${getCellStyle(layers[cell], childTableSize, {x: cellOffsetX, y: cellOffsetY})}">`)
            result +=  cellContent
            result +=  indent(size.depth + 3, `</div>`)

            if(layers[cell].url) result += indent(size.depth + 3, `</a>`)

            result +=  indent(size.depth + 2, `</td>`)

            colspan = 1

         }

      })

      result += indent(size.depth + 1, `</tr>`)

   })

   return `${result}${indent(size.depth, `</table>`)}`

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

function getCellContent(layer: Layer, depth: number, size: TableSize){

   depth += 4

   if(size.offsetX > 0 || size.offsetY >0 ) return ""

   if(layer.source && layer.source.length > 0){
      return indent(depth, `<img src="${layer.source}" style="display:block;" width="${layer.x2 - layer.x1 - layer.border*2}" height="${layer.y2 - layer.y1 - layer.border*2}" alt="${layer.title}"/>`)
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

         if(isLink && !layer.url){
            content += indent(depth, `<a href="${formatLink(textLayer.text)}" style="${linkStyle}${style}" style="${style}">${textLayer.text}</a>`)
         } else {
            content += indent(depth, `<span style="${style}">${textLayer.text.replace("\n","<br/>")}</span>`)
         }


      })

      return content

   }

   return ""

}

function getCellStyle(layer: Layer, size: TableSize, offset: {x: number, y: number}){

   let style = "display:block;"

   let width = size.width
   let height = size.height

   if(offset.x) style += `margin-left:${offset.x}px;`
   if(offset.y) style += `margin-top:${offset.y}px;`

   for (var attribute in layer.css) {

      if(!layer.css.hasOwnProperty(attribute)) continue
      if(layer.source && attribute == "background-color") continue

      let value = layer.css[attribute] + ";"

      // For split cells, fix style that does not happen in current viewport
      if(attribute == "border-radius"){

         let values = expandCSS(layer.css[attribute])

         if(size.offsetX) {
            values[0] = "0"
            values[3] = "0"
         }

         if(size.offsetY) {
            values[0] = "0"
            values[1] = "0"
         }

         if(size.originalWidth > size.width + size.offsetX) {
            values[1] = "0"
            values[2] = "0"
         }

         if(size.originalHeight > size.height + size.offsetY) {
            values[2] = "0"
            values[3] = "0"
         }

         style += `${attribute}:${contractCSS(values)};`

      } else

      if(attribute == "border"){

         if(size.width != size.originalWidth || size.height != size.originalHeight){

            let values = []

            if(!size.offsetX) {
               values.push(`border-left:${value}`)
               width -= layer.border
            }

            if(!size.offsetY) {
               values.push(`border-top:${value}`)
               height -= layer.border
            }

            if(size.originalWidth <= size.width + size.offsetX) {
               values.push(`border-right:${value}`)
               width -= layer.border
            }

            if(size.originalHeight <= size.height + size.offsetY) {
               values.push(`border-bottom:${value}`)
               height -= layer.border
            }

            style += values.join(";")

         } else {

            width  -= layer.border*2
            height -= layer.border*2
            style += `${attribute}:${value}`

         }

      } else

      style += `${attribute}:${value}`

   }

   if(layer.children.length > 0 && layer.source){

      let backgroundSize = Math.floor(size.originalWidth/size.width)*100

      style += `background-image:url(${layer.source});background-size: ${backgroundSize}% auto;`
      if(size.offsetX || size.offsetY){
         style += `background-position:-${size.offsetX}px -${size.offsetY}px;`
      }
   }

   style += `width:${width}px;`
   style += `height:${height}px;`

   return style

}

function appendLayers(layout: Layer[], currentLayer: Layer){

   var appended = false

   for(var i = layout.length - 1; i >= 0; i--){

      if(currentLayer.x1 >= layout[i].x1 && currentLayer.y1 >= layout[i].y1 && currentLayer.x2 <= layout[i].x2 && currentLayer.y2 <= layout[i].y2) {
         appendLayers(layout[i].children, currentLayer)
         appended = true
         break
      }

   }

   if(!appended) layout.push(currentLayer)

}

function sketchToLayers(layerGroup: MSLayer[], offset?: {x: number, y: number}, command: MSPluginCommand){

   let layers: Layer[] = []
   let assets: string[] = []

   layerGroup.forEach((layer, type) => {

      if(layer.isVisible() && (!offset || !layer.parentGroup().isLayerExportable())){

         if(layer.class() == MSSymbolInstance && !layer.isLayerExportable()){

            const children = sketchToLayers( layer.symbolMaster().layers(), {x: layer.frame().x()  + ((offset) ? offset.x : 0), y: layer.frame().y()  + ((offset) ? offset.y : 0)}, command)

            layers = layers.concat(children.layers)
            assets = assets.concat(children.assets)

         } else

         if(layer.class() == MSLayerGroup && !layer.isLayerExportable()){

            if(!offset){

               const children = sketchToLayers(layer.children(), {x: layer.frame().x(), y: layer.frame().y()}, command)

               layers = layers.concat(children.layers)
               assets = assets.concat(children.assets)

            }

         } else {

            if([MSLayerGroup, MSTextLayer, MSShapeGroup, MSBitmapLayer].indexOf(layer.class()) > -1){

               const layerCSS = getCSS(layer)

               const borderWidth = (layerCSS["border"]) ? parseFloat(layerCSS["border"].split(" ")[0]) : 0

               const url = unescape(command.valueForKey_onLayer("hrefURL", layer))

               layers.unshift({
                  id: unescape(layer.objectID()),
                  title: unescape(layer.name()),
                  url: (url.length > 0 && url !== "null") ? url : null,
                  x1: Math.round(layer.frame().x() + ((offset) ? offset.x : 0)),
                  y1: Math.round(layer.frame().y() + ((offset) ? offset.y : 0)),
                  x2: Math.round(layer.frame().x() + layer.frame().width()  + ((offset) ? offset.x : 0)),
                  y2: Math.round(layer.frame().y() + layer.frame().height()  + ((offset) ? offset.y : 0)),
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

   const fontWeights = ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"]
   const fontStyles = ["italic", "oblique"]

   const hasFill = (layer.style().fills().firstObject()) ? true : null

   var textElements: {
      text: string,
      css: any
   }[] = []

   const attributes = layer.attributedStringValue().treeAsDictionary().attributes

   attributes.forEach((attribute)=>{

      const font = attribute.NSFont

      const fontFamily = unescape(font.family)
      const fontName = unescape(font.name)
      const fontVariants = fontName.substr(fontFamily.length + 1).split(" ")

      const fontWeight = fontVariants.filter(variant => fontWeights.indexOf(variant.toLowerCase()) > -1)
      const fontStyle = fontVariants.filter(variant => fontStyles.indexOf(variant.toLowerCase()) > -1)

      const fontColor = layer.attributedStringValue().attribute_atIndex_effectiveRange_("NSColor", attribute.location, null)

      let css = {
         "font-weight": (fontWeight.length == 1) ? (fontWeights.indexOf(fontWeight[0].toLowerCase()) + 1) * 100 + "" : null,
         "font-style": (fontStyle.length == 1) ? fontStyle[0].toLowerCase() : null,
         "text-decoration": (layer.attributedStringValue().attribute_atIndex_effectiveRange_("NSUnderline", attribute.location, null)) ? "underline" : null,
         "font-family": `'${fontFamily}'`,
         "font-size": font.attributes.NSFontSizeAttribute + 'px',
         "color": (!hasFill && fontColor) ? NSrgbaToHex(fontColor) : null,
      }

      for (var propName in css) {
         if (css[propName] === null || css[propName] === undefined) {
            delete css[propName]
         }
      }

      textElements.push({
         text: unescape(attribute.text),
         css: css
      })

   })

   return textElements

}

function getCSS(layer: MSLayer){

   var properties = parseCSSAttributes(layer.CSSAttributes().slice(1))

   if(layer.style().fills().firstObject()){
      properties["color"] = rgbaToHex(layer.style().fills().firstObject().color())
   }

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

   if(isCircle(layer)){
      properties["border-radius"] = "100%"
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
