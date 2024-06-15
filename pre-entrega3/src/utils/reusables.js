// BEFORE:  res.status(500).json("Error al obtener los productos.");
// AFTER:   respon(res, 500, "Error al obtener los productos.")

const respon = (res, status, message) => {
    res.status(status).json({message});
}

export default respon;