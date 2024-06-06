import { businessDao } from "../dao/index.js";
import { v4 as uuidv4 } from "uuid";

export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await businessDao.getAllBusinesses();
    res.send({ status: "success", result: businesses });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const createBusiness = (req, res) => {
  try {
    const business = req.body;
    const newBusiness = businessDao.createBusiness(business);
    res.send({ status: "success", result: newBusiness });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getBusinessById = (req, res) => {
  try {
    const { bid } = req.params;
    const business = businessDao.getBusinessById(bid);
    res.send({ status: "success", result: business });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { bid } = req.params;
    const { name, price } = req.body;
    if (!name || !price || !bid) {
      return res.status(400).send({ status: "error", result: "invalid data" });
    }
    const business = await businessDao.getBusinessById(bid);
    const newProduct = {
      id: uuidv4(),
      name,
      price,
    };
    business.products.push(newProduct);
    const updatedBusiness = await businessDao.updateBusiness(bid, business);
    res.send({ status: "success", result: updatedBusiness });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};