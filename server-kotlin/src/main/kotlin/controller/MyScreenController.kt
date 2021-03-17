package controller

import beagle_grpc.ScreenController
import br.com.zup.beagle.widget.layout.ScreenBuilder
import builder.ButtonScreenBuilder
import builder.TextScreenBuilder

class MyScreenController() : ScreenController() {
    override suspend fun getScreenByName(
        name: String,
        parameters: Map<String, Any>,
        headers: Map<String, String>
    ): Any {
        val builders: Map<String, ScreenBuilder> = mapOf(
            "button" to ButtonScreenBuilder,
            "text" to TextScreenBuilder
        )

        val builder = builders[name] ?: throw Error("Screen with name $name doesn't exist.")
        return builder.build()
    }
}
