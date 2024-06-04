<template>
  <div class="modal" v-if="showModalTransferItems">
    <div class="modal-content">
      <span class="close" @click="closeModal"> &times;</span>
      <h2>Transferir ítems</h2>
        <p>Para transferir los ítems selecciona una de las siguientes áreas.</p>
      <div class="select-Area">
        <select class="select-filters" name="" id="CondiItem" v-model="area_idTransfer">
            <option value="0" disabled selected>Seleccionar área</option>

          <option v-for="area in areas" :key="area.id" :value="area.id">
            {{ area.area_name }}
          </option>
        </select>
        <p>Ingresa una causa de baja para eliminar el área. (Mínimo 10 caracteres)</p>
        <textarea v-model="reason_down" name="" area_id="" cols="30" rows="10" required></textarea>
      </div>

      <div class="box-btn">
        <button @click="submitForm" class=" btn-submit"  type="submit">
          Aceptar
        </button>
        <button @click="closeModal" class="btn-cancel" type="button">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "ModalTransferItems",
  data() {
    return {
      areas: [],
      area_id: null,
      area_name: null,
      area_idTransfer: 0,
      reason_down: null,
      showModalTransferItems: false,
    };
  },
  methods: {
    updateAreaList() {
      this.$axios
        .get("https://api.inbeartory.site/api/v1/areas",{
          headers:{
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          this.areas = response.data.areas;
        })
        .catch((error) => {
          alert("Error", error);
        });
    },
    closeModal() {
      this.showModalTransferItems = false;
    },
    submitForm() {
    const data = {
      reason_delete: this.reason_down,
    };
    this.$axios.delete(`https://api.inbeartory.site/api/v1/areas/${this.area_id}/${this.area_idTransfer}`, {
        headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${localStorage.getItem('token')}`

          },
          data: data
      })
        .then((result) => {
          Swal.fire({
            title: "Ítems Transferidos",
            text: `El área ${result.data.success.area_name} ha sido eliminado y  los items del área se han transferido correctamente.`,
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              popup: "custom-swal-font",
            },
          });
          this.$emit('areaDeletedAndItemsTransferred');
          this.reason_down = "";
          this.closeModal();
        })
        .catch((error) => {
          if (error.response.status === 422) {
            const errors = error.response.data.error;
            let errorMessage = "";
            // Concatenar los mensajes de error en una sola cadena
            for (let key in errors) {
              errorMessage += errors[key][0] + "\n";
            }
            Swal.fire({
              title: "Error al Transferir",
              text: `${errorMessage}`,
              icon: "error",
              confirmButtonText: "OK",
              customClass: {
                popup: "custom-swal-font",
              },
            });
          } else {
            // Manejar otros errores
            console.log("Error: " + error.response.data.error);
            window.location.reload();
          }
        });
  },
  setAreaId(area) {
    this.area_id = area;
  },
  },
  mounted() {
    this.updateAreaList();
  },
  
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-content {
  background-color: #fefefe;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #ffffff;
  border-radius: 15px;
  width: 40%;
  height: 50%;
}
h2{
    text-align: left;
}
p{
    margin-top: 15px;
    text-align: left;
    font-weight: 100;
    font-size: 1.1rem;
}
.select-filters{
        display: block;
        width:100%;
        padding: 1.5%;
        border-radius: 6px;
        margin-bottom: 10px;
        margin-top: 25px;
        background-color: #CBD5E1;
        font-size: 1.2rem;
    }

    button, input[type='submit']{
      font-weight: bold;
      font-size: 1.2rem;
      width: 30%;
      height: 40px;
      margin-top: 20px;
      border: none;
      border-radius: 5px;
      color: black;

    }
    button:hover, input[type='submit']:hover{
      font-weight: bold;
      transform: scale(1.1)
    }

    .btn-submit{
        background-color: #41A55D;
        float: left;
        color: black;
    }
    .btn-submit:hover{
        background-color: #0f6427;
        color: white;
    }
    .btn-cancel{
        background-color: #C66C6C;
        float: right;
        color: black;
        margin-right: 2px;
    }
    .btn-cancel:hover{
        background-color: #ab3e3e;
        color: white
    }
    textarea{
    margin-top: 10px;
    width: 100%;
    font-size: 1.2rem;
    height: 100px;
  }
  @media only screen and (max-width: 600px) {
    .modal-content {
      width: 80%;
      height: 65%;
    }
    .select-filters option{
        font-size: .9rem;
    }
  }
</style>
