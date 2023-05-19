export const handleErrors = async (response: any) => {
  // throws error when response not OK
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!(response.ok)) {
    const { message } = await response.json()
    throw Error(message)
  } else {
    return response
  }
}
