//import express
const express = require("express");

//import prisma client
const prisma = require("../prisma/client");

// Import validationResult from express-validator
const { validationResult } = require("express-validator");

//import bcrypt
const bcrypt = require("bcryptjs");
const logger = require("../helpers/logger");

//function findUsers
const findUsers = async (req, res) => {
  try {
    //get all users from database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    //send response
    res.status(200).send({
      success: true,
      message: "Get all users successfully",
      data: users,
    });
    logger.info(`Data request: ${JSON.stringify(users)}`);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
    logger.error(`Unhandled error: ${error.message}`);
  }
};

//function createUser
const createUser = async (req, res) => {
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

  //hash password
  const hashedPassword = await bcrypt?.hash(req.body.password, 10);

  try {
    //insert data
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      },
    });

    res.status(201).send({
      success: true,
      message: "User created successfully",
      data: user,
    });
    logger.info(`Data request: ${JSON.stringify(user)}`);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
    logger.error(`Unhandled error: ${error.message}`);
  }
};

//function findUserById
const findUserById = async (req, res) => {
  //get ID from params
  const { id } = req.params;

  try {
    //get user by ID
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    //send response
    res.status(200).send({
      success: true,
      message: `Get user By ID :${id}`,
      data: user,
    });
    logger.info(`Data request: ${JSON.stringify(user)}`);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
    logger.error(`Unhandled error: ${error.message}`);
  }
};

//function updateUser
const updateUser = async (req, res) => {
  //get ID from params
  const { id } = req.params;

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

  //hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    //update user
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      },
    });

    //send response
    res.status(200).send({
      success: true,
      message: "User updated successfully",
      data: user,
    });
    logger.info(`Data request: ${JSON.stringify(users)}`);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
    logger.error(`Unhandled error: ${error.message}`);
  }
};

//function deleteUser
const deleteUser = async (req, res) => {
  //get ID from params
  const { id } = req.params;

  try {
    //delete user
    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    //send response
    res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
    logger.info("Delete Success");
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
    logger.error(`Unhandled error: ${error.message}`);
  }
};

module.exports = {
  findUsers,
  createUser,
  findUserById,
  updateUser,
  deleteUser,
};
