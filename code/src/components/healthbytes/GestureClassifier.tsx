import { NormalizedLandmarkList } from '@mediapipe/holistic'
import * as fp from 'fingerpose'

import { ESTIMATION_THRESHOLD } from 'constants/AppConstants'

export interface Gesture {
  name: string,
  score: number
}
export interface GestureEstimation {
  gestures: Gesture[],
  poseData: any[]
}

export class GestureClassifier {
  private static GE: any | undefined = undefined

  static initialize = (gestureDescriptions: any[]) => {
    this.GE = new fp.GestureEstimator(gestureDescriptions)
  }

  static classify = (handLm?: NormalizedLandmarkList) => {
    if (!handLm) {
      return undefined
    }
    if (handLm.length > 0) {
      if (!this.GE) {
        console.error("GestureEstimator not initialized. Please initialize with the desired gestures.")
        return undefined
      }
      const gesture: GestureEstimation = this.GE.estimate(handLm.map(l => [l.x, l.y, l.z]), ESTIMATION_THRESHOLD)
      if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
        let result = gesture.gestures.sort((a, b) => b.score - a.score)
        return result
      }
    }
  }
}
