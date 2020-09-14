<template>
  <div class="container">
    <div class="video-wrap">
      <video id="video" playsinline autoplay></video>
    </div>
    <div class="controller">
      <button id="snap" @click="captureImage">Capture</button>
    </div>
    <canvas id="canvas" width="640" height="480"></canvas>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      name: "shivam",
    };
  },

  computed: {},

  mounted() {
    this.init();
  },

  methods: {
    init() {
      const constraints = {
        audio: true,
        video: {
          width: 1280,
          height: 720,
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.handleSuccess(stream);
          setInterval(() => {
            this.captureImage();
          }, 2000);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleSuccess(stream) {
      const video = document.getElementById("video");
      window.stream = stream;
      video.srcObject = stream;
    },
    captureImage() {
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");
      const img = context.drawImage(video, 0, 0, 640, 480);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
