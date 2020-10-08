
const mongoose = require('mongoose')
const Car = require('../models/car')
const Mark = require('../models/mark')
const Schema = mongoose.Schema


mongoose.connect('mongodb://localhost:27017/carsdb', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, () => {    
    console.log('Success connection on DB')
})


const markSchema = new Schema({
    name: String
}, {
    versionKey: false
})

const carSchema = new Schema({
    mark: { type: mongoose.Schema.Types.ObjectId, ref: 'marks'},
    model: String,
    yearProduct: Number,
    color: String,
    price: Number,
    pictUrl: String
}, {
    versionKey: false
})
    
const CarDbModel = mongoose.model('cars', carSchema)
const MarkDbModel = mongoose.model('marks', markSchema)


class DbService{

    // async add(){
    //     let markdb = await MarkDbModel.findOne({name: 'Daewoo'})
    //     let car = new CarDbModel({
    //                 mark: markdb,
    //                 model: "Lanos",
    //                 yearProduct: 2010,
    //                 color: "Aqwua",
    //                 price: 4000,
    //                 pictUrl: "https://auto.24tv.ua/resources/photos/news/930x523_DIR/201910/1660652d065b5-eb24-44ef-aa68-be74996f3786.jpg"
    //             })
    //     await car.save((res) =>{            
    //         console.log(`Saved car ${car.model}`)
    //         })
    //     // let markdb = await MarkDbModel.findOne({name: 'Audi'})
    //     // let car = new CarDbModel({
    //     //             mark: markdb,
    //     //             model: "TT",
    //     //             yearProduct: 2001,
    //     //             color: "Green",
    //     //             price: 7000
    //     //         })
    //     // await car.save((res) =>{            
    //     //     console.log(`Saved car ${car.model}`)
    //     //     })
    // }
    
    async addNewCar(someCar) {
        if(someCar !== null && someCar.mark !== undefined && someCar.mark != '' && someCar.model !== undefined && someCar.model != ''){
            let markDb = await MarkDbModel.findById(someCar.mark)
            let res = await CarDbModel.findOne({
                mark: markDb,
                model: someCar.model,
                yearProduct: someCar.yearProduct,
                color: someCar.color,
                price: someCar.price,
                pictUrl: someCar.pictUrl
            })                
            if(res === null){
                console.log(someCar.pictUrl);
                const addedCar = new CarDbModel({
                    mark: markDb,
                    model: someCar.model,
                    yearProduct: someCar.yearProduct,
                    color: someCar.color,
                    price: someCar.price,
                    pictUrl: someCar.pictUrl
                })
                await addedCar.save()
                console.log('Car saved')
                return true
            }
            else{
                console.log('Car already exists')
                return false
            }
        }
        else{
            console.log('Car is broken, aborted')
            return false
        }
    }

    async updateCar(someCar) {
        if(someCar !== null && someCar.mark !== undefined && someCar.model !== undefined){
            console.log('Prepare for update');
            console.log(someCar);
            let markDb = await MarkDbModel.findById(someCar.mark)
            await CarDbModel.findByIdAndUpdate(someCar.id, {$set: {
                mark: markDb,
                model: someCar.model,
                yearProduct: someCar.yearProduct,
                color: someCar.color,
                price: someCar.price,
                pictUri: someCar.pictUri
            }})
            console.log(`Car ${markDb.name} - ${someCar.model} updated`)
            return true
        }
        else{
            console.log('Car is broken for update, aborted')
            return false
        }
    }

    async getCarById(id){
        let car = await CarDbModel.findById(id).populate('mark').then(res => {return new Car(res.id, res.mark.name, res.model, res.yearProduct, res.color, res.price, res.pictUrl)})
        console.log(car);
        return car
    }

    async getAllCars(){
        let dbCars = await CarDbModel.find().populate('mark').then(res => {
            let cars = []
            res.forEach(car => {
                cars.push(new Car(car._id, car.mark.name, car.model, car.yearProduct, car.color, car.price, car.pictUrl))
            });
            return cars
        })
        return dbCars
    }

    async getAllMarks(){
        let dbMarks = await MarkDbModel.find().then(res => {
            let marks = []
            res.forEach(mark => {
                marks.push(new Mark(mark._id, mark.name))
            });
            return marks
        })
        return dbMarks
    }

    async deleteCar(someCarId) {
        if(someCarId !== null && someCarId !== undefined){
            return await CarDbModel.findByIdAndDelete(someCarId).populate('mark').then((res) => {
                console.log(`Car ${res.mark.name} - ${res.model} deleted`)
                return true
            })            
        }
        else{
            console.log('Car is broken for delete, aborted')
            return false
        }
    }

    async addNewMark(someMark){
        if(someMark !== undefined && someMark != ''){
            let duplicate = false
            let marks = await this.getAllMarks()
            marks.forEach(mark => {
                if(mark.name.toLowerCase() == someMark.trim().toLowerCase()){
                    duplicate = true
                }
            })
            if(!duplicate){
                const newMarkDb = new MarkDbModel({
                    name: someMark
                })
                newMarkDb.save()
                console.log('Mark saved')
                return true
            }
            else{
                console.log('Mark already exists')
                return false
            }
        }
        else{
            console.log('Mark is broken, aborted');
            return false
        }        
    }
}

module.exports = new DbService()