(async () => {
    const express = require('express');
    const path = require('path');
    const http = require('http');
    const { Server } = require('socket.io');
    const productsRouter = require('./routes/products.js');
    const Product = require('./models/Products');
    
    const PORT = process.env.PORT || 8080;
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);

    try{

        // await Product.loadData();

        app.use('/static', express.static(path.join(__dirname,'public')));
        app.use(express.json());
        
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname,'public/index.html'));
        });
        
        app.use('/products', productsRouter);
        
        server.listen(PORT, () => console.log(`Escuchando en el puerto ${PORT}`));

    } catch(err){
        console.log(err);
        console.log("Problemas al iniciar el servidor.");
    }
    

})()