import { NormalizedLandmarkList } from '@mediapipe/holistic'
import { Face, Hand, Pose, TFace, THand, TPose } from 'kalidokit'

export class LandmarkAggregate {
  facelm?: NormalizedLandmarkList
  poselm?: NormalizedLandmarkList
  poselm3d?: NormalizedLandmarkList
  rightHandlm?: NormalizedLandmarkList
  leftHandlm?: NormalizedLandmarkList
  faceRig?: TFace
  poseRig?: TPose
  rightHandRig?: THand<"Right">
  leftHandRig?: THand<"Left">

  constructor({ facelm, poselm, poselm3d, rightHandlm, leftHandlm, video }: {
    facelm: NormalizedLandmarkList,
    poselm: NormalizedLandmarkList,
    poselm3d: NormalizedLandmarkList,
    rightHandlm: NormalizedLandmarkList,
    leftHandlm: NormalizedLandmarkList,
    video: HTMLVideoElement | null | undefined | string
  }) {
    this.facelm = facelm
    this.poselm = poselm
    this.poselm3d = poselm3d
    this.rightHandlm = rightHandlm
    this.leftHandlm = leftHandlm
    if (facelm) {
      this.faceRig = Face.solve(facelm, { runtime: 'mediapipe', video: video })
    }
    if (poselm) {
      this.poseRig = Pose.solve(poselm3d, poselm, { runtime: 'mediapipe', video: video })
    }
    if (leftHandlm) {
      this.leftHandRig = Hand.solve(leftHandlm, "Left")
    }
    if (rightHandlm) {
      this.rightHandRig = Hand.solve(rightHandlm, "Right")
    }
  }

}
