<template>
  <nav>
    <div class="menu-toggle">
      <img
        @click="openModalMenu()"
        class="icon-menu"
        src="@/assets/icono_menu.png"
        alt="Icono de menu"
      />
    </div>
    <div class="actual-page">
      <h2 id="page_name">{{ pageTitle }}</h2>
    </div>
    <div class="div-icon-config">
      <img
        @click="openModalConfi()"
        class="icon-menu"
        src="@/assets/configuracion.png"
        alt="Icono de configuracion"
      />
    </div>
    <!-- UL vista movil  -->
    <ul class="menu-600px" v-show="showMenu">
      <router-link to="/inventario">
        <li class="li-menu" @click="changePageTitle('Inventario')">
          Inventario
        </li>
      </router-link>

      <router-link to="/areas" v-if="this.user_role !== '2'">
        <li class="li-menu" @click="changePageTitle('Áreas')">Áreas</li>
      </router-link>
      <router-link to="/items/eliminados" class="rb">
        <li class="li-menu" @click="changePageTitle('Ítems de baja')">
          Bajas
        </li>
      </router-link>

      <router-link to="/users" class="gu" v-if="this.user_role !== '2'">
        <li class="li-menu" @click="changePageTitle('Usuarios')">Usuarios</li>
      </router-link>
    </ul>
    <ul class="menu-confi-600px" v-show="showConfi">
      <div class="div-confi-images">
        <span>Encabezado y Pie de página.</span>
        <button @click="openModalHF" class="btn-up-images" type="button">
          Subir imágenes..
        </button>
      </div>
      <LogoutComponent></LogoutComponent>
    </ul>

    <!-- UL vista web en PC -->
    <ul class="ul-view-web-pc">
      <router-link to="/inventario" class="f" exact>
        <li class="f li-web">
          <button type="button">
            <img src="@/assets/icon_inventory.png" alt="inventario" />
            Inventario
          </button>
        </li>
      </router-link>

      <router-link to="/areas" class="t" v-if="this.user_role !== '2'" exact>
        <li class="t li-web">
          <button type="button">
            <img src="@/assets/icon_area.png" alt="area" />
            Áreas
          </button>
        </li>
      </router-link>

      <router-link to="/items/eliminados" class="rb" exact>
        <li class="rb li-web">
          <button type="button">
            <img
              style="width: 15%"
              src="@/assets/icon_area.png"
              alt="items eliminados"
            />
            Bajas
          </button>
        </li>
      </router-link>

      <router-link to="/users" class="gu" v-if="this.user_role !== '2'" exact>
        <li class="rb li-web">
          <button type="button">
            <img
              style="width: 15%"
              src="@/assets/icon_area.png"
              alt="items eliminados"
            />
            Usuarios
          </button>
        </li>
      </router-link>

      <div class="div-icon-config-2">
        <img
          @click="openModalConfi()"
          class="icon-menu"
          src="@/assets/configuracion.png"
          alt="Icono de configuracion"
        />
      </div>
      <ul class="menu-confi" v-show="showConfi">
        <div class="div-confi-images">
          <span>Encabezado y Pie de página.</span>
          <button @click="openModalHF" class="btn-up-images" type="button">
            Subir imágenes..
          </button>
        </div>
        <LogoutComponent></LogoutComponent>
      </ul>
    </ul>
  </nav>

  <ModalHeaderFooter ref="modalHeaderFooter" />
</template>

<script>
import ModalHeaderFooter from "@/components/nav_components/ModalUpHeaderFooter.vue";
import LogoutComponent from "@/components/nav_components/LogoutComponent.vue";

