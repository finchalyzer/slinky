export function template(bgColor, content){

   return `<!doctype html>
<html style="margin: 0; padding: 0px;">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
    <!--[if !mso]><!-- -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <style type="text/css">
        body{
            margin:0;
            padding:0;
            line-height: 1;
        }
        img{
            border:0 none;
            height:auto;
            line-height:100%;
            outline:none;
            text-decoration:none;
            display:block;
        }
            a img{
            border:0 none;
        }
        table, td{
            border-collapse: collapse;
            border-spacing: 0;
            padding:0px;
        }
        #bodyTable{
            height:100% !important;
            margin:0;
            padding:0;
            width:100% !important;
        }
    </style>
</head>
<body bgcolor="${bgColor}" style="padding:0px;margin:0px;">
    <table id="bodyTable" bgcolor="${bgColor}" style="width: 100%; height: 100%; background-color: ${bgColor}; margin: 0; padding:0;">
        <tr>
            <td style="text-align: center;" valign="top">
    ${content}            </td>
        </tr>
    </table>
</body>
</html>`
}
