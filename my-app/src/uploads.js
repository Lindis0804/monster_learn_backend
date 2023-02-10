import axios from 'axios'
const API_URL = "http://localhost:5000"
const cloudinaryUpload = (file)=>{
 return axios.post(API_URL+'/cloudinary/upload',file)
 .then(res=>res.data)
 .catch((err)=>{
    console.log(err)
 })
}
export default cloudinaryUpload