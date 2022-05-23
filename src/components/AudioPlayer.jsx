import { CircularProgress } from "@material-ui/core";
import {
  FormatListNumbered,
  PauseRounded,
  PlayArrowRounded,
} from "@material-ui/icons";
import React, { useState, useRef, useEffect } from "react";
import "./AudioPlayer.css";

export default function AudioPlayer({
  sender,
  audioUrl,
  id,
  setAudioId,
  audioId,
}) {
  const [isePlaying, setPlaying] = React.useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [duration, setDuration] = useState("");
  const totalDuration = React.useRef("");
  const audio = useRef(new Audio(audioUrl));
  const isUploading = useRef(audioUrl === "uploading");
  const interval = useRef();
  useEffect(() => {
    if (audioId !== id) {
      audio.current.pause();
      setPlaying(false);
    }
  }, [audioId, id]);
  useEffect(() => {
    if (isUploading.current && audioUrl !== "uploading") {
      audio.current = new Audio(audioUrl);
      audio.current.load();
      setIsLoaded(true);
    } else if (isUploading.current === false) {
      setIsLoaded(true);
    }
  }, [audioUrl]);
  function getAudioDuration(media) {
    return new Promise((resolve) => {
      media.onloadedmetadata = () => {
        media.currentTime = Number.MAX_SAFE_INTEGER;

        media.ontimeupdate = () => {
          media.ontimeupdate = () => {};
          media.currentTime = 0.1;
          resolve(media.duration);
        };
      };
    });
  }
  useEffect(() => {
    if (isLoaded) {
      getAudioDuration(audio.current).then(() => {
        setIsMetadataLoaded(true);
      });
    }
  }, [isLoaded]);
  useEffect(() => {
    if (isMetadataLoaded) {
      audio.current.addEventListener("canplaythrough", () => {
        if (!totalDuration.current) {
          setIsMediaLoaded(true);
          const time = formatTime(audio.current.duration);
          totalDuration.current = time;
          setDuration(totalDuration.current);
        }
      });
      audio.current.addEventListener("ended", () => {
        clearInterval(interval.current);
        setDuration(totalDuration.current);
        setSliderValue(0);
        setPlaying(false);
      });
    }
  }, [isMetadataLoaded]);
  function formatTime(time) {
    // console.log({ time });
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }
  function playAudio() {
    setPlaying(true);
    audio.current.play();
    if (audioId !== id) {
      setAudioId(id);
    }
    interval.current = setInterval(updateSlider, 100);
  }
  function updateSlider() {
    let sliderPostion = 0;
    const { currentTime, duration } = audio.current;
    if (typeof duration == "number") {
      sliderPostion = currentTime * (100 / duration);
      setSliderValue(sliderPostion);
      const time = formatTime(currentTime);
      setDuration(time);
    }
  }
  function stopAudio() {
    audio.current.pause();
    clearInterval(interval.current);
    setPlaying(false);
    setDuration(totalDuration.current);
  }
  function scrubAudio(e) {
    const value = event.target.value;
    const { duration } = audio.current;
    if (isMediaLoaded) {
      const seekTo = duration * (value / 100);
      audio.current.currentTime = seekTo;
      setSliderValue(value);
    }
  }

  return (
    <>
      <div className={`audioplayer ${sender ? "" : "audioplayer__alt"} `}>
        {!isMediaLoaded ? (
          <CircularProgress />
        ) : isePlaying ? (
          <PauseRounded onClick={stopAudio} />
        ) : !isePlaying ? (
          <PlayArrowRounded onClick={playAudio} />
        ) : null}
        <div className="ml-2 ">
          <span
            style={{ width: `${sliderValue}%` }}
            className="audioplayer__slider--played"
          ></span>
          <input
            type="range"
            name="slider"
            id="slider "
            min="1"
            max="100"
            value={sliderValue}
            className="audioplayer__slider bg-gray-500/30 z-50 cursor-pointer"
            onChange={scrubAudio}
          />
        </div>
        <span className="chat__timestamp audioplayer__time">{duration}</span>
      </div>
    </>
  );
}
