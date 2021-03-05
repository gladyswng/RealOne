
import React, { useState, useEffect, useRef, TextareaHTMLAttributes } from "react"

const AutoTextArea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
	const textAreaRef = useRef<HTMLTextAreaElement>(null)
	const [text, setText] = useState("")
	const [textAreaHeight, setTextAreaHeight] = useState("auto")
	const [parentHeight, setParentHeight] = useState("auto")

	// const parentStyle: CSSProperties = {
	// 	minHeight: parentHeight,
	// }

	// const textAreaStyle: CSSProperties = {
	// 	height: textAreaHeight,
	// }

  useEffect(() => {
		setParentHeight(`${textAreaRef.current!.scrollHeight}px`)
		setTextAreaHeight(`${textAreaRef.current!.scrollHeight}px`)
	}, [text])

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {

    //resetting the textarea's height to auto is to ensure that it doesn't build up indefinitely in case the textarea has a padding greater than 0.
    setTextAreaHeight("auto")
    setParentHeight(`${textAreaRef.current!.scrollHeight}px`)
    setText(e.target.value)
  }

	return (
		<div style={{ minHeight: parentHeight, width: '100%' }}>
			<textarea
        {...props}
				rows={1}
				ref={textAreaRef}
				style={{ height: textAreaHeight}}
        onChange={onChangeHandler}
			/>
		</div>
	)
}

export default AutoTextArea