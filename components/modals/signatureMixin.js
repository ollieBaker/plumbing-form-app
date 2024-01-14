export default {
  data() {
    return {
      isUploading: false,
      options: {
        penColor: "#000",
        onBegin: () => this.$refs.signaturePad.resizeCanvas()
      },
      sigWidth: 500,
      sigHeight: 250
    };
  },
  methods: {
    setSize() {
      const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
      this.sigWidth = Math.min(smallerDimension, 640) - 64;
      this.sigHeight = this.sigWidth * 0.5;
    },
    getImage() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      if (!isEmpty) {
        const fd = new FormData();
        const image = this.dataURItoBlob(data);
        this.isUploading = true;
        return { isEmpty, fd, image };
      }

      return { isEmpty };
    },
    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      const byteString = atob(dataURI.split(",")[1]);

      // separate out the mime component
      const mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];

      // write the bytes of the string to an ArrayBuffer
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const _ia = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        _ia[i] = byteString.charCodeAt(i);
      }

      const dataView = new DataView(arrayBuffer);
      const blob = new Blob([dataView], { type: mimeString });
      return blob;
    },
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    onClose() {
      this.$refs.signaturePad.clearSignature();
      this.$emit("close");
    }
  }
};
