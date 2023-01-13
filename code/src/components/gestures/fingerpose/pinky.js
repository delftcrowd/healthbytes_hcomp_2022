import { Finger, FingerCurl, FingerDirection } from 'fingerpose/src/FingerDescription'
import GestureDescription from 'fingerpose/src/GestureDescription'


// describe pinky gesture
const pinkyDescription = new GestureDescription('pinky')

// pinky:
pinkyDescription.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0)
pinkyDescription.addCurl(Finger.Pinky, FingerCurl.FullCurl, 0.0)
pinkyDescription.addCurl(Finger.Pinky, FingerCurl.HalfCurve, 0.25)
pinkyDescription.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0)
pinkyDescription.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 0.75)
pinkyDescription.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 1.0)

export default pinkyDescription
