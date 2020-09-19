<template>
  <span>
    <p>Speak the number displayed on the screen {{ num }}</p>
    <p v-for="word in transcription" :key="word">{{ word }}</p>
    <p>{{ runtimeTranscription }}</p>
  </span>
</template>

<script>
/* eslint-disable */
export default {
  name: "vue-speech",
  props: {
    lang: {
      type: String,
      default: "en-US",
    },
  },
  data: () => ({
    runtimeTranscription: "",
    transcription: [],
    checkArr: [],
  }),
  computed: {
    num() {
      const n = Math.floor(Math.random() * Math.floor(10));
      return n;
    },
  },
  methods: {
    checkApi() {
      window.SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition && process.env.NODE_ENV !== "production") {
        throw new Error(
          "Speech Recognition does not exist on this browser. Use Chrome or Firefox"
        );
      }
      if (!SpeechRecognition) {
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = this.lang;
      recognition.interimResults = true;
      recognition.addEventListener("result", (event) => {
        const text = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        this.runtimeTranscription = text;
      });
      recognition.addEventListener("end", () => {
        if (this.runtimeTranscription !== "") {
          this.transcription.push(this.runtimeTranscription);
          if (this.transcription.length > 0) {
            this.checkAgain();
          }
          this.$emit("onTranscriptionEnd", {
            transcription: this.transcription,
            lastSentence: this.runtimeTranscription,
          });
        }
        this.runtimeTranscription = "";
        recognition.start();
      });
      recognition.start();
    },
    checkAgain() {
      if (this.num == this.transcription[0]) {
        console.log(this.num, this.transcription);
        window.location.href = "/";
      } else {
        alert("fail");
      }
    },
    //num() {
    //  console.log(this.checkArr);
    //  const n = Math.floor(Math.random() * Math.floor(10));
    //  this.checkArr.push(n);
    //  return n;
    //},
  },
  mounted() {
    this.checkApi();
  },
};
</script>
