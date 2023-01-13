import { Finger, FingerCurl, FingerDirection } from 'fingerpose/src/FingerDescription'
import GestureDescription from 'fingerpose/src/GestureDescription'


// describe ring gesture
const ringDescription = new GestureDescription('ring')

// ring:
ringDescription.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0)
ringDescription.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.0)
ringDescription.addCurl(Finger.Ring, FingerCurl.FullCurl, 0.0)
ringDescription.addDirection(Finger.Ring, FingerDirection.VerticalUp, 1.0)
ringDescription.addDirection(Finger.Ring, FingerDirection.DiagonalUpLeft, 0.75)
ringDescription.addDirection(Finger.Ring, FingerDirection.DiagonalUpRight, 1.0)


export default ringDescription
