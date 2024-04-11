const restify = require ('restify')
const mongoose = require ('mongoose')

mongoose.connect('mongodb+srv://danilolacerda:aqvnA1gQFnUIbHIB@cluster0.bdgyjni.mongodb.net/')
       .then(_=> {
            const server = restify.createServer({
                name: 'my-rest-api'
            });
            
            server.use(restify.plugins.bodyParser())

            const foodSchema = new mongoose.Schema({
                name:{
                    type: String,
                    required: true
                },
                category:{
                    type: String,
                    required: true
                },
                quantity:{
                    type: Number,
                    required: true
                },
                expirationDate:{
                    type: Date,
                    required: true
                },
                price:{
                    type: Number,
                    required: true
                }
            })

            const Food = mongoose.model('Food', foodSchema)
            
            server.get('/api/foods', (req, resp, next)=>{
                Food.find().then(foods=>{
                    resp.json(foods)
                    return next()
                })
            });
            
            server.get('/api/foods/:id', (req, resp, next)=>{
                Food.findById(req.params.id).then(food=>{
                    if(food){
                        resp.json(food)
                    }else{
                        resp.status(404)
                        resp.json({message: 'não encontrado'})
                    }
                    return next()
                })
            });
            
            server.post('/api/foods', (req, resp, next)=>{
                let food =  new Food(req.body)
                food.save().then(food=>{
                    resp.json(food)
                }).catch(error =>{
                    resp.status(400)
                    resp.json({message: error.message})
                })
            })

            server.put('/api/foods/:id', async(req, resp)=>{
                const updatedFood = await Food.updateOne(
                    {_id: req.params.id},
                    {$set: {
                        name: req.body.name,
                        category: req.body.category,
                        quantity: req.body.quantity,
                        expirationDate: req.body.expirationDate,
                        price: req.body.price
                    }}
                )
                resp.json(updatedFood)
            })
            
            server.del("/api/foods/:id", async(req,res)=>{

                const removedFood = await Food.deleteOne({_id: req.params.id});
                res.json(removedFood);
            });

            server.listen(3000, ()=>{
                console.log('api listening on 3000')
            });
       }).catch(console.error)

