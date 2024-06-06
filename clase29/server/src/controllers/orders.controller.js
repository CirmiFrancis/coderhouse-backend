import { orderDao } from "../dao/index.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await orderDao.getAllOrders();
    res.send({ status: "success", result: orders });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { userId, businessId, products } = req.body;

    const totalPrice = products.reduce((tot, prod) => {
      tot += prod.price;
      return tot;
    }, 0);

    const newOrder = {
      number: uuidv4(),
      business: businessId,
      user: userId,
      products,
      totalPrice,
    };

    const order = await orderDao.createOrder(newOrder);
    res.send({ status: "success", result: order });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { oid } = req.params;
    const order = await orderDao.getOrderById(oid);
    res.send({ status: "success", result: order });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const resolveOrder = async (req, res) => {
  try {
    const { oid } = req.params;
    const order = await orderDao.getOrderById(id);
    order.status = "completed";
    const orderUpdate = orderDao.resolveOrder(oid, order);
    res.send({ status: "success", result: orderUpdate });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};