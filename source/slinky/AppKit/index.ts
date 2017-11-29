const pluginIdentifier = "com.sketchapp.slinky-plugin"

// Settings code thanks to Ashung: http://sketchplugins.com/d/134-best-strategy-for-locally-saving-user-data/6
export function setPreferences(key: string, value: string) {

   var settings = NSUserDefaults.standardUserDefaults()
   var preferences = (!settings.dictionaryForKey(pluginIdentifier)) ? NSMutableDictionary.alloc().init() :  NSMutableDictionary.dictionaryWithDictionary(settings.dictionaryForKey(pluginIdentifier))

   preferences.setObject_forKey(value, key)

   settings.setObject_forKey(preferences, pluginIdentifier)
   settings.synchronize()

}

export function getPreferences(key: string) {

    var settings = NSUserDefaults.standardUserDefaults()

    if (!settings.dictionaryForKey(pluginIdentifier)) {

        var preferences = NSMutableDictionary.alloc().init()

        preferences.setObject_forKey("0", "sidebar")

        settings.setObject_forKey(preferences, pluginIdentifier)
        settings.synchronize()

    }

    return unescape(settings.dictionaryForKey(pluginIdentifier).objectForKey(key))

}


export function dialog(message: any, title?: string){

   const app = NSApplication.sharedApplication()

   if(typeof message !== "string") message = JSON.stringify(message)

   app.displayDialog_withTitle(message, title || "Slinky")

}

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

   const args = [
      "-c",
      "-l",
      sketchtool + ' export ' + 'slices'
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
   return runCommand("/bin/mkdir", ["-p", outputFolder])
      && runCommand("/bin/bash", args)
}

function runCommand(command: string, args: string[]) {
  log("Run Command: " + command + " " + args.join(" ") + "")
  var task = NSTask.alloc().init()
  var pipe = NSPipe.pipe()
  var errPipe = NSPipe.pipe()
  task.setLaunchPath_(command)
  task.arguments = args
  task.standardOutput = pipe
  task.standardError = errPipe
  try {
    task.launch()
    task.waitUntilExit()
    return (task.terminationStatus() == 0)
  } catch (e) {
    log("❌ Cannot run command: " + e)
    return false
  }
}
