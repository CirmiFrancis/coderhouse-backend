import nodemailer from 'nodemailer';
import dotenv from 'dotenv'; // .env

dotenv.config(); // .env

const APP_PASS = process.env.APP_PASS;

class EmailManager { // administrador de email
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: "franciscirmi@gmail.com",
                pass: APP_PASS
            }
        });
    }

    async enviarCorreoCompra(email, first_name, ticket) { // envía un mail al usuario que haya realizado una compra
        try {
            const mailOptions = {
                from: "Saborear <franciscirmi@gmail.com>",
                to: email,
                subject: 'Confirmación de compra',
                html: 
                `
                    <h1>Confirmación de compra</h1>
                    <p>Gracias por tu compra, ${first_name}!</p>
                    <p>El número de tu orden es: ${ticket}</p>
                `
            };
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error al enviar el correo electrónico.", error);
        }
    }

    async enviarCorreoRestablecimiento(email, first_name, token) { // envía un mail al usuario que solicite restablecer su contraseña
        try {
            const mailOptions = {
                from: "Saborear <franciscirmi@gmail.com>",
                to: email,
                subject: 'Restablecimiento de contraseña',
                html: // modificar direccion luego del deploy
                `
                    <h1>Restablecimiento de Contraseña</h1>
                    <p>Hola ${first_name}!</p>
                    <p>Pediste restablecer tu contraseña. Te enviamos el código de confirmacion:</p>
                    <strong> ${token} </strong>
                    <p> Este código expira en una hora. </p>
                    <a href="http://localhost:8080/password"> Restablecer Contraseña </a>
                `
            };
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error al enviar el correo electrónico.", error);
        }
    }
}

// Exportar la función enviarCorreoCompra
const emailManagerInstance = new EmailManager();
const enviarCorreoCompra = emailManagerInstance.enviarCorreoCompra.bind(emailManagerInstance); // El .bind() asegura que el contexto de this dentro de una función se mantenga fijo y específico, sin importar desde dónde o cómo se llame la función. Esto es crucial para evitar problemas de contexto que pueden surgir cuando se pasan funciones como callbacks o se usan en otros contextos.

export { enviarCorreoCompra };
export default EmailManager;