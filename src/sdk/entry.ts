/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-undef */
import * as contentstack from "contentstack";
import * as Utils from "@contentstack/utils";

import ContentstackLivePreview from "@contentstack/live-preview-utils";
import axios from "axios";



type GetEntry = {
  contentTypeUid: string;
  referenceFieldPath: string[] | undefined;
  jsonRtePath: string[] | undefined;
};

type GetEntryByUrl = {
  entryUrl: string | undefined;
  contentTypeUid: string;
  referenceFieldPath: string[] | undefined;
  jsonRtePath: string[] | undefined;
};

const Stack = contentstack.Stack({
  api_key: `${process.env.REACT_APP_CONTENTSTACK_API_KEY}`,
  delivery_token: `${process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN}`,
  environment: `${process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT}`,
  //@ts-ignore
  region: `${process.env.REACT_APP_CONTENTSTACK_REGION}`
    ? `${process.env.REACT_APP_CONTENTSTACK_REGION}`
    : "us",
  live_preview: {
    management_token: `${process.env.REACT_APP_CONTENTSTACK_MANAGEMENT_TOKEN}`
      ? `${process.env.REACT_APP_CONTENTSTACK_MANAGEMENT_TOKEN}`
      : "",
    enable: true,
    host: `${process.env.REACT_APP_CONTENTSTACK_API_HOST}`
      ? `${process.env.REACT_APP_CONTENTSTACK_API_HOST}`
      : "",
  },
});

/**
 * initialize live preview
 */
ContentstackLivePreview.init({
  enable: true,
  //@ts-ignore
  stackSdk: Stack,
  clientUrlParams: {
    host: `${process.env.REACT_APP_CONTENTSTACK_APP_HOST}`
      ? `${process.env.REACT_APP_CONTENTSTACK_APP_HOST}`
      : "",
  },
  ssr: false,
});

if (`${process.env.REACT_APP_CONTENTSTACK_API_HOST}`) {
  Stack.setHost(`${process.env.REACT_APP_CONTENTSTACK_API_HOST}`);
}

const renderOption = {
  ["span"]: (node: any, next: any) => {
    return next(node.children);
  },
};

export const onEntryChange = ContentstackLivePreview.onEntryChange;

