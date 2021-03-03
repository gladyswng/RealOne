import React, { useRef, useState, useEffect } from 'react'


interface ImageUploadProps {
  id: string
  image: string
  imageStyle: string
  onInput?: (id: string, value: any, isValid: boolean) => void
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget 
  
}


const ImageUpload: React.FC<ImageUploadProps> = ({ id, image, imageStyle }) => {


  const [file, setFile] = useState<File>()
  // TODO -TYPE ANY
  const [previewUrl, setPreviewUrl] = useState<string>()

  const [isValid, setIsValid] = useState(false)

  // const filePickerRef = useRef()

  // const pickImageHandler = ({ target } : any) => {
  //   filePickerRef.current.click()



  // }

useEffect(() => {
  if (image) {
    setPreviewUrl(image)
  }
}, [])


  // Generate a preview whenever theres a new file
  useEffect(()=> {
    if (!file) {
      return 
    }
    // helps us parse files and convert a file (a binary data into a readable or outputable image url)
    const fileReader = new FileReader()
    
    // triggered each time the reading operation is successfully completed.
    fileReader.onload = () => {
      // execute whenever loads a new file or done parsing a file
      if (typeof fileReader.result === "string") {
        setPreviewUrl(fileReader.result)
      }
    }
    fileReader.readAsDataURL(file)
  }, [file])

  const pickedHandler = (e?: HTMLInputEvent | React.ChangeEvent<HTMLInputElement>) => {
    let pickedFile
    let fileIsValid = isValid
    if (e?.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0]

      console.log(pickedFile)
      setFile(pickedFile)
      setIsValid(true) // wont update immediately state value
      fileIsValid = true
    } else {
      setIsValid(false)
      fileIsValid = false
      return
    }

    // onInput(id, pickedFile, fileIsValid)
  }


  const imageRenderingStyle = () => {
    if (imageStyle === 'photo') {
      return (
        <>
        <div>
          {previewUrl && <img src={previewUrl} alt="Preview" /> }
          {!previewUrl && <p>Select an image</p>}
        </div>
        <button>
          Upload
        </button>
        </>
      )
    } 
  }
    return (
      <>
      <input
        accept=".jpg,.png,.jpeg"
        style={{ display: 'none' }}
        onChange={pickedHandler}
        // ref={filePickerRef}
        id={id}
        multiple
        type="file"
      />
      <label htmlFor={id}>
        {imageRenderingStyle()}
      </label>
    {/* {!isValid && <Typography>{error}</Typography>} */}
    </>
    );
}
export default ImageUpload