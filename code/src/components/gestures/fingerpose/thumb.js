import { Finger, FingerCurl, FingerDirection } from 'fingerpose/src/FingerDescription'
import GestureDescription from 'fingerpose/src/GestureDescription'


// describe five gesture
const thumbDescription = new GestureDescription('thumb')


// thumb:
thumbDescription.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)
thumbDescription.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.0)
thumbDescription.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.0)
thumbDescription.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.0)
thumbDescription.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.75)
thumbDescription.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.75)

export default thumbDescription
