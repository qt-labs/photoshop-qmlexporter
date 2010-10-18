import Qt 4.7
Rectangle {
    width:400
    height:255
    Image {
        id:background
        source:"images/background.png"
        x:-2
        y:0
        opacity:1
    }
    Image {
        id:new_layer_1
        source:"images/new_layer_1.png"
        x:1
        y:64
        opacity:0.2
    }
    Image {
        id:new_layer
        source:"images/new_layer.png"
        x:63
        y:161
        opacity:1
    }
    Image {
        id:new_layer_copy
        source:"images/new_layer_copy.png"
        x:136
        y:12
        opacity:1
    }
    Text {
        id:push_me
        text:"Push me"
        font.pixelSize:22
        font.family:"Tahoma"
        color:Qt.rgba(255,255,255, 1.0)
        smooth:true
        x:164
        y:17.5
        opacity:1
    }
    Image {
        id:drop_shadow_2
        source:"images/drop_shadow_2.png"
        x:22
        y:75
        opacity:0.3843137254902
    }
    Image {
        id:background_text
        source:"images/background_text.png"
        x:24
        y:77
        opacity:1
    }
    Image {
        id:drop_shadow_1
        source:"images/drop_shadow_1.png"
        x:296
        y:158
        opacity:0.8
    }
    Image {
        id:mybutton
        source:"images/mybutton.png"
        x:309
        y:168
        opacity:1
    }
    Image {
        id:new_layer_copy_1
        source:"images/new_layer_copy_1.png"
        x:116
        y:145
        opacity:0.63921568627451
    }
    Image {
        id:drop_shadow
        source:"images/drop_shadow.png"
        x:139
        y:112
        opacity:0.8
    }
    Image {
        id:new_layer_copy_2
        source:"images/new_layer_copy_2.png"
        x:159
        y:121
        opacity:0.63921568627451
    }
    Image {
        id:drop_shadow_3
        source:"images/drop_shadow_3.png"
        x:315
        y:194
        opacity:0.57254901960784
    }
    Text {
        id:button
        text:"Button"
        font.pixelSize:30
        font.family:"Tahoma"
        color:Qt.rgba(255,255,255, 1.0)
        smooth:true
        x:187
        y:128.5
        opacity:1
    }
    Image {
        id:qml
        source:"images/qml.png"
        x:319
        y:197
        opacity:1
    }
}
