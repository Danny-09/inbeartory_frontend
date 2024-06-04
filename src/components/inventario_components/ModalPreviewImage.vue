<template>
    <div class="modal" v-if="showModalImage">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
            <div class="box-image">
                <img :src="'https://api.inbeartory.site/storage/images/' + image" alt="item.image"  class="styleModalImage"/>       
            </div>
      </div>
    </div>
  </template>

<script>

export default {
  name: 'ModalPreviewImage',
  data() {
    return {
        item: null,
        showModalImage: false,
     
    };
  },
  methods: {
    setImage(image){
        this.image=image;
    },
    closeModal() {
      this.showModalImage = false;
    }
}
}
</script>

<style>


.box-image{
    width: 100%;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    overflow-y: auto;
}

.styleModalImage{
    width: 70%;
}
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
    text-align: center;
    background-color: #fefefe;
    margin: 5% auto;
    padding: 20px;
    border: 1px solid #ffffff;
    border-radius: 15px;
    width: 40%;
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

  @media only screen and (max-width: 600px) {
  .styleModalImage{
    
    min-width: 80%;
    height: 55%;
    display: flex;
    align-items: center;
    justify-content: center;
   
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* z-index: 1000; Asegúrate de tener un z-index suficientemente alto */
  }
  .modal-content {
    /* background-color: #fefefe; */
    margin: 5% auto;
    padding: 20px;
    border: 1px solid #ffffff;
    border-radius: 15px;
    width: 80%;
    height: 80%;
  }
  .box-image{
    width: 100%;
    height: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    overflow-y: auto;
    }
}
</style>