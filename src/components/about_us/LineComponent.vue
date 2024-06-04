<template>
    <div class="separator-container">
      <div class="line"></div>
      <div class="scroll-indicator">
        <span>Acerca de nosotros, mira abajo. </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 18c4.41 0 8-3.59 8-8s-3.59-8-8-8-8 3.59-8 8 3.59 8 8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LineComponent'
  };
  </script>
  
  <style scoped>
  .separator-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* margin: 5px 0; */
  }
  
  .line {
    width: 100%;
    height: 5px;
    background-color: #656363;
  }
  
  .scroll-indicator {
    display: flex;
    align-items: center;
    margin-top: 10px;
    animation: bounce 2s infinite;
  }
  
  .scroll-indicator span {
    margin-right: 10px;
    font-size: 1.2rem;
    color: #555;
  }
  
  .scroll-indicator svg {
    fill: #555;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
  
  @media (max-width: 768px) {
    .scroll-indicator span {
      font-size: 12px;
    }
  
    .scroll-indicator svg {
      width: 20px;
      height: 20px;
    }
  }
  </style>
  