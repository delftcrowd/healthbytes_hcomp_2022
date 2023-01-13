import { Finger, FingerCurl, FingerDirection } from 'fingerpose/src/FingerDescription'
import GestureDescription from 'fingerpose/src/GestureDescription'


// describe middle gesture
const middleDescription = new GestureDescription('middle')

// middle:
middleDescription.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0)
middleDescription.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.0)
middleDescription.addCurl(Finger.Middle, FingerCurl.FullCurl, 0.0)
middleDescription.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0)
middleDescription.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 0.75)
middleDescription.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 0.75)

export default middleDescription
