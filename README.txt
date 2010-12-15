INSTALLATION AND USAGE NOTES

* Version 0.1:
- Initial version

* Version 0.3:
- Added support for exporting layer groups
- Made updating the QML file optional
- Fixed a bug preventing files with groups from exporting
- Set Export as default button
- Fixed a problem with unique ID's

* Version 0.4:
- Added progressbar and cancel button

Usage:

"Element name"
- This is the name of the output QML file

"Output Folder"
- The folder containing exported files. Files are replaced 
  without warning.

"Rasterize text"
- Force text layers to be exported as images and not text
  elements

"Group layers"
- This will export each top-level group as a merged
  QML Image element.

"Export hidden"
- If checked, hidden layers are exported but their
  visible property is set to false

"Export QML"
- Uncheck this if you have modified your QML document by
  hand but still want to re-export graphical assets.


Output:
- Layers and groups are exported as image elements in 
  the root.qml file and png images are dumped into the 
  images subirectory.
- Text items are exported as Text elements



Notes: 
- Files are replaced without warning!
- The script has only been tested on Photoshop CS5 and CS4 and 
may or may not work on previous versions.


Known issues:
- The font names are not really mapped accurately at the
moment.



Installation: 

Copy "Export QML.jsx" into your 
  "Photoshop/Plugins/Presets/Scripts" 
  directory. It should now show up under
  "File/Scripts/Export QML"
