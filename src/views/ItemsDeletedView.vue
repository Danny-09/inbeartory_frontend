<!-- Cargar los componentes que se utilizaran -->
<template>
  <div id="filters">
    <div class="f">
      <button
        :class="{
          filter_active: filters_activated,
          'btn-filters': !filters_activated,
        }"
        @click="showFilters"
        type="button"
      >
        Seleccionar filtros
        <img class="icon-arrow" src="@/assets/arrow-rigth.png" alt="" />
      </button>

      <div v-show="toggleFilters" class="list-filters">
        <ul>
          <li>
            Estado
            <select
              class="select-filters"
              name=""
              id="stateItem"
              v-model="state"
            >
              <option value="null" selected disabled>Seleccionar estado</option>
              <option @click="removeFilter()" value="all">Todos</option>
              <option @click="filter()" value="1">Activos</option>
              <option @click="filter()" value="0">Inactivos</option>
            </select>
          </li>
          <li>
            Área
            <select
              class="select-filters"
              name=""
              id="areaItem"
              v-model="area_id"
            >
              <option value="0" disabled selected>Seleccionar área</option>
              <option @click="removeFilter()" value="0">Todas las área</option>
              <option
                @click="filter()"
                v-for="area in areas"
                :key="area.id"
                :value="area.id"
              >
                {{ area.area_name }}
              </option>
            </select>
          </li>
        </ul>
      </div>
      <label style="font-weight: bold" for="">R: </label>
      <input
        class="inputGoTo"
        type="number"
        @change="changeRows()"
        @input="watcherRows()"
        v-model="rows"
        min="1"
        :max="items_deleted.length"
      />
      <span style="font-weight: bold"
        >&nbsp; de {{ items_deleted.length }}</span
      >
    </div>

    <div class="b"></div>
  </div>
  <div class="table-conteiner">
    <div class="sb">
      <div class="div-exports">
        <div><p>Exportar:</p></div>
        <div @click="exportPDF" class="pdf">
          <img
            class="icon-exportar"
            src="@/assets/icon_pdf.png"
            alt="Boton para descargar archivo pdf"
          />
          <strong></strong>
        </div>
      </div>

      <div class="div-btn">
        <button
          v-if="selectedItems.length > 0"
          class="btn-del"
          @click="openModalDelete"
          type="button"
        >
          Eliminar
        </button>
      </div>
    </div>
    <div class="t">
      <table class="responsive-table">
        <thead>
          <tr>
            <!-- <th></th> -->
            <th>N.º</th>
            <th>Imágen</th>
            <th>Descripción</th>
            <th class="d-none">Marca</th>
            <th class="d-none">Modelo</th>
            <th class="d-none">Serie</th>
            <th class="d-none">Condición</th>
            <th class="d-none">Ubicación</th>
            <th class="d-none">Razón de Baja</th>
            <th class="d-none">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in itemsList" :key="item.id">
            <!-- <td><input class="checkbox-table" type="checkbox" name="" :value="{id:item.id, index:index}" v-model="selectedItems"></td> -->
            <td>{{ item.inventory_number }}</td>
            <td @click="openModalImages(item.image)" class="scale-image">
              <img
                :src="
                  'https://api.inbeartory.site/storage/images/' + item.image
                "
                alt="item.image"
                class="item-image"
              />
            </td>
            <td>{{ item.description }}</td>
            <td class="d-none">{{ item.brand }}</td>
            <td class="d-none">{{ item.model }}</td>
            <td class="d-none">{{ item.serie }}</td>
            <td class="d-none">{{ item.condition }}</td>
            <td class="d-none">{{ item.area_name }}</td>
            <td class="d-none">{{ item.reason_delete }}</td>
            <td class="d-none">
              <span style="font-size: 1rem" v-if="item.state === 1"
                >Activo</span
              >
              <span style="font-size: 1rem" v-else>Baja</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pages">
      <button class="btn-pages ml" @click="backPage">
        <img
          class="icon-arrow-p"
          src="@/assets/arrow-l-page.png"
          alt="Flecha Izquierda"
        />
      </button>
      <button
        class="num-pages"
        v-if="isPageStart"
        @click="selectPage(totalPages[1])"
      >
        <img
          class="arrow-2"
          src="@/assets/rebobinar-angulos-de-flechas-dobles.png"
          alt="Ultima pagina"
        />
      </button>

      <input type="text" readonly class="actual-page" v-model="page" />

      <button
        class="num-pages"
        v-if="isPageEnd"
        @click="selectPage(totalPages[totalPages.length - 1])"
      >
        <img
          class="arrow-2"
          src="@/assets/flechas-dobles-hacia-la-derecha-de-avance-rapido.png"
          alt="Ultima pagina"
        />
      </button>
      <button class="btn-pages" @click="nextPage">
        <img
          class="icon-arrow-p"
          src="@/assets/arrow-r-page.png"
          alt="Flecha Derecha"
        />
      </button>
      <label for="GoToPage" style="font-weight: bold; font-size: 1rem"
        >Ir a la página:</label
      >
      <input
        type="number"
        class="inputGoTo"
        v-model="goPage"
        min="1"
        :max="totalPages.length - 1"
      />
    </div>
  </div>

  <ModalDeleteItem @itemDeleted="deleteItemToList" ref="modalDelete" />

  <ModalPreviewImage ref="previewImage" />
