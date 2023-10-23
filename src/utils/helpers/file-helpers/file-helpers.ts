import imageCompression, { Options } from 'browser-image-compression'

const defaultOptions: Options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1024,
  useWebWorker: true,
}

export const compressImages = async (files: File[], options: Options = defaultOptions) => {
  try {
    return await Promise.all(
      files.map((file) => {
        if (file.type.includes('image/')) {
          return imageCompression(file, options)
        } else {
          return file
        }
      })
    )
  } catch (error) {
    console.log(error)
    return []
  }
}
