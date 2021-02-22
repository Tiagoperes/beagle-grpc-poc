import { createBeagleUIService } from '@zup-it/beagle-react'
import { createGrpcClient } from './grpc-client'

export default createBeagleUIService({
  baseUrl: 'grpc://',
  components: {},
  fetchData: createGrpcClient({ proxyAddress: 'http://localhost:8081' })
})
