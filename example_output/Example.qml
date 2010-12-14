import Qt 4.7
Item {
    width:400
    height:255
    Image {
        id: background
        source: "images/background.png"
        x: -2
        y: 0
        opacity: 1
    }
    Image {
        id: new_layer
        source: "images/new_layer.png"
        x: 63
        y: 161
        opacity: 1
    }
    Image {
        id: new_layer_copy_1
        source: "images/new_layer_copy_1.png"
        x: 128
        y: 130
        opacity: 0.63921568627451
    }
    Image {
        id: button
        source: "images/button.png"
        x: 165
        y: 89
        opacity: 1
    }
    Text {
        id: buttonlabel
        text: "Button"
        font.pixelSize: 30
        font.family: "Tahoma"
        color: "#ffffff"
        smooth: true
        x: 216
        y: 108.5
        opacity: 1
    }
    Image {
        id: textcircle
        source: "images/textcircle.png"
        x: 296
        y: 150
        opacity: 1
    }
    Image {
        id: banner
        source: "images/banner.png"
        x: 0
        y: 36
        opacity: 1
    }
}
