const request = async (endpoint, options) => {
  const fetchOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    ...options,
  }

  return fetch(`http://localhost:3001/api/${endpoint}`, fetchOptions).then(
    async (response) => {
      const body = await response.json()

      if (response.ok) {
        return body
      } else {
        // eslint-disable-next-line
        throw { status: response.status, ...body }
      }
    }
  )
}

export default request
