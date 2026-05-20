import CreditRequest from "../models/creditRequestModel.js";

const createCreditRequest = async (req, res) => {
  const { amount, message } = req.body;
  const userId = req.user._id;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Invalid amount");
  }

  const newRequest = new CreditRequest({
    user: userId,
    amount,
    message,
    status: "pending"
  });

  await newRequest.save();
  res.status(201).json(newRequest);
};

const creditRequestController = { createCreditRequest };
export default creditRequestController;
