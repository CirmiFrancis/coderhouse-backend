import { userDao } from "../dao/index.js";

export const getUsers = async (req, res) => {
  try {
    const users = await userDao.getUsers();
    res.send({ status: "success", result: users });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = req.body;
    const newUser = await userDao.saveUser(user);
    res.send({ status: "success", result: newUser });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await userDao.getUserById(uid);
    res.send({ status: "success", result: user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};