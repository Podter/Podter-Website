import getUserPresenceType from "@/utils/getUserPresenceType";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const userId = 126064549;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Cache-Control", "max-age=0, s-maxage=300");

  if (req.method === "GET") {
    try {
      const playerHeadshot = await axios.get(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=true`
      );
      const playerBody = await axios.get(
        `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=150x150&format=Png&isCircular=true`
      );

      const playerInfo = await axios.get(
        `https://users.roblox.com/v1/users/${userId}`
      );
      const friendCount = await axios.get(
        `https://friends.roblox.com/v1/users/${userId}/friends/count`
      );
      const followerCount = await axios.get(
        `https://friends.roblox.com/v1/users/${userId}/followers/count`
      );
      const lastOnline = await axios.post(
        "https://presence.roblox.com/v1/presence/last-online",
        {
          userIds: [userId],
        }
      );

      const playerPresences = await axios.post(
        `https://presence.roblox.com/v1/presence/users`,
        {
          userIds: [userId],
        },
        {
          headers: {
            Cookie: `.ROBLOSECURITY=${process.env.ROBLOX_COOKIE}`,
          },
        }
      );

      let placeThumbnail;
      if (
        playerPresences.data.userPresences[0].rootPlaceId ||
        playerPresences.data.userPresences[0].placeId
      ) {
        placeThumbnail = await axios.get(
          `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${
            playerPresences.data.userPresences[0].rootPlaceId ||
            playerPresences.data.userPresences[0].placeId
          }&returnPolicy=PlaceHolder&size=150x150&format=Png&isCircular=false`
        );
      }

      return res.status(200).json({
        message: "Success",
        data: {
          thumbnails: {
            headshot: playerHeadshot.data.data[0].imageUrl,
            body: playerBody.data.data[0].imageUrl,
          },
          info: {
            username: playerInfo.data.name,
            displayName: playerInfo.data.displayName,
            friendCount: friendCount.data.count,
            followerCount: followerCount.data.count,
          },
          presences: {
            userPresenceType: getUserPresenceType(
              playerPresences.data.userPresences[0].userPresenceType
            ),
            location: playerPresences.data.userPresences[0].lastLocation,
            placeThumbnail: placeThumbnail
              ? placeThumbnail.data.data[0].imageUrl
              : null,
            lastOnline: lastOnline.data.lastOnlineTimestamps[0].lastOnline,
          },
        },
        code: res.statusCode,
      });
    } catch {
      return res
        .status(500)
        .json({ message: "Internal Server Error", code: res.statusCode });
    }
  }

  return res
    .status(405)
    .json({ message: "Method Not Allowed", code: res.statusCode });
}
