export function generarResetToken(){ // función que genera un token con un cálcuclo matemático
    const token = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    return token.toString(); 
}