import { IconType } from "react-icons/lib"
import { SiApple, SiGoogle, SiGithub, SiDiscord, SiFacebook } from "react-icons/si"

type Provider = {
  name: "google" | "github" | "discord" | "facebook"
  displayName: string
  icon: IconType
  url?: string
}

export const providers: Provider[] = [
  { name: "google", displayName: "Google", icon: SiGoogle },
  { name: "github", displayName: "GitHub", icon: SiGithub },
  { name: "discord", displayName: "Discord", icon: SiDiscord },
  { name: "facebook", displayName: "Facebook", icon: SiFacebook }
]