<template>
    <div class="password-recovery">
      <h2>Recuperar Contraseña</h2>
      <div v-if="step === 1">
        <button @click="requestToken">Solicitar Token</button>
      </div>
      <div v-if="step === 2">
        <input type="text" v-model="token" placeholder="Ingresa el token" />
        <button @click="validateToken">Validar Token</button>
      </div>
      <div v-if="step === 3">
        <div class="modal-overlay" @click="showModal = false">
          <div class="modal-container" @click.stop>
            <button class="modal-close" @click="showModal = false">&times;</button>
            <h3>Nueva Contraseña</h3>
            <input type="password" v-model="newPassword" placeholder="Nueva Contraseña" />
            <button @click="setNewPassword">Aceptar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'RecoverPasswordComponent',
    data() {
      return {
        step: 1,
        token: '',
        newPassword: '',
        showModal: false,
      };
    },
    methods: {
      requestToken() {
        // Lógica para solicitar el token
        console.log('Token solicitado');
        this.step = 2;
      },
      validateToken() {
        // Lógica para validar el token
        if (this.token === '123456') { // Reemplazar con la validación real del token
          this.showModal = true;
          this.step = 3;
        } else {
          alert('Token incorrecto');
        }
      },
      setNewPassword() {
        // Lógica para establecer la nueva contraseña
        console.log('Nueva contraseña establecida');
        this.showModal = false;
        this.$router.push('/login'); // Redirigir al login
      },
    },
  };
  </script>
  
  <style scoped>
  .password-recovery {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    font-family: Arial, sans-serif;
  }
  
  .password-recovery h2 {
    margin-bottom: 20px;
  }
  
  .password-recovery input,
  .password-recovery button {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    box-sizing: border-box;
  }
  
  .password-recovery button {
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .password-recovery button:hover {
    background-color: #0056b3;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-container {
    background: white;
    padding: 20px;
    border-radius: 4px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
  
  .modal-body {
    margin-top: 20px;
  }
  </style>
  