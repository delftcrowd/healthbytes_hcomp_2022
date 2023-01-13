import { FACEMESH_FACE_OVAL } from "@mediapipe/holistic"
import { OverlayFunction } from "components/healthbytes/HealthByte"

export const drawOutFace: OverlayFunction = (canvas, landmarks) => {
  const ctx = canvas.getContext("2d")
  if (ctx === null || landmarks === undefined || landmarks.facelm === undefined) return
  const { width, height } = canvas.getBoundingClientRect()
  const startingPoint = landmarks.facelm[FACEMESH_FACE_OVAL[0][0]]
  const nextPoints = FACEMESH_FACE_OVAL.map(([_, end]) => landmarks.facelm?.at(end))
  ctx.fillStyle = '#000'
  ctx.filter = 'blur(4px)'
  ctx.beginPath()
  const x = width / 1280
  const y = height / 720
  ctx.moveTo(x * startingPoint.x, y * startingPoint.y)
  for (const nextPoint of nextPoints) {
    if (nextPoint === undefined) continue
    ctx.lineTo(x * nextPoint.x, y * nextPoint.y)
  }
  ctx.closePath()
  ctx.fill()
  ctx.filter = 'none'
}