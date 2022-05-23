import {
  Send,
  MicRounded,
  CancelRounded,
  CheckCircleRounded,
} from "@material-ui/icons";
import React from "react";
import "./ChatFooter.css";
import { audioStorage, createTimestamp, db, storage } from "../firebase";
import recordAudio from "./recordAudio";
import { v4 } from "uuid";
export default function ChatFooter({
  input,
  onChange,
  sendMessage,
  image,
  user,
  room,
  roomId,
  setAudioId,
}) {
  const [isRecording, setRecording] = React.useState(false);
  const inputRef = React.useRef(null);
  const recordingEl = React.useRef(null);
  const record = React.useRef(null);
  const timeInterval = React.useRef(null);
  async function StartRecording(e) {
    e.preventDefault();
    record.current = await recordAudio();
    inputRef.current.focus();
    inputRef.current.style.width = "calc(100% - 56px)";
    setRecording(true);
    setAudioId(null);
  }

  React.useEffect(() => {
    if (isRecording) {
      recordingEl.current.style.opacity = "1";
      record.current.start();
      function startTimer() {
        const start = Date.now();
        timeInterval.current = setInterval(setTime, 1000);
        function setTime() {
          console.log("start Settime");
          const timeElapsed = Date.now() - start;
          const totalSeconds = Math.floor(timeElapsed / 1000);
          const minutes = parseInt(totalSeconds / 60);
          const seconds = parseInt(totalSeconds % 60);
          const duration = `${formatTime(minutes)}:${formatTime(seconds)}`;
          setDuration(duration);
        }
      }
      startTimer();
    }
  }, [isRecording]);
  const [duration, setDuration] = React.useState("00:00");

  function formatTime(value) {
    return String(value).length < 2 ? `0${value}` : value;
  }
  async function finishRecording() {
    const audio = await stopRecording();
    console.log(audio);
    const { audioFile, audioName } = audio;
    sendAudio(audioFile, audioName);
  }
  async function sendAudio(audioFile, audioName) {
    db.collection("users")
      .doc(user.uid)
      .collection("chats")
      .doc(roomId)
      .set({
        name: room.name,
        photoURL: room.photoURL || "to get",
        timestamp: createTimestamp(),
      });
    const doc = await db
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .add({
        name: user.displayName,
        uid: user.uid,
        timestamp: createTimestamp(),
        time: new Date().toUTCString(),
        audioUrl: "uploading",
        audioName,
      });
    await audioStorage.child(audioName).put(audioFile);
    const url = await audioStorage.child(audioName).getDownloadURL();
    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .doc(doc.id)
      .update({
        audioUrl: url,
      });
  }
  function stopRecording() {
    inputRef.current.focus();
    clearInterval(timeInterval.current);
    const audio = record.current.stop();
    recordingEl.current.style.opacity = "0";
    setRecording(false);
    inputRef.current.style.width = "calc(100% - 112px)";
    setDuration("00:00");
    return audio;
  }
  function audioInputChange(e) {
    const audioFile = e.target.files[0];
    if (audioFile) {
      setAudioId("");
      sendAudio(audioFile, v4());
    }
  }
  const canRecord = navigator.mediaDevices.getUserMedia && window.MediaRecorder;
  const RawBtn = [
    <Send className="w-12 h-12 text-white" key={1} />,
    <MicRounded className="w-12 h-12 text-white" key={2} />,
  ];
  const btnIcons =
    input.trim() || (input === "" && image) ? RawBtn.reverse() : RawBtn;

  return (
    <div className="chat__footer">
      <form>
        <input
          ref={inputRef}
          type="text"
          placeholder="tape your message"
          value={input}
          onChange={!isRecording ? onChange : null}
        />
        {canRecord ? (
          <button
            type="submit"
            onClick={
              input.trim() || (input === "" && image)
                ? sendMessage
                : StartRecording
            }
            className="send__btn bg-green-500"
          >
            {btnIcons}
          </button>
        ) : (
          <>
            {" "}
            <label className="send__btn bg-green-500" htmlFor="capture">
              {btnIcons}
            </label>
            {input.trim() || (input === "" && image) ? (
              <input
                style={{ display: "none" }}
                type="button"
                id="capture"
                onClick={sendMessage}
              />
            ) : (
              <input
                style={{ display: "none" }}
                type="file"
                id="capture"
                accept="audio/*"
                capture
                onChange={audioInputChange}
              />
            )}
          </>
        )}
      </form>
      {isRecording && (
        <div className="record" ref={recordingEl}>
          <CancelRounded
            className="w-24 h-24 text-[#f20519]"
            onClick={stopRecording}
          />
          <div>
            <div className="record__redcircle"></div>
            <div className="record__duration">{duration}</div>
          </div>
          <CheckCircleRounded
            className="w-24 h-24 text-green-500"
            onClick={finishRecording}
          />
        </div>
      )}
    </div>
  );
}
