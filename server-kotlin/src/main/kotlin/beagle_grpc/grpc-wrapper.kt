package beagle_grpc

import beagle.Messages
import br.com.zup.beagle.serialization.jackson.BeagleSerializationUtil

private fun asJsonString(value: Any): String {
    return BeagleSerializationUtil.beagleObjectMapper().writeValueAsString(value)
}

private fun buildDataContext(context: Map<String, Any>): Messages.DataContext {
    val messageBuilder = Messages.DataContext.newBuilder().setId(context["id"] as String)
    if (context["value"] != null) {
        messageBuilder.setValue(asJsonString(context["value"]!!))
    }
    return messageBuilder.build()
}

private fun serializeNodeAttributes(jsonMap: MutableMap<String, Any>): Map<String, Any> {
    val skip = listOf("_beagleComponent_", "context", "id", "style", "children")
    val attributes = HashMap<String, Any>()
    jsonMap.forEach() {
        if (!skip.contains(it.key)) attributes[it.key] = it.value
    }
    return attributes
}

private fun buildNode(jsonMap: MutableMap<String, Any>): Messages.ViewNode {
    val messageBuilder = Messages
        .ViewNode
        .newBuilder()
        .setBeagleComponent(jsonMap["_beagleComponent_"] as String)

    if (jsonMap["id"] != null) messageBuilder.setId(jsonMap["id"] as String)
    if (jsonMap["context"] != null) messageBuilder.setContext(buildDataContext(jsonMap["context"] as Map<String, Any>))
    if (jsonMap["style"] != null) messageBuilder.setStyle(asJsonString(jsonMap["style"]!!))
    if (jsonMap["child"] != null) messageBuilder.setChild(buildNode(jsonMap["child"] as MutableMap<String, Any>))

    val attributes = serializeNodeAttributes(jsonMap)
    if (!attributes.isEmpty()) messageBuilder.setAttributes(asJsonString(attributes))

    val children = jsonMap["children"] as List<MutableMap<String, Any>>?
    if (children?.isEmpty() == false) {
        children.forEach() {
            messageBuilder.addChildren(buildNode(it))
        }
    }

    return messageBuilder.build()
}

fun asGrpcView(widget: Any): Messages.ViewNode {
    val mapper = BeagleSerializationUtil.beagleObjectMapper()
    val jsonString = mapper.writeValueAsString(widget)
    val jsonMap = mapper.readValue(jsonString, MutableMap::class.java) as MutableMap<String, Any>
    try {
        val grpc = buildNode(jsonMap)
        return grpc
    } catch (err: Throwable) {
        err.printStackTrace()
        throw err
    }
}
