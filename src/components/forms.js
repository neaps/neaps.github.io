import React from 'react'
import styled from '@emotion/styled'
import colors from '../style/colors'

const textStyle = `
  padding: 0.5rem;
  border: ${colors.primary.dark} 2px solid;
  margin-bottom: 1rem;
  width: 100%;
`

const FormInput = styled.input`
  ${textStyle}
`

const FormSelect = styled.select`
  ${textStyle}
  border-radius: 0;
`

const TextareaInput = styled.textarea`
  ${textStyle}
`

const FormSubmitElement = styled.input`
  border: 0;
  background: ${colors.primary.dark};
  color: #fff;
  padding: 0.5rem;
  cursor: pointer;
`

const FormSubmit = ({ value }) => (
  <FormSubmitElement type="submit" value={value} />
)

export { FormInput, FormSelect, TextareaInput, FormSubmit }
