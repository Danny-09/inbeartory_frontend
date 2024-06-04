<template>
  <HeaderComponent></HeaderComponent>
  <NavComponent v-if="showNavBar"></NavComponent>
  <!-- <transition name="slide-left" mode="out-in"> -->
  <router-view />
  <!-- </transition> -->
  <LineComponent v-if="showAboutUs"></LineComponent>
  <AboutUsComponent v-if="showAboutUs"></AboutUsComponent>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import NavComponent from "@/components/NavComponent.vue";
import AboutUsComponent from "@/components/about_us/AboutUsComponent.vue";
import LineComponent from "@/components/about_us/LineComponent.vue";


// import LoginView from '@/views/LoginView.vue'
export default {
  components: {
    NavComponent,
    HeaderComponent,
    AboutUsComponent,
    LineComponent
  },
  created() {
    // Verificar si hay un token en el localStorage
    const token = localStorage.getItem("token");

    // Si no hay token, redirigir al login
    if (!token) {
      this.$router.push({ name: "login" });
    } else {
      // Aquí podrías agregar lógica para validar el token en el backend si es necesario
      this.$router.push({ name: "inventario" });
    }
  },
  computed: {
    showNavBar() {
      // Acceder a la información de la ruta actual, para ocultar el componente nav.
      return (
        this.$route.name !== "login" && this.$route.name !== "recover_password"
      );
    },
    showAboutUs(){
      return (
        this.$route.name === "login"
      );
    }
  },
};
</script>
<style>
* {
  font-family: "Montserrat", sans-serif;
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Montserrat";
  margin: 0;
  padding: 0;
}
/* Estilos de transición */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.5s ease;
}
.slide-left-enter,
.slide-left-leave-to {
  transform: translateX(100%);
}
</style>
