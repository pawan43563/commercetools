export default handler = async  (request, response) => {
    console.log('🚀 ~ handler= ~ request:', request.query);
    const res = await fetch(`https://api.contentstack.io/v3/taxonomies/${req?.query?.term_uid}/terms`, {
        method: "GET",
        headers: {
          "api_key": "blt7193dffbafc4e975",
          "authorization": "cs3f96691f3caab263b532d92e",
          "Content-Type": "application/json",
        }
      })
    const data = await res.json()
    response.status(200).json({
      body: data,
      query: request.query,
      cookies: request.cookies,
    });
}
  