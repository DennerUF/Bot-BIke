const mongoose = require('mongoose');

module.exports = {
    connection(){
    mongoose.connect(process.env.mongoUrl, {useNewUrlParser: true,useUnifiedTopology: true})
    .then(() => {console.log('DataBase connected')})
    .catch((error) => { console.log(error) });
    }

}
