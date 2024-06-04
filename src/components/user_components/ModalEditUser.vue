<template>
  <div class="modal" v-if="showModalEditUser">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Editar usuario</h2>
      <p>Llena los siguientes campos.</p>
      <form @submit.prevent="submitForm">
        <div class="cl-1">
          <label for=""><span>*</span> Nombre completo :</label>
          <input
            type="text"
            v-model="name"
            class="form-control"
            id="name"
            required
          />

          <label for="">Nombre de usuario <b>(Opcional)</b>:</label>
          <input
            type="text"
            v-model="user_name"
            class="form-control"
            id="user_name"
            placeholder="Ejemplo: user_name_09"
          />

          <label for=""><span>*</span>CURP: </label>
          <input
            type="text"
            v-model="curp"
            class="form-control"
            id="curp"
            maxlength="18"
            required
          />

          <label for=""><span>*</span>Email: </label>
          <input
            type="text"
            v-model="email"
            class="form-control"
            id="email"
            placeholder="user@inbeartory.com"
            required
          />

          <label for=""><span>*</span>Puesto: </label>
          <input
            type="text"
            v-model="position"
            class="form-control"
            id="position"
            placeholder="PTC Titular'B'"
            required
          />

          <div class="box-btn">
            <label for="">Asigna un rol de usuario</label>
            <select
              class="select-filters"
              name=""
              id="areaItem"
              v-model="user_role"
            >
              <option value="0" disabled selected>Seleccionar rola</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.role_name }}
              </option>
            </select>
            <button @click="closeModal" class="btn-cancel" type="button">
              Cancelar
            </button>
            <button class="btn-submit" type="submit">Aceptar</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "ModalAltaUser",
  data() {
    return {
      roles: [],
      id: "",
      name: "",
      user_name: "",
      curp: "",
      email: "",
      password: "",
      user_role: 0,
      position: '',
      showModalEditUser: false,
    };
  },
  methods: {
    getUserRoles() {
      this.$axios
        .get("https://api.inbeartory.site/api/v1/roles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.roles = response.data.roles;
        });
    },
    closeModal() {
      this.showModalEditUser = false;
    },
    resetForm() {
      this.name = "";
      this.user_name = "";
      this.curp = "";
      this.email = "";
      this.password = "";
      this.user_role = "";
      this.position = '';
    },
    submitForm() {
      const data = {
        name: this.name,
        user_name: this.user_name,
        curp: this.curp,
        email: this.email,
        user_role: this.user_role,
        position: this.position,
      };

      this.$axios
        .put(`https://api.inbeartory.site/api/v1/users/${this.id}`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((result) => {
          Swal.fire({
            title: "Datos actualizados",
            text: `Los datos para el usuario ${result.data.user.name},  se han actualizado correctamente.`,
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              popup: "custom-swal-font",
            },
          });

          this.$emit("userEdited");
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
              title: "Actualización fallida",
              text: `${errorMessage}`,
              icon: "error",
              confirmButtonText: "OK",
              customClass: {
                popup: "custom-swal-font",
              },
            });
          } else {
            Swal.fire({
              title: "Actualización fallida",
              text: `Intenta de nuevo, verifica los campos`,
              icon: "error",
              confirmButtonText: "OK",
              customClass: {
                popup: "custom-swal-font",
              },
            });
          }
        });
    },
    setUser(user) {
      this.id = user.id;
      this.name = user.name;
      this.user_name = user.user_name;
      this.curp = user.curp;
      this.email = user.email;
      this.user_role = user.user_role;
      this.position = user.position;

    },
  },
  mounted() {
    this.getUserRoles();
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
  margin: 1% auto;
  padding: 20px;
  border: 1px solid #ffffff;
  border-radius: 15px;
  width: 70%;
  // height: 90%;
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
