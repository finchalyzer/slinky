interface NSFont{
   font(): this
   string(): string
   familyName(): string
   displayName(): string
   weightOfFont(): number
   pointSize(): number
   defaultLineHeightForFont(): number
   foregroundColor: any
   attribute_atIndex_effectiveRange_(attribute: string, index: number, range: any)
}

interface NSURL{
   URLWithString(url: string): this
   path(): string
}

interface NSWorkspace{
   sharedWorkspace(): this
   openURL(url: NSURL): void
}

interface NSData{
   writeToFile(path: string): boolean
}

interface NSString{
   stringWithString(input: string): this
   stringWithFormat(format: string): this
   alloc(): this
   dataUsingEncoding(format: any): NSData
   initWithData_encoding_(data: NSData, encoding: any)
}

interface NSApplication {
   sharedApplication(): this
   displayDialog_withTitle(message: string, title: string): void
}

interface NSSavePanel{
   savePanel(): this
   setTitle(title: string): void
   setPrompt(title: string): void
   setNameFieldStringValue(title: string): void
   runModal(): boolean
   URL(): string
}

interface NSBundle{
   mainBundle(): this
   pathForResource_ofType_inDirectory(path: string, type: any, directory: string): void
}

interface NSTask{
   alloc(): this
   init(): this
   launch(): void
   launchPath: string
   arguments: string[]
   standardOutput: NSPipe
   standardError: NSPipe
   terminationStatus(): number
}

interface NSPipe{
   pipe(): this
   fileHandleForReading(): this
   readDataToEndOfFile(): NSData
}

interface NSRect{
   size:{
      width: any
      height: number
   }
}

interface WebView{
   alloc(): this
   init(): this
   frame(): NSRect
   setFrame(NSRect): void
   identifier: string
   loadHTMLString(url: string): void
   addConstraint(any): void
   setNeedsLayout(enabled: boolean): void
   setMainFrameURL_(name: string): void
   stringByEvaluatingJavaScriptFromString(script: string): string
}

interface coscript{
   env(): {
      scriptURL: NSURL
   }
}

interface NSDictionary{
   alloc(): this
   init(): this
   dictionaryForKey(key: string): NSDictionary
   dictionaryWithDictionary(dictionary: NSDictionary): NSDictionary
   dictionaryForKey(key: string): NSDictionary
   setObject_forKey(value: any, key: string): void
   objectForKey(key: string): string
   synchronize(): void
}

interface NSUserDefaults{
   alloc(): this
   standardUserDefaults(): NSDictionary
}

declare var NSMutableDictionary: NSDictionary
declare var NSUserDefaults: NSUserDefaults
declare var coscript: coscript
declare var NSUserName: () => string
declare var WebView: WebView
declare var NSURL: NSURL
declare var NSWorkspace: NSWorkspace
declare var NSPipe: NSPipe
declare var NSTask: NSTask
declare var NSBundle: NSBundle
declare var NSApplication: NSApplication
declare var NSSavePanel: NSSavePanel
declare var NSString: NSString
declare var NSUTF8StringEncoding: any
declare var NSCalibratedRGBColorSpace: any

declare var NSClassFromString: (string: string) => any
declare var NSSelectorFromString: (string: string) => any

declare var NSLayoutAttributeHeight: any
