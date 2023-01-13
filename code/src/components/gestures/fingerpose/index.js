import { Finger, FingerCurl, FingerDirection } from 'fingerpose/src/FingerDescription'
import GestureDescription from 'fingerpose/src/GestureDescription'


// describe index gesture
const indexDescription = new GestureDescription('index')

// index:
indexDescription.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0)
indexDescription.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.0)
indexDescription.addCurl(Finger.Index, FingerCurl.FullCurl, 0.0)
indexDescription.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.75)
indexDescription.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 1.0)
indexDescription.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.75)

export default indexDescription
