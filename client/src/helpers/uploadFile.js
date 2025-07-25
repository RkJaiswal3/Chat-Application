const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/auto/upload`

// console.log("CLoud name", process.env.REACT_APP_CLOUDINARY_NAME)

const uploadFile = async (file) => {

  const formData = new FormData();
  formData.append('file', file)
  formData.append("upload_preset", "chat-app-file")

  const response = await fetch(url, {
    method: 'post',
    body: formData
  })

  const responseData = await response.json();


  return responseData;
}


export default uploadFile