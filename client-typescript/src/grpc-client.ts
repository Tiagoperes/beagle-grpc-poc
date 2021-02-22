import { ViewNode, ScreenRequest } from 'grpc/messages_pb'
import { ScreenControllerClient } from 'grpc/screen_pb_service'
import { BeagleUIElement } from '@zup-it/beagle-web'

async function getView(name: string, client: ScreenControllerClient) {
  const request = new ScreenRequest()
  request.setName(name)
  return new Promise<ViewNode>((resolve, reject) => {
    client.getScreen(request, (error, response) => {
      if (error) reject(error)
      else resolve(response)
    })
  })
}

interface GrpcClientOptions {
  proxyAddress: string,
  redirectGrpcFrom?: string,
  customHttpClient?: typeof fetch,
}

const defaultOptions: GrpcClientOptions = {
  proxyAddress: '',
  redirectGrpcFrom: 'grpc://',
  customHttpClient: fetch,
}

function asBeagleElement(view: ViewNode): BeagleUIElement {
  const element: BeagleUIElement = { _beagleComponent_: view.getBeaglecomponent() }

  // context
  if (view.getContext()) {
    element.context = { id: view.getContext().getId() }
    if (view.getContext().getValue()) {
      element.context.value = JSON.parse(view.getContext().getValue())
    }
  }

  // style
  if (view.getStyle()) {
    element.style = JSON.parse(view.getStyle())
  }

  // attributes
  if (view.getAttributes()) {
    const attrs = JSON.parse(view.getAttributes())
    Object.keys(attrs).forEach(key => element[key] = attrs[key])
  }

  // child
  if (view.getChild()) {
    element.child = asBeagleElement(view.getChild())
  }

  // children
  if (view.getChildrenList()) {
    element.children = view.getChildrenList().map(asBeagleElement)
  }

  return element
}

async function fetchGrpcView(name: string, client: ScreenControllerClient): Promise<Response> {
  try {
    const view = await getView(name, client)
    const beagleTree = asBeagleElement(view)
    console.log(beagleTree)
    const blob = new Blob([JSON.stringify(beagleTree)], { type : 'application/json' })
    return new Response(blob, { status: 200, statusText: 'OK' })
  } catch (err) {
    const message = 'message' in err ? err.message : 'Unknown error'
    const blob = new Blob([message], { type : 'text/plain' })
    return new Response(blob, { status: 500, statusText: 'Internal Server Error' })
  }
}

export function createGrpcClient(options: GrpcClientOptions) {
  const { proxyAddress, redirectGrpcFrom, customHttpClient } = { ...defaultOptions, ...options }
  const client = new ScreenControllerClient(proxyAddress)

  const grpcClient: typeof fetch = (...args) => {
    const url = typeof args[0] === 'string' ? args[0] : args[0].url
    if (url.startsWith(redirectGrpcFrom)) {
      return fetchGrpcView(url.replace(new RegExp(`^${redirectGrpcFrom}`), ''), client)
    }
    return customHttpClient(...args)
  }

  return grpcClient
}

