
const UserModel = require('../models/UserModel')

async function searchUser(request, response) {
  try {
    const { search } = request.body;

    const query = new RegExp(search, "i", "g");

    const user = await UserModel.find({
      "$or": [
        { name: query },
        { email: query }
      ]
    }).select('-password');

    response.json({
      message: 'All user',
      data: user,
      success: true
    })
  } catch (error) {
    return response.status(500).json({
      message: message.error || error,
      error: true
    })
  }
}


module.exports = searchUser;