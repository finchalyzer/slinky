function slugify(text) {
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/&/g, '-and-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}
function isURL(string) {
    var pattern = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
    return pattern.test(string);
}
function isEmail(string) {
    var pattern = new RegExp(/^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,14}$/);
    return pattern.test(string);
}
function rgbaToHex(rgba) {
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(Math.floor(rgba.red() * 255)) + componentToHex(Math.floor(rgba.green() * 255)) + componentToHex(Math.floor(rgba.blue() * 255));
}
function NSrgbaToHex(rgba) {
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(Math.floor(rgba.redComponent() * 255)) + componentToHex(Math.floor(rgba.greenComponent() * 255)) + componentToHex(Math.floor(rgba.blueComponent() * 255));
}

function template(bgColor, content) {
    return "<html xmlns=\"http://www.w3.org/1999/xhtml\" style=\"box-sizing: border-box; margin: 0; padding: 0px;\">\n<head>\n   <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n   <meta content=\"text/html; charset=utf-8\" http-equiv=\"Content-Type\">\n</head>\n<body bgcolor=\"" + bgColor + "\" style=\"padding:0px;margin:0px;\">\n   <table bgcolor=\"" + bgColor + "\" style=\"box-sizing: border-box; width: 100%; background-color: " + bgColor + "; margin: 0; padding:0;\">\n      <tr>\n         <td style=\"text-align: center;\" valign=\"top\">\n            " + content + "\n         </td>\n      </tr>\n   </table>\n</body>\n</html>";
}

