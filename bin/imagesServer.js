const express = require("express")
const path = require("path")

const app = express()

const port = 8080

app.use("/images",
    express.static(path.resolve(__dirname, "../data/img"))
)

app.listen(port, () => {
    console.log("Image server running")
})