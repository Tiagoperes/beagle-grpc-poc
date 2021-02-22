package controller

import beagle_grpc.ScreenController
import builder.ButtonScreenBuilder
import builder.TextScreenBuilder

class MyScreenController() : ScreenController() {
    init {
        super.addScreens(mapOf(
            "button" to ButtonScreenBuilder,
            "text" to TextScreenBuilder,
        ))
    }
}
