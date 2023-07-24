import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as apis from '../apis'
import icons from '../ultis/icons'
import * as actions from '../store/actions'
import { toast } from 'react-toastify'
import moment, { max } from 'moment'
import { LoadingSOng } from '.'


const { AiOutlineHeart, BsThreeDots, MdSkipNext, MdSkipPrevious, CiRepeat, BsPauseFill, BsFillPlayFill, CiShuffle, TbRepeatOnce, BsFillMicFill, SlVolume1, SlVolume2, SlVolumeOff } = icons
var intervalId
const Player = ({ setIsShowRightSlidebar }) => {

    // const audioEl = useRef(new Audio())
    const { curSongId, isPlaying, songs } = useSelector(state => state.music)
    const [songInfo, setSongInfo] = useState(null)
    // const [source, setSource] = useState(null)
    const [audio, setAudio] = useState(new Audio())
    const [curSeconds, setCurSeconds] = useState(0)
    const [isShuffe, setIsShuffe] = useState(false)
    const [repeatMode, setRepeatMode] = useState(0)
    const [isLoadedSource, setIsLoadedSource] = useState(true)
    const [volume, setVolume] = useState(70)
    // console.log(audioEl)
    const dispatch = useDispatch()
    const thumbRef = useRef()
    const trackRef = useRef()

    useEffect(() => {
        const fetchDetailSong = async () => {
            setIsLoadedSource(false)
            const [res1, res2] = await Promise.all([
                apis.apiGetDetailSong(curSongId),
                apis.apiGetSong(curSongId)
            ])
            setIsLoadedSource(true)
            if (res1.data.err === 0) {
                setSongInfo(res1.data.data)
                // setCurSeconds(0)
            }
            if (res2.data.err === 0) {
                audio.pause()
                setAudio(new Audio(res2.data.data['128']))
            }
            else {
                audio.pause()
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

    // useEffect(() => {
    //     audio.load()
    //     if (isPlaying) play()
    // }, [audio])

    useEffect(() => {
        intervalId && clearInterval(intervalId)
        audio.pause()
        audio.load()
        if (isPlaying && thumbRef.current) {
            audio.play()
            intervalId = setInterval(() => {
                let percent = Math.round(audio.currentTime * 10000 / songInfo.duration) / 100
                // console.log(percent)
                thumbRef.current.style.cssText = `right: ${100 - percent}%`
                setCurSeconds(Math.round(audio.currentTime))
            }, 200)
        }
    }, [audio])

    useEffect(() => {
        const handleEnded = () => {
            console.log(isShuffe);
            if (isShuffe) {
                handleShuffle()
            } else if (repeatMode) {
                repeatMode === 1 ? handleRepeatOne() : handleNextSong()
            } else {
                audio.pause()
                dispatch(actions.play(false))
            }
        }
        audio.addEventListener('ended', handleEnded)

        return () => {
            audio.removeEventListener('ended', handleEnded)
        }
    }, [audio, isShuffe, repeatMode])

    useEffect(() => {
        audio.volume = volume / 100
    }, [volume])



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
        // console.log(e);
        const trackRect = trackRef.current.getBoundingClientRect()
        const percent = Math.round((e.clientX - trackRect.left) * 10000 / trackRect.width) / 100
        // console.log(percent);
        thumbRef.current.style.cssText = `right: ${100 - percent}%`
        audio.currentTime = percent * songInfo.duration / 100
        setCurSeconds(Math.round(percent * songInfo.duration / 100))

    }

    const handleNextSong = () => {
        if (songs) {
            let currentSongIndex
            songs?.forEach((item, index) => {
                if (item.encodeId === curSongId) currentSongIndex = index
            })
            dispatch(actions.setCurSongId(songs[currentSongIndex + 1].encodeId))
            dispatch(actions.play(true))
        }
    }

    const handlePrevSong = () => {
        if (songs) {
            let currentSongIndex
            songs?.forEach((item, index) => {
                if (item.encodeId === curSongId) currentSongIndex = index
            })
            dispatch(actions.setCurSongId(songs[currentSongIndex - 1].encodeId))
            dispatch(actions.play(true))
        }
    }

    const handleRepeatOne = () => {
        audio.play()
    }

    const handleShuffle = () => {
        const randomIndex = Math.round(Math.random() * songs?.length) - 1
        dispatch(actions.setCurSongId(songs[randomIndex].encodeId))
        dispatch(actions.play(true))
    }


    return (
        <div className='bg-main-400  px-5 h-full flex'>
            <div className='w-[40%] flex-auto flex gap-3 items-center '>
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
                    <span
                        className={`cursor-pointer ${isShuffe ? 'text-purple-600' : 'text-black'}`}
                        title='Bật phát ngẫu nhiên'
                        onClick={() => setIsShuffe(prev => !prev)}
                    >
                        <CiShuffle size={24} />
                    </span>
                    <span
                        onClick={handlePrevSong}
                        className={`${!songs ? 'text-gray-500' : 'cursor-pointer'}`}
                    >
                        <MdSkipPrevious size={24} />
                    </span>
                    <span
                        className='p-1 border border-gray-700 cursor-pointer hover:text-main-500 rounded-full'
                        onClick={handleTogglePlayMusic}
                    >
                        {!isLoadedSource ? <LoadingSOng /> : isPlaying ? <BsPauseFill size={30} /> : <BsFillPlayFill size={30} />}
                    </span>
                    <span
                        onClick={handleNextSong}
                        className={`${!songs ? 'text-gray-500' : 'cursor-pointer'}`}
                    >
                        <MdSkipNext size={24} />
                    </span>
                    <span className={`cursor-pointer ${repeatMode && 'text-purple-600'}`} title='Bật phát lại tất cả'
                        onClick={() => setRepeatMode(prev => prev === 2 ? 0 : prev + 1)}
                    >
                        {repeatMode === 1 ? <TbRepeatOnce size={24} /> : <CiRepeat size={24} />}
                    </span>

                </div>
                <div className='w-full flex items-center justify-center gap-3 text-xs'>
                    <span>{moment.utc(curSeconds * 1000).format('mm:ss')}</span>
                    <div
                        className='bg-[rgba(0,0,0,0.1)] hover:h-[6px] cursor-pointer relative   h-[3px] w-3/4 rounded-l-full rounded-r-full'
                        onClick={handleClickProgressbar}
                        ref={trackRef}>
                        <div ref={thumbRef} className='bg-[#0e8080] absolute top-0 left-0 bottom-0 rounded-l-full rounded-r-full'></div>
                    </div>
                    <span>{moment.utc(songInfo?.duration * 1000).format('mm:ss')}</span>

                </div>
            </div>
            <div className='w-[30%] flex-auto   flex items-center justify-end gap-4  '>
                <span onClick={() => setIsShowRightSlidebar(prev => !prev)} className='p-1 rounded-sm cursor-pointer  opacity-90 hover:opacity-100'><BsFillMicFill size={20} /></span>

                <span onClick={() => setVolume(prev => +prev === 0 ? 70 : 0)}>{+volume >= 50 ? <SlVolume2 /> : +volume === 0 ? <SlVolumeOff /> : <SlVolume1 />}</span>

                <input
                 className='w-[250px]'
                    type="range"
                    step={1}
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                />

            </div>
        </div>
    )
}

export default Player