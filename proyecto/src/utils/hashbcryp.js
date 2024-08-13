import bcrypt from "bcrypt";

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)); // crea un hash a partir de un password
export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password); // valida el password