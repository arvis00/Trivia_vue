<template>
  <div class="container">
    <slot />
  </div>
</template>

<script>
export default {}
</script>

<style>
.container {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 313px;
  height: 540px;
  border: 1px solid rgb(53, 52, 52);
  border-radius: 20px;
  background-color: #fff;
  position: relative;
  top: 81px;
}

.resultText {
  text-align: center;
  margin-top: 137px;
  font-size: 25px;
  font-weight: 900;
}

.question {
  text-align: center;
  font-size: 20px;
}

.answer {
  height: 30px;
  width: 200px;
  margin-top: 10px;
  border-radius: 20px;
}

.listAnswers {
  list-style-type: none;
  padding: 0;
}
</style>
