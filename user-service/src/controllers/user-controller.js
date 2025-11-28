const User = require("../models/User");
const response = require("../utils/response");
const { createUserSchema } = require("../validators/user-validator");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    return response.success(res, "Users fetched", users);
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return response.error(res, "User not found", 404);
    }

    return response.success(res, "User fetched", user);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    // Validasi lengkap
    const { error } = createUserSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = {};

      error.details.forEach((err) => {
        const field = err.context.key;
        errors[field] = err.message;
      });

      return res.status(400).json({
        success: false,
        errors
      });
    }

    // Cek duplicate email
    try {
      const newUser = await User.create(req.body);

      return res.status(201).json({
        success: true,
        data: newUser
      });

    } catch (err) {
      if (err.original?.errno === 1062) {
        return res.status(409).json({
          success: false,
          errors: {
            email: "Email already exists"
          }
        });
      }
      throw err;
    }

  } catch (err) {
    next(err);
  }
};
