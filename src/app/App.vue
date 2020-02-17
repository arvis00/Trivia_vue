<template>
  <div id="app">
    <!-- <s id="quiz"> -->

    <WhiteSpace v-if="!startQuiz">

      <Timer @timerEnd="gameOver" ref="timerRef" />
      <span v-if="isRequesting&&currentIndex===0">Loading...</span>

      <template v-if="currentQuestion">
        <h5>
          {{ currentQuestion.category }}
        </h5>
        <h2 class="question">
          {{ currentQuestion.question }}
        </h2>

        <ul class="listAnswers">
          <li v-for="(answer,i) in currentAnswers" :key="answer">
            <BaseButton
            class="answer"

            :correct="answer === currentQuestion.correct_answer"
            :gameOver="gameOverData"
            :class="{red:i===clickedIndex}"
            :disabled="disabled"
            @click="checkAnswer(answer,i)">
              {{ answer }}
            </BaseButton>
          </li>
        </ul>
      </template>

      <!-- </template> -->

      <!-- <div v-if="endQuiz">
          Score: {{result}} out of {{this.questions.length}} answered correctly
      </div> -->
    </WhiteSpace>

    <WhiteSpace v-if="endQuiz && result > 0">
      <span class="resultText">
        You answered {{ result }} questions correctly
      </span>
    </WhiteSpace>
    <WhiteSpace v-if="endQuiz && result === 0">
      <span class="resultText">"You did not manage to answer a single question correctly!</span>
    </WhiteSpace>
    <BaseButton class="startButton" v-if="startQuiz" @click="onClick">
      {{ endQuiz ? "CONTINUE PLAYING" : "START PLAYING" }}
    </BaseButton>
  </div>
</template>

<script>
import axios from '@/packages/axios'
import shuffle from 'lodash.shuffle'
import BaseButton from '@/components/BaseButton'
import Timer from '@/components/Timer'
import WhiteSpace from '@/components/WhiteSpace'

export default {
  name: 'App',
  components: {
    BaseButton,
    Timer,
    WhiteSpace
  },
  data () {
    return {
      currentIndex: 0,
      isRequesting: false,
      questions: [],
      startQuiz: true,
      endQuiz: false,
      result: 0,
      clickedIndex: null,
      gameOverData: false,
      disabled: false
      // correct: false
    }
  },
  computed: {
    currentQuestion () {
      if (this.questions.length) {
        return this.questions[this.currentIndex]
      }
      return null
    },

    currentAnswers () {
      return this.currentQuestion.answers
    }
  },
  created () {},
  methods: {
    async fetchQuestions () {
      this.isRequesting = true
      try {
        const { data } = await axios.get('/api.php?amount=3')
        data.results.forEach(q => {
          q.answers = shuffle([...q.incorrect_answers, q.correct_answer])
        })
        this.questions = [...this.questions, ...data.results]
        console.log(data)
        this.isRequesting = false
      } catch (error) {
        this.isRequesting = false
        throw error
      }
    },
    nextQuestion () {
      this.currentIndex++
      if ((this.currentIndex + 1) % 2 === 0) {
        this.fetchQuestions()
        this.questions.shift()
      }
    },
    async onClick () {
      if (this.startQuiz) {
        this.startQuiz = !this.startQuiz
        if (this.endQuiz) {
          this.gameOverData = !this.gameOverData
          this.disabled = !this.disabled
          this.clickedIndex = null
          this.endQuiz = !this.endQuiz
          this.result = 0
          this.currentIndex = 0
          this.questions = []
        }
        try {
          await this.fetchQuestions()
          this.$nextTick(() => {
            this.$refs.timerRef.startTimer()
          })
        } catch (error) {
          console.error(error)
        }
      }
    },
    checkAnswer (answer, i) {
      if (answer === this.currentQuestion.correct_answer) {
        this.result++
        this.nextQuestion()
        this.$refs.timerRef.startTimer()
      } else {
        this.clickedIndex = i
        this.$refs.timerRef.stopTimer()
        this.gameOverData = !this.gameOverData
        this.disabled = !this.disabled
        setTimeout(() => {
          this.gameOver()
          // this.$refs.timerRef.onTimesUp()
        }, 3000)
      }
    },
    gameOver () {
      this.currentIndex = 0
      this.endQuiz = !this.endQuiz
      this.startQuiz = !this.startQuiz
    }
  }
}
</script>

<style>

#app {
  background-color: #7330ac;
  width: 375px;
  height: 812px;
  margin: 0 auto;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

</style>