function convert(artboard) {
    var data = sketchToLayers(artboard.layers());
    var layout = [];
    var offset = {
        minX: artboard.frame().width(),
        maxX: 0,
    };
    data.layers.forEach(function (layer) {
        if (layer.x1 < offset.minX)
            offset.minX = layer.x1;
        if (layer.x2 > offset.maxX)
            offset.maxX = layer.x2;
        layout = appendLayers(layout, layer);
    });
    layout = relatativePosition(layout, { x: offset.minX, y: 0 });
    var table = createTable(layout, {
        width: offset.maxX - offset.minX,
        height: artboard.frame().height()
    });
    var bodyBackground = rgbaToHex(artboard.backgroundColorGeneric());
    return {
        table: template(bodyBackground, table),
        assets: data.assets
    };
}
function createTable(layers, size) {
    layers = layers.sort(function (a, b) { return a.x1 - b.x1; });
    layers = layers.sort(function (a, b) { return a.y1 - b.y1; });
    var table = {
        columns: [],
        rows: [0, size.height]
    };
    var lastRow = 0;
    layers.forEach(function (layer) {
        if (layer.y2 >= lastRow && table.rows.indexOf(layer.y2) < 0)
            table.rows.push(layer.y2);
        if (layer.y1 >= lastRow) {
            if (table.rows.indexOf(layer.y1) < 0)
                table.rows.push(layer.y1);
            lastRow = layer.y2;
        }
        if (table.columns.indexOf(layer.x1) < 0)
            table.columns.push(layer.x1);
        if (table.columns.indexOf(layer.x2) < 0)
            table.columns.push(layer.x2);
    });
    table.rows = table.rows.sort(function (a, b) { return a - b; });
    table.columns = table.columns.sort(function (a, b) { return a - b; });
    var tableGrid = [];
    for (var row = 0; row < table.rows.length - 1; row++) {
        var _loop_1 = function() {
            var cellContent = null;
            layers.forEach(function (layer, layerIndex) {
                if (typeof cellContent === "number")
                    return;
                if (layer.x1 < table.columns[column + 1] && layer.x2 > table.columns[column] && layer.y1 < table.rows[row + 1] && layer.y2 > table.rows[row]) {
                    cellContent = layerIndex;
                }
            });
            if (!tableGrid[row])
                tableGrid[row] = [];
            tableGrid[row].push(cellContent);
        };
        for (var column = 0; column < table.columns.length - 1; column++) {
            _loop_1();
        }
    }
    var result = "<table style=\"border-collapse:collapse;table-layout:fixed;width:" + size.width + "px;margin:auto;\" border=\"0\" width=\"" + size.width + "\" height=\"" + size.height + "\">\n";
    if (table.columns.length > 2) {
        result += "<colgroup>";
        for (var column = 0; column < table.columns.length - 1; column++) {
            var cellWidth = table.columns[column + 1] - table.columns[column];
            if (column === 0 && table.columns[0] > 0)
                cellWidth += table.columns[0];
            if (column === table.columns.length - 2 && table.columns[column + 1] < size.width)
                cellWidth += size.width - table.columns[column + 1];
            result += "<col style=\"width:" + cellWidth + "px;\"/>";
        }
        result += "</colgroup>";
    }
    tableGrid.forEach(function (row, rowIndex) {
        result += " <tr>\n";
        var colspan = 1;
        var empty = false;
        row.forEach(function (cell, cellIndex) {
            var cellWidth = table.columns[cellIndex + 1] - table.columns[cellIndex];
            if (cellIndex === 0 && table.columns[0] > 0)
                cellWidth += table.columns[0];
            if (cell === "rowspanned") {
            }
            else if (typeof cell !== "number") {
                if (cellIndex == tableGrid[0].length - 1 || (typeof tableGrid[rowIndex][cellIndex + 1] === "number" || tableGrid[rowIndex][cellIndex + 1] === "rowspanned")) {
                    result += "   <td colspan=\"" + colspan + "\" style=\"width:" + cellWidth + "px;height:" + (table.rows[rowIndex + 1] - table.rows[rowIndex]) + "px\">&shy;</td>\n";
                    colspan = 1;
                    empty = false;
                }
                else {
                    colspan++;
                    empty = true;
                }
            }
            else if (cellIndex < tableGrid[0].length - 1 && tableGrid[rowIndex][cellIndex + 1] === cell) {
                colspan++;
            }
            else {
                var rowspan = 1;
                for (var i = rowIndex + 1; i < tableGrid.length; i++) {
                    if (tableGrid[i][cellIndex] === cell) {
                        rowspan++;
                        for (var z = 0; z < colspan; z++) {
                            tableGrid[i][cellIndex - z] = "rowspanned";
                        }
                    }
                    else {
                        break;
                    }
                }
                var childStyle = "";
                if (layers[cell].y1 - table.rows[rowIndex] > 0)
                    childStyle += "margin-top:" + (layers[cell].y1 - table.rows[rowIndex]) + "px;";
                if (cellIndex - (colspan - 1) === 0 && table.columns[0] > 0)
                    childStyle += "margin-left:" + table.columns[0] + "px;";
                var cellStyle = "vertical-align:top;padding:0px;";
                cellStyle += "width:" + (layers[cell].x2 - layers[cell].x1) + "px;";
                cellStyle += "height:" + (layers[cell].y2 - layers[cell].y1) + "px;";
                var cellContent = (layers[cell].children.length === 0) ? getCellContent(layers[cell]) : createTable(layers[cell].children, { width: layers[cell].x2 - layers[cell].x1, height: layers[cell].y2 - layers[cell].y1 });
                var isLink = (isURL(layers[cell].title));
                result += "   <td style=\"" + cellStyle + "\" colspan=\"" + colspan + "\" rowspan=\"" + rowspan + "\">" + ((isLink) ? "<a href=\"" + layers[cell].title + "\" style=\"text-decoration:none;\" target=\"_blank\">" : "") + "<div style=\"" + childStyle + getCellStyle(layers[cell]) + "\">" + cellContent + "</div>" + ((isLink) ? "</a>" : "") + "</td>\n";
                colspan = 1;
            }
        });
        result += " </tr>\n";
    });
    return result + "\n</table>";
}
function relatativePosition(layout, offset) {
    for (var i = 0; i < layout.length; i++) {
        if (layout[i].children.length > 0) {
            layout[i].children = relatativePosition(layout[i].children, { x: layout[i].x1 + layout[i].border, y: layout[i].y1 + layout[i].border });
        }
        layout[i].x1 -= offset.x;
        layout[i].x2 -= offset.x;
        layout[i].y1 -= offset.y;
        layout[i].y2 -= offset.y;
    }
    return layout;
}
function getCellContent(layer) {
    if (layer.source && layer.source.length > 0) {
        return "<img src=\"" + layer.source + "\" width=\"" + (layer.x2 - layer.x1 - layer.border * 2) + "\" height=\"" + (layer.y2 - layer.y1 - layer.border * 2) + "\" alt=\"" + layer.title + "\"/>";
    }
    if (layer.content && layer.content.length > 0) {
        var content_1 = "";
        layer.content.forEach(function (textLayer) {
            var style = "";
            var linkStyle = "text-decoration:none;";
            for (var attribute in textLayer.css) {
                if (!textLayer.css.hasOwnProperty(attribute))
                    continue;
                if (attribute == "text-decoration")
                    linkStyle = "";
                style += attribute + ":" + textLayer.css[attribute] + ";";
            }
            var isLink = isURL(textLayer.text);
            if (isLink) {
                content_1 += "<a href=\"" + ((isEmail(textLayer.text)) ? "mailto:" : "") + textLayer.text + "\" style=\"" + linkStyle + style + "\" target=\"_blank\" style=\"" + style + "\">" + textLayer.text + "</a>";
            }
            else {
                content_1 += "<span style=\"" + style + "\">" + textLayer.text.replace("\n", "<br/>") + "</span>";
            }
        });
        return content_1;
    }
    return "";
}
function getCellStyle(layer, onlyCSS) {
    var style = "display:block;";
    style += "width:" + (layer.x2 - layer.x1 - layer.border * 2) + "px;";
    style += "height:" + (layer.y2 - layer.y1 - layer.border * 2) + "px;";
    for (var attribute in layer.css) {
        if (!layer.css.hasOwnProperty(attribute))
            continue;
        if (layer.source && attribute == "background-color")
            continue;
        style += attribute + ":" + layer.css[attribute] + ";";
    }
    if (layer.children.length > 0 && layer.source) {
        style += "background-image:url(" + layer.source + ");background-size:100% 100%;";
    }
    return style;
}
function appendLayers(layout, currentLayer) {
    var appended = false;
    layout.forEach(function (layer, layerIndex, layoutObj) {
        if (appended)
            return;
        if (currentLayer.x1 >= layer.x1 && currentLayer.y1 >= layer.y1 && currentLayer.x2 <= layer.x2 && currentLayer.y2 <= layer.y2) {
            layoutObj[layerIndex].children = appendLayers(layer.children, currentLayer);
            appended = true;
        }
    });
    if (!appended)
        layout.push(currentLayer);
    return layout;
}
function sketchToLayers(layerGroup, offset) {
    var layers = [];
    var assets = [];
    layerGroup.forEach(function (layer, type) {
        if (layer.isVisible() && (!offset || !layer.parentGroup().isLayerExportable())) {
            if (layer.class() == MSSymbolInstance && !layer.isLayerExportable()) {
                var children = sketchToLayers(layer.symbolMaster().layers(), { x: layer.frame().x() + ((offset) ? offset.x : 0), y: layer.frame().y() + ((offset) ? offset.y : 0) });
                layers = layers.concat(children.layers);
                assets = assets.concat(children.assets);
            }
            else if (layer.class() == MSLayerGroup && !layer.isLayerExportable()) {
                if (!offset) {
                    var children = sketchToLayers(layer.children(), { x: layer.frame().x(), y: layer.frame().y() });
                    layers = layers.concat(children.layers);
                    assets = assets.concat(children.assets);
                }
            }
            else {
                if ([MSLayerGroup, MSTextLayer, MSShapeGroup, MSBitmapLayer].indexOf(layer.class()) > -1) {
                    var layerCSS = getCSS(layer);
                    var borderWidth = (layerCSS["border"]) ? parseFloat(layerCSS["border"].split(" ")[0]) : 0;
                    layers.push({
                        id: unescape(layer.objectID()),
                        title: unescape(layer.name()),
                        x1: layer.frame().x() + ((offset) ? offset.x : 0),
                        y1: layer.frame().y() + ((offset) ? offset.y : 0),
                        x2: layer.frame().x() + layer.frame().width() + ((offset) ? offset.x : 0),
                        y2: layer.frame().y() + layer.frame().height() + ((offset) ? offset.y : 0),
                        border: borderWidth,
                        css: layerCSS,
                        content: (layer.class() == MSTextLayer) ? splitText(layer) : null,
                        source: (layer.isLayerExportable()) ? "assets/" + unescape(layer.objectID()) + "@2x.png" : null,
                        children: []
                    });
                }
                if (layer.isLayerExportable()) {
                    assets.push(unescape(layer.objectID()));
                }
            }
        }
    });
    return { layers: layers, assets: assets };
}
function splitText(layer) {
    var textStorage = layer.createTextStorage();
    var attributeRuns = textStorage.attributeRuns();
    var attributeRunsCount = attributeRuns.count();
    var fontWeights = ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"];
    var fontStyles = ["italic", "oblique"];
    var textElements = [];
    for (var i = 0; i < attributeRunsCount; i++) {
        var obj = attributeRuns.objectAtIndex(i);
        var textAttributes = {
            text: "",
            css: {}
        };
        textAttributes.text = unescape(obj.string());
        var font = obj.font();
        var fontFamily = unescape(font.familyName());
        var fontName = unescape(font.displayName());
        var fontVariants = fontName.substr(fontFamily.length + 1).split(" ");
        var fontWeight = fontVariants.filter(function (variant) { return fontWeights.indexOf(variant.toLowerCase()) > -1; });
        if (fontWeight.length == 1)
            textAttributes.css["font-weight"] = (fontWeights.indexOf(fontWeight[0].toLowerCase()) + 1) * 100;
        var fontStyle = fontVariants.filter(function (variant) { return fontStyles.indexOf(variant.toLowerCase()) > -1; });
        if (fontStyle.length == 1)
            textAttributes.css["font-style"] = fontStyle[0].toLowerCase();
        if (obj.attribute_atIndex_effectiveRange_("NSUnderline", 0, null)) {
            textAttributes.css["text-decoration"] = "underline";
        }
        textAttributes.css["font-family"] = "'" + fontFamily + "'";
        textAttributes.css["font-size"] = font.pointSize() + 'px';
        var color = obj.foregroundColor().colorUsingColorSpaceName(NSCalibratedRGBColorSpace);
        textAttributes.css["opacity"] = color.alphaComponent();
        textAttributes.css["color"] = NSrgbaToHex(color);
        textElements.push(textAttributes);
    }
    return textElements;
}
function getCSS(layer) {
    var properties = parseCSSAttributes(layer.CSSAttributes().slice(1));
    if (layer.class() === MSTextLayer) {
        var textAlignment = [
            'left', 'right', 'center', 'justify'
        ][layer.textAlignment()];
        if (textAlignment)
            properties["text-align"] = textAlignment;
        var textDecoration = null;
        if (layer.styleAttributes().NSStrikethrough)
            textDecoration = 'line-through';
        if (layer.styleAttributes().NSUnderline)
            textDecoration = 'underline';
        if (textDecoration)
            properties["text-decoration"] = textDecoration;
        var textTransform = null;
        if (layer.styleAttributes().MSAttributedStringTextTransformAttribute === 1)
            textTransform = 'uppercase';
        if (layer.styleAttributes().MSAttributedStringTextTransformAttribute === 2)
            textTransform = 'lowercase';
        if (textTransform)
            properties["text-transform"] = textTransform;
    }
    return properties;
}
function parseCSSAttributes(attributes) {
    var result = {};
    attributes.forEach(function (property) {
        var parts = property.split(': ');
        if (parts.length !== 2)
            return;
        var propName = parts[0];
        var propValue = parts[1].replace(';', '');
        switch (propName) {
            case "background":
                propName = "background-color";
                break;
        }
        result[propName] = propValue;
    });
    return result;
}

