import { convert } from "./convert"
import { dialog, saveDialog, saveFile, exportAssets, getPreferences, setPreferences } from "./AppKit"
import { slugify } from "./helpers"
import { updateSidebar, getValue } from "./sidebar"

function exportHTML(context?: SketchContext) {

   if(!context) return

   const artboard = context.document.currentPage().currentArtboard()
   const command = context.command

   const sketchVersion = parseFloat(context.api().version)

   if(!artboard){
      dialog("Select an artboard first!", "⚠️ Slinky")
      return
   }

   let exportPath = saveDialog("Export template to",{
      promptTitle: "Export",
      fileName: `${slugify(artboard.name())}.html`
   })

   if(!exportPath) return

   const content = convert(artboard, command, sketchVersion)

   const result = saveFile(content.table, exportPath)

   // Export assets
   exportAssets(
      context,
      content.assets,
      exportPath.substring(0, exportPath.lastIndexOf("/")) + "/assets/"
   )

   if(result){
      const workspace = NSWorkspace.sharedWorkspace()
      const updateUrl = NSURL.URLWithString(`file://${exportPath}`)
      workspace.openURL(updateUrl)
   } else {
      dialog("Could not export the template :/ \n\nPlease, report an issue at\nhttps://github.com/finchalyzer/slinky", "⚠️ Slinky")
   }

}

function toggleURL(context?: SketchContext){

   if(!context) return

   const sidebarEnabled = (getPreferences("sidebar") === "1" )
   setPreferences("sidebar", (sidebarEnabled) ? "0" : "1")

   updateSidebar(context, sidebarEnabled)

}


function onSelectionChanged(context?: SketchContext){

   if(!context) return

   const sidebarEnabled = (getPreferences("sidebar") === "1")
   if(!sidebarEnabled) return

   const selection = context.actionContext.oldSelection
   const url = getValue(context)

   if(url !== "multiple"){
      selection.forEach(layer => {

         const value = unescape(context.command.valueForKey_onLayer('hrefURL', layer))

         if(url.length === 0 && value.length === 0) return

         context.command.setValue_forKey_onLayer(url, 'hrefURL', layer)

      })
   }

   updateSidebar(context)

}

const exportHTMLFunc = exportHTML()
const toggleURLFunc = toggleURL()
const selectionChangeFunc = onSelectionChanged()
