import React from 'react'
import { Audio } from 'react-loader-spinner'

const AudioLoading = () => {
    return (
        <Audio
            height="30"
            width="30"
            color="#4fa94d"
            ariaLabel="audio-loading"
            wrapperStyle={{}}
            wrapperClass="wrapper-class"
            visible={true}
        />
    )
}

export default AudioLoading