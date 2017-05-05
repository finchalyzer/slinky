import { dialog } from "./Appkit"

export function getValue(context: SketchContext, identifier: string, parentID: string){

   const panels = getPanel(identifier, parentID)
   if(!panels || !panels.panel) return

   const output = unescape(panels.panel.stringByEvaluatingJavaScriptFromString("getValue()"))

   return output

}

export function setValue(context: SketchContext, identifier: string, parentID: string, value: string){

   const panels = getPanel(identifier, parentID)
   if(!panels || !panels.panel) return

   panels.panel.stringByEvaluatingJavaScriptFromString(`setValue('${value}')`)

}

export function createPanel(context: SketchContext, identifier: string, parentID: string, size: {width: number, height: number}, remove: boolean){

   const document= NSClassFromString("MSDocument").performSelector(NSSelectorFromString("currentDocument"))
   const panels = getPanel(identifier, parentID)

   if(remove){

      if(panels.panel){

         panels.panel.removeFromSuperview()

         var parentFrame = panels.container.frame()
         parentFrame.size.height = parentFrame.size.height - size.height
         panels.container.setFrame(parentFrame)

         document.inspectorController().selectionDidChangeTo(context.selection)
      }

   } else
   if(!panels.panel){

      const panel = WebView.alloc().init()
      var childFrame = panel.frame()
      childFrame.size.width = size.width
      childFrame.size.height = size.height

      panel.setFrame(childFrame)
      panel.identifier = identifier

      const url = unescape(context.plugin.urlForResourceNamed("slinky.html"))
      panel.setMainFrameURL_(url)

      panels.container.addSubview(panel)

      var parentFrame = panels.container.frame()
      parentFrame.size.height = parentFrame.size.height + size.height
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
