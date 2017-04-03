export function saveDialog(title: string, options?:{promptTitle: string, fileName: string}){

   const panel =  NSSavePanel.savePanel()

   panel.setTitle(title)

   if(options){
      if(options.promptTitle) panel.setPrompt(options.promptTitle)
      if(options.fileName) panel.setNameFieldStringValue(options.fileName)
   }

   const result = panel.runModal()

   return (result) ? decodeURIComponent(panel.URL().toString().replace("file://", "")) : null

}

export function saveFile(content: string, path: string){

   const stringData = NSString.stringWithString(content)
   const data = stringData.dataUsingEncoding(NSUTF8StringEncoding)

   return data.writeToFile(path)

}

/* Assets export thanks to https://github.com/Ashung/Android_Res_Export */

const sketchtool = NSBundle.mainBundle().pathForResource_ofType_inDirectory("sketchtool", null, "sketchtool/bin")

export function exportAssets(context: SketchContext, itemIds: string[], outputFolder: string){

   let sketchFile = context.document.fileURL()

   if(!sketchFile || context.document.isDocumentEdited()){
      NSApplication.sharedApplication().displayDialog_withTitle("To export the assets, save the Sketch file first!", "⚠️ Slinky")
      return
   } else {
      sketchFile = decodeURIComponent(sketchFile.toString().replace("file://", ""))
   }

   context.document.saveDocument(null)

   const command = "/bin/bash"
   const args = [
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
   ]

   var task = NSTask.alloc().init()
   var pipe = NSPipe.pipe()
   var errPipe = NSPipe.pipe()
   task.launchPath = command
   task.arguments = args
   task.standardOutput = pipe
   task.standardError = errPipe
   task.launch()

}
