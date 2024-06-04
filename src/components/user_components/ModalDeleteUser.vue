<template>
  <div class="modal" v-if="showModalDeleteUser">
    <div class="modal-content">
      <span class="close" @click="closeModal"> &times;</span>
      <h2>Eliminar usuario</h2>
      <p style="color: red; font-weight: bold">
        Al eliminar al usuario, se eliminarán sus ítems y áreas.
      </p>
      <div class="cl-1">
        <div class="box-btn">
          <button @click="deleteUser()" class="btn-submit" type="submit">
            Aceptar
          </button>
          <button @click="closeModal" class="btn-cancel" type="button">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "ModalDeleteUser",
  data() {
    return {
      id: null,
      showModalDeleteUser: false,
    };
  },
  methods: {
    closeModal() {
      this.showModalDeleteUser = false;
    },
    deleteUser() {
      this.$axios
        .delete(`https://api.inbeartory.site/api/v1/users/${this.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((result) => {
          Swal.fire({
            title: "Usuario eliminado",
            text: `El usuario ${result.data.success.name},  se ha elimiando correctamente, en conjutno con los ítems y áreas pertenenicientes.`,
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              popup: "custom-swal-font",
            },
          });
          this.$emit("userDeleted");
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
              title: "Error al eliminar",
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
            // window.location.reload();
          }
        });
    },
    setUser(user) {
      this.id = user.id;
    },
  },
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
h2 {
  text-align: left;
}
textarea {
  margin-top: 10px;
  width: 100%;
  font-size: 1.2rem;
}
p {
  margin-top: 10px;
  text-align: justify;
}
/* .box-btn{
      margin-top: 37%;
    } */
button {
  font-weight: bold;
  font-size: 1rem;
  width: 30%;
  height: 40px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
}
button:hover {
  color: white;
  font-weight: bold;
  transform: scale(1.1);
}
.btn-submit {
  float: left;
  background-color: #41a55d;
  color: black;
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
    margin-top: 30px;
    width: 80%;
    height: 35%;
  }
  .btn-cancel {
    color: black;
  }
}
</style>
