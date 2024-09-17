"use client"
import { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
import { drawRing } from './utilities';
import styles from './Design.module.css';

// Type definitions
type HandCoordinates = number[][];

const RingSizer: React.FC = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null); // For captured image
  const [ringSize, setRingSize] = useState<number | null>(null);
  const [selectedFinger, setSelectedFinger] = useState<string>('indexFinger');
  const [handCoordinates, setHandCoordinates] = useState<HandCoordinates | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Store captured image
  const [facingMode, setFacingMode] = useState<string>('user');

  // Define intrinsic camera matrix based on video resolution
  const getCameraMatrix = (videoWidth: number, videoHeight: number) => {
    const f_x = videoWidth; // Assume focal length equals width
    const f_y = videoHeight; // Assume focal length equals height
    const c_x = videoWidth / 2;
    const c_y = videoHeight / 2;

    return [
      [f_x, 0, c_x],
      [0, f_y, c_y],
      [0, 0, 1],
    ]; // 3x3 intrinsic matrix
  };

  // Adjust canvas size to match the webcam video size
  const setCanvasSize = () => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
  };

  useEffect(() => {
    const runHandpose = async () => {
      const net = await handpose.load();
      setInterval(() => {
        detect(net);
      }, 100); // Detect hand every 100ms
    };

    const detect = async (net: handpose.HandPose) => {
      if (webcamRef.current?.video?.readyState === 4) {
        const video = webcamRef.current.video;

        // Ensure canvas size is set
        setCanvasSize();

        // Get camera matrix based on video dimensions
        const K = getCameraMatrix(video.videoWidth, video.videoHeight);

        // Detect hand landmarks
        const hands = await net.estimateHands(video);

        if (hands.length > 0) {
          const calibratedHandCoordinates = hands[0].landmarks.map(([x, y, z]) => {
            const projectedX = (K[0][0] * x + K[0][2]) / z;
            const projectedY = (K[1][1] * y + K[1][2]) / z;
            return [projectedX, projectedY];
          });

          setHandCoordinates(calibratedHandCoordinates);

          // Mockup data for ring size (dynamic based on real data)
          const sizes = {
            thumb: 9,
            indexFinger: 7,
            middleFinger: 8,
            ringFinger: 7,
            pinky: 6,
          };

          setRingSize(sizes[selectedFinger]);
        }
      }
    };

    runHandpose();
  }, [selectedFinger]);

  // Draw the ring on the canvas
  useEffect(() => {
    if (handCoordinates) {
      drawRing(handCoordinates, selectedFinger, canvasRef);
    }
  }, [handCoordinates, selectedFinger]);

  // Capture image from the webcam and display it on a separate canvas
  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setCapturedImage(imageSrc || null);

    if (captureCanvasRef.current && imageSrc) {
      const ctx = captureCanvasRef.current.getContext('2d');
      const video = webcamRef.current?.video;

      if (ctx && video) {
        captureCanvasRef.current.width = video.videoWidth;
        captureCanvasRef.current.height = video.videoHeight;
        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
          ctx.clearRect(0, 0, captureCanvasRef.current!.width, captureCanvasRef.current!.height);
          ctx.drawImage(img, 0, 0, captureCanvasRef.current!.width, captureCanvasRef.current!.height);

          if (handCoordinates) {
            drawRing(handCoordinates, selectedFinger, captureCanvasRef, false);
          }
        };
      }
    }
  };

  // Toggle between front and back camera
  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };


  return (
    <div className={styles.container}>
      <div className={styles.webcamContainer}>
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className={styles.webcam}
          videoConstraints={{ facingMode }} // Control the camera
        />
        <canvas ref={canvasRef} className={styles.overlayCanvas} />
      </div>

      <div className={styles.controls}>
        <label>Select Finger:</label>
        <select
          onChange={(e) => setSelectedFinger(e.target.value)}
          value={selectedFinger}
        >
          <option value="thumb">Thumb</option>
          <option value="indexFinger">Index Finger</option>
          <option value="middleFinger">Middle Finger</option>
          <option value="ringFinger">Ring Finger</option>
          <option value="pinky">Pinky</option>
        </select>

        {ringSize && (
          <div className={styles.ringSize}>
            <h3>Detected Ring Size: {ringSize}</h3>
          </div>
        )}

        <button className={styles.captureButton} onClick={captureImage}>
          Capture Image
        </button>

        <button className={styles.toggleCameraButton} onClick={toggleCamera}>
          Switch Camera
        </button>

        <button className={styles.goToCustomButton}>
          Go to Custom Hand Ring
        </button>
      </div>

      {capturedImage && (
        <div className={styles.capturedImageContainer}>
          <h3>Captured Image:</h3>
          <canvas ref={captureCanvasRef} className={styles.capturedCanvas} />
        </div>
      )}
    </div>
  );
};

export default RingSizer;