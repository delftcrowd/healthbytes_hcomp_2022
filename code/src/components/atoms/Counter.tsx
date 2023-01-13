import { useEffect } from "react"
import { resetCounter, updateCounter } from "store/slices/counterSlice"
import { RootState } from "store/store"
import { useAppDispatch, useAppSelector } from '../../store/hooks'

const Counter = () => {
  const dispatch = useAppDispatch()
  const counter = useAppSelector((state: RootState) => state.counter)

  useEffect(() => {
    if (counter.maxTime != 0) {
      if (counter.progress <= 0) {
        dispatch(resetCounter())
        return
      }

      const timer = setTimeout(() => {
        dispatch(updateCounter({ progress: counter.progress - 1 }))
      }, 1000)

      return () => clearTimeout(timer)
    }
  })

  return <div className="mt-2 text-4xl text-center">
    {counter.progress}
  </div>
}

export default Counter