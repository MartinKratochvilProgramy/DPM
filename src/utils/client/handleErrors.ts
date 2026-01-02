export const handleErrors = async (response: any) => {
  // throws error when response not OK
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!response.ok) {
    const res = await response.json();
    throw Error(res);
  } else {
    return response;
  }
};
