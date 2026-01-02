import { type ReactNode } from 'react'

interface CardInterface {
  children: ReactNode
  setOpen: () => void
}

const Card: React.FC<CardInterface> = ({ children, setOpen }) => {
  return (
    <div
      onClick={setOpen}
      className='card-shadow hover:bg-opacity-10 dark:hover:bg-opacity-[0.02] hover:bg-red-100 w-[290px] md:w-[460px] aspect-[1.2] flex items-center justify-center rounded-md sm:rounded-lg border border-blue-400 dark:border-gray-500 cursor-pointer'
    >
      {children}
    </div>
  )
}

export default Card
