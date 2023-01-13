import { Finger, FingerCurl, FingerDirection } from 'fingerpose/src/FingerDescription'
import GestureDescription from 'fingerpose/src/GestureDescription'


// describe fist gesture
const fistDescription = new GestureDescription('fist')

// thumb:
fistDescription.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0)
fistDescription.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.75)
fistDescription.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5)
fistDescription.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0)
fistDescription.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.25)
fistDescription.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.25)
fistDescription.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.75)
fistDescription.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.75)

// all other fingers:
// - curled
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  fistDescription.addCurl(finger, FingerCurl.FullCurl, 1.0)
  fistDescription.addCurl(finger, FingerCurl.HalfCurl, 0.75)
  fistDescription.addDirection(finger, FingerDirection.VerticalUp, 1.0)
  fistDescription.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.75)
  fistDescription.addDirection(finger, FingerDirection.DiagonalUpRight, 0.75)
}

// give additional weight
// fistDescription.setWeight(Finger.Thumb, 1)
// fistDescription.setWeight(Finger.Index, 1);
// fistDescription.setWeight(Finger.Middle, 1);
// fistDescription.setWeight(Finger.Ring, 1);
// fistDescription.setWeight(Finger.Pinky, 1);

export default fistDescription
