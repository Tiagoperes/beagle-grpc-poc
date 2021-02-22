package beagle_grpc

import beagle.Messages
import beagle.ScreenControllerGrpcKt
import br.com.zup.beagle.widget.layout.ScreenBuilder

open class ScreenController : ScreenControllerGrpcKt.ScreenControllerCoroutineImplBase() {
    private val builders = HashMap<String, ScreenBuilder>()

    protected fun addScreen(name: String, builder: ScreenBuilder) {
        builders[name] = builder
    }

    protected fun addScreens(definitions: Map<String, ScreenBuilder>) {
        definitions.forEach() {
            builders[it.key] = it.value
        }
    }

    override suspend fun getScreen(request: Messages.ScreenRequest): Messages.ViewNode {
        val builder = builders[request.name] ?: throw Error("Screen with name ${request.name} doesn't exist.")
        val view = builder.build()
        return asGrpcView(view)
    }
}
