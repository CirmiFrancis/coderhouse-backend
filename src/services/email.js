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
                html: // modificar direccion en el deploy
                `
                    <h1>Restablecimiento de Contraseña</h1>
                    <p>Hola ${first_name}!</p>
                    <p>Pediste restablecer tu contraseña. Te enviamos el código de confirmacion:</p>
                    <strong> ${token} </strong>
                    <p> Este código expira en una hora. </p>
                    <a href="https://saborear.onrender.com/password"> Restablecer Contraseña </a>
                `
            };
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error al enviar el correo electrónico.", error);
        }
    }

    async informarCuentaEliminada(email, first_name, last_name) { // envia un mail al usuario que se haya eliminado por inactividad
        try {
            const mailOptions = {
                from: "Saborear <franciscirmi@gmail.com>",
                to: email,
                subject: 'Cuenta eliminada por inactividad',
                html:
                `
                    <h1>Cuenta eliminada por inactividad</h1>
                    <p>Hola ${first_name} ${last_name}!</p>
                    <p>Lamentamos informarte que hemos eliminado tu cuenta por inactividad.</p>
                    <p>Puedes volver a crear una nueva cuenta con el mismo correo pero recuerda no dejar pasar más de 48hs sin conexión.</p>
                    <br>
                    <p>Atentamente, el equipo de Saborear.</p>
                `
            };
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error al enviar el correo electrónico.", error); 
        }
    }

    async usuarioEliminadoPorAdmin(email, first_name, last_name) { // envia un mail al usuario que ha sido eliminado por un administrador
        try {
            const mailOptions = {
                from: "Saborear <franciscirmi@gmail.com>",
                to: email,
                subject: 'Cuenta eliminada por administrador',
                html:
                `
                    <h1>Cuenta eliminada por administrador</h1>
                    <p>Hola ${first_name} ${last_name}!</p>
                    <p>Lamentamos informarle que su cuenta ha sido eliminada por un administrador. Si considera que esto es un error, por favor, responda a este correo. También puede crear una nueva cuenta utilizando el mismo correo electrónico.</p>
                    <br>
                    <p>Atentamente, el equipo de Saborear.</p>
                `
            };
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error al enviar el correo electrónico.", error); 
        }
    }

    async productoEliminado(email, first_name, last_name, title) { // envia un mail al usuario dueño del producto eliminado
        try {
            const mailOptions = {
                from: "Saborear <franciscirmi@gmail.com>",
                to: email,
                subject: 'Producto eliminado',
                html:
                `
                    <h1>Producto eliminado</h1>
                    <p>Hola ${first_name} ${last_name}!</p>
                    <p>Le informamos que el producto "${title}" que publicaste ha sido eliminado.</p>
                    <br>
                    <p>Atentamente, el equipo de Saborear.</p>
                `
            };
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error al enviar el correo electrónico.", error); 
        }
    }
}

const emailManagerInstance = new EmailManager();
const enviarCorreoCompra = emailManagerInstance.enviarCorreoCompra.bind(emailManagerInstance); // el .bind() asegura que el contexto de this dentro de una función se mantenga fijo y específico, sin importar desde dónde o cómo se llame la función. Esto es crucial para evitar problemas de contexto que pueden surgir cuando se pasan funciones como callbacks o se usan en otros contextos.

export { enviarCorreoCompra };
export default EmailManager;
