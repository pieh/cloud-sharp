const express = require(`express`)

const { spawn } = require(`child_process`)
const path = require(`path`)

const app = express()
const port = 8050

let gatsbyProcess
app.use("/", express.json(), (req, res) => {
  setTimeout(() => {
    gatsbyProcess.send({
     type: `GATSBY_CLOUD_IMAGE_SERVICE`,
      action: {
        type: "JOB_FINISHED",
        payload: {
          id: req.body.id,
        }
      },
    })
  }, 10000)

  res.send({ wat: "wat" })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

const gatsbyBin = path.join(
  `node_modules`,
  `gatsby`,
  `dist`,
  `bin`,
  `gatsby.js`
)

gatsbyProcess = spawn(gatsbyBin, [`build`], {
  stdio: [`inherit`, `inherit`, `inherit`, `ipc`],
  env: {
    ...process.env,
    NODE_ENV: `production`,
    ENABLE_GATSBY_REFRESH_ENDPOINT: `true`,
    GATSBY_CLOUD_IMAGE_SERVICE_URL: `http://localhost:${port}`,
  },
})

gatsbyProcess.on(`exit`, exitCode => {
  process.exit(exitCode)
})
