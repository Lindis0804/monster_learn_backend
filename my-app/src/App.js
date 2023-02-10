import logo from './logo.svg';
import './App.css';
import cloudinaryUpload from './uploads';

function App() {
 const handleFileUpload = (e)=>{
  const uploadData = new FormData()
  uploadData.append("file",e.target.files[0],"file")
  cloudinaryUpload(uploadData)
 }
 return (
  <div>
    <div style={{margin:10}}>
      <label style={{margin:10}}>Cloudinary</label>
      <input
        type="file"
        onChange={(e)=>handleFileUpload(e)}
      />
    </div>
  </div>
 )
}

export default App;
