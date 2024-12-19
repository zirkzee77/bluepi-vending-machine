import Config from "./config"

const getMediaUrl = (imgName: string) => {
  return Config.MediaUrl + imgName
}

export default getMediaUrl
