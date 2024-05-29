//BCRYPT es una librería de hashing para contraseñas. 

import bcrypt from "bcrypt"; 

// createHash: aplicar el hash al password. 
// hashSync: toma el password que le pasamos y aplica el proceso de hasheo a partir de un salt. Un "salt" es un string random que hace que el proceso de hasheo se realice de forma impredecible. 
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// isValidPassword: comparar el password proporcionado por el usuario con el almacenado en la base de datos. 
export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);