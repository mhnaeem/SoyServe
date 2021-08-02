const SoyBuilder = require("../src/builder");

new SoyBuilder(process.argv)
    .start()
    .then(e => console.log("Successful"))
    .catch(e => {
        console.log("Opps! Something bad happened: " + e.toString());
    })
