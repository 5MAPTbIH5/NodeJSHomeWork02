const database = require("./services/db_service")
const Car = require('./models/car')
// const Mark = require('./models/mark')
const express = require('express')
const app = express()
const expressHbs = require('express-handlebars')
const hbs = require('hbs')
const mainRouter = require('./routes/main.routes')


app.set('view engine', 'hbs')
app.engine('hbs', expressHbs({
    layoutsDir: 'views/layouts',
    defaultLayout: 'layout',
    extname: 'hbs'
}))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'))
hbs.registerPartials(__dirname + '/views/partials')


app.use('/', mainRouter)


app.listen(3000)

// async function proces(){
//     // database.add()
//     let data = await database.getCar()
//     data.price = 4000
//     //database.updateCar(data)

//     // database.deleteCar(data)
//     // setTimeout(() => {console.log(data)},2000)

//     // console.log(data);

//     // const cc = new Car(1, 2, 3, 4, 5)
//     // const cc = new Car()

//     // console.log(cc)

// }

// proces()