// import protoLoader from '@grpc/proto-loader'
// import grpcLibrary from '@grpc/grpc-js'
// 

// const PROTO_PATH = '../../server-kotlin/src/main/proto/**/*.proto'

// async function start() {
//   const files = await glob.__promisify__(PROTO_PATH)
//   const packageDefinition = await protoLoader.load(files)
//   const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition)
// }

import { exec } from 'child_process'
import { rm, mkdir } from 'fs/promises'
import { promisify } from 'util'
import { promise as glob } from 'glob-promise'

// Path to this plugin
const PROTOC_GEN_TS_PATH = './node_modules/.bin/protoc-gen-ts'
// Directory to write generated code to (.js and .d.ts files)
const OUT_DIR = './generated'
// Directory where the proto files are residing
const PROTO_DIR = '../server-kotlin/src/main/proto'
const run = promisify(exec)

async function start() {
  const plugin = `--plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}"`
  const protoPath = `--proto_path=${PROTO_DIR}`
  const jsOut = `--js_out="import_style=commonjs,binary:${OUT_DIR}"`
  const tsOut = `--ts_out="service=grpc-web:${OUT_DIR}"`
  const files = (await glob(`${PROTO_DIR}/**/*.proto`)).join(' ')

  try {
    await rm(OUT_DIR, { recursive: true, force: true })
    await mkdir(OUT_DIR)
    const { stderr, stdout } = await run(`protoc ${plugin} ${protoPath} ${jsOut} ${tsOut} ${files}`)
    console.log(stdout)
    console.error(stderr)
  } catch (err) {
    console.error(err)
    console.error('Please make sure you have protobuf installed in your machine')
    process.exit(1)
  }
}

start()
