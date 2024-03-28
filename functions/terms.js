export default async function handler(request, response) {
    console.log('🚀 ~ handler= ~ request:', request.query);
    let data;
    if (request?.query?.taxonomy) {
        const res = await fetch(`https://api.contentstack.io/v3/taxonomies/${request?.query?.taxonomy}/terms`, {
            method: "GET",
            headers: {
              "api_key": "blt7193dffbafc4e975",
              "authorization": "cs3f96691f3caab263b532d92e",
              "Content-Type": "application/json",
            }
        })
        data = await res.json()
        console.log('🚀 ~ handler ~ data:', data);
    } else {
        const res = await fetch(`https://cdn.contentstack.io/v3/taxonomies/entries`, {
              method: "GET",
              headers: {
                "api_key": "blt7193dffbafc4e975",
                "authorization": "cs3f96691f3caab263b532d92e",
                "Content-Type": "application/json",
              },
              params: {
                environment: "production",
                query: `{"taxonomies.courses" : { "$in" : [${request?.query?.term_uid}] }}`,
              }
            })
        data = await res.json()
        console.log('🚀 ~ handler ~ data:', data);
    }
    response.status(200).json({
      body: data,
      query: request.query,
      cookies: request.cookies,
    });
}
  