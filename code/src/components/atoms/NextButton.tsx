import { Button, ButtonProps } from '@mui/material'
import { proceedTask } from 'components/utils/task'
import { useAppDispatch } from 'store/hooks'


export function NextButton({ buttonText, ...props }: ButtonProps & { buttonText: string }) {
  const dispatch = useAppDispatch()

  function next() {
    dispatch(proceedTask())
  }

  return <Button variant='contained' onClick={next} sx={{ marginTop: '1em' }} color={'success'} {...props}>{buttonText}</Button>
}
