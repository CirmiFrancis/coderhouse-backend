import { faker } from "@faker-js/faker"; 

export const generar100Productos = () => { // se especifica la estructura del producto falso para luego generar 100 de estos
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseInt( faker.commerce.price() ),
        img: faker.image.avatar(),
        code: faker.string.alphanumeric(5), 
        stock: parseInt( faker.string.numeric() ), 
        category: faker.commerce.department(), 
        status: faker.datatype.boolean(0.5), 
        thumbnails: faker.helpers.arrayElements( [faker.image.avatar(), faker.image.avatar(), faker.image.avatar()] ), 
    }
}