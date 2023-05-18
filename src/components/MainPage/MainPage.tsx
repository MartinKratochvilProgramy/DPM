import React from 'react'
import Container from '../Container'
import Stocks from './Stocks'

const MainPage = () => {
  // const { user } = useUser()

  // useEffect(() => {
  //   if (user?.email == null) return

  //   fetch('/api/stocks', {
  //     method: 'POST',
  //     body: JSON.stringify({ username: user?.email })
  //   })
  //     .then(async response => await response.json())
  //     .then(res => { console.log(res) })
  //     .catch(e => { console.log(e) }
  //     )
  // }, [])

  return (
    <Container className='flex'>
      <div className='w-full grid grid-cols-2 gap-5'>
        <Stocks />
      </div>
    </Container>
  )
}

export default MainPage
