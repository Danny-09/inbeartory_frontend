<template>
  <div class="modal" v-if="showModalAltaArea">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Agregar área</h2>
      <p>Llena los siguientes campos.</p>
      <form @submit.prevent="submitForm">
        <div class="cl-1">
          <label for="">* Nombre de área :</label>
          <input
            type="text"
            v-model="area_name"
            class="form-control"
            id="NoInventory"
            required
          />

          <label for="">* No. Edificio:</label>
          <input
            type="number"
            v-model="building"
            class="form-control"
            id="DescItem"
            min="1"
            required
          />

          <label for="">* No. Piso:</label>
          <input
            type="number"
            v-model="floor"
            class="form-control"
            id="MarcaItem"
            min="1"
            required
          />

          <label for="">* Ala:</label>
          <input
            type="text"
            v-model="wing"
            class="form-control"
            id="ModeloItem"
            required
          />
          <div class="box-btn">
            <label for="">Asigna el usuario encargado del área</label>
            <select
              class="select-filters"
              name=""
              id="areaItem"
              v-model="user_id"
            >
              <option value="0" disabled selected>Seleccionar usuario</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
            <button @click="closeModal" class="btn-cancel" type="button">
              Cancelar
            </button>
            <button class="btn-submit" type="submit">Añadir</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "ModalAltaArea",
  data() {
    return {
      areas: [],
      users: [],
      area_name: "",
      building: "",
      floor: "",
      wing: "",
      user_id: 0,
      showModalAltaArea: false,
    };
  },
  methods: {
    getUsers() {
      this.$axios.get("https://api.inbeartory.site/api/v1/users",{
        headers:{
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then((response) => {
        this.users = response.data.users;
      });
    },
    closeModal() {
      this.showModalAltaArea = false;
    },
    resetForm() {
      this.area_name = null;
      this.building = "";
      this.floor = "";
      this.wing = "";
      this.user_id = "";
    },
    submitForm() {
      const data = {
        area_name: this.area_name,
        building: this.building,
        floor: this.floor,
        wing: this.wing,
        user_id: this.user_id,
      };

      this.$axios
        .post("https://api.inbeartory.site/api/v1/areas", data, {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        })
        .then((result) => {
          Swal.fire({
            title: "Registro exitoso",
            text: `El área ${result.data.success.area_name},  se ha registrado correctamente.`,
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              popup: "custom-swal-font",
            },
          });

          this.$emit("AreaAdded");
          this.resetForm();
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
              title: "Registro fallido",
              text: `${errorMessage}`,
              icon: "error",
              confirmButtonText: "OK",
              customClass: {
                popup: "custom-swal-font",
              },
            });
          } else {
            Swal.fire({
              title: "Registro fallido",
              text: `Intenta de nuevo, verifica, los campos`,
              icon: "error",
              confirmButtonText: "OK",
              customClass: {
                popup: "custom-swal-font",
              },
            });
          }
        });
    },
  },
  mounted() {
    this.getUsers();
  },
};
</script>

<style scoped lang="scss">
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
  width: 70%;
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
h2 {
  text-align: center;
}
p {
  margin-top: 10px;
  text-align: left;
}
form {
  display: grid;
  grid-template-areas: "c1";

  .cl-1 {
    grid-area: c1;
  }

  label {
    display: block;
    font-weight: bolder;
    margin-top: 20px;
    text-align: left;
  }
  .label-inline {
    display: inline;
    margin-left: 5%;
  }

  input[type="text"],
  input[type="number"],
  select {
    font-size: 1rem;
    border: 1px solid #d3cdcd;
    border-radius: 5px;
    width: 100%;
    height: 40px;
    margin-top: 5px;
    /* margin: auto; */
  }

  .box-btn {
    margin-top: 1%;
  }
}

.custom-swal-font {
  font-family: "Century Gothic";
}
button {
  font-weight: bold;
  font-size: 1rem;
  width: 125px;
  height: 40px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
}
button:hover {
  color: white;
  font-weight: bold;
  transform: scale(1.1);
  color: black;
}
.btn-submit {
  background-color: #41a55d;
  float: right;
  margin-right: 20px;
}

.btn-cancel {
  background-color: #c66c6c;
  float: right;
  color: black;
}
.btn-submit:hover {
  background-color: #0f6427;
}

.btn-cancel:hover {
  background-color: #ab3e3e;
  float: right;
}

@media only screen and (max-width: 600px) {
  .modal-content {
    overflow-y: auto;
  }
  .btn-submit {
    width: 100px;
    float: left;
  }
  .btn-cancel {
    width: 100px;
  }
}
</style>
