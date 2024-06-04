<template>
  <div class="background">
    <div class="login-container">
      <div class="login-header">
        <img
          src="@/assets/android-chrome-192x192.png"
          alt="Profile Image"
          class="profile-image"
        />
      </div>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Correo</label>
          <input
            type="email"
            id="email"
            name="email"
            v-model="email"
            placeholder="Ingresa tu correo"
            required
            @focus="isFocusedEmail = true"
            @blur="isFocusedEmail = false"
            :class="{ 'input-focused': isFocusedEmail }"
          />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            v-model="password"
            placeholder="Ingresa tu constraseña"
            required
            @focus="isFocusedPassword = true"
            @blur="isFocusedPassword = false"
            :class="{ 'input-focused': isFocusedPassword }"
          />
        </div>
        <button type="submit" class="login-button">Iniciar Sesión</button>
      </form>
      <button @click="recoverPassword" class="recover-button">
        Recuperar Contraseña
      </button>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
export default {
  name: "LoginComponent",
  data() {
    return {
      email: "",
      password: "",
      tokenJWT: "",
      isFocusedEmail: false,
      isFocusedPassword: false,
    };
  },
  methods: {
    login() {
      const email = this.email;
      const password = this.password;
      const data = {
        email: email,
        password: password,
      };
      this.$axios
        .post("https://api.inbeartory.site/api/v1/login", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.tokenJWT = response.data.authorisation.token;
          localStorage.setItem("token", this.tokenJWT);

          localStorage.setItem("user_id", response.data.user.id);
          localStorage.setItem("user_role", response.data.user.user_role);

          this.$router.push({ name: "inventario" });
        })
        .catch(() => {
          Swal.fire({
              title: `Login fallido`,
              text: `Verifica que tus credenciales sean correctas.!`,
              icon: "error",
              confirmButtonText: "OK",
              customClass: {
                popup: "custom-swal-font",
              },
            });
        });
    },
    recoverPassword() {
      this.$router.push({ name: "recover_password" });
    },
  },
};
</script>

<style scoped>
* {
  font-size: 1.2rem;
}
.background {
  background-color: #cbd5e1;
  margin-top: 1px;
  height: 83vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  max-width: 600px;
  width: 25%;
  padding: 45px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.login-header {
  text-align: center;
  margin-bottom: 20px;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border-top: none;
  border-left: none;
  border-right: none;

  border-radius: 5px;
}
/* Clase para el input enfocado */
.input-focused {
  /* border-color: #0f6427; */
  outline: none;
  box-shadow: 0 0 5px rgba(89, 92, 89, 0.5);
}

.login-button,
.recover-button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  background-color: #41a55d;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.login-button:hover,
.recover-button:hover {
  background-color: #0f6427;
  transform: scale(0.98);
}

.recover-button {
  background-color: #6c757d;
}

.recover-button:hover {
  background-color: #565e64;
}

/* Estilos para la vista en celulares */
@media only screen and (max-width: 600px) {
  .login-container {
    width: 70%;
  }
}
</style>
