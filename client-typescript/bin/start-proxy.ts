import { exec, ChildProcess, ExecOptions } from 'child_process'

const GO_PATH = '~/go'
const GRPC_WEB_PROXY_PATH = `${GO_PATH}/src/github.com/improbable-eng/grpc-web`
const BACKEND_ADDRESS = 'localhost:50051'
const TLS_CERT_PATH = null
const TLS_KEY_PATH = null
const HTTP_PORT = '8081'

function run(cmd: string, options?: ExecOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = exec(cmd, options, (err, stdout, stderr) => {
      stdout && console.log(stdout)
      stderr && console.log(stderr)
      if (err) reject(err)
    })
    process.on('close', resolve)
  })
}

async function install() {
  await run(`git clone https://github.com/improbable-eng/grpc-web.git ${GO_PATH}/src/github.com/improbable-eng/grpc-web`)
  await run('dep ensure', { cwd: GRPC_WEB_PROXY_PATH })
  await run('go install ./go/grpcwebproxy', { cwd: GRPC_WEB_PROXY_PATH })
}

async function start() {
  const tls = TLS_CERT_PATH && TLS_KEY_PATH
    ? `--server_tls_cert_file=${TLS_CERT_PATH} --server_tls_key_file=${TLS_KEY_PATH}`
    : '--run_tls_server=false'
  const startProxy = () => run(`grpcwebproxy --backend_addr=${BACKEND_ADDRESS} --allow_all_origins ${tls} --server_http_debug_port=${HTTP_PORT}`)

  try {
    console.log(`proxy running at localhost:${HTTP_PORT}`)
    await startProxy()
  } catch (err) {
    console.error(err)
    console.error('Failed to start proxy. Installing proxy...')
    try {
      await install()
      await startProxy()
    } catch (err) {
      console.error(err)
      console.error('Failed to install and start the application. Please make sure both go and dep are installed.')
      process.exit(1)
    }
  }
}

start()
