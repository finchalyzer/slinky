# Slinky 💎 ✉️
[💾 Download](https://github.com/finchalyzer/slinky/archive/master.zip) | [💎 One-click Install via Sketchpacks](https://sketchpacks.com/finchalyzer/slinky/install) | [🐞 Report an issue](https://github.com/finchalyzer/slinky/issues/new) | [⭐️ Share love](https://github.com/finchalyzer/slinky/stargazers)
## Export your Sketch designs as HTML email templates

![Slinky demo](http://cdn.finch.io/public/slinky.gif)

Slinky is a [Sketch](https://www.sketchapp.com) plugin that allows you to export Sketch artboards as ready–to–send HTML e-mail templates.

### Installation

1. [Download](https://github.com/finchalyzer/slinky/archive/master.zip), unzip and double-click the **Slinky.sketchplugin** file and let Sketch automatically install the plugin for you
2. Open up your Sketch file and select the Artboard with your template design
3. Go to *Plugins -> Slinky -> Export Selected Artboard* from the Sketch top menu bar
4. Choose the folder where to export the template
5. Voilà!

We have prepared some *good to go* Sketch templates located in [templates](https://github.com/finchalyzer/slinky/templates) directory just for you 🎁


## Important Guidelines
Slinky is not perfect _yet_, so to get the best result, there are some things to remember creating you design file:

### ⚠️ Images and icons
Slinky will automatically export image and icon assets, but you need to individually mark them as **Exportable**

![](http://cdn.finch.io/public/slinky-exportable.gif)


### ⚠️ Links
Link support is a bit hacky for now. You have ~~two~~ three options:
   - Name your group/shape/layer as the link you want to use for it. Slinky will catch that and automatically convert that object to a link
   - Slinky will automatically convert to links text layers containing a valid url or email
   - Add the links afterwards in the code or with whatever tool you will use for sending the email

### ⚠️ Layout
Overlapping layers won't work. Slinky respects the good old table layout and some things just don't work there :/

![](http://cdn.finch.io/public/slinky-overlapping.png)

### ⚠️ Fonts
Slinky does not check the template for custom fonts *(yet)* and will export the template as it is. For the safest result across different email clients, we suggest you to use cross-platform fonts only:

- **Sans Serif Safe Fonts**
   - Arial
   - Arial Black
   - Century Gothic
   - Geneva
   - Lucida
   - Lucida Sans
   - Lucida Grande
   - Tahoma
   - Trebuchet MS
   - Verdana

- **Serif Safe Fonts**
   - Courier
   - Courier New
   - Georgia
   - MS Serif
   - Palatino
   - Palatino Linotype
   - Times
   - Times New Roman

## Feedback and support
Slinky is an early experiment by [Finch.io](https://finch.io) team and does only the basic stuff for now. We encourage you to help make Slinky more awesome by reporting issues and feature requests right here at github or via email at [human@finch.io](human@finch.io).
