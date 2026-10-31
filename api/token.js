const { AccessToken } = require("livekit-server-sdk");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return res.status(500).json({
      error: "LiveKit is not configured. Check the three LIVEKIT environment variables in Vercel."
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const room = String(body.room || "").trim();
    const role = body.role === "student" ? "student" : "teacher";
    const requestedIdentity = String(body.identity || "").trim();
    if (!room || !/^[a-zA-Z0-9_-]{1,80}$/.test(room)) {
      return res.status(400).json({ error: "A valid room code is required." });
    }

    const suffix = requestedIdentity.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32);
    const identity = suffix || (role + "-" + Math.random().toString(36).slice(2, 10));
    const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity,
      name: role === "teacher" ? "Teacher" : "Betty",
      ttl: "2h"
    });
    token.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true
    });

    const jwt = await token.toJwt();
    return res.status(200).json({ token: jwt, url: LIVEKIT_URL, room, identity, role });
  } catch (error) {
    console.error("LiveKit token error:", error);
    return res.status(500).json({ error: "Could not create a lesson token." });
  }
};
