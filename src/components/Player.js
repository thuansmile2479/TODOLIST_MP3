import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as apis from '../apis'
import icons from '../ultis/icons'
import * as actions from '../store/actions'
import { toast } from 'react-toastify'
import moment from 'moment'


const { AiOutlineHeart, AiFillHeart, BsThreeDots, MdSkipNext, MdSkipPrevious, CiRepeat, BsPauseFill, BsFillPlayFill, CiShuffle } = icons
var intervalId
const Player = () => {

    // const audioEl = useRef(new Audio())
    const { curSongId, isPlaying } = useSelector(state => state.music)
    const [songInfo, setSongInfo] = useState(null)
    // const [source, setSource] = useState(null)
    const [audio, setAudio] = useState(new Audio())
    const [curSeconds, setCurSeconds] = useState()
    // console.log(audioEl)
    const thumbRef = useRef()
    const trackRef = useRef()
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchDetailSong = async () => {
            const [res1, res2] = await Promise.all([
                apis.apiGetDetailSong(curSongId),
                apis.apiGetSong(curSongId)
            ])
            if (res1.data.err === 0) {
                setSongInfo(res1.data.data)
                // setCurSeconds(0)
            }
            if (res2.data.err === 0) { 
                audio.pause()
                setAudio(new Audio(res2.data.data['128']))
            }
            else {
                setAudio(new Audio())
                dispatch(actions.play(false)) 
                toast.warn(res2.data.msg)
                setCurSeconds(0)
                thumbRef.current.style.cssText = `right: 100%`
            }  
        }
        fetchDetailSong()
    }, [curSongId])

    // const play = async () => {
    //     await audio.play()
    // }

    useEffect(() => {
        intervalId && clearInterval(intervalId)
        audio.pause()
        audio.load() 
        if (isPlaying) {
            audio.play()
            intervalId = setInterval(() => {
                let percent = Math.round(audio.currentTime * 10000 / songInfo.duration) / 100
                // console.log(percent)
                thumbRef.current.style.cssText = `right: ${100 - percent}%`
                setCurSeconds(Math.round(audio.currentTime))
            }, 200)
        } 
    }, [audio])

    

    const handleTogglePlayMusic = async () => {
        if (isPlaying) {
            audio.pause()
            dispatch(actions.play(false))
        } else {
            audio.play()
            dispatch(actions.play(true))
            
        }
    }
    // useEffect(() => {
    //     console.log(audio.currentTime)
    //     if (isPlaying && thumbRef.current) {
    //         let percent = Math.round(audio.currentTime * 100 / songInfo.duration)
    //         thumbRef.current.cssText = `right: ${percent}%`
    //     }
    // }, [audio.currentTime])

    const handleClickProgressbar = (e) => {
        const trackRect = trackRef.current.getBoundingClientRect()
        const percent = Math.round((e.clientX = trackRect.left) * 10000 / trackRect.width) / 100
        thumbRef.current.style.cssText = `right: ${100 - percent}%`
        audio.currentTime = percent * songInfo.duration / 100
        setCurSeconds(Math.round(percent * songInfo.duration / 100))
    }

    return (
        <div className='bg-main-400 px-5 h-full flex'>
             <div className='w-[30%] flex-auto flex gap-3 items-center'>
                <img src={songInfo?.thumbnail} alt="thumbnail" className='w-16 h-16 object-cover rounded-md' />
                <div className='flex flex-col'>
                    <span className='font-semibold text-gray-700 text-sm'>{songInfo?.title}</span>
                    <span className='text-xs text-gray-500'>{songInfo?.artistsNames}</span>
                </div>
                <div className='flex gap-4 pl-2'>
                    <span>
                        <AiOutlineHeart size={16} />
                    </span>
                    <span>
                        <BsThreeDots size={16} />
                    </span>
                </div>
            </div>
            <div className='w-[40%] flex-auto   flex items-center justify-center gap-4 flex-col  py-2'>
                <div className='flex gap-8 justify-center items-center'>
                    <span className='cursor-pointer' title='Bật phát ngẫu nhiên'><CiShuffle size={24} /></span>
                    <span className='cursor-pointer'><MdSkipPrevious size={24} /></span>
                    <span
                        className='p-1 border border-gray-700 cursor-pointer hover:text-main-500 rounded-full'
                        onClick={handleTogglePlayMusic}
                    >
                        {isPlaying ? <BsPauseFill size={30} /> : <BsFillPlayFill size={30} />}
                    </span>
                    <span className='cursor-pointer'><MdSkipNext size={24} /></span>
                    <span className='cursor-pointer' title='Bật phát lại tất cả'><CiRepeat size={24} /></span>

                </div>
                <div className='w-full flex items-center justify-center gap-3 text-xs'>
                    <span>{moment.utc( curSeconds* 1000).format('mm:ss')}</span>
                    <div className='bg-[rgba(0,0,0,0.1)] horver:h-[8px] cursor-pointer relative m-auto h-[3px] w-4/5 rounded-l-full rounded-r-full' onClick={handleClickProgressbar} ref={trackRef}>
                        <div ref={thumbRef} className='bg-[#0e8080] absolute top-0 left-0 h-[3px] rounded-l-full rounded-r-full'></div>
                    </div>
                    <span>{moment.utc(songInfo?.duration * 1000).format('mm:ss')}</span>

                </div>
            </div>
            <div className='w-[30%] flex-auto  '>
                Volume
            </div>
        </div>
    )
}

export default Player