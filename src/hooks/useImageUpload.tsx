import React, { useState, useEffect } from 'react'
import { projectStorage, projectFirestore, timestamp } from '../firebase/config'

export const useImageUpload = (image?: string) => {

  const [file, setFile] = useState<File>()
 
  const [previewUrl, setPreviewUrl] = useState<string>()

  const [isValid, setIsValid] = useState(false)
  


  useEffect(() => {
  if (image) {
    
    setPreviewUrl(image)
  }
  }, [image])
  // console.log(previewUrl)

  // Generate a preview whenever theres a new file
  useEffect(()=> {
    if (!file ) {
      if (!image) {
        setPreviewUrl('')
        
      }
      return
    }

    // const deleteImage = async (imageUrl: string) => {
    //    await projectStorage.refFromURL(imageUrl).delete()
    // }

    const storageRef:any = projectStorage.ref(file.name)
    // const collectionRef: any = projectFirestore.collection('posts')

    storageRef.put(file).on('state_changed', () => {},(err: any) => {
      console.log(err)
    }, async () => {
      if (previewUrl && previewUrl !== image) {
        
        console.log(previewUrl)
        console.log(image)
        // deleteImage(previewUrl)
        await projectStorage.refFromURL(previewUrl).delete()
      }
      const url = await storageRef.getDownloadURL()
      // const createdAt = timestamp()
      // collectionRef.add({ text: 'What the title', image: url, createdAt })
      setPreviewUrl(url)
      
    })

  }, [file])

  const pickedHandler = (e?: React.ChangeEvent<HTMLInputElement>) => {
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

  }

  return ({ file, previewUrl, pickedHandler })

} 