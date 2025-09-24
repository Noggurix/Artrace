let processedResolve: (() => void) | null = null;

export const ImageStore = {
  image: null as string | null,
  processedImage: null as string | null,
  traceImage: null as string | null,

  set(base64: string) {
    this.image = base64;
  },

  setProcessed(base64: string) {
    this.processedImage = base64;
    if (processedResolve) {
      processedResolve();
      processedResolve = null;
    }
  },

  setVector(svg: string) {
    this.traceImage = svg;
  },

  get() {
    return this.image;
  },

  clear() {
    this.image = null;
    this.processedImage = null;
    this.traceImage = null;
    processedResolve = null;
  },
};