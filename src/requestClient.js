const http = require('@actions/http-client')

const client = new http.HttpClient('e2e-tool-action')

const createRun = async (apiKey) => {
  const url = process.env.BASE_URL || 'http://host.docker.internal:4444'

  const { result } = await client.postJson(`${url}/runs`, {
    apiKey,
    actionVersion: '0.0.1',
  })

  return result
}

const uploadRunZip = async (runId, runZip) => {
  const url = process.env.BASE_URL || 'http://host.docker.internal:4444'
  const zipStream = runZip.createReadStream()

  await client.sendStream('POST', `${url}/runs/${runId}/zip`, zipStream)
}

const pollRunStatus = async (runId) => {
  const url = process.env.BASE_URL || 'http://host.docker.internal:4444'
  const { result } = await client.get(`${url}/runs/${runId}`)

  return result
}

module.exports = {
  createRun,
  uploadRunZip,
  pollRunStatus,
}
