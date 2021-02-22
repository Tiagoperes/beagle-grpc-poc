import server.GrpcServer

fun main() {
    val port = System.getenv("PORT")?.toInt() ?: 50051
    val server = GrpcServer(port)
    server.start()
    server.blockUntilShutdown()
}
