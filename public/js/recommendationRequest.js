async function sendDelete(url, name) {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      name: name
    })
  });

  location.reload();
  
}