</template>
<script>
import ModalDeleteItem from "@/components/inventario_components/ModalDeleteItem.vue";
import ModalPreviewImage from "@/components/inventario_components/ModalPreviewImage.vue";
import Swal from "sweetalert2";

export default {
  name: "ItemsDeletedView",
  data() {
    return {
      areas: [],
      items_deleted: [],
      area_id: 0,
      state: null,
      rows: 10,
      searchByBar: "",
      page: 1,
      total_items: 0,
      total_items_filters: 0,
      toggleFilters: false,
      isPageStart: true,
      isPageEnd: true,
      goPage: null,
      isActiveFilterArea: false,
      isActiveFilterState: false,
      selectedItems: [],
      checkboxItems: [],
      filters_activated: false,
    };
  },
  components: {
    ModalDeleteItem,
    ModalPreviewImage,
  },
  methods: {
    removeFilter() {
      this.filters_activated = false;
    },
    filter() {
      if (this.state == 0 || this.state == 1) {
        this.filters_activated = true;
      } else {
        this.filters_activated = false;
      }

      if (this.area_id !== 0) {
        this.filters_activated = true;
      }
      if (this.area_id === "0") {
        this.filters_activated = false;
      }
    },
    selectedItemsList() {
      console.log(this.selectedItems);
    },
    deleteItemToList(index) {
      // Ordenar el array de índices de mayor a menor para evitar problemas al eliminar elementos
      index.sort((a, b) => b - a);
      // Eliminar los elementos del array 'items' uno por uno
      index.forEach((i) => {
        this.items_deleted.splice(i, 1);
      });

      this.selectedItems = [];
      this.checkboxItems = [];
      this.total_items = this.items_deleted.length;
    },
    changeRows() {
      if (!this.rows) {
        this.rows = 10;
        if (this.rows < this.items_deleted.length) {
          this.rows;
        } else {
          this.rows = this.items_deleted.length;
        }
      }
    },
    watcherRows() {
      if (this.rows < 0 || this.rows > this.items_deleted.length) {
        Swal.fire({
          title: "Valor incorrecto",
          text: `El valor no puede ser un número negativo o mayor a la cantidad de items registrados`,
          icon: "warning",
          confirmButtonText: "Volver",
        });
        if (this.rows > this.items_deleted.length) {
          this.rows = 10;
          if (this.rows < this.items_deleted.length) {
            this.rows;
          } else {
            this.rows = this.items_deleted.length;
          }
        } else {
          this.rows = 10;
          if (this.rows < this.items_deleted.length) {
            this.rows;
          } else {
            this.rows = this.items_deleted.length;
          }
        }
      }
    },
    inputGoPages() {
      if (this.goPage > this.totalPages.length - 1) {
        Swal.fire({
          title: "Valor incorrecto",
          text: `El valor no puede ser mayor a la cantidad de páginas, ingresa un valor menor o igual`,
          icon: "warning",
          confirmButtonText: "Volver",
        });
        this.goPage = 1;
      }

      if (this.goPage >= 1 && this.goPage <= this.totalPages.length - 1) {
        this.page = this.goPage;
      }
    },
    showFilters() {
      this.toggleFilters = !this.toggleFilters;
    },
    openModalImages(image) {
      if (this.$refs.previewImage) {
        this.$refs.previewImage.setImage(image);
        this.$refs.previewImage.showModalImage = true;
      }
    },
    openModalDelete() {
      if (this.$refs.modalDelete) {
        this.$refs.modalDelete.showModalDeleteItem = true;
        this.$refs.modalDelete.setItem(this.checkboxItems);
      }
    },
    updateItemList() {
      const user_role = parseInt(localStorage.getItem("user_role"));
      const user_id = parseInt(localStorage.getItem("user_id"));
      if (user_role === 1) {
        this.$axios
          .get("https://api.inbeartory.site/api/v1/deleted_items", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            this.items_deleted = response.data.items;
            this.total_items = this.items_deleted.length;
            if (this.total_items === 0) {
              Swal.fire({
                title: "Sin registros",
                text: `No existen registros de ítems eliminados en el sistema de inventario.`,
                icon: "warning",
                confirmButtonText: "OK",
                customClass: {
                  popup: "custom-swal-font",
                },
              });
            }
          })
          .catch((error) => {
            this.items_deleted = [];
            console.log("No existen items registrados", error);
          });
      } else {
        this.$axios
          .get(`https://api.inbeartory.site/api/v1/user/deleted_items/${user_id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            this.items_deleted = response.data.items;
            this.total_items = this.items_deleted.length;
            if (this.total_items === 0) {
              Swal.fire({
                title: "Sin registros",
                text: `No existen registros de ítems eliminados en el sistema de inventario.`,
                icon: "warning",
                confirmButtonText: "OK",
                customClass: {
                  popup: "custom-swal-font",
                },
              });
            }
          })
          .catch((error) => {
            this.items_deleted = [];
            console.log("No existen items registrados", error);
          });
      }
    },
    searchByFilters() {
      const user_id = parseInt(localStorage.getItem("user_id"));
      const user_role = parseInt(localStorage.getItem("user_role"));

      let params = {
        rows: this.rows,
        area_id: this.area_id,
        user_id: user_id,
        user_role: user_role,
      };

      if (this.state === "all") {
        this.state = null;
      } else {
        if (this.state == 0 || this.state == 1) {
          params.state = parseInt(this.state);
        }
      }
      // let alert = false;
      this.$axios
        .get("https://api.inbeartory.site/api/v1/deleted_items_filter", {
          params: params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.total_items = 0;
          this.items_deleted = response.data.deleted_items;
          this.total_items_filters = this.items_deleted.length;

          if (this.rows > this.items_deleted.length) {
            this.rows = 10;
            if (this.rows < this.items_deleted.length) {
              this.rows;
            } else {
              this.rows = this.items_deleted.length;
            }
          } else {
            this.rows = 10;
            if (this.rows < this.items_deleted.length) {
              this.rows;
            } else {
              this.rows = this.items_deleted.length;
            }
          }
          if (this.total_items_filters === 0) {
            Swal.fire({
              title: "Sin registros",
              text: `No existen ítems registrados en el sistema de inventario.`,
              icon: "warning",
              confirmButtonText: "OK",
              customClass: {
                popup: "custom-swal-font",
              },
            });
          }
        })
        .catch((error) => {
          this.total_items_filters = [];
          console.error("No existen items", error.data);
        });
    },
    searchBar() {
      if (this.searchByBar === "") {
        return this.updateItemList();
      }
      this.$axios
        .get("https://api.inbeartory.site/api/v1/items/" + this.searchByBar, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          if (response.data && Array.isArray(response.data.items)) {
            this.items_deleted = response.data.items;
            this.total_items = this.items_deleted.length;
          } else {
            this.items_deleted = [];
          }

          if (this.rows > this.items_deleted.length) {
            this.rows = 10;
            if (this.rows < this.items_deleted.length) {
              this.rows;
            } else {
              this.rows = this.items_deleted.length;
            }
          } else {
            this.rows = 10;
            if (this.rows < this.items_deleted.length) {
              this.rows;
            } else {
              this.rows = this.items_deleted.length;
            }
          }
        })
        .catch((error) => {
          console("Error: " + error.response.data);
        });
    },
    exportPDF() {
      var area = "all";
      var user = 1;
      if (this.area_id !== 0) {
        area = this.area_id;
      }

      window.location.href = `https://api.inbeartory.site/api/v1/document/casualties/pdf/${user}/${area}/motivo de borrar`;
    },
    validateRows() {
      if (this.rows <= 0) {
        this.rows = 1;
      }
    },
    clear_filters() {
      this.state = null;
      this.updateItemList();
    },
    nextPage() {
      if (this.page < this.totalPages[this.totalPages.length - 1]) {
        this.page++;
      }
    },
    backPage() {
      if (this.page > 1) {
        this.page--;
      }
    },
    selectPage(i) {
      this.page = i;
    },
    changePage() {
      if (this.page == this.totalPages[1]) {
        this.isPageStart = false;
      }
      if (this.page == this.totalPages[this.totalPages.length - 1]) {
        this.isPageEnd = false;
      }
    },
    watcherPages() {
      if (
        this.totalPages.length > 0 &&
        this.page > this.totalPages[this.totalPages.length - 1]
      ) {
        this.page = this.totalPages[this.totalPages.length - 1];
      }
    },
  },
  mounted() {
    this.$axios
      .get("https://api.inbeartory.site/api/v1/areas", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        this.areas = response.data.areas;
      })
      .catch((error) => {
        alert("Error", error);
      });
    this.updateItemList();
    this.totalPages;
  },
  computed: {
    totalPages() {
      if (this.total_items_filters === 0 || this.rows <= 0) {
        return [];
      }
      var row1 = Math.ceil(this.total_items / this.rows);
      var row2 = Math.ceil(this.total_items_filters / this.rows);
      // var r = null;
      var pages = [];
      var r = row1 != 0 ? row1 : row2;
      for (let i = 0; i <= r; i++) {
        pages.push(i);
      }
      return pages;
    },
    itemsList() {
      const startIndex = (this.page - 1) * this.rows;
      const endIndex = startIndex + this.rows;

      return this.items_deleted.slice(startIndex, endIndex);
    },
  },
  watch: {
    // rows: {
    //     handler: 'watcherPages', // Llama a la función searchByFilters cuando rows cambia
    //     immediate: true // Esto asegura que searchByFilters se ejecute inmediatamente al inicio
    // },
    selectedItems: {
      handler() {
        this.checkboxItems = this.selectedItems;
      },
      immediate: true,
    },
    area_id: {
      handler() {
        this.searchByFilters();
        this.isActiveFilterArea = true;
        this.filter();
      },
      immediate: true,
    },
    state: {
      handler() {
        this.searchByFilters();
        this.isActiveFilterState = true;
        this.filter();
      },
      immediate: true,
    },
    searchByBar: {
      handler() {
        this.searchBar();
      },
      immediate: true,
    },
    goPage: {
      handler: "inputGoPages",
    },
    rows: {
      handler() {
        this.watcherPages();
      },
      immediate: true,
    },
    total_items: {
      handler() {
        if (this.page > this.totalPages[this.totalPages.length - 1]) {
          this.page = this.totalPages[this.totalPages.length - 1];
        }
        if (this.rows > this.items_deleted.length) {
          this.rows = this.items_deleted.length;
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  font-size: 1.2rem;
}
.checkbox-table {
  margin-left: 10px;
  margin-right: 10px;

  width: 25px;
  height: 25px;
}
.arrow-2 {
  width: 45%;
}
.scale-image:hover {
  transform: scale(1.1);
  cursor: pointer;
}
.ml {
  margin-left: 100px;
}
.inputGoTo {
  background-color: white;
  border: none;
  width: 3%;
  height: 45px;
  display: inline;
  border-radius: 5px;
}
.inputGoTo:hover {
  border-color: #c4c1c1;
}
.list-filters {
  background-color: #efecec;
  position: absolute;
  top: 190px;
  margin-left: 1.7%;
  width: 32.7%;
  border-radius: 6px;
  z-index: 1;
  li {
    list-style: none;
    display: block;
    // font-size:1.3rem;
    font-weight: bold;
    margin-left: 15px;
    margin-top: 15px;
  }
}
.select-filters {
  display: block;
  width: 95%;
  padding: 1.5%;
  border-radius: 6px;
  margin-bottom: 10px;
  margin-top: 15px;
  background-color: #cbd5e1;
}
.filter_active {
  height: 50px;
  width: 40%;
  background-color: #41a55d;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;
  margin-left: 2.1%;
  color: white;
  // text-align: center
}
.filter_active:hover {
  background-color: #0f6427;
  color: white;
  // transform: scale(.9);
}
.icon-arrow {
  width: 10%;
  float: right;
}
.icon-arrow-p {
  width: 55%;
  text-align: center;
}
.btn-filters {
  height: 50px;
  width: 40%;
  background-color: #fcf6f6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;
  margin-left: 2.1%;
  // text-align: center
}
.btn-filters:hover {
  background-color: #0f6427;
  color: white;
  // transform: scale(.9);
}

.actual-page {
  width: 3%;
  height: 45px;
  border: none;
  border-radius: 10px;
  margin: 0.6%;
  font-weight: bold;
  background-color: rgb(184, 182, 182);
  font-size: 1.5rem;
  height: 50px;
  color: white;
  border-radius: 5px;
  text-align: center;
}
.num-pages {
  width: 3%;
  height: 45px;
  border: none;
  border-radius: 10px;
  margin: 0.6%;
  font-weight: bold;
}
.num-pages:hover {
  background-color: rgb(45, 40, 40);
  color: white;
}
.selected-page {
  background-color: rgb(184, 182, 182);
  font-size: 1.5rem;
  height: 50px;
  color: white;
  border-radius: 5px;
}
.pages {
  // background-color: white;
  span {
    float: right;
    margin-top: 5px;
  }
  position: sticky; /* Hace que los encabezados se queden pegajosos */
  top: 0;
  margin: 0px 39px 0px 22px;
  padding-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-pages {
  border: none;
  border-radius: 10px;
  width: 2.5%;
  height: 40px;
  font-weight: bold;
  margin-top: 1px;
  //float: right;
  margin-right: 5px;
  margin-left: 5px;
}
.btn-pages:hover {
  background-color: #7cac9c;
  transform: scale(0.9);
  color: white;
}
.btn-clear {
  margin-left: 1%;
  border-radius: 5px;
  height: 30px;
  cursor: pointer;
  color: black;
  font-weight: bold;
}
.btn-clear:hover {
  background-color: #c66c6c;
  transform: scale(0.9);
  color: white;
}
#filters {
  height: 90px;
  display: grid;
  grid-template-areas: "f b";

  h1 {
    text-align: center;
    padding-bottom: 50px;
    padding-left: 5px;
    font-weight: bold;
    font-size: 1.4rem;
  }
  background-color: #7cac9c;
  .f {
    grid-area: f;
    display: flex;
    align-items: center;
    // background-color: white
  }
  .b {
    grid-area: b;
    display: flex;
    align-items: center;
    justify-content: right;
    margin-right: 2.6%;
  }
}

label {
  margin-left: 1%;
}
select {
  margin-left: 2%;
  width: 27%;
}
input[type="number"] {
  width: 50px;
  text-align: center;
  background-color: rgb(232, 227, 227);
  margin-left: 2%;
  font-weight: normal;
}
input[type="radio"] {
  transform: scale(1.7); /* Ajusta el tamaño según tus preferencias */
  margin-left: 2%;
  margin-top: 0.2%;
}
.table-conteiner {
  h1 {
    font-weight: normal;
  }
  display: grid;
  grid-template-areas:
    "s1"
    "t";
  height: 533px;
  overflow-y: auto;
  background-color: #cbd5e1;
  .sb {
    grid-area: s1;
    display: grid;
    grid-template-areas: "ex ad";
    padding-top: 10px;
    padding-bottom: 10px;
    // background-color: #0f6427;
  }
  .t {
    grid-area: t;
    overflow-y: auto;
  }
  .div-btn {
    grid-area: ad;
    float: right;
  }
}

.mrg-r {
  height: 50px;
  width: 45%;
  background-color: #41a55d;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.5s ease;
  float: left;
  margin-right: 3%;
  margin-left: 50%;
  margin-top: 32px;
}
.mrg-r:hover {
  background-color: #0f6427;
  color: white;
  transform: scale(1.1);
}
.btn-add {
  height: 50px;
  width: 45%;
  background-color: #41a55d;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.5s ease;
  float: left;
  margin-right: 1%;
  margin-left: 29%;
  margin-top: 32px;
}
.btn-add:hover {
  background-color: #0f6427;
  color: white;
  transform: scale(1.1);
}
.btn-del {
  display: block;
  height: 50px;
  width: 20%;
  background-color: #c66c6c;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.5s ease;
  margin-top: 32px;
}
.btn-del:hover {
  background-color: #ab3e3e;
  color: white;
  transform: scale(1.1);
}

input[type="search"] {
  width: 40vw;
  height: 55px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  margin-right: 3.9%;
}
.responsive-table {
  width: 97%;
  border-collapse: collapse;
  border-left: none;
  border-right: none;
  //   margin-top: -20px;
  margin: auto;
}

thead {
  background-color: #f1f5f9;
  // border-left: none;
  // border-right: none;
  border-bottom: 2px solid #8f8e8e;
  height: 50px;
  position: sticky; /* Hace que los encabezados se queden pegajosos */
  top: 0; /* Posiciona los encabezados en la parte superior del contenedor al hacer scroll */
  // z-index: 1; /* Asegura que los encabezados estén sobre el resto del contenido */
}
tbody {
  background-color: #ffffff;
}
/* Estilos de las celdas */
th {
  //   border: 1px solid #d3cece;
  padding: 8px;
  text-align: center;
}

td {
  padding-top: 10px;
  border: 1px solid #d3cece;
  border-top: none;
  border-left: none;
  border-right: none;
  text-align: center;
  font-size: 16px;
}

/* Estilos de la imagen */
.item-image {
  max-width: 100px;
  max-height: 50px;
}

.icon-actions {
  width: 30px;
  margin-left: 12px;
}
.icon-actions:hover {
  transform: scale(1.2);
}

.div-exports {
  // margin-top: 20px;
  margin-left: 22px;
  text-align: left;

  grid-area: ex;
  height: 80px;
  p {
    display: inline;
    font-weight: bold;
    font-size: 1.4rem;
  }
  // background-color: #0f6427;
}
.icon-exportar {
  width: 35px;
  margin-top: 10px;
}

.excel {
  height: 50px;
  width: 15%;
  background-color: #41a55d;
  border-radius: 5px;
  display: inline-block;
  margin-left: 2px;
  margin-top: 5px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.5s ease;
}
.pdf {
  height: 50px;
  width: 15%;
  background-color: #c66c6c;
  border-radius: 5px;
  display: inline-block;
  // margin-left: 10x;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.5s ease;
}
.excel:hover {
  background-color: #0f6427;
  color: white;
  transform: scale(1.1);
}
.pdf:hover {
  background-color: #ab3e3e;
  color: white;
  transform: scale(1.1);
}
// .background-edit{
//     background-color: #41A55D;
// }
strong {
  font-weight: bold;
  font-size: 1.3rem;
  margin-left: 10px;
}

@media only screen and (max-width: 796px) {
  #filters {
    height: 190px;
    display: grid;
    grid-template-areas:
      "b"
      "f";

    .f {
      grid-area: f;
      display: flex;
      align-items: center;
      // background-color: rgb(129, 16, 16)
    }
    .b {
      grid-area: b;
    }
    input[type="search"] {
      width: 100%;
      height: 55px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      margin: 20px 7px 0px 20px;
      padding: 10px;
    }
    .list-filters {
      position: absolute; /* Cambiar a posición relativa para que fluya con el contenido */
      top: 290px;
      margin-left: 3%;
      width: 54.5%;
    }
  }
}

/* Estilos para la vista en celulares */
@media only screen and (max-width: 600px) {
  #filters {
    height: 190px;
    display: grid;
    grid-template-areas:
      "b"
      "f";

    h1 {
      text-align: center;
      padding-bottom: 50px;
      padding-left: 5px;
      font-weight: bold;
      font-size: 1.4rem;
    }
    background-color: #7cac9c;
    .f {
      grid-area: f;
      display: flex;
      align-items: center;
      // background-color: rgb(129, 16, 16)
    }
    .b {
      grid-area: b;
    }
    input[type="search"] {
      font-family: "Montserrat";
      width: 100%;
      height: 55px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      margin: 20px 7px 0px 20px;
      padding: 10px;
    }
    .list-filters {
      background-color: #efecec;
      position: absolute;
      top: 270px;
      margin-left: 5.3%;
      width: 190px;
      border-radius: 6px;

      z-index: 1;
      li {
        list-style: none;
        display: block;
        // font-size:1.3rem;
        font-weight: bold;
        margin-left: 18px;
        margin-top: 15px;
        font-size: 1rem;
      }
      color: black;
    }
  }

  .table-conteiner {
    h1 {
      font-weight: normal;
    }
    display: grid;
    grid-template-areas:
      "s1"
      "t";
    height: 533px;
    overflow-y: auto;
    background-color: #cbd5e1;
    .sb {
      grid-area: s1;
      display: grid;
      grid-template-areas: "ex ad";
      padding-top: 10px;
    }
    .t {
      grid-area: t;
      overflow-y: auto;
    }
    .div-btn {
      grid-area: ad;
      float: right;
    }

    .div-exports {
      // margin-top: 20px;
      // margin-left: 22px;
      text-align: left;

      grid-area: ex;
      height: 90px;

      // background-color: #0f6427;
    }
    .icon-exportar {
      width: 50%;
    }
    p {
      text-align: center;
      font-size: 1.2rem;
    }
    .excel {
      height: 50px;
      width: 70px;
      background-color: #41a55d;
      border-radius: 5px;
      display: inline-block;
      margin: 5px 0px 0px 0px;
      text-align: center;
      cursor: pointer;
      transition: background-color 0.5s ease;
    }
    .pdf {
      height: 50px;
      width: 70px;
      background-color: #c66c6c;
      border-radius: 5px;
      display: inline-block;
      // margin-left: 15px;
      text-align: center;
      cursor: pointer;
      transition: background-color 0.5s ease;
    }
    .excel:hover {
      background-color: #0f6427;
      color: white;
      transform: scale(1.1);
    }
    .pdf:hover {
      background-color: #ab3e3e;
      color: white;
      transform: scale(1.1);
    }
    strong {
      font-size: 0px;
    }
  }

  .select-filters {
    font-size: 0.9rem;
    display: block;
    width: 90%;
    padding: 1.5%;
    border-radius: 6px;
    margin-bottom: 10px;
    margin-top: 15px;
    background-color: #cbd5e1;
    color: black;
  }
  .select-filters option {
    font-size: 1rem;
    color: black;
  }
  .icon-arrow {
    width: 0%;
    float: right;
  }
  .icon-arrow-p {
    width: 55%;
    text-align: center;
  }
  .btn-filters {
    font-size: 1.1rem;
    height: 40px;
    width: 190px;
    background-color: #fcf6f6;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s ease;
    margin-left: 5.3%;
    color: black;
    // text-align: center
  }
  .btn-filters:hover {
    background-color: #0f6427;
    color: white;
    // transform: scale(.9);
  }

  label {
    margin-left: 10px;
  }

  .actual-page {
    width: 35%;
    height: 45px;
    border: none;
    border-radius: 10px;
    margin: 2%;
    font-weight: bold;
    background-color: rgb(184, 182, 182);
    font-size: 1.5rem;
    height: 50px;
    color: white;
    border-radius: 5px;
    text-align: center;
  }
  .num-pages {
    width: 30%;
    height: 45px;
    border: none;
    border-radius: 10px;
    margin: 0.6%;
    font-weight: bold;
    color: black;
  }
  .num-pages:hover {
    background-color: rgb(45, 40, 40);
    color: white;
  }
  .pages {
    // background-color: white;
    span {
      float: right;
      margin-top: 5px;
    }
    position: sticky; /* Hace que los encabezados se queden pegajosos */
    top: 0;
    margin: 0px 39px 0px 22px;
    padding-top: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn-pages {
    border: none;
    border-radius: 10px;
    width: 25%;
    height: 40px;
    font-weight: bold;
    margin-top: 1px;
    //float: right;
    margin-right: 5px;
    margin-left: 5px;
    color: black;
  }

  .btn-pages:hover {
    background-color: #7cac9c;
    transform: scale(0.9);
    color: white;
  }
  th,
  td {
    font-size: 0.9rem;
  }
  .item-image {
    max-width: 40px;
    max-height: 50px;
  }
  .d-none {
    display: none;
  }

  .mrg-r {
    height: 50px;
    width: 120px;
    background-color: #41a55d;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.5s ease;
    float: right;
    margin-right: 5px;
    margin-left: 20px;
    margin-top: 32px;
    color: black;
  }
  .mrg-r:hover {
    background-color: #0f6427;
    color: white;
    transform: scale(1.1);
  }

  .btn-del {
    display: block;
    height: 50px;
    width: 120px;
    background-color: #c66c6c;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.5s ease;
    float: right;
    margin-right: 5px;
    color: black;
  }
  .btn-del:hover {
    background-color: #ab3e3e;
    color: white;
    transform: scale(1.1);
  }

  .btn-add {
    height: 50px;
    width: 120px;
    background-color: #41a55d;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.5s ease;
    float: right;
    margin-right: 5px;
    margin-top: 32px;
    color: black;
    display: none;
  }
  .filter_active {
    height: 40px;
    width: 190px;
    background-color: #41a55d;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s ease;
    margin-left: 20px;
    color: white;
    // text-align: center
  }
  .filter_active:hover {
    background-color: #0f6427;
    color: white;
    // transform: scale(.9);
  }
}
</style>
