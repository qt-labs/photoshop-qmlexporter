/*
Photoshop to QML Exporter

Version: 0.1

For information about Qt Quick itself:
http://qt.nokia.com/products/qt-quick/

Author: Jens Bache-wiig
contact: jensbw@gmail.com

Copyright (c) 2010, Nokia
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. All advertising materials mentioning features or use of this software
   must display the following acknowledgement:
   This product includes software developed by the <organization>.
4. Neither the name of the <organization> nor the
   names of its contributors may be used to endorse or promote products
   derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY <COPYRIGHT HOLDER> ''AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

#target photoshop

var mainDialog;
var runButton = 1;
var cancelButton = 2;
var qmlfile;


// Setting keys
var appString = "QML Exporter - 1"
var outputNameKey = 0;
var destinationKey = 1;
var rasterizeKey = 2;

main();

// Converts SolidColor to a QML color property
function qtColor(color) {
    return "Qt.rgba(" + color.rgb.red + "," + color.rgb.green + "," + color.rgb.blue + ", 1.0)";
}

function main() {

    var exportInfo = new Object();

    if (cancelButton == setupDialog(exportInfo)) 
		return 'cancel';

    app.preferences.rulerUnits = Units.PIXELS

    var documentName = app.activeDocument.name;
    app.activeDocument = app.documents[documentName];
    var documentCopy = app.activeDocument.duplicate();
    documentCopy.activeLayer = documentCopy.layers[documentCopy.layers.length - 1];

	
	var elementName = mainDialog.outputName.text;
	if (elementName.indexOf(".qml") == -1) 	// Append .qml unless not explicitly set
		elementName += ".qml"
	
	var outputName = exportInfo.destination + "\\" + elementName;

    var imagefolder = new Folder(exportInfo.destination + "\\images\\");
    imagefolder.create();

	app.activeDocument.suspendHistory("export QML history", "");
    qmlfile = new File(outputName);
    qmlfile.encoding = "UTF8";
    qmlfile.open("w", "TEXT", "");
    qmlfile.write("import Qt 4.7\n");
    qmlfile.write("Rectangle {\n");
    qmlfile.write("    width:" + app.activeDocument.width.as("px") + "\n");
    qmlfile.write("    height:" + app.activeDocument.height.as("px") + "\n");
    exportChildren(documentCopy, app.documents[documentName], exportInfo, documentCopy, exportInfo.fileNamePrefix);
    documentCopy.close(SaveOptions.DONOTSAVECHANGES);
    qmlfile.write("}\n");
    qmlfile.close();
}


function setupDialog(exportInfo) {
    mainDialog = new Window("dialog", "Export Document To QML");
    var brush = mainDialog.graphics.newBrush(mainDialog.graphics.BrushType.THEME_COLOR, "appDialogBackground");
    mainDialog.graphics.backgroundColor = brush;
    mainDialog.graphics.disabledBackgroundColor = mainDialog.graphics.backgroundColor;
    mainDialog.orientation = 'column';
    mainDialog.alignChildren = 'left';

    mainDialog.groupFirstLine = mainDialog.add("group");
    mainDialog.groupFirstLine.orientation = 'row';
    mainDialog.groupFirstLine.alignChildren = 'left';
    mainDialog.groupFirstLine.alignment = 'fill';

    mainDialog.groupSecondLine = mainDialog.add("group");
    mainDialog.groupSecondLine.orientation = 'row';
    mainDialog.groupSecondLine.alignChildren = 'left';

    mainDialog.groupThirdLine = mainDialog.add("group");
    mainDialog.groupThirdLine.orientation = 'row';
    mainDialog.groupThirdLine.alignChildren = 'right';
    mainDialog.groupThirdLine.alignment = 'right';

    mainDialog.groupFirstLine.add("statictext", undefined, "Element Name:");
    mainDialog.groupSecondLine.add("statictext", undefined, "Output Folder:");

    mainDialog.outputName = mainDialog.groupFirstLine.add("edittext", undefined, "MyElement");
	mainDialog.outputName.preferredSize.width = 120
	mainDialog.rasterizeText = mainDialog.groupFirstLine.add("checkbox", undefined, "Rasterize Text");
	
    mainDialog.destinationFolder = mainDialog.groupSecondLine.add("edittext", undefined, "");
    mainDialog.destinationFolder.preferredSize.width = 200;
    mainDialog.buttonBrowse = mainDialog.groupSecondLine.add("button", undefined, "Browse..");

    mainDialog.buttonBrowse.onClick = function () {
        var defaultFolder = defaultFolder = "~";
        var selFolder = Folder.selectDialog("Select destination", defaultFolder);
        if (selFolder != null) mainDialog.destinationFolder.text = selFolder.fsName;
        mainDialog.defaultElement.active = true;
    }

    mainDialog.buttonRun = mainDialog.groupThirdLine.add("button", undefined, "Export");
    mainDialog.buttonRun.onClick = function () {
        var destination = mainDialog.destinationFolder.text;
        if (destination.length == 0) {
            alert("you must specify a destination directory.");
            return;
        }

        var testFolder = new Folder(destination);
        if (!testFolder.exists) {
            alert("The destination directory does not exist.");
            return;
        }
        exportInfo.destination = destination;

        mainDialog.close(runButton);
    }

    mainDialog.buttonCancel = mainDialog.groupThirdLine.add("button", undefined, "Cancel");
    mainDialog.buttonCancel.onClick = function () {
        mainDialog.close(cancelButton);
    }

	try {
		// Try to read saved settings
		var desc = app.getCustomOptions(appString);
		mainDialog.outputName.text = desc.getString(outputNameKey);
		mainDialog.destinationFolder.text = desc.getString(destinationKey);
		mainDialog.rasterizeText.value = desc.getBoolean(rasterizeKey);
	}
	catch(e) { } // Use defaults 	
    
	app.bringToFront();
    mainDialog.center();

    var result = mainDialog.show();
    if (cancelButton != result) {
		var desc = new ActionDescriptor();
		desc.putString(outputNameKey, mainDialog.outputName.text);
		desc.putString(destinationKey, mainDialog.destinationFolder.text);	
		desc.putBoolean(rasterizeKey, mainDialog.rasterizeText.value);
		app.putCustomOptions(appString, desc);
    }
	
    return result;
}

function hideAll(obj) {
    for (var i = 0; i < obj.artLayers.length; i++) {
        obj.artLayers[i].allLocked = false;
        obj.artLayers[i].visible = false;
    }
    for (var i = 0; i < obj.layerSets.length; i++) { // Recursive
        hideAll(obj.layerSets[i]);
    }
}

function exportChildren(dupObj, orgObj, exportInfo, dupDocRef, fileNamePrefix) {
    hideAll(dupObj)
    for (var i = dupObj.artLayers.length - 1; i >= 0; i--) {
        if (i < dupObj.artLayers.length - 1) dupObj.artLayers[i + 1].visible = false

        var currentLayer = dupObj.artLayers[i];
        currentLayer.visible = true

        // Since we already save opacity, we dont want it affecting the output image
        var opacity = currentLayer.opacity / 100.0;
        currentLayer.opacity = 100;

        var layerName = dupObj.artLayers[i].name; // store layer name before change doc
        var fileNameBody = layerName.toLowerCase();

        // Ignore empty text layers
        if (currentLayer.kind == LayerKind.TEXT && currentLayer.textItem.contents == "") continue;

        var documentCopyTmp = dupDocRef.duplicate();
		
        // Trim empty space
        if (activeDocument.activeLayer.isBackgroundLayer == false) {
            app.activeDocument.trim(TrimType.TRANSPARENT);
        }

        fileNameBody = fileNameBody.replace(/[ :\/\\*\?\"\<\>\|#]/g, "_"); // '/\:*?"<>|' -> '_'
        if (fileNameBody.length > 120) {
            fileNameBody = fileNameBody.substring(0, 120);
        }

        var isText = (currentLayer.kind == LayerKind.TEXT && !(mainDialog.rasterizeText.value))

        // Write QML  properties
        if (isText) qmlfile.write("    Text {\n");
        else qmlfile.write("    Image {\n");
        var filename = fileNameBody + ".png";
        qmlfile.write("        id:" + fileNameBody + "\n");

        var xoffset = currentLayer.bounds[0].as("px");
        var yoffset = currentLayer.bounds[1].as("px");

        if (isText) {
            var textItem = currentLayer.textItem;
            qmlfile.write("        text:\"" + textItem.contents + "\"\n");

            // ### Temporary hack to set font positioning
            // Using pointsize doesnt work for some reason and we need to
            // figure out which metric we need to use ascending, perhaps?
            yoffset -= textItem.size.as("px") / 4;

            qmlfile.write("        font.pixelSize:" + Math.floor(textItem.size.as("px")) + "\n");

            //var fontfamily = app.textFonts.getByName(textitem.font);
            qmlfile.write("        font.family:\"" + textItem.font + "\"\n");

            if (textItem.font.indexOf("Bold") != -1) qmlfile.write("        font.bold:true\n");

            if (textItem.font.indexOf("Italic") != -1) qmlfile.write("        font.italic:true\n");

            qmlfile.write("        color:" + qtColor(currentLayer.textItem.color) + "\n");
            qmlfile.write("        smooth:true\n");
        } else {
            qmlfile.write("        source:\"images/" + filename + "\"\n");
        }

        qmlfile.write("        x:" + xoffset + "\n");
        qmlfile.write("        y:" + yoffset + "\n");
        qmlfile.write("        opacity:" + opacity + "\n");
        qmlfile.write("    }\n");

        // Save document
        if (!isText) {
            var saveFile = new File(exportInfo.destination + "\\images\\" + filename);
            pngSaveOptions = new PNGSaveOptions();
            pngSaveOptions.interlaced = false;
            dupObj.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE);
        }

        // Close tempfile
        documentCopyTmp.close(SaveOptions.DONOTSAVECHANGES);
    }

    for (var i = 0; i < dupObj.layerSets.length; i++) {
        var fileNameBody = fileNamePrefix;
        fileNameBody += "_" + "s";
        exportChildren(dupObj.layerSets[i], orgObj.layerSets[i], exportInfo, dupDocRef, fileNameBody); // recursive call
    }
}
