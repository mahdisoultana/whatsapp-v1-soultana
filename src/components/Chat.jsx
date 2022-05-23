import {
  Avatar,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import {
  AddPhotoAlternate,
  ArrowBack,
  DirectionsBusTwoTone,
  MoreVert,
} from "@material-ui/icons";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import useRoom from "../hooks/useRoom";
import "./Chat.css";

import ChatMessages from "./ChatMessages";
import MediaPreview from "./MediaPreview";
import ChatFooter from "./ChatFooter";
import { createTimestamp, db, storage } from "../firebase";
import { v4 } from "uuid";
import Compressor from "compressorjs";
import useChatMessages from "../hooks/useChatMessages";
export default function Chat({ user, page }) {
  const { roomId } = useParams();
  const [image, setImage] = React.useState(null);

  const [audioId, setAudioId] = React.useState(null);
  const messages = useChatMessages(roomId);

  const [src, setSrc] = React.useState("");
  const [input, setInput] = React.useState("");

  const [openMenu, setOpenMenu] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  function onChangeInput(e) {
    setInput(e.target.value);
  }
  async function sendMessage(e) {
    e.preventDefault();

    if (input.trim() || (input === "" && image)) {
      setInput("");
      if (image) {
        closePreview();
      }
      const imageName = v4();
      const newMessage = image
        ? {
            name: user.displayName,
            message: input,
            uid: user.uid,
            timestamp: createTimestamp(),
            time: new Date().toUTCString(),
            imageUrl: "uploading",
            imageName,
          }
        : {
            name: user.displayName,
            message: input,
            uid: user.uid,
            timestamp: createTimestamp(),
            time: new Date().toUTCString(),
          };
      db.collection("users")
        .doc(user.uid)
        .collection("chats")
        .doc(roomId)
        .set({
          name: room.name,
          phtoURL: room.photoURL || null,
          timestamp: createTimestamp(),
        });
      const doc = await db
        .collection("rooms")
        .doc(roomId)
        .collection("messages")
        .add(newMessage);

      if (image) {
        new Compressor(image, {
          quality: 0.8,
          maxWidth: 1920,
          async success(result) {
            setSrc("");

            setImage(null);
            await storage.child(imageName).put(result);
            const url = await storage.child(imageName).getDownloadURL();
            db.collection("rooms")
              .doc(roomId)
              .collection("messages")
              .doc(doc.id)
              .update({
                imageUrl: url,
              });
          },
        });
      }
    }
  }
  function closePreview() {
    setSrc("");
    setImage(null);
  }
  function showPreveiw(e) {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        setSrc(reader.result);
      };
    }
  }
  const room = useRoom(roomId, user.uid);
  async function deleteRoom() {
    setOpenMenu(false);
    setIsDeleting(true);
    try {
      const roomRef = db.collection("rooms").doc(roomId);
      const roomMessages = await roomRef.collection("messages").get();
      const audioFiles = [];
      const imagesFiles = [];

      roomMessages.docs.forEach((doc) => {
        if (doc.data().audioName) {
          audioFiles.push(doc.data().audioName);
        } else if (doc.data().imageName) {
          imagesFiles.push(doc.data().imageName);
        }
      });
      await Promise.all([
        ...roomMessages.docs.map((doc) => doc.ref.delete()),
        ...imagesFiles.map((image) => storage.child(image).delete()),
        ...audioFiles.map((audio) => audio.Storage.child(audio).delete()),
        db
          .collection("users")
          .doc(user.uid)
          .collection("chats")
          .doc(roomId)
          .delete(),
        roomRef.delete(),
      ]);
    } catch (error) {
      console.warn("error deleting room", error);
    } finally {
      setIsDeleting(false);
      page.isMobile ? goBack() : replace("/chats");
    }
  }
  const { goBack, replace } = useHistory();
  return (
    <div className="chat">
      <div className="chat__background"></div>
      <div className="chat__header flex items-center">
        <IconButton onClick={goBack}>
          <ArrowBack />
        </IconButton>
        <div className="avatar__container">
          <Avatar src={room?.photoURL} />
        </div>
        <div className="chat__header--info flex items-center">
          <h3>{room?.name}</h3>
        </div>
        <div className="chat__header--right">
          <input
            type="file"
            id="image"
            accept="image/*"
            style={{ display: "none" }}
            onChange={showPreveiw}
          />
          <IconButton>
            <label htmlFor="image">
              <AddPhotoAlternate />
            </label>
          </IconButton>

          <IconButton
            onClick={(event) => {
              setOpenMenu(event.currentTarget);
            }}
          >
            <MoreVert />{" "}
          </IconButton>
          <Menu
            id="menu"
            anchorEl={openMenu}
            keepMounted
            open={Boolean(openMenu)}
            onClose={() => setOpenMenu(null)}
          >
            <MenuItem onClick={deleteRoom}>Delete Room</MenuItem>
          </Menu>
        </div>
      </div>
      <div className="chat__body--container">
        <div className="chat__body">
          <ChatMessages
            messages={messages}
            roomId={roomId}
            audioId={audioId}
            setAudioId={setAudioId}
            user={user}
          />
        </div>
      </div>
      {<MediaPreview src={src} closePreview={closePreview} />}
      <ChatFooter
        input={input}
        onChange={onChangeInput}
        sendMessage={sendMessage}
        image={image}
        user={user}
        room={room}
        roomId={roomId}
        setAudioId={setAudioId}
      />
      {isDeleting && (
        <div className="chat__deleting">
          <CircularProgress />
        </div>
      )}
    </div>
  );
}
