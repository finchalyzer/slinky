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
