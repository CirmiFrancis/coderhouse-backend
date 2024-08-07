import supertest from "supertest";
import { expect } from "chai";

const requester = supertest("http://localhost:8080"); // encargado de hacer las peticiones al servidor

describe("Tests PRODUCTS para el desafío complementario 4", () => {

    // before(function() {
    //     this.timeout(5000); // aumenta el tiempo de espera a 5 segundos para todos los tests
    // });

    it("Endpoint GET /api/products debe obtener todos los productos correctamente.", async () => {
        const response = await requester.get("/api/products");

        //console.log("Status Code:", response.statusCode);
        //console.log("Response Body:", response.body);

        expect(response.statusCode).to.equal(200); // verifico si el status devolvió 200 (ok)
        expect(response.body).to.be.an("object"); // verifico si body es un objeto
        expect(response.body).to.have.property("docs").that.is.an("array"); // verifico si docs es un array
        if (response.body.docs.length > 0) {
            expect(response.body.docs[0]).to.have.property("_id"); // verifico si el primer elemento tiene un ID
        }
    })

    it("Endpoint GET /api/products/{pid} debe obtener un producto en específico correctamente.", async () => {
        const productoID = "6626f6c948c0130b313bee86";
        const response = await requester.get(`/api/products/${productoID}`);
    
        //console.log("Status Code:", response.statusCode);
        //console.log("Response Body:", response.body);

        expect(response.statusCode).to.equal(200); // verifico que el status devolvió 200 (ok)
        expect(response.body._id).to.equal("6626f6c948c0130b313bee86"); // verifico que el ID sea el mismo
    });

    it("Endpoint POST /api/products debe tirar status 400 al crear un producto sin title.", async () => {
        const nuevoProducto = {
            // "title": "Test title",
            "description": "Test description",
            "price": 1234,
            "img": "img/test.jpg",
            "code": "test123",
            "stock": 50,
            "category": "Test",
            "status": true,
            "thumbnails": [],
            "owner": "test"
        };
    
        const response = await requester.post("/api/products").send(nuevoProducto); // envío nuevoProducto
    
        //console.log("Status Code:", response.statusCode);
        //console.log("Response Body:", response.body);

        expect(response.statusCode).to.equal(400); // verifico que el status devuelva 400
    });

})