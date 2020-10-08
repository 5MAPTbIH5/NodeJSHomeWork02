const Car = require('../models/car')
const carsService = require('../services/db_service')

let currCarId;

class MainController {

    async indexGet(req, resp) {
        currCarId = null
        resp.render('index', {
            title: 'Автосалон',
            allCars: await carsService.getAllCars()
        })
        // await carsService.add()
    }
    indexPost(req, resp) {
        let postArgs = []
        for(let arg in req.body){
            postArgs.push(req.body[arg])
        }
        currCarId = postArgs[0]
        switch(postArgs[1]){
            case 'info':
                console.log('Pressed info')
                resp.redirect('/infoCar')
            break
            case 'edit':
                console.log('Pressed edit')
                resp.redirect('/editCar')
            break
            case 'delete':
                console.log('Pressed delete')
                resp.redirect('/deleteCar')
            break
        }
    }
    async addNewCarGet(req, resp, data) {
        resp.render('addNewCar', {
            title: 'Добавление нового автобомобиля',
            marks: await carsService.getAllMarks()
        })
    }
    async addNewCarPost(req, resp) {      
        console.log(req.body.pictUrl);
        let newCar = new Car(null, req.body.mark, req.body.model, req.body.yearProduct, req.body.color, req.body.price, req.body.pictUrl)
        console.log(newCar);
        if(await carsService.addNewCar(newCar)){
            resp.render('ok')
        }
        else{
            resp.render('carError')
        }
    }
    addNewMarkGet(req, resp) {
        resp.render('addNewMark', {
            title: 'Добавление новой марки авто'
        })
    }
    async addNewMarkPost(req, resp) {
        if(await carsService.addNewMark(req.body.mark)){
            resp.render('ok')
        }
        else{
            resp.render('markError')
        }
    }
    async infoCar(req, resp) {
        if(currCarId !== null){
            let carDb = await carsService.getCarById(currCarId)
            if(carDb !== undefined){
                resp.render('infoCar', {
                    title: `Информация о ${carDb.mark} ${carDb.model}`,
                    car: carDb
                })
            }
            else{
                resp.render('carError')
            }
        }
        else{
            resp.render('carError')
        }
    }
    async editCarGet(req, resp) {
        if(currCarId !== null){
            let carDb = await carsService.getCarById(currCarId)
            let marksDb = await carsService.getAllMarks()
            let markIdDb = null
            marksDb.forEach(element => {
                if(element.name == carDb.mark){
                    markIdDb = element.id
                }
            });
            if(carDb !== undefined){
                resp.render('editCar', {
                    title: `Редактирование ${carDb.mark} ${carDb.model}`,
                    car: carDb,
                    marks: await carsService.getAllMarks(),
                    markId: markIdDb
                })
            }
            else{
                resp.render('carError')
            }
        }
        else{
            resp.render('carError')
        }
    }
    async editCarPost(req, resp) {
        let editedCar = new Car(req.body.id, req.body.mark, req.body.model, req.body.yearProduct, req.body.color, req.body.price, req.body.pictUrl)
        console.log(req.body);
        if(await carsService.updateCar(editedCar)){
            resp.render('ok')
        }
        else{
            resp.render('carError')
        }
    }
    deleteCarGet(req, resp) {
        if(currCarId !== null){
            resp.render('deleteCar', {
                title: 'Удаление'
            })
        }
        else{
            resp.render('carError')
        }
    }
    async deleteCarPost(req, resp) {
        if(req.body.btnAction !== undefined){
            switch(req.body.btnAction){
                case 'yes':
                    if(await carsService.deleteCar(currCarId)){
                        resp.render('ok')
                    }
                    else{                        
                        resp.render('carError')
                    }
                break
                case 'no':
                    resp.redirect('/')
                break
            }
        }
        else{
            resp.render('carError')
        }
    }
}

module.exports = new MainController()