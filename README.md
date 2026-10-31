# Betty Classroom

A friendly browser-based classroom starter for teaching Betty through screen sharing.

## Current starter features
- Responsive lesson-room interface
- Generates a shareable room URL with a room code
- Browser microphone and camera permission/testing controls
- Screen sharing using `getDisplayMedia()`
- Clear notice explaining that multi-device live calls are not connected yet

## Run locally
Because browser camera/microphone/screen-sharing APIs generally require a secure context, use localhost or HTTPS:
1. Download/clone this repository.
2. Open a terminal in the project folder.
3. Run `python -m http.server 8000`.
4. Visit `http://localhost:8000`.

## Important next step
The invite link currently identifies a room but does not connect two browsers. To make a real Zoom-like lesson, implement WebRTC peer connections plus a signaling service (for example, a small WebSocket backend) and STUN/TURN configuration. Add room membership, access controls, and explicit consent before deploying publicly. Do not treat the room code as authentication.

## Deploy
GitHub Pages can host the static UI, but it cannot by itself provide the signaling backend required for live calls between devices. Use an HTTPS static host plus a signaling/WebRTC service for the complete app.
