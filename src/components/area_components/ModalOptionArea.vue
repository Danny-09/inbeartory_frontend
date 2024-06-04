<template>
    <div class="modal" v-if="showModalOptionDelete">
      <div class="modal-content">
        <span class="close" @click="closeModal"> &times;</span>
        <h2>Eliminar área</h2>
        <h3>
          Antes de eliminar un área puedes elegir entre: <br> 
          <li>     Eliminar el área junto con los ítems pertenecientes. </li>
          <li>     Transferir los ítems a otra área. </li>
        </h3>
        
            <div class="box-btn">
              <div class="e">
              <button @click="openModalDeleteArea(this.area_id)" class="btn-eliminar" type="button">Eliminar</button>
              </div>

              <div class="t">
              <button class="move-Area" @click="openModalTransferItems(this.area_id)" type="button">Mover</button>
              </div>

              <div class="c">
                <button @click="closeModal" class="btn-cancel" type="button">Cancelar</button>
              </div>
            </div>
          </div>
    </div>

    <ModalDeleteArea @areaDeleted="eventDeleted" ref="modalDelete"/>
    <ModalTransferItems @areaDeletedAndItemsTransferred="eventDeletedAndTrasnferred"  ref="modalTransfer"/>


  </template>
  
  <script>
  import ModalDeleteArea from '@/components/area_components/ModalDeleteArea.vue'
  import ModalTransferItems from '@/components/area_components/ModalTransferItems.vue'

  
  export default {
    name: 'ModalOptionArea',
      data() {
      return {
        area_id: null,
        showModalOptionDelete: false,
        };
    },
    components:{
        ModalDeleteArea,
        ModalTransferItems
    },
    methods: {
      eventDeletedAndTrasnferred(){
        this.$emit('areaWasDeletedAndTransferred');
        this.showModalOptionDelete = false;
      },
      eventDeleted(){
        this.$emit('areaWasDeleted');
        this.showModalOptionDelete = false;
      },
      closeModal() {
        this.showModalOptionDelete = false;
      },
      openModalDeleteArea(area_id){
            if (this.$refs.modalDelete) {
                this.$refs.modalDelete.showModalDeleteArea = true;
                this.$refs.modalDelete.setArea(area_id);
            }
        },
      openModalTransferItems(area_id){
          if (this.$refs.modalTransfer) {
              this.$refs.modalTransfer.showModalTransferItems = true;
              this.$refs.modalTransfer.setAreaId(area_id)
        }
      },
      submitForm(){                 
        this.closeModal();
      },
      setArea(area){
        this.area_id = area.id;
      }
    }
  };
  </script>
  
  <style scoped lang="scss">
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
    width: 40%;
    height: 40%;
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
  h2{
    text-align: left;
  }
  h3{
    padding-top: 20px;
    text-align: justify;
    list-style:square;

  }
  li{
    font-weight: 100;
  }
  .box-btn{
    // margin-top: 5%;
    // background-color: #41A55D;   
    // width: 100%;
    display: grid;
    grid-template-areas: 
    'be bma'
    'bc bc'
    ;
    
  }
  .e{
    grid-area: be;  
  }
  .t{
    grid-area: bma;
  }
  .c{
    grid-area: bc;
  }
  
  .btn-eliminar{
    background-color: #ab3e3e;
    width: 250px;
    height: 45px;
    float: left;
  }
  .move-Area{
    align-items: center;
    width: 250px;
    height: 45px;
    float: right;
    margin-right: 25px;
    background-color: #41A55D;

    // margin-left: 60px;
    // margin-right: 60px;
  }

  .btn-cancel{
      background-color: #ddd;
      width: 250px;
      height: 45px;
      float: right;
      margin-right: 25px;
    }
  
    button{
      font-weight: bold;
      font-size: 1.2rem;
      width: 30%;
      height: 40px;
      margin-top: 40px;
      border: none;
      border-radius: 5px;
      color: black;

    }
    button:hover{
      font-weight: bold;
      transform: scale(1.1)
  
    }
    
  
    .move-Area:hover{
      background-color: #0f6427;
      color: white;
    }

    .btn-eliminar:hover{
      background-color: #ab3e3e;
      color: white
    }
    
    .btn-cancel:hover{
      background-color: #7b7a7a;
      color: white;
      
    }
  
  .custom-swal-font {
    font-family: 'Century Gothic';  
  }

    @media only screen and (max-width: 600px) {
      .modal-content {
        width: 80%;
        height: 60%;
        
      }
      .btn-eliminar{
        background-color: #ab3e3e;
        width: 130px;
        height: 45px;
        float: left;
      }
      .move-Area{
        align-items: center;
        width: 130px;
        height: 45px;
        float: right;
        margin-right: 2px;
        background-color: #41A55D;
        // margin-left: 60px;
        // margin-right: 60px;
      }

      .btn-cancel{
          background-color: #ddd;
          width: 130px;
          height: 45px;
          float: right;
          margin-right: 2px;
        }
    }

    
 
 </style>