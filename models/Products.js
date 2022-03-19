const fs = require('fs').promises;
const knex = require('knex');
const path = require('path');

class Product {
    constructor() {
        this.db = knex(
            this.productDbConfig = {
                client: 'mysql',
                connection: {
                    host: 'localhost',
                    port: 3306,
                    user: 'root',
                    database: 'products_db'
                }
            }
        )
    }
    
    async getAll(name = "", order = "id"){
        const products = await this.db("products_db")
        .whereILike("name", `%${name}%`)
        .orderBy(order, "asc");
        
        return products;
    }
    
    async getById(id){
        const product = await this.db("products_db")
            .where({ id })
            .first();
    
        return product;
    }

    async update(id, body){
        const result = await this.db("products_db")
            .where({ id })
            .update(body);
        
        return result;
    }

    async create(body){
        // result únicamente retorna un [] con el id del primer elemento añadido
        // sin importar la cantidad de elementos enviados en POST
        const result = await this.db("products_db")
            .insert(body);
        
        return result[0]; 
    }

    async delete(id){
        const result = await this.db("products_db")
            .where({ id })
            .del();
        
        return result;
    }

    async loadData(){

        try{
            await this.db.schema.dropTableIfExists("products_db")
            await this.db.schema.createTable("products_db", (table) => {
                table.increments("id")
                table.string("name")
                table.integer("price")
                table.string("description")
            });
    
            const data = await fs.readFile(path.join(__dirname, "../database/products.json"));
            const products = JSON.parse(data);
        
            for (const product of products) {
                await this.db("products_db").insert(product);
            }

        } catch(err){
            throw err;
        }
    }

}

module.exports = new Product();