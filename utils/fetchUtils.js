export const unWrap = async (response) => {
  console.log(response);
  const json = await response.json();
  const { ok, status, statusText } = response;
  return {
    json,
    ok,
    status,
    statusText
  };
};

export const getErrorResponse = (error) => {
  console.log('in getError');
  console.log(error);
  return {
    ok: false,
    status: 500,
    statusText: error?.message || error,
    json: {}
  };
};
