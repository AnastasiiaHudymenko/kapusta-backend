const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError, errorMessages } = require("../helpers");

const incomeSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, "Please set a description for the transaction"],
    },
    category: {
      type: String,
      enum: ["Salary", "Bonus", "Deposit", "Certificate", "Present", "Other"],

      required: [true, "category for transaction is required"],
    },
    sum: {
      type: String,
      required: [true, "Please set a sum for the transaction"],
    },
    // date: {
    //   type: Date,
    //   required: [true],
    // },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Income = model("income", incomeSchema);
incomeSchema.post("save", handleMongooseError);

const incomeSchemaJoi = Joi.object({
  description: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages(errorMessages("description")),
  category: Joi.string()
    .valid("Salary", "Bonus", "Deposit", "Certificate", "Present", "Other")
    .required(),
  sum: Joi.string().min(2).max(100).required().messages(errorMessages("sum")),
  // date: Joi.date().required(),
}).options({ abortEarly: false });

module.exports = { Income, incomeSchemaJoi };
