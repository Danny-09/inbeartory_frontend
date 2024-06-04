
<template>
  <div class="modal" v-if="showModalDeleteItem">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Eliminar item</h2>
      <p>Ingresa una causa de baja para eliminar el item. (Mínimo 10 caracteres)</p>
      <form @submit.prevent="submitForm">
        <div class="cl-1">
          <textarea v-model="reason_down" name="" id="" cols="30" rows="10" required></textarea>
          <div class="box-btn">
            <button class="btn-submit" type="submit">Eliminar</button>
            <button @click="closeModal" class="btn-cancel" type="button">Cancelar</button>
          </div>
        </div>
        
      </form>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';


export default {
  name: 'ModalDeleteItem',
  props:[
    'updateItemList'
  ],
  data() {
    return {
      id: [],
      description: null,
      showModalDeleteItem: false,
      reason_down: null,
      index: []
    };
  },
  methods: {
    closeModal() {
      this.showModalDeleteItem = false;
    },
    submitForm(){         
      const r = {
        reason_delete: this.reason_down,
        items: this.id
      }
      this.$axios.delete(`https://api.inbeartory.site/api/v1/items`,{
        data: r,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`

        }
      })
      .then(() => {
        Swal.fire({
        title: 'Item eliminado',
        text: `El ítem se ha elimiando correctamente.`,
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
        popup: 'custom-swal-font',
      },
      });
      this.$emit('itemDeleted', this.id);
      this.reason_down = '';
      this.id = [];
      this.index = [];
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
              title: 'Error al eliminar',
              text: `${errorMessage}`,
              icon: 'error',
              confirmButtonText: 'OK',
              customClass: {
              popup: 'custom-swal-font',
            },
            });
          } else {
              // Manejar otros errores
              console.log('Error: ' + error.response.data.error);
                    // window.location.reload();

          }
      });
    },
    setItem(listItems){
      listItems.forEach(item =>{
          this.id.push(item.id);
          this.index.push(item.index);
      });
    }
  }
};
</script>

<style scoped>
/* Estilos específicos para el modal */
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
  width: 50%;
  height: 55%;
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
  text-align: center;
}
textarea{
  margin-top: 10px;
  width: 100%;
  font-size: 1.2rem;
}

  /* .box-btn{
    margin-top: 37%;
  } */
  button{
    font-weight: bold;
    font-size: 1rem;
    width: 30%;
    height: 40px;
    margin-top: 10px;
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
    float: left;
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
  }

@media only screen and (max-width: 600px) {
  .modal-content {
    height: 500px;
    width: 80%;  
  }
  textarea{
  margin-top: 42px;
  width: 100%;
  margin-bottom: 20px;
  font-size: 1.2rem;
  } 
  p{
    text-align: left;
  }
 
}

</style>





