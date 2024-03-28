import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import parse from "html-react-parser";

import ArchiveRelative from "../components/archive-relative";
import RenderComponents from "../components/render-components";
import { getPageRes, getBlogPostRes, getEntriesByTerm } from "../helper";
import Skeleton from "react-loading-skeleton";
import { Prop, Banner, Post } from "../typescript/pages";
import { useLivePreviewCtx } from "../context/live-preview-context-provider";
import BlogList from "../components/blog-list";

export default function BlogPost({ entry }: Prop) {
  const lpTs = useLivePreviewCtx();
  const { blogId } = useParams();
  const history = useNavigate();
  const [getEntry, setEntry] = useState({
    banner: {} as Banner,
    post: {} as Post,
  });
  const [terms, setTerms] = useState([]);
  const [error, setError] = useState(false);

  async function fetchData() {
    try {
      const entryUrl = blogId ? `/blog/${blogId}` : "/";
      const terms = await getEntriesByTerm(blogId);
      setTerms(terms?.entries);
      console.log('🚀 ~ fetchData ~ terms:', terms);
      const banner = await getPageRes("/blog");
      // const post = await getBlogPostRes(entryUrl);
      // (!banner || !post) && setError(true);
      setEntry({ banner, post });
      // entry({ page: banner, blogPost: post });
    } catch (error) {
      console.error(error);
      setError(true);
    }
  }

  useEffect(() => {
    fetchData();
    error && history("/404");
  }, [blogId, lpTs, error]);

  const { post, banner } = getEntry;
  return (
    <>
      {banner ? (
        <RenderComponents
          pageComponents={banner.page_components}
          blogsPage
          contentTypeUid='blog_post'
          entryUid={banner.uid}
          locale={banner.locale}
        />
      ) : (
        <Skeleton height={400} />
      )}

      <div className='blog-container'>
        {
          terms ? (
            terms.map((ent: any, index: number) => (
              <BlogList bloglist={ent} key={index} />
            ))
          ): <Skeleton height={400} />
        }
      </div>
    </>
  );
}
