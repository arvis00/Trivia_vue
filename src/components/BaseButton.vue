<template>
  <button :class="correct && gameOver ? 'green' : ''" @click="onClick">
    <slot />
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    correct: {
      type: Boolean
    },
    gameOver: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick (event) {
      this.$emit("click", event)
    }
  }
}
</script>

<style>
button:focus {
  outline: 0;
}

button:disabled {
  color: black;
}

.startButton {
  position: absolute;
  bottom: 100px;
  margin: 0 auto;
  height: 40px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 900;
  padding: 0 26px 0 26px;
}

.green {
  background-color: rgb(9, 255, 0);
}

.red {
  background-color: rgb(255, 1, 1);
}
</style>
