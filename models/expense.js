const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError, errorMessages } = require("../helpers");

const expenseSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, "Please set a description for the transaction"],
    },
    category: {
      type: String,
      enum: [
        "Transport",
        "Products",
        "Health",
        "Alcohol",
        "Entertainment",
        "Housing",
        "Technique",
        "Communal, communication",
        "Sports, hobbies",
        "Education",
        "Other",
      ],
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

const Expense = model("expense", expenseSchema);
expenseSchema.post("save", handleMongooseError);

const expenseSchemaJoi = Joi.object({
  description: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages(errorMessages("description")),
  category: Joi.string()
    .valid(
      "Transport",
      "Products",
      "Health",
      "Alcohol",
      "Entertainment",
      "Housing",
      "Technique",
      "Communal, communication",
      "Sports, hobbies",
      "Education",
      "Other"
    )
    .required(),
  sum: Joi.string().min(2).max(100).required().messages(errorMessages("sum")),
  // date: Joi.date().required(),
}).options({ abortEarly: false });

module.exports = { Expense, expenseSchemaJoi };
