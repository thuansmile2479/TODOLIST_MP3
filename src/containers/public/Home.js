import React, { useEffect } from 'react'
import { Header, Slider } from '../../components'
// import * as apis from '../../apis'

const Home = () => {

  // useEffect(() => {
  //   const fetchDataHome = async () => {
  //     const response = await apis.getHome()
  //     console.log(response);
  //   }

  //   fetchDataHome()

  // }, [])

  return (
    <div className='overflow-y-auto'>
      <div className='h-[70px]  flex items-center'>
        <Header />
        
      </div>
      <Slider />
    </div>
  )
}

export default Home