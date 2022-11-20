const http = require('@actions/http-client')

const client = new http.HttpClient('e2e-tool-action')

// TODO: Require the package.json and test if it works?
const defaultHeaders = {
  'x-action-version': 123,
}

const createRun = async (apiKey) => {
  const url = process.env.BASE_URL || 'http://host.docker.internal:4444'

  const headers = { ...defaultHeaders, 'x-api-key': apiKey }
  // TODO: Take in the Git SHA in the body?
  const { result } = await client.postJson(`${url}/runs`, {}, headers)

  return result?.runId
}

const uploadRunZip = async (apiKey, runId, runZip) => {
  const url = process.env.BASE_URL || 'http://host.docker.internal:4444'
  const zipStream = runZip.createReadStream()

  const headers = { ...defaultHeaders, 'x-api-key': apiKey }

  await client.sendStream('POST', `${url}/runs/${runId}/zip`, zipStream, headers)
}

// TODO: Take in apiKey also.
const pollRunStatus = async (apiKey, runId) => {
  const url = process.env.BASE_URL || 'http://host.docker.internal:4444'

  const headers = { ...defaultHeaders, 'x-api-key': apiKey }

  const { result, statusCode } = await client.getJson(`${url}/runs/${runId}`, headers)

  console.log({
    result,
    statusCode,
  })

  // TODO: Check the createdAt timestamp...
  // Get the durationa and the run-page URL.

  return result
}

module.exports = {
  createRun,
  uploadRunZip,
  pollRunStatus,
}