export default {
  name: "NavComponent",
  data() {
    return {
      showMenu: false,
      showConfi: false,
      pageTitle: "Inventario",
      user_role: localStorage.getItem("user_role"),
    };
  },
  components: {
    ModalHeaderFooter,
    LogoutComponent,
  },
  methods: {
    openModalMenu() {
      this.showMenu = !this.showMenu;
      if (this.showConfi == true) {
        this.showConfi = false;
      }
    },
    openModalConfi() {
      this.showConfi = !this.showConfi;
      if (this.showMenu == true) {
        this.showMenu = false;
      }
    },
    changePageTitle(name) {
      this.pageTitle = name;
    },
    openModalHF() {
      if (this.$refs.modalHeaderFooter) {
        this.$refs.modalHeaderFooter.showModalHeaderFooter = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.router-link-active {
  button {
    color: white;
    transform: scale(1.05); /* Efecto de escala cuando el enlace está activo */
    transition: transform 0.2s ease; /* Transición suave */
    border: 1px solid white;
    border-radius: 5px;
    border-left: none;
    border-right: none;

  }
}
* {
  font-weight: bold;
  color: black;
}

nav {
  height: 60px;
  background-color: #ee9229;
}

a {
  text-decoration: none;
}
a:after {
  color: #38b923;
}
.ul-view-web-pc {
  display: grid;
  align-items: center;
  grid-template-areas:
    "i a rb gu c"
    "mc mc mc mc mc";
  .f {
    grid-area: i;
  }
  .s {
    grid-area: a;
  }
  .rb {
    grid-area: rb;
  }
  .gu {
    grid-area: gu;
  }
}
.li-web {
  display: inline;
  display: flex;
  align-items: center;
  justify-content: center;
}
img {
  width: 25%;
}
button {
  background-color: #ee9229;
  border: none;
  height: 60px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.5s ease;
}
button:hover {
  transform: scale(0.9);
  color: white;
}

.div-icon-config-2 {
  grid-area: c;
  // background-color: #38B923;
  width: 10%;
  margin-left: 90%;
  cursor: pointer;
}
.menu-confi {
  // display: block;
  width: 20%;
  height: 100%;
  grid-area: mc;
  border-radius: 5px;
  background-color: rgb(218, 218, 218);
  z-index: 0;
  margin-left: 80%;
}
.div-confi-images {
  text-align: left;
  // border: 1px solid #ee9229;
  border-radius: 5px;
  padding: 15px;
  margin: 5px;
  color: white;
  // background-color: #ee9229;
}
.btn-up-images {
  margin-top: 5px;
  padding: 20px;
  height: 40px;
  color: white;
  border-radius: 5px;
  font-size: 1rem;
  margin-left: 15px;
}
.btn-up-images {
  transition: transform 0.2s ease; /* Agrega una transición suave */
}
.icon-menu {
  margin-top: 5px;
  width: 80%;
}
.icon-menu:hover {
  transform: scale(1.1);
}
.menu-toggle,
.menu-600px,
.actual-page,
.div-icon-config,
.menu-confi-600px {
  display: none;
}

@media only screen and (max-width: 600px) {
  nav {
    display: grid;
    grid-template-areas:
      "m np c"
      "o o o";
  }
  .menu-toggle {
    display: block;
    grid-area: m;
    float: left;
    // width: 20%;
  }
  .actual-page {
    display: block;
    grid-area: np;
    text-align: center;
    // margin-left: 20px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon-menu {
    width: 40px;
    margin-left: 5px;
    margin-top: 10px;
    cursor: pointer;
  }
  .icon-menu:hover {
    transform: scale(1.1);
  }
  .menu-600px {
    display: block;
    border-radius: 5px;
    grid-area: o;
    background-color: rgb(218, 218, 218);
    width: 50%;
    height: 100%;
    z-index: 0;
  }
  .div-icon-config {
    display: block;
    grid-area: c;
    // margin-right: 15px;
    text-align: right;
  }
  .menu-confi-600px {
    display: block;
    width: 50%;
    height: 100%;
    grid-area: o;
    border-radius: 5px;
    background-color: rgb(218, 218, 218);
    z-index: 0;
    margin-left: 50%;
  }
  .li-menu {
    text-align: left;
    border: 1px solid #ee9229;
    border-radius: 5px;
    padding: 15px;
    margin: 5px;
    color: white;
    background-color: #ee9229;
    // background-color: #38B923;
  }
  .li-menu:hover {
    transform: scale(0.9);
    transition: transform 0.2s ease; /* Agrega una transición suave */
  }
  .div-confi-images {
    text-align: left;
    // border: 1px solid #ee9229;
    border-radius: 5px;
    padding: 15px;
    margin: 5px;
    color: white;
    // background-color: #ee9229;
  }
  .btn-up-images {
    margin-top: 5px;
    height: 40px;
    color: white;
    border-radius: 5px;
    font-size: 1rem;
    margin-left: 15px;
  }
  .btn-up-images {
    transition: transform 0.2s ease; /* Agrega una transición suave */
  }

  .ul-view-web-pc {
    display: none;
  }
}
</style>
