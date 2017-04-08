import { convert } from "./convert"
import { dialog, saveDialog, saveFile, exportAssets } from "./AppKit"
import { slugify } from "./helpers"

function exportHTML(context?: SketchContext) {

   if(!context) return

   const artboard = context.document.currentPage().currentArtboard()

   if(!artboard){
      dialog("Select an artboard first!", "⚠️ Slinky")
      return
   }

   let exportPath = saveDialog("Export template to",{
      promptTitle: "Export",
      fileName: `${slugify(artboard.name())}.html`
   })

   if(!exportPath) return

   const content = convert(artboard)

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

const defaultFunc = exportHTML()
