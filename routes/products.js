const { Router } = require('express');
const path = require('path');
const multer = require('multer');
const Product = require('../models/Products');

const router = new Router();

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, path.join(__dirname, "../public/img"))
    },
    filename: (req, res, cb) => {
        cb(null, file.fieldName + "-" + Date.now() + ".jpg")
    }
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
    const { name, order } = req.query;
    const products = await Product.getAll(name, order); 
    res.send(products);
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const product = await Product.getById(id);
    if(!product){
        res.sendStatus(404);
    } else{
        res.send(product);
    }
})

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    const result = await Product.update(id, body);
    if(result == 1){
        res.sendStatus(200);
    } else{
        res.sendStatus(404);
    }
})

router.post('/', async (req, res) => {
    const body = req.body;

    const id = await Product.create(body);
    res.status(201).send({ id });
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    const result = await Product.delete(id);
    if(result == 1){
        res.sendStatus(200);
    } else{
        res.sendStatus(404);
    }
})





module.exports = router;