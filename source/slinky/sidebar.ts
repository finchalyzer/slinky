import { dialog } from "./Appkit"

const sidebarID = "slinky_url"
const sidebarParent = "view_coordinates"
const sideberSize = {
   width: 230,
   height: 38
}

export function getValue(context: SketchContext){

   const panels = getPanel(sidebarID, sidebarParent)
   if(!panels || !panels.panel) return

   const output = unescape(panels.panel.stringByEvaluatingJavaScriptFromString("getValue()"))

   return output

}

export function updateSidebar(context: SketchContext, remove?: boolean){

   const document = NSClassFromString("MSDocument").performSelector(NSSelectorFromString("currentDocument"))
   const panels = getPanel(sidebarID, sidebarParent)

   if(remove){

      if(panels.panel){

         panels.panel.removeFromSuperview()

         var parentFrame = panels.container.frame()
         parentFrame.size.height = parentFrame.size.height - sideberSize.height
         panels.container.setFrame(parentFrame)

         document.inspectorController().selectionDidChangeTo(context.selection)
      }

      return

   }

   let url: string = null
   const selection = document.selectedLayers().layers()

   selection.forEach(layer => {
      const value = unescape(context.command.valueForKey_onLayer('hrefURL', layer))
      if(!url) url = value
      if(url !== value) url = "multiple"
   })

   if(!url || url === "null") url = ""

   if(panels.panel){

      panels.panel.stringByEvaluatingJavaScriptFromString(`setValue('${url}')`)

   } else {

      const panel = WebView.alloc().init()
      var childFrame = panel.frame()
      childFrame.size.width = sideberSize.width
      childFrame.size.height = sideberSize.height

      panel.setFrame(childFrame)
      panel.identifier = sidebarID

      const path = unescape(context.plugin.urlForResourceNamed("slinky.html")) + `#${url}`
      panel.setMainFrameURL_(path)

      panels.container.addSubview(panel)

      var parentFrame = panels.container.frame()
      parentFrame.size.height = parentFrame.size.height + sideberSize.height
      panels.container.setFrame(parentFrame)

      document.inspectorController().selectionDidChangeTo(context.selection)

   }

}

function getPanel( identifier: string, parentID: string){

   const document= NSClassFromString("MSDocument").performSelector(NSSelectorFromString("currentDocument"))

   const contentView = document.inspectorController().view()

   if(!contentView) return null

   const container = viewSearch(contentView, parentID)
   const panel = viewSearch(contentView, identifier)

   return {
      container: container,
      panel: panel
   }

}

function viewSearch(nsview, identifier){

   var found = null

   if(nsview.subviews().length > 0){

      nsview.subviews().forEach(function(subview){

         if(found) return
         if (subview.identifier() == identifier){
            found = subview
         } else {

            found = viewSearch(subview, identifier)

         }
      })
   }

   return found
}
