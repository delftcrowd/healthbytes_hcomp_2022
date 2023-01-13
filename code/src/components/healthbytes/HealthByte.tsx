import { Camera } from '@mediapipe/camera_utils'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { FACEMESH_FACE_OVAL, FACEMESH_LEFT_EYE, FACEMESH_LIPS, FACEMESH_RIGHT_EYE, HAND_CONNECTIONS, Options, POSE_CONNECTIONS } from '@mediapipe/holistic'
import { InfoOutlined } from '@mui/icons-material'
import { Backdrop, Button, CircularProgress, Typography } from '@mui/material'
import { LandmarkAggregate } from 'components/gestures/Gesture'
import { Classifier } from 'components/healthbytes/Classifier'
import { MyHolistic } from 'components/healthbytes/MyHolistic'
import { HolisticResults } from 'components/utils/utilsTS'
import { DEFAULT_CONNECTOR_OPTIONS, DEFAULT_LANDMARK_OPTIONS, VISIBILITY_MIN } from 'constants/AppConstants'
import React, { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import './../../styles.css'

export interface ConnectorOrLandmarkOptions {
  face?: boolean,
  hand?: boolean,
  body?: boolean
}

export type HealthByteProps = {
  classifier: Classifier,
  showLandmarks?: boolean | ConnectorOrLandmarkOptions,
  showConnectors?: boolean | ConnectorOrLandmarkOptions,
  holisticOptions?: Options
} & ComponentPropsWithoutRef<"div">

export type HealthByteHandle = {
  getCamera: () => Camera | null,
  getWebcam: () => Webcam | null,
  getCanvas: () => HTMLCanvasElement | null,
  addOverlays: (overlayFunction: OverlayFunction) => void,
  clearOverlays: () => void
}

export type OverlayFunction = (canvas: HTMLCanvasElement, landmarks: LandmarkAggregate) => void

const HealthByte = React.forwardRef<HealthByteHandle, HealthByteProps>((
  { showLandmarks = false,
    showConnectors = false,
    classifier,
    holisticOptions,
    className,
    ...props },
  ref
) => {
  const [isHolisticLoading, setIsHolisticLoading] = useState<boolean>(true)
  const [isFailedLoadingCamera, setIsFailedLoadingCamera] = useState<boolean>(false)
  const holistic = MyHolistic.getInstance()
  // ---WEBCAM---
  const cameraRef = useRef<Camera | null>(null)
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayFunctions = useRef<OverlayFunction[]>([])

  const videoConstraints = {
    facingMode: "user",
    aspectRatio: 1.33,
  }

  const onUserMediaError = () => {
    setIsFailedLoadingCamera(true)
  }

  React.useImperativeHandle(ref, () => ({
    getCamera() {
      return cameraRef.current
    },
    getWebcam() {
      return webcamRef.current
    },
    getCanvas() {
      return canvasRef.current
    },
    addOverlays(overlayFunction: OverlayFunction) {
      overlayFunctions.current.push(overlayFunction)
    },
    clearOverlays() {
      overlayFunctions.current.length = 0
    }
  }))

  holistic.onResults((r) => {
    setIsHolisticLoading(false)
    const results = r as HolisticResults
    // landmark names may change depending on TFJS/Mediapipe model version
    let facelm = results.faceLandmarks
    let poselm = results.poseLandmarks
    let rightHandlm = results.rightHandLandmarks
    let leftHandlm = results.leftHandLandmarks
    // Pose 3D Landmarks are with respect to Hip distance in meters
    let poselm3d = results['ea']

    if (!canvasRef.current) {
      return
    }

    const ctx = canvasRef.current.getContext("2d")

    if (!ctx) {
      return
    }

    const landmarkAggregate: LandmarkAggregate = new LandmarkAggregate({
      facelm: facelm,
      poselm: poselm,
      poselm3d: poselm3d,
      rightHandlm: rightHandlm,
      leftHandlm: leftHandlm,
      video: webcamRef.current?.video
    })

    overlayFunctions.current.forEach(overlayFunction => {
      if (!canvasRef.current) {
        return
      }

      overlayFunction(canvasRef.current, landmarkAggregate)
    })

    if (classifier.isRunning && showLandmarks) {
      if (showLandmarks === true || (showLandmarks as ConnectorOrLandmarkOptions).face) {
        const config = (showLandmarks as ConnectorOrLandmarkOptions)
        drawLandmarks(ctx, facelm,
          // ? (config.face as ConnectorOrLandmarkOption).landmarks as DrawingOptions
          { lineWidth: 1, radius: 1, visibilityMin: VISIBILITY_MIN })
      }
      if (showLandmarks === true || (showLandmarks as ConnectorOrLandmarkOptions).body) {
        drawLandmarks(ctx, poselm, DEFAULT_LANDMARK_OPTIONS)
      }
      if (showLandmarks === true || (showLandmarks as ConnectorOrLandmarkOptions).hand) {
        drawLandmarks(ctx, rightHandlm, DEFAULT_LANDMARK_OPTIONS)
        drawLandmarks(ctx, leftHandlm, DEFAULT_LANDMARK_OPTIONS)
      }
    }

    if (classifier.isRunning && showConnectors) {
      if (showLandmarks === true || (showConnectors as ConnectorOrLandmarkOptions).body) {
        drawConnectors(ctx, poselm, POSE_CONNECTIONS, DEFAULT_CONNECTOR_OPTIONS)
      }
      if (showLandmarks === true || (showConnectors as ConnectorOrLandmarkOptions).hand) {
        drawConnectors(ctx, rightHandlm, HAND_CONNECTIONS, DEFAULT_CONNECTOR_OPTIONS)
        drawConnectors(ctx, leftHandlm, HAND_CONNECTIONS, DEFAULT_CONNECTOR_OPTIONS)
      }
      if (showLandmarks === true || (showConnectors as ConnectorOrLandmarkOptions).face) {
        drawConnectors(ctx, facelm, FACEMESH_FACE_OVAL, DEFAULT_CONNECTOR_OPTIONS)
        drawConnectors(ctx, facelm, FACEMESH_LEFT_EYE, DEFAULT_CONNECTOR_OPTIONS)
        drawConnectors(ctx, facelm, FACEMESH_RIGHT_EYE, DEFAULT_CONNECTOR_OPTIONS)
        drawConnectors(ctx, facelm, FACEMESH_LIPS, DEFAULT_CONNECTOR_OPTIONS)
      }
    }

    classifier.classify(landmarkAggregate)
  })

  useEffect(() => {
    holistic.setOptions(holisticOptions ? holisticOptions : {
      enableFaceGeometry: false,
      enableSegmentation: false,
      modelComplexity: 2,
      selfieMode: true,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    classifier.start()

    if (webcamRef.current?.video) {
      cameraRef.current = new Camera(webcamRef.current?.video, {
        onFrame: async () => {
          canvasRef.current!.width = webcamRef.current?.video?.clientWidth!
          canvasRef.current!.height = webcamRef.current?.video?.clientHeight!
          await holistic.send({
            image: webcamRef.current!.video!,
          })
        },
        width: webcamRef.current!.video!.videoWidth,
        height: webcamRef.current!.video!.videoHeight,
      })
      cameraRef.current.start()
    }
    return () => {
      cameraRef.current?.stop()
    }
  }, [])

  return (
    <>
      <div className={`relative max-w-sm ${className}`} {...props} >
        <Webcam
          ref={webcamRef}
          muted={true}
          mirrored={true}
          videoConstraints={{ ...videoConstraints }}
          onUserMediaError={onUserMediaError}
        />
        <canvas
          id="canvas"
          className="absolute top-0 z-10"
          ref={canvasRef}
          style={{ backgroundColor: "transparent" }}
        />
      </div>

      <Backdrop
        sx={{ color: '#fff', zIndex: 20, display: 'flex', flexDirection: 'column', backgroundColor: "rgb(0,0,0,0.9)" }}
        open={isFailedLoadingCamera}
      >
        <Typography variant='h5' marginTop='1em'>
          No camera input detected!
        </Typography>
        <Typography variant='subtitle1' marginTop='1em'>
          Make sure you have given permission to use your camera and chosen the correct camera input (if multiple available). <br />You can do so by clicking the <InfoOutlined /> icon left of the address bar.<br />If you have changed the permissions or input, please refresh the page and try again.<br /><br />If after that you still see this screen, then unfortunately your device is not compatible with this study's software. <br />In that case, please return the study. Feel free to close this message and revoke the consent. Thank you for the cooperation.<br /><br />
        </Typography>
        <Button variant="outlined" onClick={() => { setIsFailedLoadingCamera(false); setIsHolisticLoading(false) }} color="error">Close this message</Button>
      </Backdrop>
      <Backdrop
        sx={{ color: '#fff', zIndex: 20, display: 'flex', flexDirection: 'column', backgroundColor: "rgb(0,0,0,0.8)" }}
        open={isHolisticLoading && !isFailedLoadingCamera}
      >
        <CircularProgress color="inherit" />
        <Typography variant='subtitle1' marginTop='1em'>Loading pose detector.<br />This might take a few seconds depending on your network speed. Please wait...</Typography>
      </Backdrop>
    </>
  )
})

export default React.memo(HealthByte)