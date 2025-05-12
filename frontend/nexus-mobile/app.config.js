import 'dotenv/config';

export default {
  "expo": {
    "name": "nexus-mobile",
    "slug": "nexus-mobile",
    "version": "1.0.0",
    "extra": {
      "API_BASE_URL": process.env.API_BASE_URL,
      "API_BASE_URL_QUERY": process.env.API_BASE_URL_QUERY,
    }
  }
}
