<template>
  <div class="container">
    <div class="video-wrap">
      <video id="video" playsinline autoplay></video>
    </div>
    <div class="controller">
      <button id="snap" @click="captureImage">Capture</button>
    </div>
    <canvas id="canvas" width="640" height="480"></canvas>
    <form id="myAwesomeForm" method="post">
      <input type="text" id="filename" name="filename" />
    </form>
  </div>
</template>

<script>
/* eslint-disable */
import axios from "axios";

export default {
  data() {
    return {
      count: 0,
      isHuman: false,
      validateArr: [],
      check: true,
    };
  },

  computed: {},

  mounted() {
    this.init();
  },

  methods: {
    render() {
      window.location.href = "/check";
    },
    init() {
      const constraints = {
        audio: false,
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
          }, 5000);
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
      let image = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      const ImageURL = image;
      const block = ImageURL.split(";");
      const contentType = block[0].split(":")[1]; // In this case "image/gif"
      const realData = block[1].split(",")[1];

      const blob = this.b64toBlob(realData, contentType);

      const form = document.getElementById("myAwesomeForm");
      const formDataToUpload = new FormData(form);
      formDataToUpload.append("image", blob);

      if (
        this.validateArr[this.validateArr.length - 1] ===
          this.validateArr[this.validateArr.length - 2] &&
        this.validateArr[this.validateArr.length - 2] ===
          this.validateArr[this.validateArr.length - 3] &&
        this.validateArr[this.validateArr.length - 1] === "no"
      ) {
        this.check = false;
        this.validateArr = [];
        window.location.href = "/check";
      }

      if (this.count === 0 && this.check) {
        this.count++;
        axios({
          method: "post",
          url: "http://127.0.0.1:3000/",
          data: formDataToUpload,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((res) => {
            console.log(res.data.Labels);
            res.data.Labels.forEach((label) => {
              console.log(label.Name, label.Confidence);
              if (label.Name === "Face") {
                if (label.Confidence > 85) {
                  console.log("yes he is human");
                  this.isHuman = true;
                }
              }
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (this.isHuman && this.count > 0 && this.check) {
        axios({
          method: "post",
          url: "http://127.0.0.1:3000/compare",
          data: formDataToUpload,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((res) => {
            //console.log(res.data.FaceMatches, res.data.FaceMatches.Similarity);
            if (
              res.data.FaceMatches.length !== 0 &&
              res.data.FaceMatches[0].Similarity &&
              res.data.FaceMatches[0].Similarity > 85
            ) {
              console.log("face matched");
              this.validateArr.push("yes");
            } else {
              console.log("face not matched");
              this.validateArr.push("no");
            }
            console.log(this.validateArr);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || "";
      sliceSize = sliceSize || 512;

      var byteCharacters = atob(b64Data); // window.atob(b64Data)
      var byteArrays = [];

      for (
        var offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, { type: contentType });
      return blob;
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
#myAwesomeForm {
  display: none;
}
</style>
