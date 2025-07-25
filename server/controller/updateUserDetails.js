const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");

async function updateUserDetails(request, response) {
  try {
    const token = request.cookies.token || "";

    const user = await getUserDetailsFromToken(token);
    if (!token) {
      return response.status(400).json({
        message: "authentication token missing",
        error: true
      })
    }

    const { name, profile_pic } = request.body;

    if (!name && !profile_pic) {
      return response.status(400).json({
        message: "Invalid or expired token",
        error: true
      })
    }

    await UserModel.updateOne({
      _id: user._id
    },
      {
        name,
        profile_pic
      });

    const updateUser = await UserModel.findById(user._id).select('-password');

    return response.status(200).json({
      message: "User update successfully!",
      data: updateUser,
      success: true
    })


  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true
    })
  }
}

module.exports = updateUserDetails