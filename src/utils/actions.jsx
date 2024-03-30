import { useState } from "react";
import { AccessToken, IngressClient, IngressInput } from "livekit-server-sdk";

/**
 * @typedef {Object} CreateIngressOptions
 * @property {string} name - The name of the room.
 * @property {string} roomName - The name of the room.
 * @property {string} participantName - The name of the participant.
 * @property {string} participantIdentity - The identity of the participant.
 * @property {boolean} [bypassTranscoding] - Whether to bypass transcoding.
 * @property {Object} [video] - Video configuration.
 * @property {TrackSource} video.source - The source of the video.
 * @property {IngressVideoEncodingPreset} video.preset - The video encoding preset.
 * @property {Object} [audio] - Audio configuration.
 * @property {TrackSource} audio.source - The source of the audio.
 * @property {IngressAudioEncodingPreset} audio.preset - The audio encoding preset.
 */

const Actions = () => {
  const [roomSlug, setRoomSlug] = useState("");
  const [ingressType, setIngressType] = useState(IngressInput.DEFAULT_INPUT);
  const ingressClient = new IngressClient(import.meta.env.VITE_NEXT_PUBLIC_LIVEKIT_WS_URL);

  /**
   * Create a streamer token.
   * @param {string} slug - The identity of the streamer.
   * @returns {Promise<string>} A promise that resolves with the generated token.
   */
  const createStreamerToken = async (slug) => {
    const token = new AccessToken(import.meta.env.VITE_LIVEKIT_API_KEY, import.meta.env.VITE_LIVEKIT_API_SECRET, {
      identity: slug,
    });

    token.addGrant({
      room: slug,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
    });

    return await Promise.resolve(token.toJwt());
  };

  /**
   * Create a viewer token.
   * @param {string} slug - The name of the room.
   * @param {string} room - The identity of the viewer.
   * @returns {Promise<string>} A promise that resolves with the generated token.
   */
  const createViewerToken = async (roomName, identity) => {
    // try {
    //   const newObj = {
    //     roomName: "sohag",
    //     participantName: slug,
    //   };

    //   const response = await fetch("http://localhost:3004/api/viewer-token", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(newObj),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Failed to generate token");
    //   }

    //   const { token } = await response.json();
    //   return token;
    // } catch (error) {
    //   console.error("Error generating token:", error);
    //   throw error;
    // }

    const token = new AccessToken(import.meta.env.VITE_LIVEKIT_API_KEY, import.meta.env.VITE_LIVEKIT_API_SECRET, {
      identity: identity,
    });

    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: false,
      canPublishData: true,
    });

    return await Promise.resolve(token.toJwt());
  };

  /**
   * Create an ingress.
   * @returns {Promise<any>} A promise that resolves with the created ingress.
   */
  const createIngress = async () => {
    const options = /** @type {CreateIngressOptions} */ ({
      name: roomSlug,
      roomName: roomSlug,
      participantName: roomSlug,
      participantIdentity: roomSlug,
    });

    const ingress = await ingressClient.createIngress(ingressType, options);

    return ingress;
  };

  /**
   * Reset ingresses.
   * @returns {Promise<void>} A promise that resolves once ingresses are reset.
   */
  const resetIngresses = async () => {
    const ingresses = await ingressClient.listIngress({});

    for (const ingress of ingresses) {
      if (ingress.ingressId) {
        await ingressClient.deleteIngress(ingress.ingressId);
      }
    }
  };

  return { resetIngresses, createIngress, createViewerToken, createStreamerToken };
};

export default Actions;
