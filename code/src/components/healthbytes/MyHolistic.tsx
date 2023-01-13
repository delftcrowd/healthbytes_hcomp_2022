import { Holistic } from "@mediapipe/holistic"


// Singleton Holistic makes sure that we load the holistic sources only once.
export class MyHolistic {

  static instance?: Holistic

  public static getInstance(): Holistic {
    if (!MyHolistic.instance) {
      MyHolistic.instance = new Holistic({
        locateFile: (file: string) => {
          // return `../public/mediapipe/holistic/${file}`
          return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`
        }
      })
    }
    return MyHolistic.instance
  }

  public static clearInstance() {
    MyHolistic.instance = undefined
  }
}