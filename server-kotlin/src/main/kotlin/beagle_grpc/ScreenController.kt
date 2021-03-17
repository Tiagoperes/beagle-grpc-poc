package beagle_grpc

import beagle.Messages
import beagle.ScreenControllerGrpcKt
import br.com.zup.beagle.serialization.jackson.BeagleSerializationUtil
import com.fasterxml.jackson.core.JacksonException
import io.grpc.Status
import io.grpc.StatusException

open class ScreenController : ScreenControllerGrpcKt.ScreenControllerCoroutineImplBase() {
    // fixme: can we return a real type instead of Any?
    open suspend fun getScreenByName(name: String, parameters: Map<String, Any>, headers: Map<String, String>): Any {
        throw StatusException(
            Status.UNIMPLEMENTED.withDescription(
                "Method ScreenController.getScreenByName is unimplemented"
            )
        )
    }

    override suspend fun getScreen(request: Messages.ScreenRequest): Messages.ViewNode {
        val mapper = BeagleSerializationUtil.beagleObjectMapper()
        val parameters: Map<String, Any> = try {
            mapper.readValue(request.parameters, MutableMap::class.java) as MutableMap<String, Any>
        } catch (err: JacksonException) {
            mapOf()
        }
        // todo: get the real headers
        val headers = HashMap<String, String>()
        val view = getScreenByName(request.name, parameters, headers)
        return asGrpcView(view)
    }
}
