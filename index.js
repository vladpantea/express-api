const app = require('./server').app
require('dotenv').load({ silent: true })
const chalk = require('chalk')
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(chalk.blue(`Application running on port: ${PORT}`))
})