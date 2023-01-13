import { Finger, FingerCurl, FingerDirection } from 'fingerpose/src/FingerDescription'
import GestureDescription from 'fingerpose/src/GestureDescription'


// describe five gesture
const fiveDescription = new GestureDescription('five')


// thumb:
fiveDescription.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)
fiveDescription.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0)
fiveDescription.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.5)
fiveDescription.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.5)

// index:
fiveDescription.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0)
fiveDescription.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.75)
fiveDescription.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 1.0)
fiveDescription.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.5)

// middle:
fiveDescription.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0)
fiveDescription.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0)
fiveDescription.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 0.75)
fiveDescription.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 0.75)

// ring:
fiveDescription.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0)
fiveDescription.addDirection(Finger.Ring, FingerDirection.VerticalUp, 1.0)
fiveDescription.addDirection(Finger.Ring, FingerDirection.DiagonalUpLeft, 0.75)
fiveDescription.addDirection(Finger.Ring, FingerDirection.DiagonalUpRight, 1.0)

// pinky:
fiveDescription.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0)
fiveDescription.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0)
fiveDescription.addDirection(Finger.Ring, FingerDirection.DiagonalUpLeft, 0.5)
fiveDescription.addDirection(Finger.Ring, FingerDirection.DiagonalUpRight, 1.0)

// give additional weight
// fiveDescription.setWeight(Finger.Index, 2)
// fiveDescription.setWeight(Finger.Middle, 2)
// fiveDescription.setWeight(Finger.Ring, 2)
// fiveDescription.setWeight(Finger.Pinky, 2)

export default fiveDescription
