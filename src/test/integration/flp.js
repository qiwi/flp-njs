import { promisify } from 'util'
import childProcess from 'child_process'
import eventBody from '../resources/event.json'
import axios from 'axios'

const exec = promisify(childProcess.exec)

const port = 8080
const url = `http://localhost:${port}`

describe('flp', () => {
  let containerId
  beforeAll(async () => {
    const { stdout } = await exec(`docker run -d -p 8080:${port} local/flp-njs`)
    containerId = stdout
  })

  it('returns `roger that` to POST /event', async () => {
    const response = await axios.post(url + '/event', eventBody)
    expect(response.data).toEqual('roger that')
  })

  it('returns `roger that` to POST /event-batch', async () => {
    const response = await axios.post(
      url + '/event-batch',
      {
        events: new Array(2).fill(eventBody)
      })
    expect(response.data).toEqual('roger that')
  })

  afterAll(() => {
    exec(`docker kill ${containerId}`)
  })
})

