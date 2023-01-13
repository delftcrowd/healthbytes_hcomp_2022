import { Landmark, NormalizedLandmark, NormalizedLandmarkList, Results } from "@mediapipe/holistic"
import { Vector } from "kalidokit"
import { useLocation } from "react-router-dom"

export interface AnyObject {
  [x: string]: any
}

export type HolisticResults = Results & {
  ea: NormalizedLandmarkList
}

export enum ActionType {
  ACTIVATE,
  DEACTIVATE,
  EXECUTE,
  NOACTION
}

export class Point {
  x: number
  y: number
  z: number

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }
  static fromVector(v?: Vector) {
    if (v) {
      return new this(v.x, v.y, v.z)
    }
    return new this(0, 0, 0)
  }

  static fromLandmark(n: NormalizedLandmark) {
    return new this(n.x, n.y, n.z)
  }

  add(other: Point) {
    return new Point(this.x + other.x, this.y + other.y, this.z + other.z)
  }

  sub(other: Point) {
    return new Point(this.x - other.x, this.y - other.y, this.z - other.z)
  }

  mul(scalar: number) {
    return new Point(this.x * scalar, this.y * scalar, this.z + scalar)
  }

  div(scalar: number) {
    return new Point(this.x / scalar, this.y / scalar, this.z / scalar)
  }

  setX(x: number) {
    return new Point(x, this.y, this.z)
  }

  setY(y: number) {
    return new Point(this.x, y, this.z)
  }

  setZ(z: number) {
    return new Point(this.x, this.y, z)
  }

  set(x?: number, y?: number, z?: number) {
    return new Point(x ? x : this.x, y ? y : this.y, z ? z : this.z)
  }

  asArray() {
    return [this.x, this.y, this.z]
  }

  asObject() {
    return { x: this.x, y: this.y, z: this.z }
  }
}

export interface Box {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

export const toDegrees = (radians: number): number => {
  return radians * (180 / Math.PI)
}

export function flatten2(data: any, response: AnyObject = {}, flatKey = "", onlyLastKey = false) {
  for (let [key, value] of Object.entries(data)) {
    let newFlatKey: string
    if (!isNaN(parseInt(key)) && flatKey.includes("[]")) {
      newFlatKey = (flatKey.charAt(flatKey.length - 1) == "." ? flatKey.slice(0, -1) : flatKey) + `[${key}]`
    } else if (!flatKey.includes(".") && flatKey.length > 0) {
      newFlatKey = `${flatKey}.${key}`
    } else {
      newFlatKey = `${flatKey}${key}`
    }
    if (value instanceof Vector) {
      value = { x: value.x, y: value.y, z: value.z }
    }
    if (typeof value === "object" && value !== null && Object.keys(value).length > 0) {
      flatten2(value, response, `${newFlatKey}.`, onlyLastKey)
    } else {
      if (onlyLastKey) {
        newFlatKey = newFlatKey.split(".").pop()!
      }
      if (Array.isArray(response)) {
        response.push({
          [newFlatKey.replace("[]", "")]: value
        })
      } else {
        response[newFlatKey.replace("[]", "")] = value
      }
    }
  }
  return response
}

export const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

export const openInNewTab = (url: string) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}

export const getCentroid = (handLandmarks: NormalizedLandmarkList): Point => {
  const boundingBox = getBoundingBox(handLandmarks)
  return new Point((boundingBox.xMin + boundingBox.xMax) / 2, (boundingBox.yMin + boundingBox.yMax) / 2, 0)
}

export const getBoundingBox = (handLandmarks: NormalizedLandmarkList): Box => {
  let x_min = 1
    , x_max = 0
    , y_min = 1
    , y_max = 0

  for (const lm of handLandmarks) {
    const x = lm.x
    const y = lm.y
    if (x > x_max)
      x_max = x
    if (x < x_min)
      x_min = x
    if (y > y_max)
      y_max = y
    if (y < y_min)
      y_min = y
  }

  return {
    xMin: x_min,
    xMax: x_max,
    yMin: y_min,
    yMax: y_max
  }
}

function calculate_angle(shoulder: Landmark, elbow: Landmark, wrist: Landmark) {
  let radians = Math.atan2(wrist.y - elbow.y, wrist.x - elbow.x) -
    Math.atan2(shoulder.y - elbow.y, shoulder.x - elbow.x)
  let angle = Math.abs(radians * 180.0 / Math.PI)

  if (angle > 180.0) {
    angle = 360 - angle
  }

  return angle
}

export const convertNormalisedToCoordinate = (landmark: Landmark | undefined, width: number, height: number): Landmark => {
  if (landmark === undefined) return { x: 0, y: 0, z: 0 }
  return {
    x: landmark.x * width,
    y: landmark.y * height,
    z: landmark.z,
    visibility: landmark.visibility
  }
}
