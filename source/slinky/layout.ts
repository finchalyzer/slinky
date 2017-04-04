export function template(bgColor, content){

   return `<html xmlns="http://www.w3.org/1999/xhtml" style="box-sizing: border-box; margin: 0; padding: 0px;">
<head>
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
</head>
<body bgcolor="${bgColor}" style="padding:0px;margin:0px;">
   <table bgcolor="${bgColor}" style="box-sizing: border-box; width: 100%; background-color: ${bgColor}; margin: 0; padding:0;">
      <tr>
         <td style="text-align: center;" valign="top">
            ${content}
         </td>
      </tr>
   </table>
</body>
</html>`
}
