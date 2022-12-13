const eventHandlers = {
  onChange : (campo, setter) => {
    return (e) => {
      const { name, value } = e.target;
      setter({ ...campo, [name]: value });
    }
  }
}

export default eventHandlers;