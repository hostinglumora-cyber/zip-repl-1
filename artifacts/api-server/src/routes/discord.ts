import { Router, type IRouter } from "express";
import { ReplitConnectors } from "@replit/connectors-sdk";

const router: IRouter = Router();
const connectors = new ReplitConnectors();

router.get("/discord/me", async (req, res) => {
  try {
    const response = await connectors.proxy("discord", "/api/v10/users/@me", {
      method: "GET",
    });

    if (!response.ok) {
      req.log.warn({ status: response.status }, "Discord profile unavailable");
      return res.status(response.status).json({ error: "Discord profile unavailable" });
    }

    const profile = await response.json() as {
      id: string;
      username: string;
      global_name?: string | null;
      avatar?: string | null;
    };

    const avatarUrl = profile.avatar
      ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=128`
      : `https://cdn.discordapp.com/embed/avatars/${Number(profile.id) % 5}.png`;

    return res.json({
      id: profile.id,
      name: profile.global_name || profile.username,
      username: profile.username,
      avatarUrl,
    });
  } catch (error) {
    req.log.error({ err: error }, "Discord profile request failed");
    return res.status(502).json({ error: "Discord profile request failed" });
  }
});

export default router;