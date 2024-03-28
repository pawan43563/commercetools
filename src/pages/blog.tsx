import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArchiveRelative from "../components/archive-relative";
import RenderComponents from "../components/render-components";
import BlogList from "../components/blog-list";

import { getBlogListRes, getPageRes, getTerms } from "../helper";
import Skeleton from "react-loading-skeleton";
import { Prop, Entry, ArchiveBlogList, BlogData } from "../typescript/pages";
import { useLivePreviewCtx } from "../context/live-preview-context-provider";

export default function Blog({ entry }: Prop) {
  const history = useNavigate();

  const [getEntry, setEntry] = useState({} as Entry);
  const [terms, setTerms] = useState([]);

  const [getList, setList] = useState({
    archive: {} as ArchiveBlogList,
    list: [],
  });
  const [error, setError] = useState(false);
  const lpTs = useLivePreviewCtx();

  async function fetchData() {
    try {

      const terms = await getTerms("courses");
      console.log('🚀 ~ fetchData ~ terms:', terms);
      setTerms(terms?.body?.terms);
      const blog = await getPageRes("/blog");
      const result = await getBlogListRes();
      (!blog || !result) && setError(true);

      const archive = [] as any;
      const blogLists = [] as any;

      result.forEach((blogs: BlogData) => {
        if (blogs.is_archived) {
          archive.push(blogs);
        } else {
          blogLists.push(blogs);
        }
      });

      setEntry(blog);
      setList({ archive: archive, list: blogLists });
      entry({ page: blog, blogPost: result });
    } catch (error) {
      console.error(error);
      setError(true);
    }
  }

  useEffect(() => {
    fetchData();
    error && history("/404");
  }, [error, lpTs]);

  const handleClick = (uid: any) => {
    console.log('🚀 ~ handleClick ~ uid:', uid);
    // Navigate to a new page with the route based on ter?.uid
    if (uid) {
      history(`/blog/${uid}`);
    }
  };

  return (
    <>
      {Object.keys(getEntry).length ? (
        <RenderComponents
          pageComponents={getEntry.page_components}
          blogsPage
          contentTypeUid='page'
          entryUid={getEntry.uid}
          locale={getEntry.locale}
        />
      ) : (
        <Skeleton height={400} />
      )}
      <div className='blog-container'>
        {
          terms ? ( 
            terms.map((ter: any) => (
              <div className="card" key={ter?.uid} onClick={ () => handleClick(ter?.uid) }>
                <div>{ter?.name}</div>
              </div>
            ))
          ) : <Skeleton height={400} />
        }
      </div>
    </>
  );
}