export default {
  /**
   *
   * fetches all the entries from specific content-type
   * @param {* content-type uid} contentTypeUid
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   *
   */
  getEntry({ contentTypeUid, referenceFieldPath, jsonRtePath }: GetEntry) {
    return new Promise((resolve, reject) => {
      const query = Stack.ContentType(contentTypeUid).Query();
      if (referenceFieldPath) query.includeReference(referenceFieldPath);
      query
        .includeOwner()
        .toJSON()
        .find()
        .then(
          (result) => {
            jsonRtePath &&
              Utils.jsonToHTML({
                entry: result,
                paths: jsonRtePath,
                renderOption,
              });
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
    });
  },

  /**
   *fetches specific entry from a content-type
   *
   * @param {* content-type uid} contentTypeUid
   * @param {* url for entry to be fetched} entryUrl
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   * @returns
   */
  getEntryByUrl({
    contentTypeUid,
    entryUrl,
    referenceFieldPath,
    jsonRtePath,
  }: GetEntryByUrl) {
    return new Promise((resolve, reject) => {
      const blogQuery = Stack.ContentType(contentTypeUid).Query();
      if (referenceFieldPath) blogQuery.includeReference(referenceFieldPath);
      blogQuery.includeOwner().toJSON();
      const data = blogQuery.where("url", `${entryUrl}`).find();
      data.then(
        (result) => {
          jsonRtePath &&
            Utils.jsonToHTML({
              entry: result,
              paths: jsonRtePath,
              renderOption,
            });
          resolve(result[0]);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },

  getTerms: async (term_uid: string) => {
    console.log('🚀 ~ term_uid:', Stack);
    return new Promise((resolve, reject) => {
      fetch(`https://commercetools.contentstackapps.com/terms?term_uid=${term_uid}`, {
        method: "GET",
      })
      .then((response) => resolve(response.json()))
      .catch((error) => reject(error));
    //    resolve({
    //     "terms": [
    //         {
    //             "uid": "sports",
    //             "name": "Sports",
    //             "parent_uid": null,
    //             "depth": 1,
    //             "created_at": "2024-03-27T18:31:10.073Z",
    //             "created_by": "bltd3e314b8626ecf71",
    //             "updated_at": "2024-03-27T18:31:10.073Z",
    //             "updated_by": "bltd3e314b8626ecf71",
    //             "taxonomy_uid": "courses",
    //             "ancestors": [
    //                 {
    //                     "uid": "courses",
    //                     "name": "Courses",
    //                     "type": "TAXONOMY"
    //                 }
    //             ]
    //         },
    //         {
    //             "uid": "information_technology",
    //             "name": "Information Technology",
    //             "parent_uid": null,
    //             "depth": 1,
    //             "created_at": "2024-03-27T18:30:53.038Z",
    //             "created_by": "bltd3e314b8626ecf71",
    //             "updated_at": "2024-03-27T18:30:53.038Z",
    //             "updated_by": "bltd3e314b8626ecf71",
    //             "taxonomy_uid": "courses",
    //             "ancestors": [
    //                 {
    //                     "uid": "courses",
    //                     "name": "Courses",
    //                     "type": "TAXONOMY"
    //                 }
    //             ]
    //         },
    //         {
    //             "uid": "ai",
    //             "name": "AI",
    //             "parent_uid": "information_technology",
    //             "depth": 2,
    //             "created_at": "2024-03-27T18:31:42.236Z",
    //             "created_by": "bltd3e314b8626ecf71",
    //             "updated_at": "2024-03-27T18:32:58.525Z",
    //             "updated_by": "bltd3e314b8626ecf71",
    //             "taxonomy_uid": "courses",
    //             "ancestors": [
    //                 {
    //                     "uid": "courses",
    //                     "name": "Courses",
    //                     "type": "TAXONOMY"
    //                 },
    //                 {
    //                     "uid": "information_technology",
    //                     "uuid": "660465ddfb52c7a8788b08c9",
    //                     "name": "Information Technology"
    //                 }
    //             ]
    //         },
    //         {
    //             "uid": "football",
    //             "name": "Football",
    //             "parent_uid": "sports",
    //             "depth": 2,
    //             "created_at": "2024-03-27T18:32:00.045Z",
    //             "created_by": "bltd3e314b8626ecf71",
    //             "updated_at": "2024-03-27T18:32:00.045Z",
    //             "updated_by": "bltd3e314b8626ecf71",
    //             "taxonomy_uid": "courses",
    //             "ancestors": [
    //                 {
    //                     "uid": "courses",
    //                     "name": "Courses",
    //                     "type": "TAXONOMY"
    //                 },
    //                 {
    //                     "uid": "sports",
    //                     "name": "Sports",
    //                     "uuid": "660465ee51f698bd47a07265"
    //                 }
    //             ]
    //         },
    //         {
    //             "uid": "cricket",
    //             "name": "Cricket",
    //             "parent_uid": "sports",
    //             "depth": 2,
    //             "created_at": "2024-03-27T18:31:48.231Z",
    //             "created_by": "bltd3e314b8626ecf71",
    //             "updated_at": "2024-03-27T18:31:48.231Z",
    //             "updated_by": "bltd3e314b8626ecf71",
    //             "taxonomy_uid": "courses",
    //             "ancestors": [
    //                 {
    //                     "uid": "courses",
    //                     "name": "Courses",
    //                     "type": "TAXONOMY"
    //                 },
    //                 {
    //                     "uid": "sports",
    //                     "name": "Sports",
    //                     "uuid": "660465ee51f698bd47a07265"
    //                 }
    //             ]
    //         },
    //         {
    //             "uid": "coding",
    //             "name": "Coding",
    //             "parent_uid": "information_technology",
    //             "depth": 2,
    //             "created_at": "2024-03-27T18:31:35.450Z",
    //             "created_by": "bltd3e314b8626ecf71",
    //             "updated_at": "2024-03-27T18:31:35.450Z",
    //             "updated_by": "bltd3e314b8626ecf71",
    //             "taxonomy_uid": "courses",
    //             "ancestors": [
    //                 {
    //                     "uid": "courses",
    //                     "name": "Courses",
    //                     "type": "TAXONOMY"
    //                 },
    //                 {
    //                     "uid": "information_technology",
    //                     "name": "Information Technology",
    //                     "uuid": "660465ddfb52c7a8788b08c9"
    //                 }
    //             ]
    //         },
    //         {
    //             "uid": "architecture",
    //             "name": "Architecture",
    //             "parent_uid": "information_technology",
    //             "depth": 2,
    //             "created_at": "2024-03-27T18:31:22.527Z",
    //             "created_by": "bltd3e314b8626ecf71",
    //             "updated_at": "2024-03-27T18:31:22.527Z",
    //             "updated_by": "bltd3e314b8626ecf71",
    //             "taxonomy_uid": "courses",
    //             "ancestors": [
    //                 {
    //                     "uid": "courses",
    //                     "name": "Courses",
    //                     "type": "TAXONOMY"
    //                 },
    //                 {
    //                     "uid": "information_technology",
    //                     "name": "Information Technology",
    //                     "uuid": "660465ddfb52c7a8788b08c9"
    //                 }
    //             ]
    //         }
    //     ]
    // })
    });
  },

  getEntriesByTerm: async (term_uid: string) => {
    return new Promise((resolve, reject) => {
      // fetch(`https://api.contentstack.io/v3/taxonomies/${term_uid}/terms`, {
      //   method: "GET",
      //   headers: {
      //     "api_key": "blt7193dffbafc4e975",
      //     "authorization": "cs3f96691f3caab263b532d92e",
      //     "Content-Type": "application/json",
      //   }
      // })
      // .then((response) => resolve(response.json()))
      // .catch((error) => reject(error));
       resolve({
        "entries": [
            {
                "_content_type_uid": "blog_post",
                "uid": "blt4aafd9dcdc6491c4",
                "_version": 3,
                "locale": "en-us",
                "ACL": {},
                "_in_progress": false,
                "author": [
                    {
                        "uid": "bltb1b4d8050507c29e",
                        "_content_type_uid": "author"
                    }
                ],
                "body": {
                    "attrs": {},
                    "children": [
                        {
                            "type": "p",
                            "attrs": {},
                            "children": [
                                {
                                    "text": "In the business world, data is precious. Data generated by a single organization is large enough to make it impossible for a team of humans to filter out the essential details from tons of raw data. When we have a plethora of data, this is where data mining comes into the picture."
                                }
                            ],
                            "uid": "782479a0f3b6415dbe7959d20a7098df"
                        },
                        {
                            "type": "p",
                            "attrs": {},
                            "children": [
                                {
                                    "text": "Data mining is a process that organizations use to turn raw data into useful information. Organizations utilize software to analyze large sets of raw data and look for patterns. These patterns help organizations learn more about their customers or even the general public."
                                }
                            ],
                            "uid": "8dfc8351c9ec46f584c3ed8e74d96747"
                        },
                        {
                            "type": "p",
                            "attrs": {},
                            "children": [
                                {
                                    "text": "This information pulled out helps to improve the decision-making process. Thus, strategies to increase sales, market, and deploy upcoming features are further apparent. Data mining is an indispensable part of any organization's intelligence. It helps uncover valuable insights by identifying patterns in raw data, turning them into useful information."
                                }
                            ],
                            "uid": "bd85087bd1594a4583c7ab81f9495c50"
                        },
                        {
                            "type": "p",
                            "attrs": {},
                            "children": [
                                {
                                    "text": "Frequently data mining is confused with terms like machine learning and data analysis, but these terms are very different and unique. Data mining and machine learning both use patterns and analytics. Data mining looks for patterns already present in data and brings it out for human intervention to make decisions. Data mining gets this information from large datasets, and data analytics is when organizations decide to take this information and dive into it to learn more."
                                }
                            ],
                            "uid": "448c56a4e824439dbfbce5a2169c4def"
                        },
                        {
                            "type": "p",
                            "attrs": {},
                            "children": [
                                {
                                    "text": "Businesses that make use of data mining have an advantage. They have a better understanding of their customers, oversight of business operations, improved customer acquisition, and new business opportunities. Also, they acquire a perception of potential customers, new ways to market and improve their systems. Thus, data mining helps businesses advance without any obstacles."
                                }
                            ],
                            "uid": "44252cbe573e41e2aa040980f96489cf"
                        },
                        {
                            "type": "p",
                            "attrs": {},
                            "children": [
                                {
                                    "text": "Data mining helps organizations with the detection of fraudulent activity and forestalling potential fraud. Instead of relying only on the human experience, patterns generated from data mining can help you make a creative and innovative decision, one which might be beyond human analysis."
                                }
                            ],
                            "uid": "58661afc8bf74daeaefc1d38ad984d87"
                        }
                    ],
                    "type": "doc",
                    "uid": "d79ad1ea33354f749f82f77beb8494ef",
                    "_version": 3
                },
                "created_at": "2024-03-21T12:09:05.666Z",
                "created_by": "bltd3e314b8626ecf71",
                "date": "2021-02-03T08:55:29.000Z",
                "featured_image": {
                    "_version": 1,
                    "is_dir": false,
                    "uid": "bltbfd49a5d9729c9e9",
                    "ACL": {},
                    "content_type": "image/svg+xml",
                    "created_at": "2024-03-21T12:08:46.735Z",
                    "created_by": "bltd3e314b8626ecf71",
                    "description": "",
                    "file_size": "32524",
                    "filename": "data-mining.svg",
                    "parent_uid": "blt9a1214a907d42bc7",
                    "tags": [],
                    "title": "Data Mining",
                    "updated_at": "2024-03-21T12:08:46.735Z",
                    "updated_by": "bltd3e314b8626ecf71",
                    "publish_details": {
                        "environment": "bltb01964060e9a1ebb",
                        "locale": "en-us",
                        "time": "2024-03-21T12:08:46.961Z",
                        "user": "bltd3e314b8626ecf71"
                    },
                    "url": "https://images.contentstack.io/v3/assets/blt7193dffbafc4e975/bltbfd49a5d9729c9e9/65fc234e748f451a60951d08/data-mining.svg"
                },
                "is_archived": false,
                "related_post": [
                    {
                        "uid": "blta3eef1cc94154e3c",
                        "_content_type_uid": "blog_post"
                    },
                    {
                        "uid": "blt85e9b58be8fefbc6",
                        "_content_type_uid": "blog_post"
                    }
                ],
                "seo": {
                    "meta_title": "Data Mining and its significance in Business Analytics",
                    "meta_description": "blog data",
                    "keywords": "Data Mining and its significance in Business Analytics",
                    "enable_search_indexing": true
                },
                "tags": [],
                "taxonomies": [
                    {
                        "taxonomy_uid": "courses",
                        "term_uid": "ai"
                    }
                ],
                "title": "Data Mining and its significance in Business Analytics",
                "updated_at": "2024-03-27T18:33:12.903Z",
                "updated_by": "bltd3e314b8626ecf71",
                "url": "/blog/data-mining-and-its-significance-in-business-analytics",
                "publish_details": {
                    "time": "2024-03-27T19:23:20.511Z",
                    "user": "bltd3e314b8626ecf71",
                    "environment": "bltb01964060e9a1ebb",
                    "locale": "en-us"
                }
            }
        ]
    });
    });
  }
};


