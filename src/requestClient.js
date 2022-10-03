const http = require('@actions/http-client')

const client = new http.HttpClient('e2e-tool-action')

const createRun = async (apiKey) => {
  const url = process.env.BASE_URL || 'http://host.docker.internal:4444'

  const { result } = await client.postJSON(`${url}/runs`, {
    apiKey,
    actionVersion: '0.0.1',
  })

  return result
}

const uploadRunZip = async (runId, runZip) => {
  const url = process.env.BASE_URL || 'http://host.docker.internal:4444'
  const zipStream = runZip.createReadStream()

  await client.sendStream('POST', `${url}/stream/${runId}`, zipStream)
}

// TODO: Implement with runId argument.
const pollRunStatus = async () => {

}

module.exports = {
  createRun,
  uploadRunZip,
  pollRunStatus,
}
