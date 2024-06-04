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
            <th style="text-align: left">Área</th>
            <th class="d-none">No. Edificio</th>
            <th class="d-none">No. Piso</th>
            <th class="d-none">Ala</th>
            <th>Encargado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="area in areas" :key="area.id">
            <td style="text-align: left">{{ area.area_name }}</td>
            <td class="d-none">{{ area.building }}</td>
            <td class="d-none">{{ area.floor }}</td>
            <td class="d-none">{{ area.wing }}</td>
            <td>{{ area.user_name }}</td>
            <td>
              <img
                @click="openModalEditArea(area)"
                class="icon-actions"
                src="@/assets/lapiz_editar.png"
                alt="Boton para editar"
              />
              <img
                @click="openModalOptionDelete(area)"
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

  <ModalAltaArea @areaAdded="updateAreaList" ref="modalAlta" />
  <ModalEditArea @areaEdited="updateAreaList" ref="modalEdit" />
  <ModalOptionArea
    @areaWasDeleted="updateAreaList"
    @areaWasDeletedAndTransferred="updateAreaList"
    ref="modalOption"
  />
</template>

<script>
import ModalAltaArea from "@/components/area_components/ModalAltaArea.vue";
import ModalEditArea from "@/components/area_components/ModalEditArea.vue";
import ModalOptionArea from "@/components/area_components/ModalOptionArea.vue";

export default {
  name: "AreaView",
  data() {
    return {
      areas: [],
    };
  },
  components: {
    ModalAltaArea,
    ModalEditArea,
    ModalOptionArea,
  },
  methods: {
    openModalAlta() {
      if (this.$refs.modalAlta) {
        this.$refs.modalAlta.showModalAltaArea = true;
      }
    },
    updateAreaList() {
      this.$axios
        .get("https://api.inbeartory.site/api/v1/areas", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.areas = response.data.areas;
        })
        .catch(() => {
          alert("No existen áreas asignadas aún");
        });
    },
    openModalEditArea(area) {
      if (this.$refs.modalEdit) {
        this.$refs.modalEdit.showModalEditArea = true;
        this.$refs.modalEdit.setArea(area);
      }
    },
    openModalOptionDelete(area) {
      if (this.$refs.modalOption) {
        this.$refs.modalOption.showModalOptionDelete = true;
        this.$refs.modalOption.setArea(area);
      }
    },
  },
  mounted() {
    this.updateAreaList();
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
  // margin-top:10px;
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
  // border-left: none;
  // border-right: none;
  border-bottom: 2px solid #8f8e8e;
  height: 50px;
  // position: sticky; /* Hace que los encabezados se queden pegajosos */
  // top: 0; /* Posiciona los encabezados en la parte superior del contenedor al hacer scroll */
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
