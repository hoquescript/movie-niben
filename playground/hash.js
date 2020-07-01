const bcrypt = require("bcrypt");

async function run(){
    const salt = await bcrypt.genSalt(30);
    console.log(salt)
    const hash = await bcrypt.hash('1234', salt)
    console.log(hash)
}

run()