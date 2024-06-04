<template>
   <header>
      <h1>INBEARTORY</h1>
      <h2 id="section_name"></h2>
   </header>
</template>


<script>
export default{
   name: 'HeaderComponent'
}

</script>

<style scoped lang="scss">
$green: #0E7547;

header{
   background-color: $green;
   height: 60px;
   text-align: center;
   h1{
      color: white;
      padding-top: 1%;
   }
}
</style>