import React, { useEffect, useState } from 'react'
import { ReactComponent as PictureIcon } from '../../svg/picture.svg'
import { projectStorage, projectFirestore, timestamp } from '../../firebase/config'


interface MultipleImageUploadProps {
 
  image?: string

}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget 
  
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({  image }) => {


  const [files, setFiles] = useState<any>()
  // TODO -TYPE ANY
  const [urls, setUrls] = useState<string[]>()

  const [isValid, setIsValid] = useState(false)
  console.log(files)
//   useEffect(() => {
//   if (image) {
//     setPreviewUrls(image)
//   }
// }, [])



  // Generate a preview whenever theres a new file
  useEffect(()=> {
    if (!files) {
      return 
    }

    const urls = files.map((file: File) => URL.createObjectURL(file))
    setUrls(urls)
    
    return () => {
      
      if (urls?.length > 0) {
        urls?.forEach((url: string )=> URL.revokeObjectURL(url))
      }
    }
  }, [files])

  const pickedHandler = (e?: HTMLInputEvent | React.ChangeEvent<HTMLInputElement>) => {
    let pickedFiles
    let fileIsValid = isValid
    console.log(e?.target.files)
    if (e?.target.files) {
      pickedFiles =  Array.from(e.target.files)  

      // console.log(pickedFile)
      setFiles(pickedFiles)
      setIsValid(true) // wont update immediately state value
      fileIsValid = true
    } else {
      setIsValid(false)
      fileIsValid = false
      return
    }

    // onInput(id, pickedFile, fileIsValid)
  }
  console.log(urls)
  const displayUploadedFiles = (urls:string[]) => {
    if (urls.length <2) {
      return urls.map((url, i) => <img className="overflow-hide h-60 object-cover w-full" key={i} src={url} />)

    }
    if (urls.length > 1 && urls.length < 3) {
      return urls.map((url, i) => <img className="overflow-hide h-60 object-cover w-6/12" key={i} src={url} />)
    }
    if (urls.length > 2) {
      return urls.map((url, i) => <img className="overflow-hide h-60 object-cover w-4/12  last:opacity-40" key={i} src={url} />)
      // return urls.map((url, i) => {
      //   if (i === urls.length-1) {
      //     return  <img className="overflow-hide h-48 object-cover w-3/12 opacity-50" key={i} src={url} />
      //   } else {

      //     return <img className="overflow-hide h-48 object-cover w-3/12" key={i} src={url} />
      //   }
      // })
    }
  }

  const imageClickHandler = (e:any) => {
    e.preventDefault()
    files.forEach((file: any) => {

      const storageRef:any = projectStorage.ref(file.name)
      // const collectionRef: any = projectFirestore.collection('posts')
  
      storageRef.put(file).on('state_changed', () => {},(err: any) => {
        console.log(err)
      }, async () => {
        const url = await storageRef.getDownloadURL()
        console.log(url)
        
      })
    })

  }

  
  return (
    <>

    {!urls && <div className="flex justify-center items-center h-60 px-6 pb-6 bg-gray-300 opacity-0.5  ">
      <div className="space-y-1 text-center text-gray-400">
        <PictureIcon className="mx-auto h-12 w-12 fill-current"/>
        
        <div className="flex text-sm text-gray-600">
          <label htmlFor="file-upload" className="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-blue-500">
            <span>Upload multiple image</span>
            <input 
            id="file-upload" 
            name="file-upload" 
            accept=".jpg,.png,.jpeg"
            type="file" 
            multiple
            onChange={pickedHandler}
            className="sr-only" />
          </label>
        </div>

      </div>
    </div>}
      {/* <input
        accept=".jpg,.png,.jpeg"
        style={{ display: 'none' }}
        onChange={pickedHandler}
        // ref={filePickerRef}
        id="images"
        multiple
        type="file"
      />
      <label htmlFor="images">
       UPLOAD MULTIPLE FILES
      </label> */}
      <div v-for="item in items" className="flex justify-center h-auto flex-wrap">
        {urls && urls.length > 0 && displayUploadedFiles(urls)}

      </div>
      <button className="btn-blue bg-blue-500" onClick={imageClickHandler}>Click to send</button>
    {/* {!isValid && <Typography>{error}</Typography>} */}
    </>
  )
}
export default MultipleImageUpload