import axios from '@/packages/axios'
import shuffle from 'lodash.shuffle'
import Vue from 'vue'
let time = null
export default {
  strict: process.env.NODE_ENV === 'development',
  state: () => ({
    currentIndex: 0,
    isRequesting: false,
    questions: [],
    startQuiz: true,
    endQuiz: false,
    result: 0,
    clickedIndex: null,
    gameOverData: false,
    disabled: false,
    // timer component
    timePassed: 0,
    timerInterval: null
  }),
  getters: {
    startQuiz: state => {
      return state.startQuiz
    },
    currentIndex: state => {
      return state.currentIndex
    },
    isRequesting: state => {
      return state.isRequesting
    },
    questions: state => {
      return state.questions
    },
    endQuiz: state => {
      return state.endQuiz
    },
    result: state => {
      return state.result
    },
    clickedIndex: state => {
      console.log('clickedindex', state.clickedIndex)

      return state.clickedIndex
    },
    gameOverData: state => {
      return state.gameOverData
    },
    disabled: state => {
      return state.disabled
    },
    timePassed: state => {
      return state.timePassed
    },
    timerInterval: state => {
      return state.timerInterval
    },
    currentQuestion (state) {
      console.log('run')

      if (state.questions.length) {
        console.log(state.questions[state.currentIndex])

        return state.questions[state.currentIndex]
      }
      return null
    },
    currentAnswers (state, getters) {
      return getters.currentQuestion.answers
    }
  },
  mutations: {

    setOnClick (state) {
      state.startQuiz = !state.startQuiz
      if (state.endQuiz) {
        state.gameOverData = !state.gameOverData
        state.disabled = !state.disabled
        state.clickedIndex = null
        state.endQuiz = !state.endQuiz
        state.result = 0
        state.currentIndex = 0
        state.questions = []
      }
    },
    setQuestions (state, data) {
      state.questions = [...state.questions, ...data.results]
      console.log(data)
    },
    changeRequesting (state, status) {
      state.isRequesting = status
    },
    increaseIndex (state, payload) {
      console.log('payload', payload)
      if (payload === 'currentIndex') {
        state.currentIndex += 1
        return
      }
      state.result += 1
    },
    shiftQuestions (state) {
      state.questions.shift()
    },
    setClickedIndex (state, i) {
      console.log('setclickedindex', i)

      state.clickedIndex = i
    },
    setGameOverData (state) {
      state.gameOverData = !state.gameOverData
    },
    setDisabled (state) {
      state.disabled = !state.disabled
    },
    setGameOver (state) {
      state.currentIndex = 0
      state.endQuiz = !state.endQuiz
      state.startQuiz = !state.startQuiz
    },
    setStartTimer (state, payload) {
      state.timerInterval = payload
    },
    setTimePassed (state, payload) {
      payload === 1 ? state.timePassed += 1 : state.timePassed = 0
    }
  },
  actions: {
    // currentQuestion ({ commit }) {
    //   console.log('run')

    //   commit('setCurrentQuestion')
    // },
    async fetchQuestions ({ commit }) {
      commit('changeRequesting', true)
      try {
        const { data } = await axios.get('/api.php?amount=3')
        data.results.forEach(q => {
          q.answers = shuffle([...q.incorrect_answers, q.correct_answer])
        })
        commit('setQuestions', data)
        commit('changeRequesting', false)
      } catch (error) {
        commit('changeRequesting', false)
        throw error
      }
    },
    nextQuestion ({ state, dispatch, commit }) {
      commit('increaseIndex', 'currentIndex')
      if ((state.currentIndex + 1) % 2 === 0) {
        dispatch('fetchQuestions')
        commit('shiftQuestions')
      }
    },
    async onClick ({ state, dispatch, commit }) {
      if (state.startQuiz) {
        commit('setOnClick')
        try {
          await dispatch('fetchQuestions')
          Vue.nextTick(() => {
            dispatch('startTimer')
          })
        } catch (error) {
          console.error(error)
        }
      }
    },
    checkAnswer ({ state, commit, dispatch, getters }, { answer, i }) {
      console.log('answer', i)

      if (answer === getters.currentQuestion.correct_answer) {
        commit('increaseIndex', 'result')
        dispatch('nextQuestion')
        dispatch('startTimer')
      } else {
        commit('setClickedIndex', i)
        dispatch('stopTimer')
        commit('setGameOverData')
        commit('setDisabled')
        setTimeout(() => {
          dispatch('gameOver')
        }, 3000)
      }
    },
    gameOver ({ commit }) {
      commit('setGameOver')
    },
    // timer component
    startTimer ({ dispatch, commit }) {
      dispatch('stopTimer')
      commit('setTimePassed', 0)
      time = setInterval(() => commit('setTimePassed', 1), 1000)
      commit('setStartTimer', time)
    },
    stopTimer () {
      clearInterval(time)
    }
  }
}
