const core = require('@actions/core')
const http = require('@actions/http-client')
const exec = require('@actions/exec')
const { open, readFile } = require('fs/promises')

// TODO: Pack together the code? Test open the e2e.toml file.
// TODO: Make sure that we send the Action version so that old ones can be rejected.
// TODO: Throw error if not on Linux.
const CONFIG_FILENAME = 'e2e.toml'

const getConfigString = async () => {
  try {
    const configBuffer = await readFile(CONFIG_FILENAME)

    return configBuffer.toString()
  } catch (error) {
    throw new Error(`E2E config file named "${CONFIG_FILENAME}" not found in current working directory.`)
  }
}

// most @actions toolkit packages have async methods
async function run() {
  try {
    await getConfigString()
    await exec.exec('zip -r e2e.zip . -x ".git/*" ".github/*"')

    await exec.exec('ls -lah')

    const client = new http.HttpClient('temp')

    const res = await client.postJson('http://host.docker.internal:4444/hej', { temp: 1 })

    console.log('res', res)

    const filehandle = await open('e2e.zip')

    console.log('filehandle', filehandle)

    const res2 = await client.sendStream('POST', 'http://host.docker.internal:4444/stream',
      filehandle.createReadStream())

    console.log('res2', res2)
  } catch (error) {
    console.log(error)
    core.setFailed(error.message);
  }
}

run();
