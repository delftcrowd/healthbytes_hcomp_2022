import { FieldProps, FormikErrors, FormikTouched } from "formik"
import { FC, HTMLInputTypeAttribute } from "react"

export interface TextInputProps {
  label: string
  name: string
  type: HTMLInputTypeAttribute
  placeholder?: string
  errors?: FormikErrors<{
    [field: string]: any
  }>
  touched?: FormikTouched<{
    [field: string]: any
  }>
  autofocus?: boolean
  disabled?: boolean
}

export const TextInput: FC<TextInputProps & FieldProps> = ({
  field,
  form: { touched, errors },
  type = "text",
  label,
  ...props
}) => {

  const isError = errors[field.name] && touched[field.name]
  const errorClass = isError ? 'error' : ''

  return (
    <>
      <label htmlFor={props.name}>{label}</label>
      <input type={type} {...field} {...props} />
      {isError && <span className="text-red-600">{errors[field.name]}</span>}
    </>
  )
}