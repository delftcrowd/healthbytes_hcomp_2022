
const ErrorView = ({ message }: { message: string }) => {
  return message ? <div className='text-sm text-my-red'> {message} </div> : null
}

export default ErrorView
