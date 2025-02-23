//import express
const express = require("express");

// Import validationResult from express-validator
const { validationResult } = require("express-validator");

//import bcrypt
const bcrypt = require("bcryptjs");

//import jsonwebtoken
const jwt = require("jsonwebtoken");

//import prisma client
const prisma = require("../prisma/client");

// import logger
const logger = require("../helpers/logger");

//function login
const login = async (req, res) => {
  // Periksa hasil validasi
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error(`Unhandled error: Validation error`);
    // Jika ada error, kembalikan error ke pengguna
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  try {
    //find user
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    //user not found
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    //compare password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    //password incorrect
    if (!validPassword) {
      logger.error(`Invalid password`);
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    //generate token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Destructure to remove password from user object
    const { password, ...userWithoutPassword } = user;

    //return response
    await Promise.all([
      res.status(200).send({
        success: true,
        message: "User login successfully",
        data: {
          user: userWithoutPassword,
          token: token,
        },
      }),
      logger.info(`Data request: ${JSON.stringify(user)}`),
    ]);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
    logger.error(`This is error: ${error.array()}`);
  }
};

module.exports = { login };
