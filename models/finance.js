const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError, errorMessages } = require("../helpers");

const financeSchema = new Schema(
  {
    balance: {
      type: String,
      required: [true, "Please set a balance for the user"],
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

const Finance = model("finance", financeSchema);
financeSchema.post("save", handleMongooseError);

const financeSchemaJoi = Joi.object({
  balance: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages(errorMessages("balance")),
  // date: Joi.date().required(),
}).options({ abortEarly: false });

module.exports = { Finance, financeSchemaJoi };
