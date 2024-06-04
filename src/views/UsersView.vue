<template>
  <div id="filters">
    <div class="f"></div>
    <div class="b">
      <button class="btn-add" @click="openModalAlta" type="button">
        Añadir
      </button>
    </div>
  </div>
  <div class="table-conteiner">
    <div class="sb"></div>
    <div class="t">
      <table class="responsive-table">
        <thead>
          <tr>
            <th style="text-align: left">#</th>
            <th>Nombre</th>
            <th class="d-none">Nombre de usuario</th>
            <th class="d-none">Email</th>
            <th>Rol</th>
            <th class="d-none">CURP</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td style="text-align: left">{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td class="d-none">{{ user.user_name }}</td>
            <td class="d-none">{{ user.email }}</td>
            <td>
              <span style="font-size: 1rem" v-if="user.user_role === 1"
                >SuperAdmin</span
              >
              <span style="font-size: 1rem" v-else>Encargado</span>
            </td>
            <td class="d-none">{{ user.curp }}</td>
            <td>
              <img
                @click="openModalEditUser(user)"
                class="icon-actions"
                src="@/assets/lapiz_editar.png"
                alt="Boton para editar"
              />
              <img
                @click="openModalDeleteUser(user)"
                class="icon-actions"
                src="@/assets/eliminar.png"
                alt="Boton para eliminar"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalAltaUser @userAdded="updateUsersList" ref="modalAlta" />
  <ModalEditUser @userEdited="updateUsersList" ref="modalEdit" />
  <ModalDeleteUser @userDeleted="updateUsersList" ref="modalDelete" />
</template>

<script>
import ModalAltaUser from "@/components/user_components/ModalAltaUser.vue";
import ModalEditUser from "@/components/user_components/ModalEditUser.vue";
import ModalDeleteUser from "@/components/user_components/ModalDeleteUser.vue";

export default {
  name: "AreaView",
  data() {
    return {
      users: [],
    };
  },
  components: {
    ModalAltaUser,
    ModalEditUser,
    ModalDeleteUser,
  },
  methods: {
    openModalAlta() {
      if (this.$refs.modalAlta) {
        this.$refs.modalAlta.showModalAltaUser = true;
      }
    },
    updateUsersList() {
      this.$axios
        .get("https://api.inbeartory.site/api/v1/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.users = response.data.users;
        })
        .catch(() => {
          alert("No existen usuarios registrados.!");
        });
    },
    openModalEditUser(user) {
      if (this.$refs.modalEdit) {
        this.$refs.modalEdit.showModalEditUser = true;
        this.$refs.modalEdit.setUser(user);
      }
    },
    openModalDeleteUser(user) {
      if (this.$refs.modalDelete) {
        this.$refs.modalDelete.showModalDeleteUser = true;
        this.$refs.modalDelete.setUser(user);
      }
    },
  },
  mounted() {
    this.updateUsersList();
  },
};
</script>

<style scoped lang="scss">
* {
  font-size: 1.2rem;
}
#filters {
  height: 90px;
  display: grid;
  grid-template-areas: "f b";
  h1 {
    text-align: center;
  }
  background-color: #cbd5e1;
  .f {
    grid-area: f;
    display: flex;
    align-items: center;
  }
  .b {
    grid-area: b;
    display: flex;
    align-items: center;
    justify-content: right;
    margin-right: 3%;
  }
}
.btn-add {
  height: 50px;
  width: 36%;
  background-color: #41a55d;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.5s ease;
  float: right;
  margin-right: -0.4%;
  color: black;
}
.btn-add:hover {
  background-color: #0f6427;
  color: white;
  transform: scale(1.1);
}
.table-conteiner {
  height: 533px;
  overflow-y: auto;
  background-color: #cbd5e1;
}
.responsive-table {
  width: 97%;
  border-collapse: collapse;
  border-left: none;
  border-right: none;
  margin-top: 40px;
  margin: auto;
}
thead {
  background-color: #f1f5f9;

  border-bottom: 2px solid #8f8e8e;
  height: 50px;
}
tbody {
  background-color: #ffffff;
}
/* Estilos de las celdas */
th {
  padding: 8px;
  text-align: left;
}

td {
  padding-top: 10px;
  border: 1px solid #d3cece;
  border-top: none;
  border-left: none;
  border-right: none;
  text-align: left;
  font-size: 16px;
}
.icon-actions {
  width: 30px;
  margin-left: 12px;
}
.icon-actions:hover {
  transform: scale(1.2);
}
@media only screen and (max-width: 600px) {
  .btn-add {
    width: 80%;
  }
  .d-none {
    display: none;
  }
}
</style>
