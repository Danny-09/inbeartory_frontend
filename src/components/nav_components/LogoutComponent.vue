<template>
  <div class="">
    <button class="btn-up-images" type="button" @click="logout()">Cerrar sesión</button>
  </div>
</template>
<script>
export default {
  name: "LogoutComponent",
  data() {
    return {

    };
  },
  methods: {
    logout(){
        //Eliminar los valores del localStorage y token JWT
        localStorage.clear();
        this.$router.push({ name:'login'} );
    }
  },
};
</script>

<style scoped>
.btn-up-images {
  margin-top: 5px;
  height: 40px;
  color: white;
  border-radius: 5px;
  font-size: 1rem;
  margin-left: 35px;
  width: 180px;
  margin-bottom: 10px;
}
.btn-up-images {
  transition: transform 0.2s ease; /* Agrega una transición suave */
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
  font-weight: bold;

}
button:hover {
  transform: scale(0.9);
  color: white;
}
@media only screen and (max-width: 600px) {
  .btn-up-images {
    width: 140px;
  }
}
</style>
