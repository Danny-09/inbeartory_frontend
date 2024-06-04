<template>
    <div class="about-us">
      <h2>Acerca de nosotros..</h2>
      <p>Bienvenidos a nuestro equipo de trabajo, conoce a las personas detrás de este proyecto:</p>
      <div class="team-members">
        <div v-for="(member, index) in team" :key="index" class="member">
          <h3>{{ member.name }}</h3>
          <p>{{ member.position }}</p>
          <p style="font-weight: bold; color: gray;">{{ member.email }}</p>
          <a :href="`http://${member.linkedin}`">{{ member.linkedin }}</a>
        </div>
        <div class="teacher">
          <h2>Asesor: <span>Ulises Ponce Mendoza</span> </h2>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AboutUsComponent',
    data() {
      return {
        team: [
          { name: 'Danilo Fernando Abril León', position: 'Project Manager, Desarrollador Full Stack', email: 'Correo: dacojose@gmail.com', linkedin: 'linkedin.com/in/danilo-abril-26a9132b3' },
          { name: 'José Luis Moreno Meza', position: 'Desarrollador Backend', email: 'Correo: joseluis020902@outlook.com ', linkedin: 'linkedin.com/in/josé-luis-moreno-meza-7667b0306' },
          { name: 'Kevin Humberto Urquijo Luzania', position: 'Diseñador (UX, UI), Desarrollador Frontend', email: 'Correo: Luzania451147@gmail.com.', linkedin: '/' },
          { name: 'Roberto Zuzuarregui Miranda', position: 'Diseñadores (UX, UI), Desarrollador Frontend', email: 'Correo: robez123foximangle@gmail.com .', linkedin: '/' }
        ]
      };
    }
  };
  </script>
  
  <style scoped lang="scss">
  .about-us {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  .teacher{
    h2{
      text-align: center;
    }
  }
  .team-members {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .member {
    width: 45%;
    margin-bottom: 20px;
  }
  
  h2 {
    margin-bottom: 10px;
  }
  
  h3 {
    margin-top: 20px;
  }
  
  ul {
    margin-top: 10px;
  }
  </style>
  