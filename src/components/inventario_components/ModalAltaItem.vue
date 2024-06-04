<template>
  <div class="modal" v-if="showModalAltaItem">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Agregar item</h2>
      <p>Llena los siguientes campos.</p>
      <form @submit.prevent="submitForm">
        <div class="cl-1">
          <label for="input1">* No. de inventario (5 dígitos):</label>
          <input
            type="text"
            @input="limitInput"
            v-model="inventory_number"
            class="form-control"
            id="NoInventory"
            required
          />

          <label for="DescItem">* Descripción:</label>
          <input
            type="text"
            v-model="description"
            class="form-control"
            id="DescItem"
            :disabled="!isInventoryNumberFilled"
            required
          />

          <label for="MarcaItem">* Marca:</label>
          <input
            type="text"
            v-model="brand"
            class="form-control"
            id="MarcaItem"
            :disabled="!isInventoryNumberFilled"
            required
          />

          <label for="ModeloItem">* Modelo:</label>
          <input
            type="text"
            v-model="model"
            class="form-control"
            id="ModeloItem"
            :disabled="!isInventoryNumberFilled"
            required
          />
        </div>
        <div class="cl-2">
          <label for="CommentsItem">Comentarios:</label>
          <input
            type="text"
            v-model="comments"
            class="form-control"
            id="CommentsItem"
            :disabled="!isInventoryNumberFilled"
          />

          <label for="SerieItem">* Serie:</label>
          <input
            type="text"
            v-model="serie"
            class="form-control"
            id="SerieItem"
            :disabled="!isInventoryNumberFilled"
            required
          />

          <label for="CondiItem">* Condición:</label>
          <input
            type="text"
            v-model="condition"
            class="form-control"
            id="CondiItem"
            :disabled="!isInventoryNumberFilled"
            required
          />

          <label for="CondiItem">* Ubicación del item</label>
          <select
            name=""
            id="CondiItem"
            v-model="area_id"
            :disabled="!isInventoryNumberFilled"
          >
            <option value="0" disabled selected>Seleccionar área</option>

            <option v-for="area in areas" :key="area.id" :value="area.id">
              {{ area.area_name }}
            </option>
          </select>
        </div>
        <div class="cl-3">
          <fieldset>
            <legend>* Estado:</legend>
            <div>
              <input
                type="radio"
                v-model="state"
                id="RadActivoItem"
                name="state"
                :disabled="!isInventoryNumberFilled"
                value="1"
              />
              <label class="label-inline" for="RadActivoItem">Activo</label>

              <input
                type="radio"
                v-model="state"
                id="RadBajaItem"
                name="state"
                :disabled="!isInventoryNumberFilled"
                value="0"
              />
              <label class="label-inline" for="RadBajaItem">Inactivo </label>
            </div>
          </fieldset>

          <label for="ImgItems">* Imagen del Item:</label>
          <input
            type="file"
            @change="handleImageChange"
            class="form-control"
            id="ImgItems"
            :disabled="!isInventoryNumberFilled"
            placeholder="Imagen del Item"
          />
          <div class="divPreview">
            <img
              v-if="imagePreview"
              :src="imagePreview"
              alt="Preview"
              class="imgPreview"
            />
          </div>
          <div class="box-btn">
            <button class="btn-submit" type="submit">Añadir</button>
            <button @click="closeModal" class="btn-cancel" type="button">
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "ModalAltaItem",
  data() {
    return {
      areas: [],
      inventory_number: "",
      description: "",
      brand: "",
      model: "",
      comments: "",
      serie: "",
      condition: "",
      area_id: 0,
      state: null,
      image: null,
      user_id: 0,
      showModalAltaItem: false,
      isInventoryNumberFilled: false,
      uploading: false,
      imagePreview: null,
    };
  },
  methods: {
    limitInput() {
      let num = this.inventory_number;

      // Eliminar cualquier caracter que no sea un dígito
      num = num.replace(/\D/g, "");

      // Limitar la longitud a 5 caracteres
      if (num.length > 5) {
        num = num.slice(0, 5);
      }

      // Actualizar el valor del campo de entrada
      this.inventory_number = num;
    },
    closeModal() {
      this.showModalAltaItem = false;
      this.imagePreview = null;
    },
    resetForm() {
      this.inventory_number = null;
      this.description = "";
      this.brand = "";
      this.model = "";
      this.comments = "";
      this.serie = "";
      this.condition = "";
      this.area_id = 0;
      this.state = null;
      this.image = null;
      this.imagePreview = null;
    },
    submitForm() {
      this.user_id = parseInt(localStorage.getItem("user_id"));
      const formData = new FormData();
      formData.append("inventory_number", this.inventory_number);
      formData.append("description", this.description);
      formData.append("brand", this.brand);
      formData.append("model", this.model);
      formData.append("comments", this.comments);
      formData.append("serie", this.serie);
      formData.append("condition", this.condition);
      formData.append("area_id", this.area_id);
      formData.append("state", this.state);
      formData.append("user_id", this.user_id);
      formData.append("image", this.image);

      this.$axios
        .post("https://api.inbeartory.site/api/v1/items", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((result) => {
          Swal.fire({
            title: "Registro exitoso",
            text: `El ítem ${result.data.success.description},  se ha registrado correctamente.`,
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              popup: "custom-swal-font",
            },
          });

          this.$emit("itemAdded", result.data.success);
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
            // Manejar otros errores
            console.log("Error: " + error.response.data.message);
          }
        });
    },
    handleImageChange(event) {
      if (event.target.files.length > 0) {
        this.image = event.target.files[0];
      }
      const img = event.target.files[0];
      if (img) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(img);
      }
    },
  },
  mounted() {
    const user_role = parseInt(localStorage.getItem("user_role"));
    const user_id = parseInt(localStorage.getItem("user_id"));

    if (user_role === 1) {
      this.$axios
        .get(`https://api.inbeartory.site/api/v1/areas`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.areas = response.data.areas;
        })
        .catch(() => {});
    } else {
      this.$axios
        .get(`https://api.inbeartory.site/api/v1/user/areas/${user_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.areas = response.data.areas;
        })
        .catch(() => {});
    }
  },
  watch: {
    inventory_number(newValue) {
      // Verificar si el número de inventario está lleno para habilitar los campos
      this.isInventoryNumberFilled =
        newValue !== null && newValue.toString().length === 5;
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
  z-index: 2;
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #ffffff;
  border-radius: 15px;
  width: 80%;
  /* height: 80%; */
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

form {
  display: grid;
  grid-template-areas: "c1 c2 c3";

  .cl-1 {
    grid-area: c1;
  }
  .cl-2 {
    grid-area: c2;
  }
  .cl-3 {
    grid-area: c3;
    width: 80%;
  }
  label {
    display: block;
    font-weight: bolder;
    margin-top: 20px;
    text-align: left;
    margin-left: 20px;
  }
  legend {
    text-align: center;
    border: none;
  }
  fieldset {
    margin-top: 58px;
  }
  .label-inline {
    display: inline;
    margin-left: 5%;
  }
  input[type="radio"] {
    margin-left: 5%;
  }
  input[type="text"],
  input[type="number"],
  select {
    font-size: 1rem;
    border: 1px solid #d3cdcd;
    border-radius: 5px;
    width: 90%;
    height: 40px;
    margin-top: 25px;
  }
  input[type="file"] {
    margin-top: 10px;
    font-size: 1rem;
  }
  .box-btn {
    margin-top: 0%;
  }
  button {
    font-weight: bold;
    font-size: 1rem;
    width: 45%;
    height: 40px;
    margin-top: 44px;
    border: none;
    border-radius: 5px;
  }

  button:hover {
    color: white;
    font-weight: bold;
    transform: scale(1.1);
  }
  .btn-submit {
    background-color: #41a55d;
    color: black;
  }

  .btn-cancel {
    background-color: #c66c6c;
    float: right;
  }
  .btn-submit:hover {
    background-color: #0f6427;
  }

  .btn-cancel:hover {
    background-color: #ab3e3e;
    float: right;
  }
}

.divPreview {
  text-align: center;
  width: 100%;
  height: 170px;
}
.imgPreview {
  width: 85%;
  height: 170px;
}

@media only screen and (max-width: 1194px) {
  form {
    display: grid;
    grid-template-areas:
      "c1"
      "c2"
      "c3";

    .cl-1 {
      grid-area: c1;
    }
    .cl-2 {
      grid-area: c2;
    }
    .cl-3 {
      grid-area: c3;
      width: 80%;
    }
  }
  .modal {
    overflow-y: auto;
  }
}

/* Estilos para la vista en celulares */
@media only screen and (max-width: 600px) {
  form {
    display: grid;
    grid-template-areas:
      "c1"
      "c2"
      "c3";

    .cl-1 {
      grid-area: c1;
    }
    .cl-2 {
      grid-area: c2;
    }
    .cl-3 {
      grid-area: c3;
    }
  }
  label {
    display: block;
    font-weight: bolder;
    margin-top: 20px;
    text-align: left;
  }
  legend {
    text-align: center;
    border: none;
  }
  fieldset {
    margin-top: 38px;
  }
  .label-inline {
    display: inline;
    /* margin-left: 5%; */
  }
  input[type="radio"] {
    margin-left: 5%;
  }
  input[type="text"],
  input[type="number"],
  select {
    font-size: 1rem;
    border: 1px solid #d3cdcd;
    border-radius: 5px;
    width: 90%;
    height: 40px;
    margin-top: 5px;
  }
  input[type="file"] {
    margin-top: 10px;
    font-size: 1rem;
  }
  button {
    font-weight: bold;
    font-size: 1rem;
    width: 45%;
    height: 40px;
    border: none;
    border-radius: 5px;
  }
  button:hover {
    color: white;
    font-weight: bold;
    transform: scale(1.1);
  }
  .btn-submit {
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

  .modal {
    z-index: 2;
  }
  .modal-content {
    height: 100%;
    overflow-y: auto;
  }
}
</style>