function saveDialog(title, options) {
    var panel = NSSavePanel.savePanel();
    panel.setTitle(title);
    if (options) {
        if (options.promptTitle)
            panel.setPrompt(options.promptTitle);
        if (options.fileName)
            panel.setNameFieldStringValue(options.fileName);
    }
    var result = panel.runModal();
    return (result) ? decodeURIComponent(panel.URL().toString().replace("file://", "")) : null;
}
function saveFile(content, path) {
    var stringData = NSString.stringWithString(content);
    var data = stringData.dataUsingEncoding(NSUTF8StringEncoding);
    return data.writeToFile(path);
}
var sketchtool = NSBundle.mainBundle().pathForResource_ofType_inDirectory("sketchtool", null, "sketchtool/bin");
function exportAssets(context, itemIds, outputFolder) {
    var sketchFile = context.document.fileURL();
    if (!sketchFile || context.document.isDocumentEdited()) {
        NSApplication.sharedApplication().displayDialog_withTitle("To export the assets, save the Sketch file first!", "⚠️ Slinky");
        return;
    }
    else {
        sketchFile = decodeURIComponent(sketchFile.toString().replace("file://", ""));
    }
    context.document.saveDocument(null);
    var command = "/bin/bash";
    var args = [
        "-c",
        "mkdir -p " + outputFolder + " && "
            + sketchtool + ' export ' + 'slices'
            + ' "' + sketchFile + '"'
            + ' --scales=2'
            + ' --formats=png'
            + ' --use-id-for-name=yes'
            + ' --group-contents-only="yes"'
            + ' --save-for-web="no"'
            + ' --overwriting="yes"'
            + ' --compact="yes"'
            + ' --items="' + itemIds.join(",") + '"'
            + ' --output="' + outputFolder.replace("%20", " ") + '"'
    ];
    var task = NSTask.alloc().init();
    var pipe = NSPipe.pipe();
    var errPipe = NSPipe.pipe();
    task.launchPath = command;
    task.arguments = args;
    task.standardOutput = pipe;
    task.standardError = errPipe;
    task.launch();
}

function exportHTML(context) {
    if (!context)
        return;
    var app = NSApplication.sharedApplication();
    var artboard = context.document.currentPage().currentArtboard();
    if (!artboard) {
        app.displayDialog_withTitle("Select an artboard first!", "⚠️ Slinky");
        return;
    }
    var exportPath = saveDialog("Export template to", {
        promptTitle: "Export",
        fileName: slugify(artboard.name()) + ".html"
    });
    if (!exportPath)
        return;
    var content = convert(artboard);
    var result = saveFile(content.table, exportPath);
    exportAssets(context, content.assets, exportPath.substring(0, exportPath.lastIndexOf("/")) + "/assets/");
    if (result) {
        var workspace = NSWorkspace.sharedWorkspace();
        var updateUrl = NSURL.URLWithString("file://" + exportPath);
        workspace.openURL(updateUrl);
    }
    else {
        app.displayDialog_withTitle("Could not export the template :/ \n\nPlease, report an issue at\nhttps://github.com/finchalyzer/slinky", "⚠️ Slinky");
    }
}
var defaultFunc = exportHTML();
