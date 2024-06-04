<template>
    <div class="modal" v-if="showModalHeaderFooter">
      <div class="modal-content">
        <span class="close" @click="closeModal"> &times;</span>
        <h2>Encabezado y Pie de página</h2>
        <p></p>

        <div class="div-header">
          <label for="ImgItems">Imagen encabezado:</label>
            <input type="file" @change="imageHeader"  class="">
              <div class="divPreview">
                <img v-if="imagePreviewHeader" :src="imagePreviewHeader" alt="Preview" class="imgPreview" />
                <img v-else-if="imgH" :src="'https://api.inbeartory.site/storage/images/assets/header'" alt="Preview" class="imgPreview" />
              </div>
        </div>

        <div class="div-footer">
          <label for="ImgItems">Imagen pie de página:</label>
            <input type="file" @change="imageFooter"  class="">
              <div class="divPreview">
                <img v-if="imagePreviewFooter" :src="imagePreviewFooter" alt="Preview" class="imgPreview" />
                <img v-else-if="imgF" :src="'https://api.inbeartory.site/storage/images/assets/footer'" alt="Preview" class="imgPreview" />
              </div>
        </div>

       
            <div class="box-btn">
              <button @click="uplImage()" class="btn-submit" type="submit">Subir</button>
              <button @click="closeModal()" class="btn-cancel" type="button">Cancelar</button>
            </div>
        </div>
    </div>
  </template>

<script>
import Swal from 'sweetalert2';
  
  export default {
    name: 'ModalHeaderFooter',
    data() {
      return {
        showModalHeaderFooter: false,
        imagePreviewHeader: null,
        imagePreviewFooter: null,
        imgHeader: '',
        imgFooter: '',
        imgH: true,
        imgF: true
      };
    },
    methods: {
        closeModal(){
            this.showModalHeaderFooter = false;
        },
        imageHeader(event){
          if (event.target.files.length > 0) {
          this.imgHeader = event.target.files[0];
          }    
          const img = event.target.files[0];
          if (img) {
              const reader = new FileReader(); 
              reader.onload = (e) => {
                this.imagePreviewHeader = e.target.result;
              };
              reader.readAsDataURL(img);
          }
        },
        imageFooter(event){
          if (event.target.files.length > 0) {
          this.imgFooter = event.target.files[0];
          } 
          const img = event.target.files[0];
          if (img) {
              const reader = new FileReader(); 
              reader.onload = (e) => {
                this.imagePreviewFooter = e.target.result;
              };
              reader.readAsDataURL(img);
          }
        },
        uplImage(){
          const formData = new FormData();
          if(this.imgHeader && this.imgFooter){
            formData.append('header', this.imgHeader);
            formData.append('footer', this.imgFooter);
          }
          if (this.imgHeader) {
            formData.append('header', this.imgHeader);
          }
          if (this.imgFooter) {
            formData.append('footer', this.imgFooter);
          }
         

          this.$axios.post('https://api.inbeartory.site/api/v1/document/header_and_footer', formData,{
            headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`

          }
          })
          .then(() => {
            Swal.fire({
            title: 'Imágenes guardadas',
            text: `Las imágenes han sido registradas correctamente.`,
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
            popup: 'custom-swal-font',
          },
          });
          this.closeModal();
          }).catch((error) => {
            if (error.response.status === 422) {
              const errors = error.response.data.error;
                  let errorMessage = '';
                  // Concatenar los mensajes de error en una sola cadena
                  for (let key in errors) {
                      errorMessage += errors[key][0] + '\n';
                  }
                  Swal.fire({
                  title: 'Registro fallido',
                  text: `${errorMessage}`,
                  icon: 'error',
                  confirmButtonText: 'OK',
                  customClass: {
                  popup: 'custom-swal-font',
                },
                });
              } else {
                  // Manejar otros errores
                  console.log('Error: ' + error.response.data.message);
              }
          });
        }
      },
      
}

</script>

<style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: 5% auto;
    padding: 20px;
    border: 1px solid #ffffff;
    border-radius: 15px;
    width: 40%;
    height: 80%;
    text-align: left
    /* height: 80%; */
  }
  
  .close {
    color: #aaa;
    float: right;
    font-size: 48px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .close:hover,
  .close:focus {
    color: #ab3e3e;
    text-decoration: none;
    cursor: pointer;
  }
  h2{
    text-align: left;
  }
  .div-header, .div-footer{
    margin-top: 30px;
    font-size: 1.2rem;
  }
  .box-btn{
      margin-top: 0%;
    }
    button{
      font-weight: bold;
      font-size: 1rem;
      width: 45%;
      height: 40px;
      margin-top: 44px;
      border: none;
      border-radius: 5px;
      
    }

    button:hover{
      color: white;
      font-weight: bold;
      transform: scale(1.1)

    }
    .btn-submit{
      background-color: #41A55D;
      color: black;

    }
    
    .btn-cancel{
      background-color: #C66C6C;
      float: right;
      color: black;

    }
    .btn-submit:hover{
      background-color: #0f6427;
    }
    
    .btn-cancel:hover{
      background-color: #ab3e3e;
      float: right;
    }

    .imgPreview{
      text-align: center;
      margin-left: 130px;
      width: 55%;
      height: 180px;
    }
  
  label{
    text-align: center;
  }
  @media only screen and (max-width: 600px) {
    .modal-content{
      width: 80%;
      height: auto;
    }
    .imgPreview{
      margin-left: 5px;
      height: 130px;
    }
  }
  
</style>