import supertest from "supertest";
import { expect } from "chai";

const requester = supertest("http://localhost:8080"); // encargado de hacer las peticiones al servidor

describe("Tests CARTS para el desafío complementario 4", () => {

    // before(function() {
    //     this.timeout(5000); // aumenta el tiempo de espera a 5 segundos para todos los tests
    // });

    let carritoNuevoID;

    it("Endpoint GET /api/carts/{cid} debe obtener todos los productos de un carrito correctamente.", async () => {
        const carritoID = "66752138ca7f0107628d717a";
        const response = await requester.get(`/api/carts/${carritoID}`);

        //console.log("Status Code:", response.statusCode);
        //console.log("Response Body:", response.body);

        expect(response.statusCode).to.equal(200); // verifico si el status devolvió 200 (ok)
        expect(response.body).to.be.an("object"); // verifico si body es un objeto
        expect(response.body).to.have.property("products").that.is.an("array"); // verifico si products es un array
    })

    it("Endpoint POST /api/carts/ debe crear un carrito correctamente.", async () => {
        const response = await requester.post("/api/carts").send({});
        carritoNuevoID = response.body._id;
        
        //console.log(carritoNuevoID);
        //console.log("Status Code:", response.statusCode);
        //console.log("Response Body:", response.body);

        expect(response.statusCode).to.equal(200); // carrito creado
        expect(response.body).to.have.property("_id").that.is.an("string"); // pregunta si existe ID, y si es un string
    });

    it("Endpoint PUT /api/carts/{cid} debe actualizar los productos de un carrito correctamente.", async () => {
        const carritoActualizado = 
        [
            {
                "product": {
                    "_id": "6626f6c948c0130b313bee86",
                    "title": "Queso",
                    "price": 300
                },
                "quantity": 2
            }
        ];
        const response = await requester.put(`/api/carts/${carritoNuevoID}`).send(carritoActualizado);

        //console.log("Status Code:", response.statusCode);
        //console.log("Response Body:", response.body);

        expect(response.statusCode).to.equal(200); // carrito actualizado

        const updatedCartResponse = await requester.get(`/api/carts/${carritoNuevoID}`);

        //console.log("Status Code:", updatedCartResponse.statusCode);
        //console.log("Response Body:", updatedCartResponse.body);

        expect(updatedCartResponse.statusCode).to.equal(200); // verifico si el status devolvió 200 (ok)
        expect(updatedCartResponse.body.products).to.have.lengthOf.above(0); // verifico que products sea mayor a 0
    });

})