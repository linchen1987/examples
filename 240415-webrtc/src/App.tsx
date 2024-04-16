import { useState, useRef } from "react";
import "./App.css";

const VideoStatus = [
  "未开启摄像头",
  "摄像头已开启",
  "无法访问摄像头",
  "你的浏览器不支持mediaDevices API",
];
const AudioStatus = [
  "未开启麦克风",
  "麦克风已开启",
  "无法访问麦克风",
  "你的浏览器不支持mediaDevices API",
];

function App() {
  const [audioStatus, setAudioStatus] = useState(AudioStatus[0]);
  const [videoStatus, setVideoStatus] = useState(VideoStatus[0]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startAudio = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.enumerateDevices().then((data) => {
        console.log(data);
      });

      // 请求麦克风权限
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
          if (audioStatus === AudioStatus[1]) {
            audioRef.current!.srcObject = null;
            stream.getTracks().forEach((track) => track.stop());
            setAudioStatus(AudioStatus[0]);
            return;
          }

          setAudioStatus(AudioStatus[1]);
          audioRef.current!.srcObject = stream;
          // 可以在这里使用stream进行进一步的处理，例如录制音频等
        })
        .catch(function (error) {
          setAudioStatus(`${AudioStatus[2]}: ${error}`);
        });
    } else {
      setAudioStatus(AudioStatus[3]);
    }
  };

  const startVideo = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // 请求麦克风权限
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          if (videoStatus === VideoStatus[1]) {
            videoRef.current!.srcObject = null;
            stream.getTracks().forEach((track) => track.stop());
            setAudioStatus(AudioStatus[0]);
            return;
          }

          setVideoStatus(VideoStatus[1]);
          videoRef.current!.srcObject = stream;
          // 可以在这里使用stream进行进一步的处理，例如录制音频等
        })
        .catch(function (error) {
          setVideoStatus(`${VideoStatus[2]}: ${error}`);
        });
    } else {
      setAudioStatus(VideoStatus[3]);
    }
  };

  return (
    <>
      <div>
        <button
          id="startAudio"
          onClick={() => {
            startAudio();
          }}
        >
          {audioStatus === AudioStatus[1] ? "关闭" : "开启"}麦克风
        </button>
        <p id="audioStatus">{audioStatus}</p>
        <audio controls autoPlay ref={audioRef}></audio>
      </div>

      <div style={{ marginTop: 36 }}>
        <button
          id="startVideo"
          onClick={() => {
            startVideo();
          }}
        >
          {videoStatus === VideoStatus[1] ? "关闭" : "开启"}摄像头
        </button>
        <p id="videoStatus">{videoStatus}</p>
        <video controls autoPlay ref={videoRef}></video>
      </div>
    </>
  );
}

export default App;
