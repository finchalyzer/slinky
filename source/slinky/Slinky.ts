import { convert } from "./convert"
import { dialog, saveDialog, saveFile, exportAssets, getPreferences, setPreferences } from "./AppKit"
import { slugify } from "./helpers"
import { createPanel, getValue, setValue } from "./sidebar"

function exportHTML(context?: SketchContext) {

   if(!context) return

   const artboard = context.document.currentPage().currentArtboard()
   const command = context.command

   if(!artboard){
      dialog("Select an artboard first!", "⚠️ Slinky")
      return
   }

   let exportPath = saveDialog("Export template to",{
      promptTitle: "Export",
      fileName: `${slugify(artboard.name())}.html`
   })

   if(!exportPath) return

   const content = convert(artboard, command)

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

   createPanel(context, "slinky_url", "view_coordinates", {width: 230, height: 38}, sidebarEnabled)
}


function onSelectionChanged(context?: SketchContext){

   if(!context) return

   const command = context.command

   const sidebarEnabled = (getPreferences("sidebar") === "1" )
   if(sidebarEnabled){
      createPanel(context, "slinky_url", "view_coordinates", {width: 230, height: 38}, false)
   } else return

   const oldSelection = context.actionContext.oldSelection
   const newSelection = context.actionContext.document.selectedLayers().layers()

   const oldURL = getValue(context, "slinky_url", "view_coordinates")
   let newUrl: string = null

   if(oldURL !== "multiple"){
      oldSelection.forEach(layer =>{
         command.setValue_forKey_onLayer(oldURL,'hrefURL', layer)
      })
   }

   newSelection.forEach(layer => {
      const value = unescape(command.valueForKey_onLayer('hrefURL', layer))
      if(!newUrl) newUrl = value
      if(newUrl !== value) newUrl = "multiple"
   })

   if(!newUrl || newUrl === "null") newUrl = ""

   setValue(context, "slinky_url", "view_coordinates", newUrl)

}

const exportHTMLFunc = exportHTML()
const toggleURLFunc = toggleURL()
const selectionChangeFunc = onSelectionChanged()
